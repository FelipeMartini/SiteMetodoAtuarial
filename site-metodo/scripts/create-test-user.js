const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  const hashedPassword = await bcrypt.hash('123456', 12)

  // Criar role de admin primeiro
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      permissions: 'all',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  })

  console.log('Usuário de teste criado:', user)
}

createTestUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
