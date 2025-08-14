#!/usr/bin/env ts-node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Carrega a instância prisma exportada em site-metodo/prisma/client.ts usando require dinâmico
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientPath = path.resolve(__dirname, '..', 'site-metodo', 'prisma', 'client')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sitePrisma = require(clientPath).prisma
const prisma = sitePrisma

async function main() {
  const xlogsDir = path.resolve(process.cwd(), 'XLOGS')
  if (!fs.existsSync(xlogsDir)) fs.mkdirSync(xlogsDir, { recursive: true })

  console.log('Lendo todas as entradas de casbin_rule...')
  const rows: any[] = await prisma.casbinRule.findMany({})
  console.log(`Total de entradas: ${rows.length}`)

  // Agrupa por chave composta (ptype + v0..v3)
  const groups = new Map<string, any[]>()
  for (const r of rows) {
    const key = `${r.ptype}||${r.v0 ?? ''}||${r.v1 ?? ''}||${r.v2 ?? ''}||${r.v3 ?? ''}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(r)
  }

  const duplicates: any[] = []
  for (const [key, list] of groups) {
    if (list.length > 1) {
      // Ordena por id (mantemos o menor id)
      list.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      const keep = list[0]
      const toRemove = list.slice(1)
      duplicates.push(...toRemove.map((r) => ({ keepId: keep.id, removed: r })))
    }
  }

  console.log(`Encontradas ${duplicates.length} entradas duplicadas.`)

  if (duplicates.length === 0) {
    console.log('Nada a remover.')
    await prisma.$disconnect()
    return
  }

  const backupFile = path.join(xlogsDir, `casbin-duplicates-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  fs.writeFileSync(backupFile, JSON.stringify(duplicates, null, 2), 'utf-8')
  console.log(`Backup das duplicatas salvo em: ${backupFile}`)

  // Remover cada registro duplicado por id
  const idsToRemove = duplicates.map((d) => d.removed.id).filter(Boolean)
  console.log(`Removendo ${idsToRemove.length} registros...`)

  // Fazer em batches de 100 para evitar problemas
  const batchSize = 100
  for (let i = 0; i < idsToRemove.length; i += batchSize) {
    const batch = idsToRemove.slice(i, i + batchSize)
    await prisma.casbinRule.deleteMany({ where: { id: { in: batch } } })
    console.log(`Removidos batch ${i / batchSize + 1} (${batch.length} registros)`)
  }

  console.log('Remoção concluída. Verificando contagem final...')
  const finalCount = await prisma.casbinRule.count()
  console.log(`Entradas finais em casbin_rule: ${finalCount}`)

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('Erro durante deduplicação:', e)
  try {
    await prisma.$disconnect()
  } catch (_) {}
  process.exit(1)
})
