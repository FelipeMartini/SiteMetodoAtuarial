'use client'

import React, { useState } from 'react'
import DataTableBase from '@/components/admin/data-table/DataTableBase'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { useUsuariosPaginados } from '../hooks/useUsuariosPaginados'


interface UsuarioTabelaRow {
  id: string
  name: string | null
  email: string | null
  department?: string | null
  location?: string | null
  jobTitle?: string | null
  validFrom?: string | null
  validUntil?: string | null
  isActive: boolean
  createdAt: string
}

const colunas: ColumnDef<UsuarioTabelaRow>[] = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'department',
    header: 'Departamento',
    cell: ({ getValue }: { getValue: () => string }) => getValue() ? <Badge variant="outline">{getValue()}</Badge> : '-',
  },
  {
    accessorKey: 'location',
    header: 'Localidade',
    cell: ({ getValue }: { getValue: () => string }) => getValue() ? <Badge variant="secondary">{getValue()}</Badge> : '-',
  },
  {
    accessorKey: 'jobTitle',
    header: 'Cargo',
    cell: ({ getValue }: { getValue: () => string }) => getValue() ? <span className="font-medium text-xs text-muted-foreground">{getValue()}</span> : '-',
  },
  {
    id: 'validade',
    header: 'Validade',
    cell: ({ row }: { row: { original: UsuarioTabelaRow } }) => {
      const from = row.original.validFrom ? new Date(row.original.validFrom).toLocaleDateString('pt-BR') : '-';
      const to = row.original.validUntil ? new Date(row.original.validUntil).toLocaleDateString('pt-BR') : '-';
      return (
        <div className="flex flex-col text-xs">
          <span className="text-muted-foreground">de <b>{from}</b></span>
          <span className="text-muted-foreground">até <b>{to}</b></span>
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Ativo',
    cell: ({ getValue }: { getValue: () => boolean }) => getValue() ? <Badge variant="default">Sim</Badge> : <Badge variant="destructive">Não</Badge>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    cell: ({ getValue }: { getValue: () => string | Date }) => new Date(getValue()).toLocaleDateString('pt-BR'),
  },
]

export default function ListaUsuariosPage() {
  const [page, setPage] = useState(0)
  const [pageSize] = useState(10)
  const { data, isLoading } = useUsuariosPaginados(page, pageSize, '')
  const [editing, setEditing] = useState<UsuarioTabelaRow | null>(null)
  const [form, setForm] = useState({
    name: '',
    department: '',
    location: '',
    jobTitle: '',
    validFrom: '',
    validUntil: '',
    isActive: 'true',
  })

  const openEdit = (row: UsuarioTabelaRow) => {
    setEditing(row)
    setForm({
      name: row.name ?? '',
      department: row.department ?? '',
      location: row.location ?? '',
      jobTitle: row.jobTitle ?? '',
      validFrom: row.validFrom ?? '',
      validUntil: row.validUntil ?? '',
      isActive: row.isActive ? 'true' : 'false',
    })
  }

  const salvar = async () => {
    if (!editing) return
    const payload: Partial<UsuarioTabelaRow> = {}
    if (form.name && form.name !== editing.name) payload.name = form.name
    if (form.department && form.department !== editing.department) payload.department = form.department
    if (form.location && form.location !== editing.location) payload.location = form.location
    if (form.jobTitle && form.jobTitle !== editing.jobTitle) payload.jobTitle = form.jobTitle
    if (form.validFrom && form.validFrom !== editing.validFrom) payload.validFrom = form.validFrom
    if (form.validUntil && form.validUntil !== editing.validUntil) payload.validUntil = form.validUntil
    const activeBool = form.isActive === 'true'
    if (activeBool !== editing.isActive) payload.isActive = activeBool
    if (Object.keys(payload).length === 0) {
      setEditing(null)
      return
    }
    await fetch(`/api/usuarios/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setEditing(null)
    window.location.reload()
  }

  return (
    <div className='p-4 flex flex-col gap-4'>
      <h1 className='text-xl font-semibold'>Usuários</h1>
      <DataTableBase
        colunas={colunas}
        dados={data?.data ?? []}
        carregando={isLoading}
        serverSide
        pagina={page}
        tamanhoPagina={pageSize}
        totalRegistros={data?.total}
        onPaginaChange={setPage}
        persistencia={{ chaveNamespace: 'usuarios-lista', habilitarPersistencia: true }}
        caption='Tabela de usuários'
        legendaAcessivel='Tabela de usuários paginada com suporte a ordenação'
        onRowClick={linha => openEdit(linha as UsuarioTabelaRow)}
      />
  <Dialog open={!!editing} onOpenChange={(o: boolean) => !o && setEditing(null)}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Nome</label>
              <Input
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Departamento</label>
              <Input
                value={form.department}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, department: e.target.value }))}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Localidade</label>
              <Input
                value={form.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Cargo</label>
              <Input
                value={form.jobTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, jobTitle: e.target.value }))}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Válido de</label>
              <Input
                type='date'
                value={form.validFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, validFrom: e.target.value }))}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Válido até</label>
              <Input
                type='date'
                value={form.validUntil}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, validUntil: e.target.value }))}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium'>Ativo</label>
              <select
                className='border rounded px-2 py-1 text-sm'
                value={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.value }))}
              >
                <option value='true'>Sim</option>
                <option value='false'>Não</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='ghost' onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={salvar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
