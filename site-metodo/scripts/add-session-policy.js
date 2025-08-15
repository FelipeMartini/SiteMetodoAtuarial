const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'felipemartinii@gmail.com'
  const existing = await prisma.casbinRule.findFirst({ where: { v0: email, v1: 'session:read', v2: 'read' } })
  if (existing) {
    console.log('policy already exists:', JSON.stringify(existing))
    return
  }
  const created = await prisma.casbinRule.create({ data: { ptype: 'p', v0: email, v1: 'session:read', v2: 'read', v3: 'allow' } })
  console.log('created policy:', JSON.stringify(created))
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
