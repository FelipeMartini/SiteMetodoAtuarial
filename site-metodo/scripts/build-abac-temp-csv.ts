import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function escapeField(field: string | null | undefined) {
  if (field === null || field === undefined) return ''
  // Double up quotes and wrap in double quotes
  const s = String(field).replace(/"/g, '""')
  return `"${s}"`
}

async function main() {
  try {
    const policies = await prisma.casbinRule.findMany()
    const lines: string[] = []
    for (const p of policies) {
      const cols = [p.ptype, p.v0, p.v1, p.v2, p.v3, p.v4, p.v5]
      const escaped = cols.map(c => escapeField(c)).join(',')
      lines.push(escaped)
    }
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'abac-'))
    const filePath = path.join(tmpDir, 'policies.csv')
    await fs.writeFile(filePath, lines.join('\n'), 'utf8')
    console.log('Temp CSV written to', filePath)
    console.log('--- sample ---')
    console.log(lines.slice(0,10).join('\n'))
    console.log('--- end sample ---')
  } catch (err) {
    console.error('Erro ao gerar CSV temporário:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
