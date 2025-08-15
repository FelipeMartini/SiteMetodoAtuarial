const { PrismaClient } = require('@prisma/client')
;(async () => {
  const prisma = new PrismaClient()
  try {
    const email = 'felipemartinii@gmail.com'
    const rows = await prisma.casbinRule.findMany({ where: { v0: email } })
    console.log('Policies for', email)
    for (const r of rows) console.log(r)
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
})()
