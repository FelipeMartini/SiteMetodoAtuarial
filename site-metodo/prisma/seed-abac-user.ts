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

  // Garantir políticas casbin (idempotente) — somente email como subject
  // Policies básicas mantidas:
  // - admin:dashboard (read, write) para o email do admin
  // - area:cliente (read, write) para novos usuários (aplicado por email)
  const policies = [
    { subject: email, object: 'admin:dashboard', action: 'read', effect: 'allow' },
    { subject: email, object: 'admin:dashboard', action: 'write', effect: 'allow' },
  { subject: email, object: 'session:read', action: 'read', effect: 'allow' },
  { subject: email, object: 'session:write', action: 'write', effect: 'allow' },
  { subject: email, object: 'admin:abac', action: 'read', effect: 'allow' },
  { subject: email, object: 'admin:abac', action: 'write', effect: 'allow' },
  { subject: email, object: 'usuario:areacliente', action: 'read', effect: 'allow' },
  { subject: email, object: 'usuario:areacliente', action: 'write', effect: 'allow' },
  ]

  for (const p of policies) {
    // Evitar duplicatas (usar somente email no v0)
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
