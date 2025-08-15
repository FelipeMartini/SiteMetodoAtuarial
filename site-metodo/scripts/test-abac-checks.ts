import { PrismaClient } from '@prisma/client'
import { checkABACPermission } from '../src/lib/abac/enforcer-abac-puro'

const prisma = new PrismaClient()

async function main() {
  const email = 'felipemartinii@gmail.com'
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error('User not found for email', email)
    process.exit(1)
  }

  console.log('Testing for user:', user.id)

  const tests = [
    { subject: email, object: 'admin:dashboard', action: 'read' },
    { subject: email, object: 'admin:dashboard', action: 'write' },
  { subject: `user:${user.id}`, object: 'admin:dashboard', action: 'read' },
  { subject: `user:${user.id}`, object: 'admin:dashboard', action: 'write' },
  { subject: email, object: 'usuario:areacliente', action: 'read' },
  { subject: email, object: 'usuario:areacliente', action: 'write' },
  { subject: `user:${user.id}`, object: 'usuario:areacliente', action: 'read' },
  { subject: `user:${user.id}`, object: 'usuario:areacliente', action: 'write' },
  ]

  for (const t of tests) {
    const r = await checkABACPermission(t.subject, t.object, t.action)
    console.log(t, '=>', r.allowed, r.reason)
  }

  await prisma.$disconnect()
}

main().catch(e=>{console.error(e); process.exit(1)})
