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

function safeLog(...args) { console.log(...args) }

async function main() {
  const XLOGS = path.resolve(process.cwd(), 'XLOGS')
  if (!fs.existsSync(XLOGS)) fs.mkdirSync(XLOGS, { recursive: true })

  safeLog('Convertendo casbin_rule: user:<id> -> email')
  const rows = await prisma.casbinRule.findMany({})
  safeLog(`Total policies: ${rows.length}`)

  const changed = []
  for (const r of rows) {
    const subj = r.v0 || ''
    if (typeof subj === 'string' && subj.startsWith('user:')) {
      const uid = subj.replace('user:', '')
      try {
        const u = await prisma.user.findUnique({ where: { id: uid }, select: { email: true } })
        if (u && u.email) {
          const existing = await prisma.casbinRule.findFirst({ where: { ptype: r.ptype, v0: u.email, v1: r.v1 || null, v2: r.v2 || null, v3: r.v3 || null, v4: r.v4 || null, v5: r.v5 || null } })
          if (existing) {
            await prisma.casbinRule.delete({ where: { id: r.id } })
            changed.push({ action: 'deleted-duplicate', id: r.id, before: r, mergedInto: existing.id })
            safeLog(`Deleted duplicate policy id=${r.id} merged into id=${existing.id}`)
          } else {
            const before = { ...r }
            await prisma.casbinRule.update({ where: { id: r.id }, data: { v0: u.email } })
            changed.push({ action: 'updated', id: r.id, before, afterV0: u.email })
            safeLog(`Updated policy id=${r.id} user:${uid} -> ${u.email}`)
          }
        } else {
          safeLog(`No user/email found for id=${uid} (policy id=${r.id})`)
        }
      } catch (err) {
        safeLog('Error converting policy', r.id, err.message || String(err))
      }
    }
  }

  const backupFile = path.join(XLOGS, `casbin-convert-backup-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  fs.writeFileSync(backupFile, JSON.stringify(changed, null, 2), 'utf-8')
  safeLog(`Conversion completa. alterações: ${changed.length}. Backup: ${backupFile}`)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('Erro na conversão:', e)
  try { await prisma.$disconnect() } catch(_){}
  process.exit(1)
})
