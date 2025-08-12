import { NextRequest, NextResponse } from 'next/server'
import { structuredLogger, performanceLogger } from '../lib/logger'

// Interface para dados de request
interface RequestData {
  method: string
  url: string
  userAgent?: string
  ip: string
  startTime: number
  userId?: string
  sessionId?: string
}

// Map para tracking de requests
const requestMap = new Map<string, RequestData>()

export function createLoggingMiddleware() {
  return async (request: NextRequest) => {
    const startTime = Date.now()
    const requestId = crypto.randomUUID()

    // Extrair informações do request
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || undefined
    const method = request.method
    const url = request.url
    const pathname = new URL(url).pathname

    // Armazenar dados do request
    const requestData: RequestData = {
      method,
      url,
      userAgent,
      ip,
      startTime,
    }
    requestMap.set(requestId, requestData)

    // Log do início do request
    structuredLogger.http(`${method} ${pathname}`, {
      ip,
      userAgent,
      method,
      endpoint: pathname,
      requestId,
    })

    // Proceder com o request
    const response = NextResponse.next()

    // Adicionar header de request ID para tracking
    response.headers.set('x-request-id', requestId)

    // Log do final do request (será executado após a resposta)
    setTimeout(() => {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      const status = response.status || 200

      // Log de performance
      performanceLogger.api(pathname, method, responseTime, status, {
        ip,
        userAgent,
        requestId,
      })

      // Log específico para requests lentos
      if (responseTime > 1000) {
        structuredLogger.warn(`Slow request: ${method} ${pathname} took ${responseTime}ms`, {
          ip,
          userAgent,
          method,
          endpoint: pathname,
          responseTime,
          statusCode: status,
          requestId,
        })
      }

      // Log para erros
      if (status >= 400) {
        const level = status >= 500 ? 'error' : 'warn'
        structuredLogger[level](`HTTP ${status}: ${method} ${pathname}`, {
          ip,
          userAgent,
          method,
          endpoint: pathname,
          responseTime,
          statusCode: status,
          requestId,
        } as any)
      }

      // Limpar dados do request
      requestMap.delete(requestId)
    }, 0)

    return response
  }
}

// Função para extrair IP real do cliente
function getClientIP(request: NextRequest): string {
  // Verificar headers de proxy
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }

  // Fallback para IP local
  return '127.0.0.1'
}

// Middleware para auditoria de APIs
export function createAuditMiddleware() {
  return async (request: NextRequest) => {
    const pathname = new URL(request.url).pathname

    // Apenas auditar APIs críticas
    const shouldAudit = shouldAuditEndpoint(pathname, request.method)

    if (shouldAudit) {
      const ip = getClientIP(request)
      const userAgent = request.headers.get('user-agent') || undefined

      // TODO: Extrair userId do token/session quando implementado
      // const userId = await getUserIdFromRequest(request)

      structuredLogger.audit(`API ${request.method} ${pathname}`, {
        performedBy: 'system',
        ip,
        userAgent,
        endpoint: pathname,
        method: request.method,
      } as any)
    }

    return NextResponse.next()
  }
}

// Determinar se um endpoint deve ser auditado
function shouldAuditEndpoint(pathname: string, method: string): boolean {
  // Auditar todas operações de escrita
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true
  }

  // Auditar endpoints específicos de leitura sensível
  const sensitiveEndpoints = ['/api/users', '/api/admin', '/api/auth', '/api/abac', '/api/audit']

  return sensitiveEndpoints.some(endpoint => pathname.startsWith(endpoint))
}

// Middleware para rate limiting básico
export function createRateLimitMiddleware() {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return async (request: NextRequest) => {
    const ip = getClientIP(request)
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minuto
    const maxRequests = 100 // máximo por minuto

    const key = `${ip}:${Math.floor(now / windowMs)}`
    const current = requests.get(key) || { count: 0, resetTime: now + windowMs }

    current.count++
    requests.set(key, current)

    // Limpar entradas antigas
    if (now > current.resetTime) {
      requests.delete(key)
    }

    // Verificar limite
    if (current.count > maxRequests) {
      structuredLogger.warn(`Rate limit exceeded for IP: ${ip}`, {
        ip,
        requestCount: current.count,
        maxRequests,
        endpoint: new URL(request.url).pathname,
      })

      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
        },
      })
    }

    return NextResponse.next()
  }
}

// Função para criar middleware completo
export function createComprehensiveMiddleware() {
  const loggingMiddleware = createLoggingMiddleware()
  const auditMiddleware = createAuditMiddleware()
  const rateLimitMiddleware = createRateLimitMiddleware()

  return async (request: NextRequest) => {
    try {
      // 1. Rate limiting primeiro
      const rateLimitResponse = await rateLimitMiddleware(request)
      if (rateLimitResponse.status === 429) {
        return rateLimitResponse
      }

      // 2. Logging
      const loggingResponse = await loggingMiddleware(request)

      // 3. Auditoria
      await auditMiddleware(request)

      return loggingResponse
    } catch {
      structuredLogger.error('Middleware error', String), {
        ip: getClientIP(request),
        userAgent: request.headers.get('user-agent') || undefined,
        method: request.method,
        endpoint: new URL(request.url).pathname,
      })

      return NextResponse.next()
    }
  }
}

export default createComprehensiveMiddleware
