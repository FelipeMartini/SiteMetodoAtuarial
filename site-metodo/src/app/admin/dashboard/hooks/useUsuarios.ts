"use client"
import { useQuery } from '@tanstack/react-query'

export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const res = await fetch('/admin/dashboard/api/usuarios')
      if (!res.ok) throw new Error('Erro ao buscar usuários')
      return res.json()
    },
  })
}
