#!/usr/bin/env node
/*
  sanitize-casbin-rules.cjs.js
  - localização: site-metodo/scripts
  Script leve e seguro para sanitizar campos v0..v5 na tabela casbin_rule.
  Gera backup em XLOGS/casbin-sanitize-backup-<timestamp>.json
  Usa CommonJS para ser require() compatível com a inicialização do servidor.
*/

const path = require('path')
const fs = require('fs')
let PrismaClient
try {
  PrismaClient = require('@prisma/client').PrismaClient
} catch (e) {
  console.error('Prisma client não encontrado. Execute "npm install" em site-metodo se necessário.')
  process.exit(1)
}

function cleanString(s) {
  if (s === null || s === undefined) return s
  let out = String(s)
  // remover caracteres de controle (C0, DEL) e normalizar espaços invisíveis
  out = out.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
  // normalizar nbsp e trims
  out = out.replace(/\u00A0/g, ' ').trim()
  // mapear aspas tipográficas para aspas simples/duplas
  out = out.replace(/[\u2018\u2019]/g, "'")
  out = out.replace(/[\u201C\u201D]/g, '"')
  // remover bytes estranhos comuns (replacement char)
  out = out.replace(/\uFFFD/g, '')
  // colar múltiplos espaços
  out = out.replace(/\s+/g, ' ')
  return out
}

async function main() {
  const prisma = new PrismaClient()
  const cwd = process.cwd()
  const xlogs = path.resolve(cwd, 'XLOGS')
  try {
    if (!fs.existsSync(xlogs)) fs.mkdirSync(xlogs, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(xlogs, `casbin-sanitize-backup-${timestamp}.json`)

  console.log('Connecting to database and loading casbin_rule rows...')
  // O nome do modelo no Prisma é `CasbinRule` -> cliente expõe `prisma.casbinRule`
  const rows = await prisma.casbinRule.findMany()
    console.log(`Found ${rows.length} casbin_rule rows`)

    const changes = []

    for (const r of rows) {
      const before = { id: r.id, v0: r.v0, v1: r.v1, v2: r.v2, v3: r.v3, v4: r.v4, v5: r.v5 }
      const after = {}
      let dirty = false
      for (const k of ['v0', 'v1', 'v2', 'v3', 'v4', 'v5']) {
        const val = r[k]
        const cleaned = typeof val === 'string' ? cleanString(val) : val
        after[k] = cleaned
        if (String(val) !== String(cleaned)) dirty = true
      }
      if (dirty) {
        try {
          await prisma.casbinRule.update({
            where: { id: r.id },
            data: {
              v0: after.v0,
              v1: after.v1,
              v2: after.v2,
              v3: after.v3,
              v4: after.v4,
              v5: after.v5,
            },
          })
          changes.push({ id: r.id, before, after })
          console.log(`Sanitized casbin_rule id=${r.id}`)
        } catch (err) {
          console.error(`Failed to update casbin_rule id=${r.id}:`, err.message)
        }
      }
    }

    fs.writeFileSync(backupPath, JSON.stringify({ runAt: new Date().toISOString(), total: rows.length, changes }, null, 2))
    console.log(`Backup written to ${backupPath}. Changes: ${changes.length}`)
  } catch (err) {
    console.error('Sanitize script error:', err)
    process.exitCode = 2
  } finally {
    try { await prisma.$disconnect() } catch (e) {}
  }
}

if (require.main === module) {
  main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
}
