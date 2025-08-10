/**
import { GET as AuthGet, POST as AuthPost } from '@/app/api/auth/[...nextauth]/route'* Teste completo de fluxo Auth.js v5: providers, login credentials, login social (mock), sessão, CSRF.
 * Requer ambiente limpo, sem rotas dinâmicas conflitantes e variáveis AUTH_DEBUG=1.
 */
import { GET as AuthGet, POST as AuthPost } from '@/app/api/auth/[...nextauth]/route'

function request(url: string, init?: RequestInit) {
  return new Request(url, init)
}

describe('Fluxo completo Auth.js', () => {
  it('GET /api/auth/providers retorna 200 e lista providers', async () => {
    const res = await AuthGet(request('http://localhost/api/auth/providers'))
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(text).toMatch(/google|credentials|github/)
  })

  it('POST /api/auth/callback/credentials sem CSRF retorna erro MissingCSRF', async () => {
    const body = new URLSearchParams({ email: 'naoexiste@teste.com', password: 'xxx' })
    const res = await AuthPost(request('http://localhost/api/auth/callback/credentials', { method: 'POST', body }))
    expect(res.status).toBe(302)
    const location = res.headers.get('location')
    expect(location).toMatch(/error=MissingCSRF/)
  })

  it('GET /api/auth/session sem login retorna 401 ou 302', async () => {
    const res = await AuthGet(request('http://localhost/api/auth/session'))
    expect([401,302]).toContain(res.status)
  })
})
