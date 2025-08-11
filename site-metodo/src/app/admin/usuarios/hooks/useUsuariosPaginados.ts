'use client'
import { useQuery } from '@tanstack/react-query'

export interface UsuarioPaginado {
  id: string
  name: string | null
  email: string | null
  accessLevel: number
  isActive: boolean
  createdAt: string
}

interface ResultadoPaginado {
  total: number
  page: number
  pageSize: number
  data: UsuarioPaginado[]
}

export function useUsuariosPaginados(page: number, pageSize: number, search: string) {
  return useQuery<ResultadoPaginado>({
    queryKey: ['usuarios-paginados', page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
      if (search) params.set('search', search)
      const res = await fetch(`/api/usuarios/paginated?${params.toString()}`)
      if (!res.ok) throw new Error('Erro ao buscar usuários paginados')
      return res.json()
    },
  })
}
