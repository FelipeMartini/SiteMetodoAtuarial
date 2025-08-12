import { simpleLogger } from './simple-logger'

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: Date
  tags?: Record<string, string>
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  database: {
    status: 'connected' | 'disconnected'
    responseTime?: number
  }
  lastChecked: Date
}

export class MonitoringService {
  private static instance: MonitoringService
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private healthChecks: SystemHealth[] = []
  private alertThresholds = {
    responseTime: 1000, // ms
    errorRate: 0.05, // 5%
    memoryUsage: 0.85, // 85%
  }

  private constructor() {
    // Iniciar coleta de métricas em background
    this.startBackgroundCollection()
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  /**
   * Registrar métrica de performance
   */
  recordMetric(metric: PerformanceMetric): void {
    const key = metric.name
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }

    const metrics = this.metrics.get(key)!
    metrics.push(metric)

    // Manter apenas últimas 1000 métricas por tipo
    if (metrics.length > 1000) {
      metrics.shift()
    }

    // Verificar thresholds e alertas
    this.checkAlerts(metric)

    // Log estruturado
    simpleLogger.info('API Performance', {
      name: metric.name,
      type: 'METRIC',
      value: metric.value,
      statusCode: 200,
      unit: metric.unit,
      tags: metric.tags,
    })
  }

  /**
   * Registrar tempo de resposta de API
   */
  recordApiResponse(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    userId?: string
  ): void {
    this.recordMetric({
      name: `api.${method.toLowerCase()}.${endpoint.replace(/\//g, '_')}`,
      value: responseTime,
      unit: 'ms',
      timestamp: new Date(),
      tags: {
        endpoint,
        method,
        statusCode: statusCode.toString(),
        userId: userId || 'anonymous',
      },
    })

    // Log específico para APIs lentas
    if (responseTime > this.alertThresholds.responseTime) {
      simpleLogger.warn(`Slow API response: ${method} ${endpoint}`, {
        endpoint,
        method,
        responseTime,
        statusCode,
        userId,
        threshold: this.alertThresholds.responseTime,
      })
    }
  }

  /**
   * Registrar query de banco de dados
   */
  recordDatabaseQuery(operation: string, table: string, duration: number, success: boolean): void {
    this.recordMetric({
      name: `database.${operation.toLowerCase()}.${table}`,
      value: duration,
      unit: 'ms',
      timestamp: new Date(),
      tags: {
        operation,
        table,
        success: success.toString(),
      },
    })
  }

  /**
   * Registrar erro da aplicação
   */
  recordError(
    error: Error,
    context?: {
      endpoint?: string
      userId?: string
      severity?: 'low' | 'medium' | 'high' | 'critical'
    }
  ): void {
    const severity = context?.severity || 'medium'

    this.recordMetric({
      name: 'errors.count',
      value: 1,
      unit: 'count',
      timestamp: new Date(),
      tags: {
        errorType: error.name,
        endpoint: context?.endpoint || 'unknown',
        severity,
      },
    })

    simpleLogger.error('Application error recorded', {
      userId: context?.userId,
      endpoint: context?.endpoint,
      severity,
      errorName: error.name,
      errorMessage: error.message,
    })
  }

  /**
   * Verificar saúde do sistema
   */
  async checkSystemHealth(): Promise<SystemHealth> {
    try {
      const health: SystemHealth = {
        status: 'healthy',
        uptime: process.uptime(),
        memory: this.getMemoryUsage(),
        database: await this.checkDatabaseHealth(),
        lastChecked: new Date(),
      }

      // Determinar status geral
      if (health.database.status === 'disconnected') {
        health.status = 'unhealthy'
      } else if (
        health.memory.percentage > this.alertThresholds.memoryUsage ||
        (health.database.responseTime && health.database.responseTime > 1000)
      ) {
        health.status = 'degraded'
      }

      // Armazenar histórico
      this.healthChecks.push(health)
      if (this.healthChecks.length > 288) {
        // 24 horas (5min intervals)
        this.healthChecks.shift()
      }

      // Log de saúde
      simpleLogger.info('System health check', {
        status: health.status,
        uptime: health.uptime,
        memoryUsage: health.memory.percentage,
        databaseStatus: health.database.status,
        databaseResponseTime: health.database.responseTime,
      })

      return health
    } catch {
      simpleLogger.error('Health check failed', {
        error: _error instanceof Error ? _error.message : String(_error),
      })
      return {
        status: 'unhealthy',
        uptime: process.uptime(),
        memory: this.getMemoryUsage(),
        database: { status: 'disconnected' },
        lastChecked: new Date(),
      }
    }
  }

  /**
   * Obter métricas agregadas
   */
  getAggregatedMetrics(
    metricName: string,
    timeRange: number = 3600000 // 1 hour default
  ): {
    avg: number
    min: number
    max: number
    count: number
    p95: number
    p99: number
  } | null {
    const metrics = this.metrics.get(metricName)
    if (!metrics || metrics.length === 0) return null

    const cutoff = new Date(Date.now() - timeRange)
    const recentMetrics = metrics
      .filter(m => m.timestamp >= cutoff)
      .map(m => m.value)
      .sort((a, b) => a - b)

    if (recentMetrics.length === 0) return null

    const sum = recentMetrics.reduce((a, b) => a + b, 0)
    const count = recentMetrics.length

    return {
      avg: sum / count,
      min: recentMetrics[0],
      max: recentMetrics[recentMetrics.length - 1],
      count,
      p95: recentMetrics[Math.floor(count * 0.95)] || recentMetrics[count - 1],
      p99: recentMetrics[Math.floor(count * 0.99)] || recentMetrics[count - 1],
    }
  }

  /**
   * Obter todas as métricas disponíveis
   */
  getAllMetrics(): string[] {
    return Array.from(this.metrics.keys())
  }

  /**
   * Obter histórico de saúde do sistema
   */
  getHealthHistory(hours: number = 24): SystemHealth[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return this.healthChecks.filter(h => h.lastChecked >= cutoff)
  }

  /**
   * Verificar alertas e thresholds
   */
  private checkAlerts(metric: PerformanceMetric): void {
    // Verificar threshold de tempo de resposta
    if (metric.name.startsWith('api.') && metric.value > this.alertThresholds.responseTime) {
      simpleLogger.warn(`Performance alert: ${metric.name} exceeded threshold`, {
        metricName: metric.name,
        value: metric.value,
        threshold: this.alertThresholds.responseTime,
        unit: metric.unit,
        tags: metric.tags,
      })
    }

    // Verificar taxa de erro
    if (metric.name === 'errors.count') {
      const errorMetrics = this.metrics.get('errors.count') || []
      const recentErrors = errorMetrics.filter(
        m => m.timestamp >= new Date(Date.now() - 5 * 60 * 1000) // últimos 5 min
      )

      if (recentErrors.length > 10) {
        // Mais de 10 erros em 5 min
        simpleLogger.error('High error rate detected', {
          errorCount: recentErrors.length,
          timeWindow: '5 minutes',
          threshold: 10,
        })
      }
    }
  }

  /**
   * Obter uso de memória
   */
  private getMemoryUsage() {
    const usage = process.memoryUsage()
    const total = usage.heapTotal
    const used = usage.heapUsed

    return {
      used,
      total,
      percentage: used / total,
    }
  }

  /**
   * Verificar saúde do banco de dados
   */
  private async checkDatabaseHealth(): Promise<{
    status: 'connected' | 'disconnected'
    responseTime?: number
  }> {
    try {
      const { prisma } = await import('./prisma')
      const start = Date.now()

      await prisma.$queryRaw`SELECT 1`

      const responseTime = Date.now() - start
      return {
        status: 'connected',
        responseTime,
      }
    } catch {
      return {
        status: 'disconnected',
      }
    }
  }

  /**
   * Iniciar coleta de métricas em background
   */
  private startBackgroundCollection(): void {
    // Health check a cada 5 minutos
    setInterval(
      () => {
        this.checkSystemHealth().catch(console.error)
      },
      5 * 60 * 1000
    )

    // Métricas de sistema a cada minuto
    setInterval(() => {
      // Métrica de uso de memória
      const memory = this.getMemoryUsage()
      this.recordMetric({
        name: 'system.memory.usage',
        value: memory.percentage,
        unit: 'percentage',
        timestamp: new Date(),
      })

      // Métrica de uptime
      this.recordMetric({
        name: 'system.uptime',
        value: process.uptime(),
        unit: 'seconds',
        timestamp: new Date(),
      })
    }, 60 * 1000)
  }
}

// Instância singleton
export const monitoring = MonitoringService.getInstance()

// Middleware para monitoramento automático de APIs
export function withMonitoring<T extends (...args: Record<string, unknown>[]) => Promise<Response>>(
  handler: T,
  options?: {
    endpoint?: string
    operation?: string
  }
): T {
  return (async (...args: Record<string, unknown>[]) => {
    const start = Date.now()
    const endpoint = options?.endpoint || 'unknown'
    let statusCode = 200
    let error: Error | null = null

    try {
      const response = await handler(...args)
      statusCode = response.status
      return response
    } catch (err) {
      error = err as Error
      statusCode = 500
      throw err
    } finally {
      const duration = Date.now() - start

      // Registrar métrica de API
      monitoring.recordApiResponse(endpoint, options?.operation || 'REQUEST', statusCode, duration)

      // Registrar erro se houver
      if (error) {
        monitoring.recordError(error, {
          endpoint,
          severity: statusCode >= 500 ? 'high' : 'medium',
        })
      }
    }
  }) as T
}

export default monitoring
