import { providers, prisma } from '@/auth'
import bcrypt from 'bcryptjs'

describe('Fluxo Auth Unificado (configuração)', () => {
  const email = 'teste+authflow@example.com'
  beforeAll(async () => {
    const hash = await bcrypt.hash('SenhaForte123!', 10)
    const existing = await prisma.user.findUnique({ where: { email } })
    if (!existing) {
      await prisma.user.create({ data: { email, password: hash, accessLevel: 1 } })
    } else if (!existing.password) {
      await prisma.user.update({ where: { id: existing.id }, data: { password: hash } })
    }
  })

  test('Providers incluem credentials e pelo menos 1 total', () => {
    expect(Array.isArray(providers)).toBe(true)
    expect(providers.length).toBeGreaterThan(0)
    const hasCredentials = providers.some((p: any) => p && (p.id === 'credentials' || p.name === 'Login'))
    expect(hasCredentials).toBe(true)
  })

  test('Hash de senha armazenado valida corretamente (simulação authorize)', async () => {
    const user = await prisma.user.findUnique({ where: { email } })
    expect(user?.password).toBeTruthy()
    const ok = await bcrypt.compare('SenhaForte123!', user!.password!)
    expect(ok).toBe(true)
    const fail = await bcrypt.compare('Errada', user!.password!)
    expect(fail).toBe(false)
  })
})
