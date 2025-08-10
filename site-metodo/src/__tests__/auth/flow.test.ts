/**
 * Testes básicos de smoke do fluxo Auth.js para evitar regressões 405 e validar endpoints core.
 * Estes testes não substituem E2E (Playwright), mas garantem que o handler catch-all responde.
 */
import { GET as AuthGet, POST as AuthPost } from '@/app/api/auth/[...auth]/route'

function request(url: string, init?: RequestInit) {
  return new Request(url, init)
}

describe('Auth.js catch-all handler', () => {
  it('providers endpoint não retorna 405', async () => {
    const res = await AuthGet(request('http://localhost/api/auth/providers'))
    expect(res.status).not.toBe(405)
  })
  it('session endpoint não retorna 405', async () => {
    const res = await AuthGet(request('http://localhost/api/auth/session'))
    expect([200,401]).toContain(res.status)
  })
  it('callback credentials inválido não retorna 405', async () => {
    const body = new URLSearchParams({ email: 'teste@example.com', password: 'xxx' })
    const res = await AuthPost(request('http://localhost/api/auth/callback/credentials', { method: 'POST', body }))
    expect(res.status).not.toBe(405)
  })
})
