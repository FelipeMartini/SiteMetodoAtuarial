'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import DataTableBase from '@/components/admin/data-table/DataTableBase'
import { ColumnDef } from '@tanstack/react-table'

interface AuditRow {
  id: string
  action: string
  target: string | null
  createdAt: string
  user?: { id: string; email?: string | null; name?: string | null }
}

const colunas: ColumnDef<AuditRow>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
  },
  { accessorKey: 'action', header: 'Ação' },
  { accessorKey: 'target', header: 'Alvo', cell: ({ getValue }) => getValue<string>() || '-' },
  {
    accessorKey: 'user',
    header: 'Usuário',
    cell: ({ row }) => row.original.user?.email || row.original.user?.name || '—',
  },
]

export default function AuditoriaPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['audit-log'],
    queryFn: async () => {
      const res = await fetch('/api/admin/metrics')
      if (!res.ok) throw new Error('Erro')
      const json = (await res.json()) as { lastAudit: AuditRow[] }
      return json.lastAudit
    },
    refetchInterval: 60000,
  })
  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Auditoria</h1>
      <DataTableBase
        colunas={colunas}
        dados={data ?? []}
        carregando={isLoading}
        caption='Últimos eventos'
        legendaAcessivel='Tabela de auditoria'
        persistencia={{ chaveNamespace: 'audit-log', habilitarPersistencia: true }}
      />
    </div>
  )
}
