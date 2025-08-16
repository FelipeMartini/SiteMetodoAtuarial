'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, Settings2 } from 'lucide-react'

interface ServerPaginationConfig {
  page: number // 1-based
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  caption?: string // Para acessibilidade
  'aria-label'?: string // Para acessibilidade
  serverPagination?: ServerPaginationConfig
  toolbarExtras?: React.ReactNode // ações adicionais (export, filtros externos já tratados fora)
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Buscar...',
  caption,
  'aria-label': ariaLabel,
  serverPagination,
  toolbarExtras,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Estado interno de paginação apenas se não for server-side
  const [internalPageSize, setInternalPageSize] = React.useState(10)
  const [internalPageIndex, setInternalPageIndex] = React.useState(0)

  const paginationState = serverPagination
    ? { pageIndex: serverPagination.page - 1, pageSize: serverPagination.pageSize }
    : { pageIndex: internalPageIndex, pageSize: internalPageSize }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: !!serverPagination,
    pageCount: serverPagination ? Math.ceil(serverPagination.total / serverPagination.pageSize) : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
    },
  })

  return (
    <div className='w-full space-y-4'>
      {/* Toolbar */}
    <div className='flex items-center justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={event =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className='h-8 w-[150px] lg:w-[250px]'
              aria-label={`Buscar na tabela por ${searchKey}`}
            />
          )}
      {toolbarExtras && <div className='flex items-center space-x-2'>{toolbarExtras}</div>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant='outline' 
              size='sm' 
              className='ml-auto h-8'
              aria-label="Configurar visibilidade das colunas"
            >
              <Settings2 className='mr-2 h-4 w-4' />
              Colunas
              <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[150px]'>
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <Table aria-label={ariaLabel || 'Tabela de dados'}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className='whitespace-nowrap'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {serverPagination ? serverPagination.total : table.getFilteredRowModel().rows.length} item(s) selecionado(s).
        </div>
        {serverPagination ? (
          <div className='flex items-center space-x-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium'>Linhas/página</p>
              <select
                value={serverPagination.pageSize}
                onChange={e => serverPagination.onPageSizeChange?.(Number(e.target.value))}
                className='h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
              >
                {[10,25,50,100].map(ps => <option key={ps} value={ps}>{ps}</option>)}
              </select>
            </div>
            <div className='flex w-[120px] items-center justify-center text-sm font-medium'>
              Página {serverPagination.page} de {Math.max(1, Math.ceil(serverPagination.total / serverPagination.pageSize))}
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => serverPagination.onPageChange(1)}
                disabled={serverPagination.page === 1}
              >
                ⟨⟨
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => serverPagination.onPageChange(Math.max(1, serverPagination.page - 1))}
                disabled={serverPagination.page === 1}
              >
                ⟨
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => serverPagination.onPageChange(serverPagination.page + 1)}
                disabled={serverPagination.page >= Math.ceil(serverPagination.total / serverPagination.pageSize)}
              >
                ⟩
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => serverPagination.onPageChange(Math.ceil(serverPagination.total / serverPagination.pageSize))}
                disabled={serverPagination.page >= Math.ceil(serverPagination.total / serverPagination.pageSize)}
              >
                ⟩⟩
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex items-center space-x-6 lg:space-x-8'>
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium'>Linhas por página</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value))
                  setInternalPageSize(Number(e.target.value))
                }}
                className='h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => { table.setPageIndex(0); setInternalPageIndex(0) }}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Ir para primeira página</span>
                ⟨⟨
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => { table.previousPage(); setInternalPageIndex(p => Math.max(0, p - 1)) }}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Ir para página anterior</span>
                ⟨
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => { table.nextPage(); setInternalPageIndex(p => p + 1) }}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Ir para próxima página</span>
                ⟩
              </Button>
              <Button
                variant='outline'
                className='h-8 w-8 p-0'
                onClick={() => { const last = table.getPageCount() - 1; table.setPageIndex(last); setInternalPageIndex(last) }}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Ir para última página</span>
                ⟩⟩
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
