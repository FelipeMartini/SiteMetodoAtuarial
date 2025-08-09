// use client

// Componente DataTableBase headless
// Implementa: sorting, filtering, column visibility, global filter, paginação client-side
// Futuras extensões: paginação server-side, exportações, pinning, resizing, ordering, seleção em lote

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTableBaseProps, DataTableEstado } from './types';
import { carregarEstadoPersistido, usePersistenciaTabela } from './usePersistenciaTabela';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { salvarCsv } from './exportCsv';
import { salvarExcel } from './exportExcel';

// Container rolagem
function TabelaContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-full overflow-auto border rounded-md" role="region" aria-label="Conteúdo da tabela">{children}</div>;
}

export function DataTableBase<TData, TValue>(props: DataTableBaseProps<TData, TValue>) {
  const {
    colunas,
    dados,
    carregando,
    persistencia,
    legendaAcessivel,
    caption,
    totalRegistros,
    pagina,
    tamanhoPagina = 10,
    onPaginaChange,
    serverSide,
    acoesToolbarExtras,
  onRowClick,
  } = props;

  // Estado base
  const estadoInicialPersistido: Partial<DataTableEstado> | null = useMemo(
    () => (persistencia?.habilitarPersistencia ? carregarEstadoPersistido(persistencia.chaveNamespace) : null),
    [persistencia]
  );

  const [sorting, setSorting] = useState(estadoInicialPersistido?.sorting || []);
  const [columnFilters, setColumnFilters] = useState(estadoInicialPersistido?.columnFilters || []);
  const [columnVisibility, setColumnVisibility] = useState(estadoInicialPersistido?.columnVisibility || {});
  const [globalFilter, setGlobalFilter] = useState(estadoInicialPersistido?.globalFilter || '');
  const [density, setDensity] = useState<'padrao' | 'compacto'>(estadoInicialPersistido?.density || 'padrao');
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const estado: DataTableEstado = {
    sorting,
    columnFilters,
    columnVisibility,
    globalFilter,
    density,
    rowSelection,
  };

  usePersistenciaTabela(persistencia, estado);

  const table = useReactTable({
    data: dados,
  columns: colunas as ColumnDef<TData, unknown>[],
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: !serverSide ? getPaginationRowModel() : undefined,
    manualPagination: !!serverSide,
    pageCount: serverSide && totalRegistros && tamanhoPagina ? Math.ceil(totalRegistros / tamanhoPagina) : undefined,
    enableRowSelection: true,
  });

  // Paginação client-side
  useEffect(() => {
    if (!serverSide) return; // server-side controla externamente
  }, [serverSide]);

  const irParaPagina = useCallback(
    (p: number) => {
      if (serverSide) {
        onPaginaChange?.(p);
      } else {
        table.setPageIndex(p);
      }
    },
    [serverSide, onPaginaChange, table]
  );

  const linhas = table.getRowModel().rows;

  // CSV export simples
  const handleExportCsv = () => {
    const preRows = table.getPrePaginationRowModel().rows;
    const linhasDados = preRows.map((r): Record<string, string> => {
      const obj: Record<string, string> = {};
      r.getVisibleCells().forEach((c) => {
        const key = c.column.id;
        // Renderização textual básica
        const valor = c.getValue();
        obj[key] = typeof valor === 'string' ? valor : JSON.stringify(valor);
      });
      return obj;
    });
    salvarCsv(linhasDados, 'exportacao');
  };

  return (
    <div className="flex flex-col gap-2" aria-label={legendaAcessivel}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar..."
          value={globalFilter ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
          aria-label="Filtro global"
          className="w-56"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDensity((d) => (d === 'padrao' ? 'compacto' : 'padrao'))}
          aria-pressed={density === 'compacto'}
        >
          Densidade: {density === 'padrao' ? 'Padrão' : 'Compacto'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          disabled={linhas.length === 0}
        >
          Exportar CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            const preRows = table.getPrePaginationRowModel().rows;
            const linhasDados = preRows.map((r): Record<string, unknown> => {
              const obj: Record<string, unknown> = {};
              r.getVisibleCells().forEach((c) => {
                const key = c.column.id;
                const valor = c.getValue();
                obj[key] = valor ?? '';
              });
              return obj;
            });
            await salvarExcel(linhasDados, 'exportacao');
          }}
          disabled={linhas.length === 0}
        >
          Exportar Excel
        </Button>
        {acoesToolbarExtras}
      </div>

      <TabelaContainer>
        <Table className={cn(density === 'compacto' ? 'leading-tight' : 'leading-normal')}>
          {caption && <caption className="text-left p-2 text-muted-foreground">{caption}</caption>}
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      aria-sort={
                        header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                          ? 'descending'
                          : 'none'
                      }
                      className="select-none cursor-pointer"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === 'asc' && '▲'}
                          {header.column.getIsSorted() === 'desc' && '▼'}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {carregando ? (
              <TableRow>
                <TableCell colSpan={colunas.length} className="p-4 text-center text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : linhas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colunas.length} className="p-4 text-center text-muted-foreground">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
  linhas.map((row: typeof linhas[number]) => (
    <TableRow key={row.id} data-selected={row.getIsSelected() || undefined} className={row.getIsSelected() ? 'bg-accent/40 cursor-pointer' : 'cursor-pointer'} onClick={()=> onRowClick?.(row.original as TData)}>
          {row.getVisibleCells().map((cell: ReturnType<typeof row.getVisibleCells>[number]) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabelaContainer>

      {/* Controles de Paginação */}
      {!serverSide && (
        <div className="flex items-center gap-2 justify-end pt-1">
          <span className="text-xs text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      )}
      {serverSide && (
        <div className="flex items-center gap-2 justify-end pt-1">
          <span className="text-xs text-muted-foreground">
            Página {(pagina ?? 0) + 1} de {table.getPageCount() ?? 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => irParaPagina(Math.max((pagina ?? 0) - 1, 0))}
            disabled={(pagina ?? 0) <= 0}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => irParaPagina((pagina ?? 0) + 1)}
            disabled={
              totalRegistros !== undefined && tamanhoPagina > 0
                ? (pagina ?? 0) + 1 >= Math.ceil(totalRegistros / tamanhoPagina)
                : false
            }
          >
            Próxima
          </Button>
        </div>
      )}
      {/* Server-side paginação a implementar em fase futura */}
    </div>
  );
}

export default DataTableBase;
