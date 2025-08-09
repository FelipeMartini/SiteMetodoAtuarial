// use client

// Tipagens base para DataTable headless utilizando TanStack Table
// Centraliza contratos para reutilização e extensão.
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';

export interface DataTableEstado {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  density: 'padrao' | 'compacto';
  rowSelection: Record<string, boolean>;
}

export interface DataTablePersistenciaConfig {
  chaveNamespace: string; // usada para localStorage
  habilitarPersistencia?: boolean;
}

export interface DataTableBaseProps<TData, TValue> {
  colunas: ColumnDef<TData, TValue>[];
  dados: TData[];
  carregando?: boolean;
  legendaAcessivel?: string;
  totalRegistros?: number; // para paginação server-side
  pagina?: number;
  tamanhoPagina?: number;
  onPaginaChange?: (pagina: number) => void;
  serverSide?: boolean; // indica se paginação e filtros são remotos
  persistencia?: DataTablePersistenciaConfig;
  onRowSelectionChange?: (rows: TData[]) => void;
  acoesToolbarExtras?: React.ReactNode;
  acoesLinhaRenderer?: (linha: TData) => React.ReactNode;
  caption?: string; // caption semântico
}
