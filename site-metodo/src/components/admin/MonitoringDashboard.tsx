'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  Monitor,
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Clock,
  Cpu,
  HardDrive,
  Zap,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { useToast } from '@/hooks/use-toast'

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  score: number
  timestamp: string
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  cpu: {
    percentage: number
  }
  services: {
    database: boolean
    cache: boolean
    storage: boolean
  }
  lastCheck: string
}

interface MetricData {
  name: string
  value: number
  timestamp: string
}

interface MonitoringData {
  systemHealth: SystemHealth
  healthHistory: SystemHealth[]
  metrics: Record<
    string,
    {
      current: number
      avg: number
      max: number
      min: number
      p95: number
      count: number
      history: MetricData[]
    }
  >
  availableMetrics: string[]
  timestamp: string
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 segundos
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring/metrics')

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: 'Acesso negado',
            description: 'Você não tem permissão para acessar as métricas de monitoramento.',
            variant: 'destructive',
          })
          return
        }
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (_error) {
      console.error('Error fetching monitoring data:', String(_error))
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados de monitoramento.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const exportMetrics = async (format: 'json' | 'prometheus' = 'json') => {
    try {
      const response = await fetch(`/api/monitoring/metrics?format=${format}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `metrics-${new Date().toISOString().slice(0, 10)}.${format === 'json' ? 'json' : 'txt'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Exportação concluída',
        description: `Métricas exportadas em formato ${format.toUpperCase()}.`,
      })
    } catch (_error) {
      console.error('Error exporting metrics:', String(_error))
      toast({
        title: 'Erro na exportação',
        description: 'Erro ao exportar métricas.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchData])

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className='h-5 w-5 text-green-500' />
      case 'degraded':
        return <AlertTriangle className='h-5 w-5 text-yellow-500' />
      case 'unhealthy':
        return <XCircle className='h-5 w-5 text-red-500' />
      default:
  return <Monitor className='h-5 w-5 text-muted-foreground' />
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500'
      case 'degraded':
        return 'bg-yellow-500'
      case 'unhealthy':
        return 'bg-red-500'
      default:
  return 'bg-muted/10'
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='text-center p-8'>
        <AlertTriangle className='h-12 w-12 text-yellow-500 mx-auto mb-4' />
        <h3 className='text-lg font-semibold'>Dados não disponíveis</h3>
        <p className='text-gray-600 mb-4'>Não foi possível carregar os dados de monitoramento.</p>
        <Button onClick={fetchData}>
          <RefreshCw className='h-4 w-4 mr-2' />
          Tentar novamente
        </Button>
      </div>
    )
  }

  const { systemHealth, healthHistory, metrics } = data

  return (
    <div className='space-y-6'>
      {/* Header with Controls */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Monitoramento do Sistema</h2>
          <p className='text-muted-foreground'>
            Última atualização: {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className='h-4 w-4 mr-2' />
            Auto-refresh
          </Button>
          <Button variant='outline' onClick={fetchData}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Atualizar
          </Button>
          <Button variant='outline' onClick={() => exportMetrics('json')}>
            <Download className='h-4 w-4 mr-2' />
            Exportar JSON
          </Button>
          <Button variant='outline' onClick={() => exportMetrics('prometheus')}>
            <Download className='h-4 w-4 mr-2' />
            Exportar Prometheus
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Status do Sistema</CardTitle>
            {getHealthIcon(systemHealth.status)}
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold capitalize'>{systemHealth.status}</div>
            <Badge className={getHealthColor(systemHealth.status)}>
              Score: {systemHealth.score}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Uptime</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatUptime(systemHealth.uptime)}</div>
            <p className='text-xs text-muted-foreground'>
              Desde {new Date(Date.now() - systemHealth.uptime * 1000).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Uso de Memória</CardTitle>
            <HardDrive className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{systemHealth.memory.percentage.toFixed(1)}%</div>
            <Progress value={systemHealth.memory.percentage} className='mt-2' />
            <p className='text-xs text-muted-foreground mt-1'>
              {formatBytes(systemHealth.memory.used)} / {formatBytes(systemHealth.memory.total)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>CPU</CardTitle>
            <Cpu className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{systemHealth.cpu.percentage.toFixed(1)}%</div>
            <Progress value={systemHealth.cpu.percentage} className='mt-2' />
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Serviços</CardTitle>
          <CardDescription>Estado atual dos serviços críticos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='flex items-center gap-2'>
              <Database className='h-4 w-4' />
              <span>Database</span>
              {systemHealth.services.database ? (
                <CheckCircle className='h-4 w-4 text-green-500' />
              ) : (
                <XCircle className='h-4 w-4 text-red-500' />
              )}
            </div>
            <div className='flex items-center gap-2'>
              <Zap className='h-4 w-4' />
              <span>Cache</span>
              {systemHealth.services.cache ? (
                <CheckCircle className='h-4 w-4 text-green-500' />
              ) : (
                <XCircle className='h-4 w-4 text-red-500' />
              )}
            </div>
            <div className='flex items-center gap-2'>
              <Server className='h-4 w-4' />
              <span>Storage</span>
              {systemHealth.services.storage ? (
                <CheckCircle className='h-4 w-4 text-green-500' />
              ) : (
                <XCircle className='h-4 w-4 text-red-500' />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Performance</CardTitle>
          <CardDescription>Dados detalhados de performance e utilização</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='overview'>Visão Geral</TabsTrigger>
              <TabsTrigger value='trends'>Tendências</TabsTrigger>
              <TabsTrigger value='health'>Histórico de Saúde</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {Object.entries(metrics).map(([metricName, metricData]) => (
                  <Card key={metricName}>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-sm font-medium capitalize'>
                        {metricName.replace(/[_-]/g, ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>
                        {metricData.current.toFixed(2)}
                        {metricName.includes('time') ? 'ms' : ''}
                      </div>
                      <div className='flex justify-between text-xs text-muted-foreground mt-2'>
                        <span>Média: {metricData.avg.toFixed(2)}</span>
                        <span>P95: {metricData.p95.toFixed(2)}</span>
                      </div>
                      <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>Min: {metricData.min.toFixed(2)}</span>
                        <span>Max: {metricData.max.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='trends' className='space-y-4'>
              {Object.entries(metrics)
                .slice(0, 3)
                .map(([metricName, metricData]) => (
                  <Card key={metricName}>
                    <CardHeader>
                      <CardTitle className='text-sm capitalize'>
                        {metricName.replace(/[_-]/g, ' ')} - Tendência
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width='100%' height={200}>
                        <LineChart data={metricData.history.slice(-20)}>
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis
                            dataKey='timestamp'
                            tickFormatter={value => new Date(value).toLocaleTimeString()}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={value => new Date(value).toLocaleString()}
                            formatter={(value: number) => [
                              `${value.toFixed(2)}${metricName.includes('time') ? 'ms' : ''}`,
                              metricName,
                            ]}
                          />
                          <Line type='monotone' dataKey='value' stroke='#3b82f6' strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value='health' className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Saúde do Sistema</CardTitle>
                  <CardDescription>Status de saúde nas últimas 24 horas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={300}>
                    <AreaChart data={healthHistory.slice(-48)}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='timestamp'
                        tickFormatter={value => new Date(value).toLocaleTimeString()}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        labelFormatter={value => new Date(value).toLocaleString()}
                        formatter={(value: number) => [
                          `${value}%`,
                          'Score de Saúde',
                        ]}
                      />
                      <Area
                        type='monotone'
                        dataKey='score'
                        stroke='#10b981'
                        fill='#10b981'
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
