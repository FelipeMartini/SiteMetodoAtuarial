'use client'
import { useQuery } from '@tanstack/react-query'

export function usePermissoes() {
  return useQuery({
    queryKey: ['permissoes'],
    queryFn: async () => {
      const res = await fetch('/admin/dashboard/api/permissoes')
      if (!res.ok) throw new Error('Erro ao buscar permissões')
      return res.json()
    },
  })
}
