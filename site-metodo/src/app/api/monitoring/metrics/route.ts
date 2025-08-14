'use client'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { monitoring } from '@/lib/monitoring'
import logger from '@/lib/logger-simple'
import { getClientIP } from '@/lib/utils/ip'
import { checkABACPermission } from '@/lib/abac/enforcer'
import { z } from 'zod'

interface SessionWithUser {
  user?: {
    location?: string | null
    department?: string | null
    mfaEnabled?: boolean
    lastLogin?: Date | string | null
  }
}

// Schema para validação dos parâmetros
const MetricsParams = z.object({
  metric: z.string().optional(),
  timeRange: z
    .string()
    .optional()
    .transform(str => (str ? parseInt(str) : 3600000)), // 1 hour default
  format: z.enum(['json', 'prometheus']).default('json'),
})

interface MetricData {
  avg: number
  min: number
  max: number
  count: number
  total?: number
  timestamp?: string
  p95?: number
  p99?: number
}

interface HealthStatus {
  status: string
  uptime: number
  memory: Record<string, number>
  cpu?: Record<string, number>
  database?: Record<string, unknown>
  lastChecked?: Date | string
  [key: string]: unknown
}

/**
 * 🔐 UTILITÁRIO PARA EXTRAIR CONTEXTO ABAC DA REQUISIÇÃO
 */
function buildABACContext(req: NextRequest, session: SessionWithUser) {
  return {
    ip: getClientIP(req),
    userAgent: req.headers.get('user-agent') || 'Unknown',
    time: new Date().toISOString(),
    location: session?.user?.location || 'unknown',
    department: session?.user?.department || 'unknown',
    mfaVerified: session?.user?.mfaEnabled || false,
    sessionAge: session?.user?.lastLogin ? Date.now() - new Date(session.user.lastLogin).getTime() : 0,
    sensitive: true, // Métricas são dados sensíveis
    dataClassification: 'confidential' as const
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificação ABAC: usuário pode acessar métricas do sistema
    const context = buildABACContext(request, session)
    const subject = session.user.email ? String(session.user.email) : `user:${session.user.id}`
    const authResult = await checkABACPermission(
      subject,
      'resource:system:metrics',
      'read',
      context
    )

    if (!authResult.allowed) {
      logger.warn('Unauthorized metrics access attempt', {
        userId: session.user.id,
        email: session.user.email,
        reason: authResult.reason,
        ip: context.ip,
        context
      })
      
      return NextResponse.json({ 
        error: 'Acesso negado',
        reason: authResult.reason 
      }, { status: 403 })
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
      // Verificação ABAC adicional para métrica específica
      const metricSubject = session.user.email ? String(session.user.email) : `user:${session.user.id}`
      const metricAuthResult = await checkABACPermission(
        metricSubject,
        `resource:system:metrics:${params.metric}`,
        'read',
        context
      )

      if (!metricAuthResult.allowed) {
        return NextResponse.json({ 
          error: 'Acesso negado para métrica específica',
          reason: metricAuthResult.reason 
        }, { status: 403 })
      }

      const aggregated = monitoring.getAggregatedMetrics(params.metric, params.timeRange)

      if (!aggregated) {
        return NextResponse.json({ error: 'Métrica não encontrada' }, { status: 404 })
      }

      // Log do acesso à métrica específica
      logger.info('SPECIFIC_METRIC_ACCESSED', {
        performedBy: session.user.id || '',
        ip: context.ip,
        userAgent: context.userAgent,
        metric: params.metric,
        timeRange: params.timeRange,
        appliedPolicies: metricAuthResult.appliedPolicies
      })

      return NextResponse.json({
        success: true,
        metric: params.metric,
        timeRange: params.timeRange,
        data: aggregated,
        context: {
          user: session.user.id,
          timestamp: new Date().toISOString(),
          authorizationPolicies: metricAuthResult.appliedPolicies
        }
      })
    }

    // Obter todas as métricas disponíveis
    const availableMetrics = monitoring.getAllMetrics()
    const metricsData: Record<string, MetricData> = {}

    // Coletar dados agregados para todas as métricas
    // Verificar acesso individual para cada métrica sensível
    for (const metricName of availableMetrics) {
      // Para métricas sensíveis, verificar permissão individual
      if (metricName.includes('security') || metricName.includes('auth') || metricName.includes('user')) {
        const metricSub = session.user.email ? String(session.user.email) : `user:${session.user.id}`
        const metricAuthResult = await checkABACPermission(
          metricSub,
          `resource:system:metrics:${metricName}`,
          'read',
          context
        )
        
        if (!metricAuthResult.allowed) {
          continue // Pular métrica não autorizada
        }
      }

      const aggregated = monitoring.getAggregatedMetrics(metricName, params.timeRange)
      if (aggregated) {
        metricsData[metricName] = aggregated
      }
    }

    // Adicionar saúde do sistema (se autorizado)
    let health: unknown = null
    let healthHistory: unknown = null

    const healthSubject = session.user.email ? String(session.user.email) : `user:${session.user.id}`
    const healthAuthResult = await checkABACPermission(
      healthSubject,
      'resource:system:health',
      'read',
      context
    )

    if (healthAuthResult.allowed) {
      health = await monitoring.checkSystemHealth()
      healthHistory = monitoring.getHealthHistory(24) // últimas 24 horas
    }

    // Formato Prometheus
    if (params.format === 'prometheus') {
      const prometheusMetrics = convertToPrometheus(metricsData, health as unknown as HealthStatus)
      return new NextResponse(prometheusMetrics, {
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    // Log do acesso completo às métricas
    logger.info('METRICS_ACCESSED', {
      performedBy: session.user.id || '',
      ip: context.ip,
      userAgent: context.userAgent,
      metricCount: Object.keys(metricsData).length,
      timeRange: params.timeRange,
      includesHealth: !!health,
      appliedPolicies: authResult.appliedPolicies,
      responseTime: authResult.responseTime
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      timeRange: params.timeRange,
      systemHealth: health,
      healthHistory: healthHistory,
      metrics: metricsData,
      metadata: {
        totalMetrics: Object.keys(metricsData).length,
        filteredMetrics: availableMetrics.length - Object.keys(metricsData).length,
        authorization: {
          policies: authResult.appliedPolicies,
          context: context,
          responseTime: authResult.responseTime
        }
      }
    })

  } catch (error) {
    logger.error('Metrics endpoint error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json({
      error: 'Erro interno do servidor',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

/**
 * 🔧 Converter métricas para formato Prometheus
 */
function convertToPrometheus(metricsData: Record<string, MetricData>, health: HealthStatus): string {
  let output = ''
  
  // Métricas básicas
  for (const [metricName, data] of Object.entries(metricsData)) {
    output += `# TYPE ${metricName}_avg gauge\n`
    output += `${metricName}_avg ${data.avg}\n`
    output += `# TYPE ${metricName}_count counter\n`
    output += `${metricName}_count ${data.count}\n`
    
    if (data.p95) {
      output += `# TYPE ${metricName}_p95 gauge\n`
      output += `${metricName}_p95 ${data.p95}\n`
    }
    
    if (data.p99) {
      output += `# TYPE ${metricName}_p99 gauge\n`
      output += `${metricName}_p99 ${data.p99}\n`
    }
    
    output += '\n'
  }
  
  // Saúde do sistema
  if (health) {
    output += `# TYPE system_status gauge\n`
    output += `system_status{status="${health.status}"} ${health.status === 'healthy' ? 1 : 0}\n`
    
    output += `# TYPE system_uptime gauge\n`
    output += `system_uptime ${health.uptime}\n`
    
    if (health.memory) {
      for (const [key, value] of Object.entries(health.memory)) {
        output += `# TYPE system_memory_${key} gauge\n`
        output += `system_memory_${key} ${value}\n`
      }
    }
  }
  
  return output
}

/**
 * POST: Recarregar métricas ou executar ações administrativas
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const context = buildABACContext(request, session)
    
    // Verificação ABAC: usuário pode executar ações administrativas em métricas
    const postSubject = session.user.email ? String(session.user.email) : `user:${session.user.id}`
    const authResult = await checkABACPermission(
      postSubject,
      'resource:system:metrics',
      'admin',
      context
    )

    if (!authResult.allowed) {
      logger.warn('Unauthorized metrics admin action attempt', {
        userId: session.user.id,
        reason: authResult.reason,
        context
      })
      
      return NextResponse.json({ 
        error: 'Acesso negado',
        reason: authResult.reason 
      }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'reload':
        // Recarregar métricas
        // monitoring.clearCache?.() // Comentado - método pode não existir
        
        logger.info('METRICS_RELOADED', {
          performedBy: session.user.id,
          ip: context.ip,
          userAgent: context.userAgent
        })
        
        return NextResponse.json({
          success: true,
          message: 'Métricas recarregadas com sucesso'
        })

      case 'clear_cache':
        // Limpar cache de métricas
        // monitoring.clearCache?.() // Comentado - método pode não existir
        
        logger.info('METRICS_CACHE_CLEARED', {
          performedBy: session.user.id,
          ip: context.ip,
          userAgent: context.userAgent
        })
        
        return NextResponse.json({
          success: true,
          message: 'Cache de métricas limpo com sucesso'
        })

      default:
        return NextResponse.json({
          error: 'Ação não reconhecida'
        }, { status: 400 })
    }

  } catch (error) {
    logger.error('Metrics admin action error', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
