import path from 'path'
import fs from 'fs/promises'
import { PrismaClient } from '@prisma/client'
import { newEnforcer } from 'casbin'
import { PrismaAdapter } from 'casbin-prisma-adapter'

const prisma = new PrismaClient()
const ABAC_MODEL_PATH = path.join(process.cwd(), 'src/lib/abac/abac-model.conf')

function hasNonPrintable(s: string | null | undefined): boolean {
  if (!s) return false
  // allow tab, LF, CR, printable ASCII range
  return /[^\x09\x0A\x0D\x20-\x7E]/.test(s)
}

function countDoubleQuotes(s: string | null | undefined): number {
  if (!s) return 0
  return (s.match(/\"/g) || s.match(/\"/g) || s.match(/\"/g) || []).length
}

async function main() {
  console.log('Diagnóstico ABAC - iniciando')

  try {
    const model = await fs.readFile(ABAC_MODEL_PATH, 'utf8')
    console.log('Modelo Casbin lido com sucesso: %s', ABAC_MODEL_PATH)
    console.log('--- modelo begin ---')
    console.log(model)
    console.log('--- modelo end ---')
  } catch (err) {
    console.error('Falha ao ler modelo Casbin:', err)
  }

  try {
    const policies = await prisma.casbinRule.findMany()
    console.log(`Policies encontradas: ${policies.length}`)

    for (const p of policies) {
      console.log('--- Policy id=%s ptype=%s ---', p.id, p.ptype)
      const fields = ['v0','v1','v2','v3','v4','v5'] as const
      for (const f of fields) {
        // @ts-ignore
        const val = p[f]
        if (val === null || val === undefined) {
          console.log(`  ${f}: <null>`)
          continue
        }
        const asStr = String(val)
        const nonPrintable = hasNonPrintable(asStr)
        const dq = (asStr.match(/\"/g) || []).length
        const rawLen = asStr.length
        console.log(`  ${f}: len=${rawLen} nonPrintable=${nonPrintable} doubleQuotes=${dq} value=${asStr}`)
        if (nonPrintable) {
          console.warn(`   >>> campo ${f} contém bytes não imprimíveis ou control chars`)
        }
      }
    }

    // Tentar inicializar enforcer com adapter (reproduzir erro)
    try {
      console.log('\nTentando newEnforcer com PrismaAdapter...')
      const adapter = await PrismaAdapter.newAdapter(prisma)
      const enforcer = await newEnforcer(ABAC_MODEL_PATH, adapter)
      console.log('Enforcer criado, tentando loadPolicy()...')
      await enforcer.loadPolicy()
      console.log('loadPolicy() executado com sucesso, políticas carregadas')
    } catch (e) {
      console.error('Erro durante newEnforcer/loadPolicy:', e instanceof Error ? e.message : e)
      console.error(e)

      // Tentar adicionar manualmente cada policy num enforcer em memória
      try {
        console.log('\nTentando adicionar políticas manualmente em enforcer em memória (adicionar uma a uma)...')
        const memEnforcer = await newEnforcer(ABAC_MODEL_PATH)
        for (const p of policies) {
          const parts: string[] = []
          if (p.v0) parts.push(String(p.v0))
          if (p.v1) parts.push(String(p.v1))
          if (p.v2) parts.push(String(p.v2))
          if (p.v3) parts.push(String(p.v3))
          if (p.v4) parts.push(String(p.v4))
          if (p.v5) parts.push(String(p.v5))

          try {
            // @ts-ignore
            const added = await memEnforcer.addPolicy(...parts)
            console.log(`  addPolicy -> id=${p.id} parts=${JSON.stringify(parts)} added=${added}`)
          } catch (addErr) {
            console.error(`  addPolicy FAILED -> id=${p.id} error=${addErr instanceof Error ? addErr.message : addErr}`)
          }
        }
      } catch (memErr) {
        console.error('Falha ao testar addPolicy em enforcer memória:', memErr)
      }
    }

  } catch (dbErr) {
    console.error('Erro ao ler policies do BD:', dbErr)
  } finally {
    await prisma.$disconnect()
  }

  console.log('Diagnóstico ABAC - finalizado')
}

main().catch(err => {
  console.error('Erro no diagnóstico:', err)
  process.exit(1)
})
