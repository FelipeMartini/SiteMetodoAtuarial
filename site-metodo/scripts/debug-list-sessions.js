// script para debugar sessões
const { PrismaClient } = require('@prisma/client')
;(async () => {
  const prisma = new PrismaClient()
  try {
    await prisma.$connect()
  const s = await prisma.session.findMany({ select: { id: true, sessionToken: true, userId: true, expires: true }, orderBy: { expires: 'desc' }, take: 20 })
  console.log('sessions:', JSON.stringify(s, null, 2))
  } catch (e) {
    console.error('error:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
