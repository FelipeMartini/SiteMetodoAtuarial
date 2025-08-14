import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'felipemartinii@gmail.com'
  // Buscar usuário por email
  const user = await prisma.user.findUnique({ where: { email } })
  console.log('user:', user ? { id: user.id, email: user.email } : null)

  const subjectUser = user ? `user:${user.id}` : null
  const subjects = subjectUser ? [email, subjectUser] : [email]

  const policies = await prisma.casbinRule.findMany({ where: { v0: { in: subjects } } })
  console.log(`Found ${policies.length} casbinRule entries for subjects:`, subjects)
  for (const p of policies) {
    console.log({ id: p.id, ptype: p.ptype, v0: p.v0, v1: p.v1, v2: p.v2, v3: p.v3 })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
