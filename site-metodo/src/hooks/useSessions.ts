import { useQuery } from '@tanstack/react-query'

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await fetch('/api/sessoes', { cache: 'no-store' })
      if (!res.ok) throw new Error('Falha ao carregar sessões')
      return res.json() as Promise<{
        sessions: Array<{ id: string; device: string; ip: string; lastActive: string }>
      }>
    },
    staleTime: 30000,
  })
}
