#!/usr/bin/env node
/*
  scripts/investigate-flow.js
  - Uso: node scripts/investigate-flow.js <target-file-relative-to-repo-root>
  - Exemplo: node scripts/investigate-flow.js site-metodo/src/app/api/users/route.ts
  Gera um relatório JSON em XLOGS/investigate-<timestamp>.json e imprime resumo.
*/

const fs = require('fs')
const path = require('path')

const repoRoot = process.cwd()
const args = process.argv.slice(2)
if (!args[0]) {
  console.error('Usage: node scripts/investigate-flow.js <target-file-relative-to-repo-root>')
  process.exit(2)
}

const target = args[0]
const targetAbs = path.resolve(repoRoot, target)
if (!fs.existsSync(targetAbs)) {
  console.error('Target file not found:', targetAbs)
  process.exit(2)
}

const outDir = path.resolve(repoRoot, 'XLOGS')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
const outPath = path.join(outDir, `investigate-${Date.now()}.json`)

const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md']

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

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8') } catch (e) { return '' }
}

const allFiles = walk(repoRoot)

// helpers to normalize import paths
function normalizeImportPath(importStr, fromFile) {
  if (!importStr) return null
  // handle alias @/
  if (importStr.startsWith('@/')) {
    return path.resolve(repoRoot, importStr.replace(/^@\//, 'site-metodo/').replace(/\.\//, ''))
  }
  if (importStr.startsWith('./') || importStr.startsWith('../')) {
    return path.resolve(path.dirname(fromFile), importStr)
  }
  // absolute-ish
  return null
}

// target identifiers
const targetRel = path.relative(repoRoot, targetAbs).replace(/\\/g, '/')
const targetBase = path.basename(targetRel)

const report = {
  target: targetRel,
  targetExists: fs.existsSync(targetAbs),
  directImporters: [],
  fetchCallers: [],
  stringOccurrences: [],
}

const importRegex = /import\s+(?:[\s\S]+?)\s+from\s+['"]([^'\"]+)['"]/g
const requireRegex = /require\(['"]([^'\"]+)['"]\)/g
const fetchRegex = /fetch\s*\(\s*([`'\"])([^`'\"]+)\1\s*[,)]/g

for (const file of allFiles) {
  const content = readFileSafe(file)
  if (!content) continue

  // raw string occurrences
  if (content.includes(targetRel) || content.includes(targetBase)) {
    report.stringOccurrences.push({ file: path.relative(repoRoot, file), hint: 'contains target filename or path' })
  }

  // imports
  let m
  importRegex.lastIndex = 0
  while ((m = importRegex.exec(content)) !== null) {
    const imp = m[1]
    const resolved = normalizeImportPath(imp, file)
    if (resolved) {
      const resolvedRel = path.relative(repoRoot, resolved)
      // check if resolved path matches target (with or without extension)
      if (resolvedRel === targetRel || resolvedRel === targetRel.replace(/\.ts$/, '') || resolvedRel.startsWith(targetRel.replace(/\.ts$/, ''))) {
        report.directImporters.push(path.relative(repoRoot, file))
      }
    } else {
      // also match alias style imports like '@/app/api/users/route'
      if (imp.includes('/app/api/users/route') || imp.includes('/app/api/users')) {
        report.directImporters.push(path.relative(repoRoot, file))
      }
    }
  }

  // require
  requireRegex.lastIndex = 0
  while ((m = requireRegex.exec(content)) !== null) {
    const imp = m[1]
    if (imp.includes('/app/api/users/route') || imp.includes('/app/api/users')) {
      report.directImporters.push(path.relative(repoRoot, file))
    }
  }

  // fetch calls
  fetchRegex.lastIndex = 0
  while ((m = fetchRegex.exec(content)) !== null) {
    const url = m[2]
    if (url.includes('/api/users') || url.includes('/api/usuarios')) {
      report.fetchCallers.push({ file: path.relative(repoRoot, file), url })
    }
  }
}

// dedupe
report.directImporters = Array.from(new Set(report.directImporters))
report.fetchCallers = Array.from(new Set(report.fetchCallers.map(JSON.stringify))).map(s => JSON.parse(s))
report.stringOccurrences = Array.from(new Set(report.stringOccurrences.map(JSON.stringify))).map(s => JSON.parse(s))

// recursively build parent chains for importers
function findParents(startFiles, depth = 0, maxDepth = 8) {
  if (depth >= maxDepth || startFiles.length === 0) return []
  const parents = []
  for (const f of startFiles) {
    const abs = path.resolve(repoRoot, f)
    // find files that import this file
    for (const file of allFiles) {
      const content = readFileSafe(file)
      if (!content) continue
      if (content.includes(f) || content.includes(path.basename(f))) {
        const rel = path.relative(repoRoot, file)
        if (!parents.includes(rel) && rel !== f) parents.push(rel)
      }
    }
  }
  if (parents.length === 0) return []
  return [parents, ...findParents(parents, depth + 1, maxDepth)]
}

report.parentChains = findParents(report.directImporters)

fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8')

console.log('Investigation finished. Report saved to', outPath)
console.log('Summary:')
console.log(`- Target: ${report.target}`)
console.log(`- Direct importers: ${report.directImporters.length}`)
report.directImporters.slice(0, 200).forEach(f => console.log('  -', f))
console.log(`- Files that call fetch to /api/users or /api/usuarios: ${report.fetchCallers.length}`)
report.fetchCallers.slice(0, 200).forEach(c => console.log(`  - ${c.file} -> ${c.url}`))
console.log(`- Parent chains levels: ${report.parentChains.length}`)
report.parentChains.slice(0, 20).forEach((level, i) => console.log(`  Level ${i + 1}: ${level.length} files`))

process.exit(0)
