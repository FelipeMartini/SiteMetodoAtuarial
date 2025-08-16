"use client"
import { useEffect, useState, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, RefreshCw, Filter } from 'lucide-react'
import { DataTable } from '@/components/admin/data-table'

interface ObservabilidadeTabsClientProps { type: string }

interface ObservabilityResponse<T=any> {
  type: string
  page: number
  pageSize: number
  total: number
  data: T[]
  elapsedMs: number
  error?: string
  summary?: { count24h?: number; errors24h?: number; p95DurationMs?: number }
  correlationId?: string
}

export default function ObservabilidadeTabsClient({ type }: ObservabilidadeTabsClientProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [summary, setSummary] = useState<{count24h?:number; errors24h?:number; p95DurationMs?:number}>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  // filtros básicos
  const [nivel, setNivel] = useState('')
  const [acao, setAcao] = useState('')
  const [recurso, setRecurso] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const queryString = useMemo(() => {
    const p = new URLSearchParams()
    p.set('type', type)
  p.set('page', String(page))
  p.set('pageSize', String(pageSize))
    p.set('summary', 'true')
    if (nivel) p.set('level', nivel)
    if (acao) p.set('action', acao)
    if (recurso) p.set('resource', recurso)
    if (statusFiltro) p.set('status', statusFiltro)
    if (search) p.set('q', search)
    if (dateFrom) p.set('dateFrom', dateFrom)
    if (dateTo) p.set('dateTo', dateTo)
    return p.toString()
  }, [type, page, pageSize, nivel, acao, recurso, statusFiltro, search, dateFrom, dateTo])

  useEffect(() => {
    let abort = false
    setLoading(true)
    setError(null)
    fetch(`/api/admin/observability?${queryString}`)
      .then(r => r.json())
      .then((resp: ObservabilityResponse) => {
        if (abort) return
        if (resp.error) { setError(resp.error); return }
        setRows(resp.data)
        setTotal(resp.total)
        if (resp.summary) setSummary(resp.summary)
      })
      .catch(e => { if (!abort) setError(String(e)) })
      .finally(() => { if (!abort) setLoading(false) })
    return () => { abort = true }
  }, [queryString])

  if (loading) return <div className="space-y-2"><Skeleton className="h-6 w-40"/><Skeleton className="h-10 w-full"/><Skeleton className="h-10 w-full"/></div>
  if (error) return <div className="text-sm text-red-500">Erro: {error}</div>

  const exportar = (formato: 'csv'|'json') => {
    const url = `/api/admin/observability?${queryString}&export=${formato}`
    fetch(url).then(async r => {
      const blob = await r.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `observ-${type}-${Date.now()}.${formato === 'csv' ? 'csv':'json'}`
      a.click()
      URL.revokeObjectURL(a.href)
    })
  }

  const exportarStreaming = (all: boolean) => {
    const qs = new URLSearchParams()
    qs.set('type', type)
    if (nivel) qs.set('level', nivel)
    if (acao) qs.set('action', acao)
    if (recurso) qs.set('resource', recurso)
    if (statusFiltro) qs.set('status', statusFiltro)
    if (dateFrom) qs.set('from', dateFrom)
    if (dateTo) qs.set('to', dateTo)
    if (all) qs.set('all','true')
    fetch(`/api/admin/observability/export?${qs.toString()}`).then(async r => {
      const blob = await r.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `observ-${type}-stream${all?'-all':''}-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(a.href)
    })
  }

  // Definição dinâmica de colunas para o DataTable
  const columns = useMemo<ColumnDef<any, any>[]>(() => {
    const baseDate: ColumnDef<any, any> = {
      id: 'createdAt',
      header: 'Data',
      accessorFn: r => r.createdAt,
      cell: ({ getValue }) => <span className="whitespace-nowrap">{new Date(getValue() as string).toLocaleString()}</span>
    }
    switch (type) {
      case 'sistema':
        return [
          baseDate,
          { id: 'level', header: 'Nível', accessorKey: 'level', cell: ({ row }) => <Badge variant={levelVariant(row.original.level)}>{row.original.level}</Badge> },
          { id: 'message', header: 'Mensagem', accessorKey: 'message', cell: ({ row }) => <div title={row.original.message} className="truncate max-w-[240px]">{row.original.message}</div> },
          { id: 'module', header: 'Módulo', accessorKey: 'module' }
        ]
      case 'auditoria':
        return [
          baseDate,
            { id: 'action', header: 'Ação', accessorKey: 'action', cell: ({ row }) => <Badge variant="outline">{row.original.action}</Badge> },
            { id: 'resource', header: 'Recurso', accessorKey: 'resource' },
            { id: 'userId', header: 'User', accessorFn: r => r.userId, cell: ({ getValue }) => {
              const v = getValue() as string | undefined
              return v ? v.slice(0,8) : '-'
            } }
        ]
      case 'performance':
        return [
          baseDate,
          { id: 'operation', header: 'Operação', accessorKey: 'operation' },
          { id: 'duration', header: 'Duração(ms)', accessorKey: 'duration' },
          { id: 'path', header: 'Path', accessorKey: 'path', cell: ({ row }) => <div title={row.original.path} className="truncate max-w-[160px]">{row.original.path}</div> },
        ]
      case 'email':
        return [
          baseDate,
          { id: 'to', header: 'Para', accessorKey: 'to', cell: ({ row }) => <div title={row.original.to} className="truncate max-w-[140px]">{row.original.to}</div> },
          { id: 'subject', header: 'Assunto', accessorKey: 'subject', cell: ({ row }) => <div title={row.original.subject} className="truncate max-w-[160px]">{row.original.subject}</div> },
          { id: 'status', header: 'Status', accessorKey: 'status', cell: ({ row }) => <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge> },
        ]
      case 'notificacoes':
        return [
          baseDate,
          { id: 'title', header: 'Título', accessorKey: 'title', cell: ({ row }) => <div title={row.original.title} className="truncate max-w-[160px]">{row.original.title}</div> },
          { id: 'userId', header: 'Usuário', accessorKey: 'userId', cell: ({ row }) => row.original.userId?.slice(0,8) },
          { id: 'status', header: 'Status', accessorKey: 'status', cell: ({ row }) => <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge> },
        ]
      case 'seguranca':
        return [
          baseDate,
          { id: 'level', header: 'Nível', accessorKey: 'level', cell: ({ row }) => <Badge variant={levelVariant(row.original.level)}>{row.original.level}</Badge> },
          { id: 'message', header: 'Mensagem', accessorKey: 'message', cell: ({ row }) => <div title={row.original.message} className="truncate max-w-[240px]">{row.original.message}</div> },
        ]
      default:
        return [
          baseDate,
          { id: 'info', header: 'Info', accessorFn: r => JSON.stringify(r).slice(0,60) }
        ]
    }
  }, [type])

  if (rows.length === 0) return (
    <div className="space-y-3">
      <Filtros />
      <p className="text-sm text-muted-foreground">Nenhum registro encontrado.</p>
    </div>
  )

  function Filtros() {
    return (
      <Card className="p-3 space-y-2">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex flex-col w-28">
            <label className="text-[10px] uppercase font-medium">Nível</label>
            <Input value={nivel} onChange={e=>setNivel(e.target.value)} placeholder="info" className="h-8" />
          </div>
          <div className="flex flex-col w-32">
            <label className="text-[10px] uppercase font-medium">Ação</label>
            <Input value={acao} onChange={e=>setAcao(e.target.value)} placeholder="LOGIN" className="h-8" />
          </div>
            <div className="flex flex-col w-32">
            <label className="text-[10px] uppercase font-medium">Recurso</label>
            <Input value={recurso} onChange={e=>setRecurso(e.target.value)} placeholder="auth" className="h-8" />
          </div>
          <div className="flex flex-col w-32">
            <label className="text-[10px] uppercase font-medium">Status</label>
            <Input value={statusFiltro} onChange={e=>setStatusFiltro(e.target.value)} placeholder="ok" className="h-8" />
          </div>
          <div className="flex flex-col w-36">
            <label className="text-[10px] uppercase font-medium">Search</label>
            <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="texto..." className="h-8" />
          </div>
          <div className="flex flex-col w-36">
            <label className="text-[10px] uppercase font-medium">De</label>
            <Input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="h-8" />
          </div>
          <div className="flex flex-col w-36">
            <label className="text-[10px] uppercase font-medium">Até</label>
            <Input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="h-8" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={()=>{setPage(1);}} title="Recarregar"><RefreshCw className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={()=>exportar('csv')}><Download className="h-4 w-4 mr-1" />CSV</Button>
            <Button size="sm" variant="outline" onClick={()=>exportar('json')}><Download className="h-4 w-4 mr-1" />JSON</Button>
          </div>
        </div>
        <div className="flex gap-4 text-[10px] text-muted-foreground">
          {summary.count24h !== undefined && <span>24h: {summary.count24h}</span>}
          {summary.errors24h !== undefined && <span>Erros24h: {summary.errors24h}</span>}
          {summary.p95DurationMs !== undefined && <span>P95(ms): {summary.p95DurationMs}</span>}
        </div>
      </Card>
    )
  }

  return (
    <div className="border rounded-md space-y-3 p-2">
      <Filtros />
      <div className="flex items-center justify-between px-1 py-1 text-xs text-muted-foreground">
        <span>{total} registros</span>
        <span>Tipo: <Badge variant="outline" className="uppercase">{type}</Badge></span>
      </div>
      <div className="text-[10px] text-muted-foreground px-1">Visualização DataTable (página atual)</div>
      <DataTable 
        columns={columns} 
        data={rows} 
        searchKey={undefined}
        serverPagination={{
          page,
          pageSize,
          total,
          onPageChange: (p)=> setPage(p),
          onPageSizeChange: (ps)=> { setPageSize(ps); setPage(1) }
        }}
        toolbarExtras={<>
          <Button variant="outline" size="sm" className="h-8" onClick={()=>exportarStreaming(false)} title="Exportar página streaming">StrPg</Button>
          <Button variant="outline" size="sm" className="h-8" onClick={()=>exportarStreaming(true)} title="Exportar multi-page streaming">StrAll</Button>
        </>}
      />
    </div>
  )
}

// headerFor / cellsFor substituídos pela definição de colunas dinâmica acima

function levelVariant(level?: string) {
  if (!level) return 'outline'
  const l = level.toLowerCase()
  if (l === 'error') return 'destructive'
  if (l === 'warn' || l === 'warning') return 'secondary'
  if (l === 'info') return 'outline'
  return 'outline'
}

function statusVariant(status?: string) {
  if (!status) return 'outline'
  const s = status.toLowerCase()
  if (['erro','failed','error'].includes(s)) return 'destructive'
  if (['sent','delivered','success','ok'].includes(s)) return 'outline'
  if (['pending','processing'].includes(s)) return 'secondary'
  return 'outline'
}
