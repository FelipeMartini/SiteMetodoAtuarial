import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Normalizando campos v4 nas políticas ABAC...')
  try {
    const policies = await prisma.casbinRule.findMany()
    let changed = 0
    for (const p of policies) {
      const raw = p.v4 as string | null
      if (!raw) continue
      try {
        const parsed = JSON.parse(raw)
        const min = JSON.stringify(parsed)
        if (min !== raw) {
          await prisma.casbinRule.update({ where: { id: p.id }, data: { v4: min } })
          console.log(`  id=${p.id} normalized v4 -> ${min}`)
          changed++
        } else {
          console.log(`  id=${p.id} already normalized`) 
        }
      } catch (err) {
        console.warn(`  id=${p.id} v4 is not valid JSON, attempting safe trim...`)
        // fallback: remove control chars and trim
        let s = String(raw)
        s = s.replace(/\r|\n|\t/g, ' ')
        s = s.replace(/\s+/g, ' ')
        s = s.trim()
        if (s !== raw) {
          await prisma.casbinRule.update({ where: { id: p.id }, data: { v4: s } })
          console.log(`  id=${p.id} cleaned v4 -> ${s}`)
          changed++
        } else {
          console.log(`  id=${p.id} left unchanged (invalid JSON but no change)`) 
        }
      }
    }
    console.log(`Normalização finalizada. policies changed=${changed}`)
  } catch (err) {
    console.error('Erro na normalização:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(e => { console.error(e); process.exit(1) })
