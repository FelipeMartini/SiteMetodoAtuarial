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

    console.log(`API endpoint registered: ${name} (${method} ${url})`)
  }

  /**
   * Remover endpoint do monitoramento
   */
  unregisterEndpoint(name: string): boolean {
    const deleted = this.endpoints.delete(name)
    if (deleted) {
      console.log(`API endpoint unregistered: ${name}`)
    }
    return deleted
  }

  /**
   * Registrar resultado de requisição
   */
  recordRequest(
    endpointName: string,
    responseTime: number,
    success: boolean,
    errorDetails?: string,
    statusCode?: number
  ): void {
    const endpoint = this.endpoints.get(endpointName)

    if (!endpoint) {
      console.warn(`Attempted to record metrics for unregistered endpoint: ${endpointName}`)
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

    console.log(`Metrics recorded for ${endpointName}: ${responseTime}ms, success: ${success}`)
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
        healthy,
        healthy ? undefined : `HTTP ${response.status}`,
        response.status
      )

      return {
        healthy,
        responseTime,
        error: healthy ? undefined : `HTTP ${response.status}`,
      }
    } catch (_error) {
      const responseTime = Date.now() - startTime
      const errorMessage = _error instanceof Error ? _error.message : 'Unknown error'

      this.recordRequest(endpointName, responseTime, false, errorMessage)

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

    console.log(`Metrics reset for endpoint: ${endpointName}`)
    return true
  }

  /**
   * Atualizar circuit breaker
   */
  private updateCircuitBreaker(endpoint: EndpointMetrics): void {
    const maxErrors = 5
    const _timeWindow: unknown = 5 * 60 * 1000 // 5 minutos

    switch (endpoint.circuitBreakerState) {
      case 'CLOSED':
        if (endpoint.recentErrors.length >= maxErrors) {
          endpoint.circuitBreakerState = 'OPEN'
          endpoint.healthy = false
          console.warn(`Circuit breaker opened for ${endpoint.name}`)
        }
        break

      case 'OPEN':
        // Tentar half-open após 30 segundos
        const lastError = Math.max(...endpoint.recentErrors)
        if (Date.now() - lastError > 30000) {
          endpoint.circuitBreakerState = 'HALF_OPEN'
          console.log(`Circuit breaker half-opened for ${endpoint.name}`)
        }
        break

      case 'HALF_OPEN':
        if (endpoint.recentErrors.length >= maxErrors) {
          endpoint.circuitBreakerState = 'OPEN'
          endpoint.healthy = false
          console.warn(`Circuit breaker re-opened for ${endpoint.name}`)
        } else if (endpoint.successfulRequests > endpoint.errorCount) {
          endpoint.circuitBreakerState = 'CLOSED'
          endpoint.healthy = true
          console.log(`Circuit breaker closed for ${endpoint.name}`)
        }
        break
    }
  }
}

// Instância singleton
export const apiMonitor = new SimpleApiMonitor()
