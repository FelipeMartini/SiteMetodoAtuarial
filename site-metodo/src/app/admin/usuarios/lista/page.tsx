"use client";

import React, { useState } from 'react';
import DataTableBase from '@/components/admin/data-table/DataTableBase';
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
      />
    </div>
  );
}
