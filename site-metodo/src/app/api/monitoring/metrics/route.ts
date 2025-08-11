import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { monitoring } from '@/lib/monitoring'
import { structuredLogger } from '@/lib/logger'
import { getClientIP } from '@/lib/utils/ip'
import { z } from 'zod'

// Schema para validação dos parâmetros
const MetricsParams = z.object({
  metric: z.string().optional(),
  timeRange: z.string().optional().transform(str => str ? parseInt(str) : 3600000), // 1 hour default
  format: z.enum(['json', 'prometheus']).default('json'),
})


interface MetricData {
  avg: number;
  min: number;
  max: number;
  count: number;
  total?: number;
  timestamp?: string;
  p95?: number;
  p99?: number;
}

interface HealthStatus {
  status: string;
  uptime: number;
  memory: Record<string, number>;
  cpu?: Record<string, number>;
  database?: Record<string, unknown>;
  lastChecked?: Date | string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação e permissões
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin ou moderador (accessLevel >= 50)
    if ((session.user.accessLevel || 0) < 50) {
      structuredLogger.security('Unauthorized metrics access attempt', 'medium', {
        userId: session.user.id,
        email: session.user.email,
        accessLevel: session.user.accessLevel,
        ip: getClientIP(request),
      })
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Extrair e validar parâmetros
    const searchParams = request.nextUrl.searchParams
    const params = MetricsParams.parse({
      metric: searchParams.get('metric') || undefined,
      timeRange: searchParams.get('timeRange') || undefined,
      format: searchParams.get('format') || 'json',
    })

    // Se métrica específica foi solicitada
    if (params.metric) {
      const aggregated = monitoring.getAggregatedMetrics(params.metric, params.timeRange)
      
      if (!aggregated) {
        return NextResponse.json(
          { error: 'Métrica não encontrada' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        metric: params.metric,
        timeRange: params.timeRange,
        data: aggregated,
      })
    }

    // Obter todas as métricas disponíveis
    const availableMetrics = monitoring.getAllMetrics()
    const metricsData: Record<string, MetricData> = {}

    // Coletar dados agregados para todas as métricas
    for (const metricName of availableMetrics) {
      const aggregated = monitoring.getAggregatedMetrics(metricName, params.timeRange)
      if (aggregated) {
        metricsData[metricName] = aggregated
      }
    }

    // Adicionar saúde do sistema
    const health = await monitoring.checkSystemHealth()
    const healthHistory = monitoring.getHealthHistory(24) // últimas 24 horas

    // Formato Prometheus
    if (params.format === 'prometheus') {
      const prometheusMetrics = convertToPrometheus(metricsData, health as unknown as HealthStatus)
      return new NextResponse(prometheusMetrics, {
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    // Log do acesso às métricas
    structuredLogger.audit('METRICS_ACCESSED', {
      performedBy: session.user.id || '',
      ip: getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'Unknown',
      metricCount: Object.keys(metricsData).length,
      timeRange: params.timeRange,
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      timeRange: params.timeRange,
      systemHealth: health,
      healthHistory: healthHistory,
      metrics: metricsData,
      availableMetrics,
    })
  } catch (_error) {
    structuredLogger.error('Error fetching metrics', _error as Error, {
      userId: (await auth())?.user?.id,
      ip: getClientIP(request),
    })
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Converter métricas para formato Prometheus
function convertToPrometheus(metricsData: Record<string, MetricData>, health: HealthStatus): string {
  const lines: string[] = []

  // Métricas de aplicação
  for (const [metricName, data] of Object.entries(metricsData)) {
    const promName = metricName.replace(/[^a-zA-Z0-9_]/g, '_')
    
    lines.push(`# HELP ${promName}_avg Average value`)
    lines.push(`# TYPE ${promName}_avg gauge`)
    lines.push(`${promName}_avg ${data.avg}`)
    
    lines.push(`# HELP ${promName}_max Maximum value`)
    lines.push(`# TYPE ${promName}_max gauge`)
    lines.push(`${promName}_max ${data.max}`)
    
    lines.push(`# HELP ${promName}_p95 95th percentile`)
    lines.push(`# TYPE ${promName}_p95 gauge`)
    lines.push(`${promName}_p95 ${data.p95}`)
  }

  // Métricas de sistema
  lines.push('# HELP system_uptime_seconds System uptime in seconds')
  lines.push('# TYPE system_uptime_seconds counter')
  lines.push(`system_uptime_seconds ${health.uptime}`)

  lines.push('# HELP system_memory_usage_ratio Memory usage ratio')
  lines.push('# TYPE system_memory_usage_ratio gauge')
  lines.push(`system_memory_usage_ratio ${health.memory.percentage}`)

  lines.push('# HELP system_health_status System health status (1=healthy, 0.5=degraded, 0=unhealthy)')
  lines.push('# TYPE system_health_status gauge')
  const healthValue = health.status === 'healthy' ? 1 : health.status === 'degraded' ? 0.5 : 0
  lines.push(`system_health_status ${healthValue}`)

  return lines.join('\n') + '\n'
}
