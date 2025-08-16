/**
 * Sistema de monitoramento simplificado para APIs
 */

export interface EndpointMetrics {
  name: string
  url: string
  method: string
  totalRequests: number
  successfulRequests: number
  errorCount: number
  totalResponseTime: number
  averageResponseTime: number
  errorRate: number
  lastRequest?: Date
  healthy: boolean
  circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  recentErrors: number[]
}

export interface SystemMetrics {
  totalRequests: number
  totalErrors: number
  averageResponseTime: number
  uptime: number
  startTime: Date
}

export interface HealthCheckResult {
  healthy: boolean
  responseTime: number
  error?: string
}

/**
 * Monitor simplificado para APIs
 */
export class SimpleApiMonitor {
  private endpoints: Map<string, EndpointMetrics> = new Map()
  private systemMetrics: SystemMetrics
  private startTime: Date

  constructor() {
    this.startTime = new Date()
    this.systemMetrics = {
      totalRequests: 0,
      totalErrors: 0,
      averageResponseTime: 0,
      uptime: 0,
      startTime: this.startTime,
    }
  }

  /**
   * Registrar endpoint para monitoramento
   */
  registerEndpoint(name: string, url: string, method: string = 'GET'): void {
    this.endpoints.set(name, {
      name,
      url,
      method,
      totalRequests: 0,
      successfulRequests: 0,
      errorCount: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      errorRate: 0,
      healthy: true,
      circuitBreakerState: 'CLOSED',
      recentErrors: [],
    })

  // logging substituído por structuredLogger (adiar import dinâmico para não quebrar env) 
  import('@/lib/logger').then(m => m.structuredLogger.info('API endpoint registered', { name, method, url })).catch(()=>{})
  }

  /**
   * Remover endpoint do monitoramento
   */
  unregisterEndpoint(name: string): boolean {
    const deleted = this.endpoints.delete(name)
    if (deleted) {
  import('@/lib/logger').then(m => m.structuredLogger.info('API endpoint unregistered', { name })).catch(()=>{})
    }
    return deleted
  }

  /**
   * Registrar resultado de requisição
   */
  recordRequest(
    endpointName: string,
    responseTime: number,
    success: boolean
  ): void {
    const endpoint = this.endpoints.get(endpointName)

    if (!endpoint) {
  import('@/lib/logger').then(m => m.structuredLogger.warn('Attempted to record metrics for unregistered endpoint', { endpointName })).catch(()=>{})
      return
    }

    // Atualizar métricas do endpoint
    endpoint.totalRequests++
    endpoint.lastRequest = new Date()
    endpoint.totalResponseTime += responseTime
    endpoint.averageResponseTime = endpoint.totalResponseTime / endpoint.totalRequests

    if (success) {
      endpoint.successfulRequests++
    } else {
      endpoint.errorCount++
      endpoint.recentErrors.push(Date.now())

      // Manter apenas erros dos últimos 5 minutos
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      endpoint.recentErrors = endpoint.recentErrors.filter(time => time > fiveMinutesAgo)
    }

    endpoint.errorRate =
      endpoint.totalRequests > 0 ? (endpoint.errorCount / endpoint.totalRequests) * 100 : 0

    // Atualizar circuit breaker
    this.updateCircuitBreaker(endpoint)

    // Atualizar métricas do sistema
    this.systemMetrics.totalRequests++
    if (!success) {
      this.systemMetrics.totalErrors++
    }

    // Recalcular tempo médio do sistema
    const totalResponseTime = Array.from(this.endpoints.values()).reduce(
      (sum, ep) => sum + ep.totalResponseTime,
      0
    )
    this.systemMetrics.averageResponseTime = totalResponseTime / this.systemMetrics.totalRequests

  import('@/lib/logger').then(m => m.structuredLogger.info('Metrics recorded', { endpointName, responseTime, success })).catch(()=>{})
  }

  /**
   * Verificar saúde de um endpoint
   */
  async healthCheck(endpointName: string): Promise<HealthCheckResult> {
    const endpoint = this.endpoints.get(endpointName)

    if (!endpoint) {
      throw new Error(`Endpoint not found: ${endpointName}`)
    }

    const startTime = Date.now()

    try {
      // Fazer uma requisição simples para testar o endpoint
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
      })

      const responseTime = Date.now() - startTime
      const healthy = response.ok

      // Registrar resultado
      this.recordRequest(
        endpointName,
        responseTime,
        healthy
      )

      return {
        healthy,
        responseTime,
        error: healthy ? undefined : `HTTP ${response.status}`,
      }
    } catch (_error) {
      const responseTime = Date.now() - startTime
      const errorMessage = _error instanceof Error ? _error.message : 'Unknown error'

      this.recordRequest(endpointName, responseTime, false)

      return {
        healthy: false,
        responseTime,
        error: errorMessage,
      }
    }
  }

  /**
   * Obter métricas de um endpoint específico
   */
  getEndpointMetrics(name: string): EndpointMetrics | null {
    return this.endpoints.get(name) || null
  }

  /**
   * Obter métricas de todos os endpoints
   */
  getAllMetrics(): EndpointMetrics[] {
    return Array.from(this.endpoints.values())
  }

  /**
   * Obter métricas do sistema
   */
  getSystemMetrics(): SystemMetrics {
    this.systemMetrics.uptime = Date.now() - this.startTime.getTime()
    return { ...this.systemMetrics }
  }

  /**
   * Reset métricas de um endpoint
   */
  resetMetrics(endpointName: string): boolean {
    const endpoint = this.endpoints.get(endpointName)

    if (!endpoint) {
      return false
    }

    // Reset apenas as métricas, mantém configuração
    Object.assign(endpoint, {
      totalRequests: 0,
      successfulRequests: 0,
      errorCount: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      errorRate: 0,
      lastRequest: undefined,
      healthy: true,
      circuitBreakerState: 'CLOSED',
      recentErrors: [],
    })

  import('@/lib/logger').then(m => m.structuredLogger.info('Metrics reset', { endpointName })).catch(()=>{})
    return true
  }

  /**
   * Atualizar circuit breaker
   */
  private updateCircuitBreaker(endpoint: EndpointMetrics): void {
    const maxErrors = 5
    // Tempo para reset automático seria implementado aqui se necessário

    switch (endpoint.circuitBreakerState) {
      case 'CLOSED':
        if (endpoint.recentErrors.length >= maxErrors) {
          endpoint.circuitBreakerState = 'OPEN'
          endpoint.healthy = false
          import('@/lib/logger').then(m => m.structuredLogger.warn('Circuit breaker opened', { endpoint: endpoint.name })).catch(()=>{})
        }
        break

      case 'OPEN':
        // Tentar half-open após 30 segundos
        const lastError = Math.max(...endpoint.recentErrors)
        if (Date.now() - lastError > 30000) {
          endpoint.circuitBreakerState = 'HALF_OPEN'
          import('@/lib/logger').then(m => m.structuredLogger.info('Circuit breaker half-opened', { endpoint: endpoint.name })).catch(()=>{})
        }
        break

      case 'HALF_OPEN':
        if (endpoint.recentErrors.length >= maxErrors) {
          endpoint.circuitBreakerState = 'OPEN'
          endpoint.healthy = false
          import('@/lib/logger').then(m => m.structuredLogger.warn('Circuit breaker re-opened', { endpoint: endpoint.name })).catch(()=>{})
        } else if (endpoint.successfulRequests > endpoint.errorCount) {
          endpoint.circuitBreakerState = 'CLOSED'
          endpoint.healthy = true
          import('@/lib/logger').then(m => m.structuredLogger.info('Circuit breaker closed', { endpoint: endpoint.name })).catch(()=>{})
        }
        break
    }
  }
}

// Instância singleton
export const apiMonitor = new SimpleApiMonitor()
