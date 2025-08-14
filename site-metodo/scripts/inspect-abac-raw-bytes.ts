import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function toHex(s: string) {
  const buf = Buffer.from(s, 'utf8')
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join(' ')
}

function showCodePoints(s: string) {
  return Array.from(s).map(ch => `${ch} U+${ch.codePointAt(0)!.toString(16).toUpperCase()}`).join(' | ')
}

async function main() {
  try {
    const p = await prisma.casbinRule.findUnique({ where: { id: 16 } as any })
    if (!p) {
      console.error('policy id=16 not found')
      return
    }
    const v4 = String(p.v4)
    console.log('v4 raw length:', v4.length)
    console.log('v4 hex bytes:', toHex(v4))
    console.log('v4 code points:', showCodePoints(v4))
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(e => { console.error(e); process.exit(1) })
