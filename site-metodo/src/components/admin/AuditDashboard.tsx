'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Download,
  RefreshCw,
  Search,
  Eye,
  User,
  Globe,
  Smartphone,
  Calendar
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AuditLog {
  id: string
  userId?: string
  action: string
  target?: string
  details?: any
  ipAddress?: string
  userAgent?: string
  success: boolean
  createdAt: string
  user?: {
    id: string
    name?: string
    email?: string
  }
}

interface AuditStats {
  period: string
  startDate: string
  endDate: string
  totalLogs: number
  successfulActions: number
  failedActions: number
  uniqueUsers: number
  actionsByType: Array<{
    action: string
    count: number
  }>
}

export function AuditDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    success: '',
    startDate: '',
    endDate: '',
    search: '',
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // Fetch logs
  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/audit/logs?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setLogs(data.logs)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/audit/stats?period=${selectedPeriod}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchLogs()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchStats()
  }, [selectedPeriod])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      userId: '',
      action: '',
      success: '',
      startDate: '',
      endDate: '',
      search: '',
    })
  }

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      params.append('export', 'true')

      const response = await fetch(`/api/audit/logs?${params}`)
      const blob = await response.blob()
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting logs:', error)
    }
  }

  const getActionBadge = (action: string, success: boolean) => {
    const variant = success ? 'default' : 'destructive'
    const colors = {
      LOGIN_SUCCESS: 'bg-green-100 text-green-800',
      LOGIN_FAILED: 'bg-red-100 text-red-800',
      USER_CREATE: 'bg-blue-100 text-blue-800',
      USER_UPDATE: 'bg-yellow-100 text-yellow-800',
      USER_DELETE: 'bg-red-100 text-red-800',
      ROLE_CHANGE: 'bg-purple-100 text-purple-800',
    }
    
    return (
      <Badge variant={variant} className={colors[action as keyof typeof colors]}>
        {action.replace('_', ' ')}
      </Badge>
    )
  }

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile')) {
      return <Smartphone className="h-4 w-4" />
    }
    return <Globe className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Auditoria</h2>
          <p className="text-muted-foreground">
            Monitoramento e análise de atividades do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchLogs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs}</div>
              <p className="text-xs text-muted-foreground">
                Últimos {selectedPeriod === 'day' ? '24 horas' : selectedPeriod === 'week' ? '7 dias' : '30 dias'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ações Bem-sucedidas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.successfulActions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalLogs > 0 ? Math.round((stats.successfulActions / stats.totalLogs) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ações Falharam</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failedActions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalLogs > 0 ? Math.round((stats.failedActions / stats.totalLogs) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Únicos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">
                Usuários ativos no período
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Input
                  placeholder="Buscar..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
                
                <Input
                  placeholder="ID do Usuário"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                />
                
                <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="LOGIN_SUCCESS">Login Sucesso</SelectItem>
                    <SelectItem value="LOGIN_FAILED">Login Falha</SelectItem>
                    <SelectItem value="USER_CREATE">Criar Usuário</SelectItem>
                    <SelectItem value="USER_UPDATE">Atualizar Usuário</SelectItem>
                    <SelectItem value="USER_DELETE">Deletar Usuário</SelectItem>
                    <SelectItem value="ROLE_CHANGE">Mudança de Role</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.success} onValueChange={(value) => handleFilterChange('success', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="true">Sucesso</SelectItem>
                    <SelectItem value="false">Falha</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
                
                <div className="flex gap-2">
                  <Button onClick={fetchLogs} size="sm" className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Limpar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
              <CardDescription>
                {logs.length} registros encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Carregando logs...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Alvo</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-mono text-sm">
                                {new Date(log.createdAt).toLocaleDateString('pt-BR')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(log.createdAt).toLocaleTimeString('pt-BR')}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {log.user ? (
                            <div>
                              <div className="font-medium">{log.user.name || 'Sem nome'}</div>
                              <div className="text-sm text-muted-foreground">{log.user.email}</div>
                            </div>
                          ) : (
                            <Badge variant="outline">Sistema</Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {getActionBadge(log.action, log.success)}
                        </TableCell>
                        
                        <TableCell>
                          <span className="font-mono text-sm">{log.target || '-'}</span>
                        </TableCell>
                        
                        <TableCell>
                          <span className="font-mono text-sm">{log.ipAddress || '-'}</span>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {log.userAgent && getDeviceIcon(log.userAgent)}
                            <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                              {log.userAgent || '-'}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {log.success ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Sucesso
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Falha
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Period Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Período de Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedPeriod} onValueChange={(value: 'day' | 'week' | 'month') => setSelectedPeriod(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Últimas 24 horas</SelectItem>
                  <SelectItem value="week">Últimos 7 dias</SelectItem>
                  <SelectItem value="month">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Actions by Type */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Ações por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.actionsByType.map((item) => (
                    <div key={item.action} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getActionBadge(item.action, true)}
                        <span className="text-sm">{item.action.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(item.count / stats.totalLogs) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Detalhes do Log
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ID</label>
                  <p className="font-mono text-sm">{selectedLog.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Data/Hora</label>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(selectedLog.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Usuário</label>
                  <p className="text-sm">
                    {selectedLog.user?.name || 'Sistema'} ({selectedLog.user?.email || 'N/A'})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Ação</label>
                  <p>{getActionBadge(selectedLog.action, selectedLog.success)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">IP Address</label>
                  <p className="font-mono text-sm">{selectedLog.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p>{selectedLog.success ? '✅ Sucesso' : '❌ Falha'}</p>
                </div>
              </div>
              
              {selectedLog.userAgent && (
                <div>
                  <label className="text-sm font-medium">User Agent</label>
                  <p className="text-sm break-all">{selectedLog.userAgent}</p>
                </div>
              )}
              
              {selectedLog.details && (
                <div>
                  <label className="text-sm font-medium">Detalhes</label>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
