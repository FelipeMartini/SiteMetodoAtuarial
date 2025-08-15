const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const rules = await prisma.casbinRule.findMany({ take: 50 })
  console.log('casbin_rule count:', rules.length)
  for (const r of rules) {
    console.log(JSON.stringify(r))
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
