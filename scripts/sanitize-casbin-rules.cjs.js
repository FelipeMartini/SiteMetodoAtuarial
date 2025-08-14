#!/usr/bin/env node
const path = require('path')
const fs = require('fs')

// tentar carregar o client TypeScript exportado em site-metodo/prisma/client.ts
const clientPathTs = path.resolve(__dirname, '..', 'site-metodo', 'prisma', 'client.ts')
let sitePrisma
try {
  sitePrisma = require(clientPathTs).prisma
} catch (e) {
  console.warn('Não foi possível require client.ts diretamente. Tente executar com node -r ts-node/register ou gerar o client. Erro:', e.message)
  // tentar fallback para node_modules .prisma client
  const fallback = path.resolve(__dirname, '..', 'site-metodo', 'node_modules', '.prisma', 'client')
  sitePrisma = require(fallback).prisma
}
const prisma = sitePrisma

function sanitizeField(s) {
  if (s === null || s === undefined) return null
  let out = String(s)
  out = out.replace(/\u00A0/g, ' ')
  out = out.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  out = out.replace(/[ \t\f\v\u00A0]+/g, ' ')
  out = out.trim()
  return out === '' ? null : out
}

async function main() {
  const XLOGS = path.resolve(process.cwd(), 'XLOGS')
  if (!fs.existsSync(XLOGS)) fs.mkdirSync(XLOGS, { recursive: true })

  console.log('Sanitização de casbin_rule - iniciando')
  const rows = await prisma.casbinRule.findMany({})
  console.log(`Total de linhas lidas: ${rows.length}`)

  const changed = []
  for (const r of rows) {
    const orig = {}
    const updated = {}
    let dirty = false

    for (const f of ['v0','v1','v2','v3','v4','v5']) {
      orig[f] = r[f]
      const san = sanitizeField(r[f])
      updated[f] = san
      const origStr = r[f] === null || r[f] === undefined ? null : String(r[f])
      const sanStr = san === null ? null : String(san)
      if (origStr !== sanStr) dirty = true
    }

    if (dirty) {
      changed.push({ id: r.id, before: orig, after: updated })
      await prisma.casbinRule.update({ where: { id: r.id }, data: updated })
      console.log(`  sanitized id=${r.id}`)
    }
  }

  const backupFile = path.join(XLOGS, `casbin-sanitize-backup-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  fs.writeFileSync(backupFile, JSON.stringify(changed, null, 2), 'utf-8')
  console.log(`Sanitização concluída. Registros alterados: ${changed.length}. Backup: ${backupFile}`)

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('Erro na sanitização:', e)
  try { await prisma.$disconnect() } catch (_) {}
  process.exit(1)
})
