"use client"
import { useQuery } from '@tanstack/react-query'

export function useAcessos() {
  return useQuery({
    queryKey: ['acessos'],
    queryFn: async () => {
      const res = await fetch('/admin/dashboard/api/acessos')
      if (!res.ok) throw new Error('Erro ao buscar acessos')
      return res.json()
    },
  })
}
