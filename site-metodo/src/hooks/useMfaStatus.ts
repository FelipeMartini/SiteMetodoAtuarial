import { useQuery } from '@tanstack/react-query'

export function useMfaStatus() {
  return useQuery({
    queryKey: ['mfa-status'],
    queryFn: async () => {
      const res = await fetch('/api/mfa/status', { cache: 'no-store' })
      if (!res.ok) throw new Error('Falha ao carregar status MFA')
      return res.json() as Promise<{ enabled: boolean; methods: string[] }>
    },
    staleTime: 30000,
  })
}
