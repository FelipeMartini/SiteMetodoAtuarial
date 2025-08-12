// use client
// Hook para persistir preferências da tabela (visibilidade de colunas, densidade, filtros)
import { useEffect, useRef } from 'react'
import { DataTableEstado, DataTablePersistenciaConfig } from './types'

const chave = (ns: string) => `admin.datatable.${ns}`

export function carregarEstadoPersistido(ns: string): Partial<DataTableEstado> | null {
  try {
    const bruto = localStorage.getItem(chave(ns))
    if (!bruto) return null
    return JSON.parse(bruto)
  } catch {
    return null
  }
}

export function usePersistenciaTabela(
  nsConfig: DataTablePersistenciaConfig | undefined,
  estado: DataTableEstado
) {
  const cacheRef = useRef<string>('')
  useEffect(() => {
    if (!nsConfig?.habilitarPersistencia) return
    const key = chave(nsConfig.chaveNamespace)
    const serializado = JSON.stringify({
      sorting: estado.sorting,
      columnFilters: estado.columnFilters,
      columnVisibility: estado.columnVisibility,
      globalFilter: estado.globalFilter,
      density: estado.density,
    })
    if (serializado !== cacheRef.current) {
      cacheRef.current = serializado
      try {
        localStorage.setItem(key, serializado)
      } catch {}
    }
  }, [nsConfig, estado])
}
