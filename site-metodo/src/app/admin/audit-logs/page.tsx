'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/admin/data-table';
import { StatsCard } from '@/components/admin/stats-card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  Shield, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Eye,
  Filter,
  Download,
  RefreshCw,
  Search,
  Clock,
  User,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DatePickerWithRange, DateRange } from '@/components/ui/date-range-picker';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AccessLog {
  id: string;
  userId: string | null;
  subject: string;
  object: string;
  action: string;
  allowed: boolean;
  ip: string | null;
  userAgent: string | null;
  timestamp: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

interface AuditStats {
  total24h: number;
  allowed: number;
  denied: number;
  activityByHour: Array<{
    hour: number;
    count: number;
  }>;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AccessLog[]>([]);
  const [stats, setStats] = React.useState<AuditStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  // Filtros
  const [filters, setFilters] = React.useState({
    subject: '',
    object: '',
    action: '',
    allowed: '',
    dateRange: undefined as DateRange | undefined
  });

  const loadLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      if (filters.subject) params.append('subject', filters.subject);
      if (filters.object) params.append('object', filters.object);
      if (filters.action) params.append('action', filters.action);
      if (filters.allowed) params.append('allowed', filters.allowed);
      if (filters.dateRange?.from) params.append('startDate', filters.dateRange.from.toISOString());
      if (filters.dateRange?.to) params.append('endDate', filters.dateRange.to.toISOString());

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        })));
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  React.useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const columns: ColumnDef<AccessLog>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Data/Hora',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {(() => {
              const value = row.getValue('timestamp');
              if (!value) return '';
              let date: Date;
              if (value instanceof Date) {
                date = value;
              } else if (typeof value === 'string' || typeof value === 'number') {
                date = new Date(value);
              } else {
                return '';
              }
              return date.toLocaleDateString('pt-BR');
            })()}
          </span>
          <span className="text-xs text-muted-foreground">
            {(() => {
              const value = row.getValue('timestamp');
              if (!value) return '';
              let date: Date;
              if (value instanceof Date) {
                date = value;
              } else if (typeof value === 'string' || typeof value === 'number') {
                date = new Date(value);
              } else {
                return '';
              }
              return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            })()}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'subject',
      header: 'Sujeito',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.getValue('subject')}</span>
          {row.original.user && (
            <span className="text-xs text-muted-foreground">
              {row.original.user.name || row.original.user.email}
            </span>
          )}
        </div>
      )
    },
    {
      accessorKey: 'object',
      header: 'Objeto',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue('object')}
        </Badge>
      )
    },
    {
      accessorKey: 'action',
      header: 'Ação',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('action')}
        </Badge>
      )
    },
    {
      accessorKey: 'allowed',
      header: 'Resultado',
      cell: ({ row }) => {
        const allowed = row.getValue('allowed') as boolean;
        return (
          <div className="flex items-center gap-2">
            {allowed ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <Badge variant={allowed ? 'default' : 'destructive'}>
              {allowed ? 'Permitido' : 'Negado'}
            </Badge>
          </div>
        );
      }
    },
    {
      accessorKey: 'ip',
      header: 'IP',
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">
          {row.getValue('ip') || 'N/A'}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const chartData = stats?.activityByHour.map(item => ({
    hora: `${item.hour.toString().padStart(2, '0')}:00`,
    acessos: item.count
  })) || [];

  const statsCards = [
    {
      title: "Total (24h)",
      value: stats?.total24h.toString() || '0',
      description: "Eventos nas últimas 24 horas",
      icon: Activity,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Permitidos",
      value: stats?.allowed.toString() || '0',
      description: "Acessos autorizados",
      icon: CheckCircle,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Negados",
      value: stats?.denied.toString() || '0',
      description: "Acessos bloqueados",
      icon: XCircle,
      trend: { value: 15, isPositive: false }
    },
    {
      title: "Taxa de Sucesso",
      value: stats ? `${Math.round((stats.allowed / (stats.allowed + stats.denied)) * 100)}%` : '0%',
      description: "Percentual de sucesso",
      icon: TrendingUp,
      trend: { value: 3, isPositive: true }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/area-cliente">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/area-cliente/dashboard-admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Logs de Auditoria</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Logs de Auditoria</h1>
              <p className="text-muted-foreground">
                Visualize e monitore todas as atividades do sistema
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadLogs} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Gráfico de Atividade */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Atividade por Hora
                </CardTitle>
                <CardDescription>
                  Distribuição de eventos nas últimas 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(label) => `Hora: ${label}`}
                        formatter={(value) => [value, 'Acessos']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="acessos" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ fill: '#8884d8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
                <CardDescription>
                  Refine a visualização dos logs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujeito</Label>
                  <Input
                    id="subject"
                    placeholder="Buscar por sujeito..."
                    value={filters.subject}
                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="object">Objeto</Label>
                  <Input
                    id="object"
                    placeholder="Buscar por objeto..."
                    value={filters.object}
                    onChange={(e) => setFilters(prev => ({ ...prev, object: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action">Ação</Label>
                  <Select 
                    value={filters.action} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as ações" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="read">read</SelectItem>
                      <SelectItem value="write">write</SelectItem>
                      <SelectItem value="delete">delete</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowed">Resultado</Label>
                  <Select 
                    value={filters.allowed} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, allowed: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os resultados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="true">Permitidos</SelectItem>
                      <SelectItem value="false">Negados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Período</Label>
                  <DatePickerWithRange
                    date={filters.dateRange}
                    onDateChange={(dateRange) => setFilters(prev => ({ ...prev, dateRange }))}
                  />
                </div>

                <Button onClick={loadLogs} className="w-full" disabled={loading}>
                  <Search className="h-4 w-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabela de Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Logs de Acesso
            </CardTitle>
            <CardDescription>
              Histórico detalhado de todas as tentativas de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={logs}
              columns={columns}
              searchKey="subject"
              searchPlaceholder="Buscar nos logs..."
            />
            
            {/* Paginação customizada */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} registros
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
