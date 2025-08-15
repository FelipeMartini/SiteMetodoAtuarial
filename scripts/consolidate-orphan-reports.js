#!/usr/bin/env node
// scripts/consolidate-orphan-reports.js
// - coleta relatórios em XLOGS gerados por madge, ts-prune, knip (se houver) e
//   scripts/find-orphans-site-metodo.js
// - consolida em um JSON com contagem e fontes para priorização manual

const fs = require('fs')
const path = require('path')

const repoRoot = process.cwd()
const xlogs = path.join(repoRoot, 'XLOGS')
if (!fs.existsSync(xlogs)) {
  console.error('XLOGS directory not found at', xlogs)
  process.exit(1)
}

function readJSONIfExists(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')) }
  catch (e) { return null }
}

const files = fs.readdirSync(xlogs).map(f => path.join(xlogs, f))

const candidates = {} // key: normalized relative path -> { count, sources: Set }

function addCandidate(p, source) {
  if (!p) return
  const rel = path.relative(repoRoot, p).replace(/\\/g, '/')
  if (!candidates[rel]) candidates[rel] = { count: 0, sources: new Set() }
  candidates[rel].count += 1
  candidates[rel].sources.add(source)
}

for (const f of files) {
  const b = path.basename(f)
  if (/madge-graph-.*\.json$/.test(b) || /^madge-graph.*\.json$/.test(b) || /madge-orphans-.*\.json$/.test(b)) {
    const j = readJSONIfExists(f)
    if (j && j.orphans) {
      for (const o of j.orphans) addCandidate(path.join(repoRoot, o), 'madge-orphans-json')
    }
  }
  if (/madge-orphans-.*\.txt$/.test(b) || /^madge-orphans.*\.txt$/.test(b)) {
    const txt = fs.readFileSync(f, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    for (const line of txt) addCandidate(path.join(repoRoot, line), 'madge-orphans-txt')
  }
  if (/ts-prune-.*\.txt$/.test(b) || /^ts-prune.*\.txt$/.test(b) || /ts-prune.*\.json$/.test(b)) {
    const txt = fs.readFileSync(f, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    for (const line of txt) {
      const parts = line.split(':')
      addCandidate(path.join(repoRoot, parts[0]), 'ts-prune')
    }
  }
  if (/knip-.*\.json$/.test(b) || /^knip.*\.json$/.test(b)) {
    const j = readJSONIfExists(f)
    if (j && Array.isArray(j)) {
      for (const item of j) {
        if (item.file) addCandidate(path.join(repoRoot, item.file), 'knip')
      }
    }
  }
  if (/orphans-site-metodo-.*\.json$/.test(b) || /^orphans-site-metodo.*\.json$/.test(b)) {
    const j = readJSONIfExists(f)
    if (j && j.orphans) {
      for (const o of j.orphans) addCandidate(path.join(repoRoot, o), 'our-orphans-script')
    }
  }
}

// Produce consolidated array sorted by count desc
const out = Object.keys(candidates).map(rel => ({ file: rel, count: candidates[rel].count, sources: Array.from(candidates[rel].sources) }))
out.sort((a,b) => b.count - a.count || a.file.localeCompare(b.file))

const outPath = path.join(xlogs, `consolidated-orphans-${Date.now()}.json`)
fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), items: out }, null, 2), 'utf8')

console.log('Consolidated report written to', outPath)
console.log('Total candidate files:', out.length)

process.exit(0)
