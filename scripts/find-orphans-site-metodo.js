#!/usr/bin/env node
// scripts/find-orphans-site-metodo.js
// - percorre site-metodo, constrói grafo via import/require
// - identifica "roots" (Next app/page/layout/route files e api routes)
// - marca arquivos alcançáveis a partir das roots
// - arquivos não alcançáveis são candidatos a orphans

const fs = require('fs')
const path = require('path')

const repoRoot = process.cwd()
const targetDir = path.join(repoRoot, 'site-metodo')
if (!fs.existsSync(targetDir)) {
  console.error('Diretório site-metodo não encontrado em', targetDir)
  process.exit(2)
}

const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir, { withFileTypes: true })
  for (const d of list) {
    if (d.name === 'node_modules' || d.name === '.git' || d.name === 'XLOGS') continue
    const full = path.join(dir, d.name)
    if (d.isDirectory()) results = results.concat(walk(full))
    else if (exts.includes(path.extname(d.name))) results.push(full)
  }
  return results
}

function read(p) {
  try { return fs.readFileSync(p, 'utf8') } catch { return '' }
}

const allFiles = walk(targetDir)

// helpers
const importRegex = /import\s+(?:[\s\S]+?)\s+from\s+['"]([^'\"]+)['"]/g
const requireRegex = /require\(['"]([^'\"]+)['"]\)/g

function resolveImport(importStr, fromFile) {
  if (!importStr) return null
  // alias @/ -> site-metodo/
  if (importStr.startsWith('@/')) {
    const p = path.resolve(repoRoot, importStr.replace(/^@\//, 'site-metodo/'))
    const found = resolveFileLike(p)
    return found
  }
  if (importStr.startsWith('./') || importStr.startsWith('../')) {
    const p = path.resolve(path.dirname(fromFile), importStr)
    const found = resolveFileLike(p)
    return found
  }
  // absolute or package - ignore
  return null
}

function resolveFileLike(p) {
  // try p with extensions
  for (const e of exts) {
    const f = p + e
    if (fs.existsSync(f)) return f
  }
  // index files
  for (const e of exts) {
    const f = path.join(p, 'index' + e)
    if (fs.existsSync(f)) return f
  }
  // maybe file already has extension
  if (fs.existsSync(p)) return p
  return null
}

// build graph
const graph = {} // file -> Set(importedFiles)
const reverse = {} // file -> Set(files that import it)

for (const file of allFiles) {
  graph[file] = new Set()
  reverse[file] = new Set()
}

for (const file of allFiles) {
  const content = read(file)
  let m
  importRegex.lastIndex = 0
  while ((m = importRegex.exec(content)) !== null) {
    const imp = m[1]
    const resolved = resolveImport(imp, file)
    if (resolved) {
      graph[file].add(resolved)
      reverse[resolved].add(file)
    }
  }
  requireRegex.lastIndex = 0
  while ((m = requireRegex.exec(content)) !== null) {
    const imp = m[1]
    const resolved = resolveImport(imp, file)
    if (resolved) {
      graph[file].add(resolved)
      reverse[resolved].add(file)
    }
  }
}

// determine roots: Next app entries (page, layout, route in src/app) and api routes
const roots = new Set()
for (const file of allFiles) {
  const rel = path.relative(targetDir, file).replace(/\\/g, '/')
  if (/src\/app\/.*\/(page|layout)\.(tsx|ts|jsx|js)$/.test(rel)) roots.add(file)
  if (/src\/app\/.*\/route\.(ts|js|tsx|jsx)$/.test(rel)) roots.add(file)
  if (/src\/app\/api\/.+\/route\.(ts|js|tsx|jsx)$/.test(rel)) roots.add(file)
  // also treat top-level server entry files (next.config, server) as roots if present
}

// BFS from roots along reverse edges? Actually from roots follow graph edges to mark reachable
const reachable = new Set()
const queue = []
for (const r of roots) {
  reachable.add(r)
  queue.push(r)
}

while (queue.length) {
  const cur = queue.shift()
  for (const dep of graph[cur]) {
    if (!reachable.has(dep)) {
      reachable.add(dep)
      queue.push(dep)
    }
  }
}

// Candidates: files in allFiles not in reachable and not tests/docs
function isTestOrStory(f) {
  const b = path.basename(f)
  return /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(b) || /\.stories\.(tsx|jsx)$/.test(b)
}

const orphans = []
for (const f of allFiles) {
  if (reachable.has(f)) continue
  if (isTestOrStory(f)) continue
  // exclude types or d.ts
  if (f.endsWith('.d.ts')) continue
  // exclude config files
  const rel = path.relative(targetDir, f)
  if (rel.startsWith('node_modules') || rel.startsWith('.')) continue
  orphans.push(f)
}

// save report
const outDir = path.join(repoRoot, 'XLOGS')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
const outPath = path.join(outDir, `orphans-site-metodo-${Date.now()}.json`)
const report = {
  generatedAt: new Date().toISOString(),
  targetDir: 'site-metodo',
  totalFiles: allFiles.length,
  roots: Array.from(roots).map(p => path.relative(repoRoot, p)),
  reachableCount: reachable.size,
  orphanCount: orphans.length,
  orphans: orphans.map(p => path.relative(repoRoot, p)),
}
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8')

console.log('Report written to', outPath)
console.log('Total files scanned:', allFiles.length)
console.log('Roots detected:', report.roots.length)
console.log('Reachable files:', report.reachableCount)
console.log('Orphan candidates:', report.orphanCount)
console.log('Sample orphans:')
report.orphans.slice(0, 40).forEach(o => console.log(' -', o))

process.exit(0)
