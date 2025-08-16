'use client';

import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

interface PaginationState {
  page: number
  limit: number
  total: number
  pages: number
}

interface ServerPaginationConfig {
  queryKey: string
  endpoint: string
  filters?: Record<string, unknown>
  initialPage?: number
  initialLimit?: number
}

interface ServerPaginationReturn<T> {
  data: T[]
  pagination: PaginationState
  isLoading: boolean
  error: Error | null
  refetch: () => void
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setFilters: (filters: Record<string, unknown>) => void
}

export function useServerPagination<T>({
  queryKey,
  endpoint,
  filters = {},
  initialPage = 1,
  initialLimit = 10
}: ServerPaginationConfig): ServerPaginationReturn<T> {
  
  const params = useMemo(() => {
    const searchParams = new URLSearchParams()
    searchParams.append('page', initialPage.toString())
    searchParams.append('limit', initialLimit.toString())
    
    // Adiciona filtros válidos
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString())
        } else {
          searchParams.append(key, String(value))
        }
      }
    })
    
    return searchParams.toString()
  }, [initialPage, initialLimit, filters])

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const res = await fetch(`${endpoint}?${params}`)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      return res.json()
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  })

  const data = response?.logs || response?.data || []
  const pagination = response?.pagination || {
    page: initialPage,
    limit: initialLimit,
    total: data.length,
    pages: 1
  }

  const setPage = useCallback((_page: number) => {
    // Esta função será implementada junto com o estado no componente pai
    // O hook retorna as funções para o componente usar com seu próprio estado
  }, [])

  const setLimit = useCallback((_limit: number) => {
    // Implementação similar ao setPage
  }, [])

  const setFilters = useCallback((_newFilters: Record<string, unknown>) => {
    // Implementação similar
  }, [])

  return {
    data,
    pagination,
    isLoading,
    error: error as Error | null,
    refetch,
    setPage,
    setLimit,
    setFilters
  }
}

export interface PaginationControlsProps {
  pagination: PaginationState
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function PaginationControls({ 
  pagination, 
  onPageChange, 
  isLoading 
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
        {pagination.total} registros
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 disabled:hover:bg-transparent"
          disabled={pagination.page <= 1 || isLoading}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Anterior
        </button>
        <span className="px-2 py-1 text-sm">
          {pagination.page} de {pagination.pages}
        </span>
        <button
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 disabled:hover:bg-transparent"
          disabled={pagination.page >= pagination.pages || isLoading}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
