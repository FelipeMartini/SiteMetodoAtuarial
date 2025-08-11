'use client'
import { useQuery } from '@tanstack/react-query'

export function useAcessosSemana() {
  return useQuery({
    queryKey: ['acessos-semana'],
    queryFn: async () => {
      const res = await fetch('/admin/dashboard/api/acessos-semana')
      if (!res.ok) throw new Error('Erro ao buscar acessos da semana')
      return res.json()
    },
  })
}
