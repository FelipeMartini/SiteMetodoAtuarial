#!/usr/bin/env ts-node

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientPath = path.resolve(__dirname, '..', 'site-metodo', 'prisma', 'client')
// carregamento dinâmico compatível ESM
const sitePrisma = await import(clientPath).then(m => m.prisma)
const prisma = sitePrisma

function sanitizeField(s: string | null | undefined): string | null {
  if (s === null || s === undefined) return null
  let out = String(s)
  // Remove non-breaking spaces
  out = out.replace(/\u00A0/g, ' ')
  // Remove control chars except tab, LF, CR
  out = out.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  // Normalize repeated whitespace to single space
  out = out.replace(/[ \t\f\v\u00A0]+/g, ' ')
  // Trim edges
  out = out.trim()
  return out === '' ? null : out
}

async function main() {
  const XLOGS = path.resolve(process.cwd(), 'XLOGS')
  if (!fs.existsSync(XLOGS)) fs.mkdirSync(XLOGS, { recursive: true })

  console.log('Sanitização de casbin_rule - iniciando')
  const rows: any[] = await prisma.casbinRule.findMany({})
  console.log(`Total de linhas lidas: ${rows.length}`)

  const changed: any[] = []

  for (const r of rows) {
    const orig: Record<string, any> = {}
    const updated: Record<string, any> = {}
    let dirty = false

    for (const f of ['v0','v1','v2','v3','v4','v5'] as const) {
      orig[f] = r[f]
      const san = sanitizeField(r[f])
      updated[f] = san
      const origStr = r[f] === null || r[f] === undefined ? null : String(r[f])
      const sanStr = san === null ? null : String(san)
      if (origStr !== sanStr) dirty = true
    }

    if (dirty) {
      changed.push({ id: r.id, before: orig, after: updated })
      // apply update
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
