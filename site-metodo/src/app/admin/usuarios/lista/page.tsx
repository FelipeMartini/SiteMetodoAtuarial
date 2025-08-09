"use client";

import React, { useState } from 'react';
import DataTableBase from '@/components/admin/data-table/DataTableBase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table';
import { useUsuariosPaginados } from '../hooks/useUsuariosPaginados';

interface UsuarioTabelaRow {
  id: string;
  name: string | null;
  email: string | null;
  accessLevel: number;
  isActive: boolean;
  createdAt: string;
}

const colunas: ColumnDef<UsuarioTabelaRow>[] = [
  { accessorKey: 'name', header: 'Nome' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'accessLevel', header: 'Nível' },
  { accessorKey: 'isActive', header: 'Ativo', cell: ({ getValue }) => (getValue<boolean>() ? 'Sim' : 'Não') },
  { accessorKey: 'createdAt', header: 'Criado em', cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString() },
];

export default function ListaUsuariosPage() {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const { data, isLoading } = useUsuariosPaginados(page, pageSize, '');
  const [editing, setEditing] = useState<UsuarioTabelaRow | null>(null)
  const [form, setForm] = useState({ name: '', accessLevel: '', isActive: 'true' })

  const openEdit = (row: UsuarioTabelaRow) => {
    setEditing(row)
    setForm({ name: row.name ?? '', accessLevel: String(row.accessLevel), isActive: row.isActive ? 'true' : 'false' })
  }

  const salvar = async () => {
    if (!editing) return
    const payload: Partial<Pick<UsuarioTabelaRow,'name'|'accessLevel'|'isActive'>> = {}
    if (form.name && form.name !== editing.name) payload.name = form.name
    const al = parseInt(form.accessLevel, 10)
    if (!Number.isNaN(al) && al !== editing.accessLevel) payload.accessLevel = al
    const activeBool = form.isActive === 'true'
    if (activeBool !== editing.isActive) payload.isActive = activeBool
    if (Object.keys(payload).length === 0) { setEditing(null); return }
    await fetch(`/api/usuarios/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
    setEditing(null)
    // TODO: invalidar cache react-query (simples reload por enquanto)
    window.location.reload()
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Usuários</h1>
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
        caption="Tabela de usuários"
        legendaAcessivel="Tabela de usuários paginada com suporte a ordenação"
  onRowClick={(linha)=> openEdit(linha as UsuarioTabelaRow)}
      />
      <Dialog open={!!editing} onOpenChange={(o)=> !o && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nome</label>
              <Input value={form.name} onChange={e=> setForm(f=> ({...f, name: e.target.value}))} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nível de Acesso</label>
              <Input type="number" value={form.accessLevel} onChange={e=> setForm(f=> ({...f, accessLevel: e.target.value}))} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Ativo</label>
              <select className="border rounded px-2 py-1 text-sm" value={form.isActive} onChange={e=> setForm(f=> ({...f, isActive: e.target.value}))}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={()=> setEditing(null)}>Cancelar</Button>
            <Button onClick={salvar}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
