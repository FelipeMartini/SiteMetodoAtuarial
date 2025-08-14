import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from 'casbin-prisma-adapter'

const prisma = new PrismaClient()

async function main() {
  console.log('Seed ABAC user and policies...')

  // Garantir usuário
  const email = 'felipemartinii@gmail.com'
  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Felipe Martini',
        email,
        isActive: true,
        department: 'admin',
        location: 'remote',
        loginCount: 1,
      },
    })
    console.log('Created user', user.id)
  } else {
    console.log('User exists', user.id)
  }

  // Garantir políticas casbin (idempotente)
  // Policies: allow read/write on admin dashboard and area-cliente
  const policies = [
    { subject: `user:${user.id}`, object: 'admin:dashboard', action: 'read', effect: 'allow' },
    { subject: `user:${user.id}`, object: 'admin:dashboard', action: 'write', effect: 'allow' },
    { subject: `user:${user.id}`, object: 'area:cliente', action: 'read', effect: 'allow' },
    { subject: `user:${user.id}`, object: 'area:cliente', action: 'write', effect: 'allow' },
    // Também garantir políticas por email (compatibilidade)
    { subject: email, object: 'admin:dashboard', action: 'read', effect: 'allow' },
    { subject: email, object: 'area:cliente', action: 'read', effect: 'allow' },
  ]

  for (const p of policies) {
    // Evitar duplicatas
    const exists = await prisma.casbinRule.findFirst({
      where: {
        v0: p.subject,
        v1: p.object,
        v2: p.action,
        v3: p.effect,
      },
    })
    if (!exists) {
      await prisma.casbinRule.create({ data: { ptype: 'p', v0: p.subject, v1: p.object, v2: p.action, v3: p.effect } })
      console.log('Added policy', p)
    } else {
      console.log('Policy exists', p)
    }
  }

  console.log('Seed completo')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
