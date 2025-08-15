#!/usr/bin/env node
// scripts/filter-consolidated-src.js
// - encontra o consolidated-orphans-*.json mais recente em XLOGS
// - filtra entries que começam com "src/" (assumindo app em site-metodo/src)
// - enriquece com metadata: absPath, exists, kind, quickExports, recommendation
// - grava JSON e CSV em XLOGS

const fs = require('fs')
const path = require('path')

const repoRoot = process.cwd()
const xlogs = path.join(repoRoot, 'XLOGS')
if (!fs.existsSync(xlogs)) { console.error('XLOGS not found'); process.exit(1) }

function newestConsolidated() {
  const files = fs.readdirSync(xlogs).filter(f => /^consolidated-orphans-.*\.json$/.test(f))
  if (!files.length) return null
  files.sort()
  return path.join(xlogs, files[files.length-1])
}

const consolidatedPath = newestConsolidated()
if (!consolidatedPath) { console.error('Nenhum consolidated-orphans-*.json encontrado em XLOGS'); process.exit(1) }

const data = JSON.parse(fs.readFileSync(consolidatedPath, 'utf8'))
const items = data.items || []

function kindFromPath(rel) {
  // rel like 'src/app/...', 'src/components/...', etc.
  if (/src\/app\/api\//.test(rel)) return 'api-route'
  if (/src\/app\/.+\/page\./.test(rel)) return 'page'
  if (/src\/app\/.+\/layout\./.test(rel)) return 'layout'
  if (/src\/components\//.test(rel)) return 'component'
  if (/src\/hooks\//.test(rel)) return 'hook'
  if (/src\/lib\//.test(rel)) return 'lib'
  if (/src\/styles\//.test(rel)) return 'style'
  if (/\.d\.ts$/.test(rel)) return 'types'
  if (/src\/validators\//.test(rel)) return 'validator'
  return 'other'
}

function quickExports(absPath) {
  try {
    const c = fs.readFileSync(absPath, 'utf8')
    const exs = [...c.matchAll(/export\s+(?:const|function|class|type|interface|default)\s+([A-Za-z0-9_]+)/g)].map(m=>m[1])
    return exs.slice(0,8)
  } catch(e) { return [] }
}

const results = []
for (const it of items) {
  if (!it.file || !it.file.startsWith('src/')) continue
  const rel = it.file
  const abs = path.join(repoRoot, 'site-metodo', rel)
  const exists = fs.existsSync(abs)
  const kind = kindFromPath(rel)
  const exports = exists ? quickExports(abs) : []
  let rec = 'maybe'
  if (!exists) rec = 'missing'
  else if (kind === 'api-route' || kind === 'page' || kind === 'layout') rec = 'keep'
  else if (it.count >= 8) rec = 'review'
  else if (it.sources && it.sources.includes('our-orphans-script')) rec = 'review'
  else rec = 'manual'

  results.push({ file: rel, absPath: abs, exists, kind, count: it.count, sources: it.sources || [], exports, recommendation: rec })
}

// sort by count desc
results.sort((a,b)=>b.count - a.count || a.file.localeCompare(b.file))

const outJson = path.join(xlogs, `filtered-orphans-src-${Date.now()}.json`)
fs.writeFileSync(outJson, JSON.stringify({ generatedAt: new Date().toISOString(), consolidated: consolidatedPath, items: results }, null, 2), 'utf8')

const outCsv = path.join(xlogs, `filtered-orphans-src-${Date.now()}.csv`)
const hdr = ['file','exists','kind','count','sources','recommendation','exports','absPath']
const rows = [hdr.join(',')]
for (const r of results) {
  const row = [
    '"'+r.file+'"',
    r.exists,
    r.kind,
    r.count,
    '"'+(r.sources||[]).join('|')+'"',
    r.recommendation,
    '"'+(r.exports||[]).join('|')+'"',
    '"'+r.absPath+'"'
  ].join(',')
  rows.push(row)
}
fs.writeFileSync(outCsv, rows.join('\n'), 'utf8')

console.log('Filtered report written to', outJson)
console.log('CSV written to', outCsv)
console.log('Items:', results.length)

process.exit(0)
