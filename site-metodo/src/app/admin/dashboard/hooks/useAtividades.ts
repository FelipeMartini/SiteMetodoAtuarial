'use client'
import { useQuery } from '@tanstack/react-query'

export function useAtividades() {
  return useQuery({
    queryKey: ['atividades'],
    queryFn: async () => {
      const res = await fetch('/admin/dashboard/api/atividades')
      if (!res.ok) throw new Error('Erro ao buscar atividades')
      return res.json()
    },
  })
}
