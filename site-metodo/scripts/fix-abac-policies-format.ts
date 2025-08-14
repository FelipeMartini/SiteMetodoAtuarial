import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function cleanValue(val: string | null | undefined): string | null {
  if (val === null || val === undefined) return null
  // Remove CR/LF/TAB and trim
  let s = String(val)
  // Normalizar unicode (remove BOM e variações) e substituir control chars
  s = s.normalize('NFKC')
  s = s.replace(/\uFEFF/g, '')
  // remover control chars exceto tab, LF, CR
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  s = s.replace(/\r|\n|\t/g, ' ')
  s = s.replace(/\s+/g, ' ')
  s = s.trim()
  return s
}

async function main() {
  console.log('Iniciando limpeza de políticas ABAC no DB...')
  try {
    const policies = await prisma.casbinRule.findMany()
    console.log(`Encontradas ${policies.length} políticas`) 
    let updated = 0
    for (const p of policies) {
      const orig: any = { v0: p.v0, v1: p.v1, v2: p.v2, v3: p.v3, v4: p.v4, v5: p.v5 }
      const newVals: any = {}
      let changed = false
      for (const k of ['v0','v1','v2','v3','v4','v5'] as const) {
        const cleaned = cleanValue(orig[k])
        newVals[k] = cleaned
        if (String(orig[k]) !== String(cleaned)) changed = true
      }

      if (changed) {
        await prisma.casbinRule.update({ where: { id: p.id }, data: { v0: newVals.v0, v1: newVals.v1, v2: newVals.v2, v3: newVals.v3, v4: newVals.v4, v5: newVals.v5 } })
        console.log(`  Updated policy id=${p.id}`)
        updated++
      } else {
        console.log(`  No change for id=${p.id}`)
      }
    }

    console.log(`Limpeza concluída. Policies atualizadas: ${updated}`)
  } catch (err) {
    console.error('Erro ao limpar políticas:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
