/**
 * Sistema simplificado de decorators para cache e monitoramento
 * Este arquivo substitui o sistema complexo de decorators por funções helper
 */

import { apiCache } from './cache'
// import { monitored } from './index' // Removido import não utilizado
import { apiMonitor } from './monitor-simple'

/**
 * Helper para adicionar cache a métodos de classe
 */
export function withCache<T extends (...args: Record<string, unknown>[]) => Promise<unknown>>(
  fn: T,
  ttl: number,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : `${fn.name}-${JSON.stringify(args)}`

    // Tentar buscar do cache
    const cached = apiCache.normal.get(key)
    if (cached) {
      return cached
    }

    // Executar função e cachear resultado
    const result = await fn(...args)
    if (result) {
      apiCache.normal.set(key, result, ttl)
    }

    return result
  }) as T
}

/**
 * Helper para adicionar monitoramento a métodos de classe
 */
export function withMonitoring<T extends (...args: Record<string, unknown>[]) => Promise<unknown>>(
  fn: T,
  endpointName: string
): T {
  return (async (...args: Parameters<T>) => {
    const startTime = Date.now()
    let success = false
    let error: string | undefined

    try {
      const result = await fn(...args)
      success = true
      return result
    } catch (err) {
      success = false
      error = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      const responseTime = Date.now() - startTime
      apiMonitor.recordRequest(endpointName, responseTime, success, error)
    }
  }) as T
}

/**
 * Helper combinado para cache + monitoramento
 */
export function withCacheAndMonitoring<
  T extends (...args: Record<string, unknown>[]) => Promise<unknown>,
>(
  fn: T,
  options: {
    cacheTtl: number
    endpointName: string
    keyGenerator?: (...args: Parameters<T>) => string
  }
): T {
  const cachedFn = withCache(fn, options.cacheTtl, options.keyGenerator)
  return withMonitoring(cachedFn, options.endpointName)
}

/**
 * Decorator simples para rate limiting
 */
export function withRateLimit<T extends (...args: Record<string, unknown>[]) => Promise<unknown>>(
  fn: T,
  maxRequests: number,
  windowMs: number
): T {
  const requests: number[] = []

  return (async (...args: Parameters<T>) => {
    const now = Date.now()

    // Remove requisições antigas da janela de tempo
    while (requests.length > 0 && requests[0] < now - windowMs) {
      requests.shift()
    }

    // Verifica se excedeu o limite
    if (requests.length >= maxRequests) {
      throw new Error(`Rate limit exceeded: ${maxRequests} requests per ${windowMs}ms`)
    }

    // Adiciona a requisição atual
    requests.push(now)

    return await fn(...args)
  }) as T
}

/**
 * Helper para retry automático
 */
export function withRetry<T extends (...args: Record<string, unknown>[]) => Promise<unknown>>(
  fn: T,
  maxRetries: number = 3,
  delayMs: number = 1000
): T {
  return (async (...args: Parameters<T>) => {
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch {
        lastError = _error instanceof Error ? _error : new Error('Unknown error')

        if (attempt === maxRetries) {
          throw lastError
        }

        // Delay antes do próximo retry (exponential backoff)
        const delay = delayMs * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }) as T
}

/**
 * Helper para timeout
 */
export function withTimeout<T extends (...args: Record<string, unknown>[]) => Promise<unknown>>(
  fn: T,
  timeoutMs: number
): T {
  return (async (...args: Parameters<T>) => {
    return Promise.race([
      fn(...args),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      ),
    ])
  }) as T
}

/**
 * Helper completo que combina todas as funcionalidades
 */
export function withFullEnhancement<T extends (...args: Record<string, unknown>[]) => Promise<unknown>>(
  fn: T,
  options: {
    cache?: { ttl: number; keyGenerator?: (...args: Parameters<T>) => string }
    monitoring?: { endpointName: string }
    rateLimit?: { maxRequests: number; windowMs: number }
    retry?: { maxRetries: number; delayMs: number }
    timeout?: { timeoutMs: number }
  }
): T {
  let enhancedFn = fn

  // Aplicar timeout
  if (options.timeout) {
    enhancedFn = withTimeout(enhancedFn, options.timeout.timeoutMs)
  }

  // Aplicar retry
  if (options.retry) {
    enhancedFn = withRetry(enhancedFn, options.retry.maxRetries, options.retry.delayMs)
  }

  // Aplicar rate limiting
  if (options.rateLimit) {
    enhancedFn = withRateLimit(
      enhancedFn,
      options.rateLimit.maxRequests,
      options.rateLimit.windowMs
    )
  }

  // Aplicar cache
  if (options.cache) {
    enhancedFn = withCache(enhancedFn, options.cache.ttl, options.cache.keyGenerator)
  }

  // Aplicar monitoramento
  if (options.monitoring) {
    enhancedFn = withMonitoring(enhancedFn, options.monitoring.endpointName)
  }

  return enhancedFn
}
