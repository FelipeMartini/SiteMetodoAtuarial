// use client
import { useQuery } from '@tanstack/react-query'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const res = await fetch('/api/me', { cache: 'no-store' })
      if (!res.ok) throw new Error('Falha ao carregar usuário atual')
      return res.json() as Promise<{ user?: { id: string; name?: string | null; email?: string | null; accessLevel?: number } }>
    },
    staleTime: 30000,
  })
}
