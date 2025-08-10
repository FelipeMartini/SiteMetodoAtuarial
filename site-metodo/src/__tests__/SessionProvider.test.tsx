import { renderHook, act, waitFor } from '@testing-library/react'
import { SessionProvider } from '@/app/providers/SessionProvider'
import { useSession } from '@/hooks/useSession'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'


// Mock fetch para simular /api/me (deve ser antes de qualquer import de hooks)

// Tipagem correta do mock de fetch para evitar uso de any
global.fetch = jest.fn(async (url: RequestInfo | URL) => {
  if (url === '/api/me') {
    return {
      ok: true,
      json: async () => ({ user: { id: '1', name: 'Usuário Teste', email: 'teste@exemplo.com', accessLevel: 5, role: 'admin' } })
    } as Response
  }
  return { ok: false, json: async () => ({}) } as Response
}) as jest.MockedFunction<typeof fetch>


describe('SessionProvider + useSession', () => {
  let qc: QueryClient
  beforeEach(() => {
    qc = new QueryClient()
    qc.clear()
  })
  it('fornece usuário e status corretamente', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={qc}>
        <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
    )
    const { result } = renderHook(() => useSession(), { wrapper })
    // Função utilitária para avançar o event loop
  const flushPromises = () => new Promise(resolve => process.nextTick(resolve))
    await act(async () => {
      await flushPromises()
    })
  await waitFor(() => result.current.status === 'authenticated')
    expect(result.current.user).toBeTruthy()
    expect(result.current.user?.name).toBe('Usuário Teste')
    expect(result.current.status).toBe('authenticated')
  })
})
