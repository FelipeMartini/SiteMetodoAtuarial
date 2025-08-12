import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { apiMonitor } from '@/lib/api/monitor-simple'
import { apiCache } from '@/lib/api/cache-simple'
import { getClientIP } from '@/lib/utils/ip'
import { auditService } from '@/lib/audit'

// Request validation schema
const QuerySchema = z.object({
  endpoint: z.string().optional(),
  action: z.enum(['health', 'stats', 'reset', 'clear-cache']).optional(),
})

export async function GET(request: NextRequest) {
  const clientIp = getClientIP(request)
  const { searchParams } = new URL(request.url)

  try {
    // Validate query parameters
    const query = QuerySchema.parse({
      endpoint: searchParams.get('endpoint') || undefined,
      action: searchParams.get('action') || undefined,
    })

    // Log API access
    await auditService.logApiAccess(
      null, // No user session required for monitoring
      'GET',
      '/api/monitoring/apis',
      clientIp,
      query
    )

    // Handle different actions
    switch (query.action) {
      case 'health':
        return await handleHealthCheck(query.endpoint)

      case 'stats':
        return await handleGetStats(query.endpoint)

      case 'reset':
        return await handleResetMetrics(query.endpoint)

      case 'clear-cache':
        return await handleClearCache()

      default:
        return await handleGetAllStats()
    }
  } catch (_error) {
    console.error('API monitoring error:', String(_error))

    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request parameters',
          details: _error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIP(request)

  try {
    const body = await request.json()

    // Validate request body
    const schema = z.object({
      action: z.enum(['register-endpoint', 'unregister-endpoint', 'record-metric']),
      endpoint: z
        .object({
          name: z.string(),
          url: z.string().url(),
          method: z.string().optional().default('GET'),
        })
        .optional(),
      metric: z
        .object({
          endpointName: z.string(),
          responseTime: z.number(),
          success: z.boolean(),
          errorDetails: z.string().optional(),
          statusCode: z.number().optional(),
        })
        .optional(),
    })

    const data = schema.parse(body)

    // Log API access
    await auditService.logApiAccess(null, 'POST', '/api/monitoring/apis', clientIp, data)

    switch (data.action) {
      case 'register-endpoint':
        if (!data.endpoint) {
          throw new Error('Endpoint data required for registration')
        }
        return await handleRegisterEndpoint(data.endpoint)

      case 'unregister-endpoint':
        if (!data.endpoint) {
          throw new Error('Endpoint data required for unregistration')
        }
        return await handleUnregisterEndpoint(data.endpoint.name)

      case 'record-metric':
        if (!data.metric) {
          throw new Error('Metric data required')
        }
        return await handleRecordMetric(data.metric)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (_error) {
    console.error('API monitoring POST error:', String(_error))

    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: _error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handler functions
async function handleHealthCheck(endpointName?: string) {
  if (endpointName) {
    try {
      const result = await apiMonitor.healthCheck(endpointName)
      return NextResponse.json({
        endpoint: endpointName,
        ...result,
        timestamp: new Date().toISOString(),
      })
    } catch (_error) {
      return NextResponse.json(
        {
          error: `Health check failed for ${endpointName}`,
          details: _error instanceof Error ? _error.message : 'Unknown error',
        },
        { status: 404 }
      )
    }
  }

  // Health check for all endpoints
  const endpoints = apiMonitor.getAllMetrics()
  const healthChecks = await Promise.allSettled(
    endpoints.map(async endpoint => {
      try {
        const result = await apiMonitor.healthCheck(endpoint.name)
        return {
          name: endpoint.name,
          ...result,
        }
      } catch (_error) {
        return {
          name: endpoint.name,
          healthy: false,
          responseTime: 0,
          error: _error instanceof Error ? _error.message : 'Unknown error',
        }
      }
    })
  )

  const results = healthChecks.map(result =>
    result.status === 'fulfilled'
      ? result.value
      : {
          name: 'unknown',
          healthy: false,
          responseTime: 0,
          error: 'Health check failed',
        }
  )

  return NextResponse.json({
    results,
    summary: {
      total: results.length,
      healthy: results.filter(r => r.healthy).length,
      unhealthy: results.filter(r => !r.healthy).length,
    },
    timestamp: new Date().toISOString(),
  })
}

async function handleGetStats(endpointName?: string) {
  if (endpointName) {
    const metrics = apiMonitor.getEndpointMetrics(endpointName)
    if (!metrics) {
      return NextResponse.json({ error: `Endpoint ${endpointName} not found` }, { status: 404 })
    }
    return NextResponse.json(metrics)
  }

  // Get all stats
  const endpoints = apiMonitor.getAllMetrics()
  const systemMetrics = apiMonitor.getSystemMetrics()
  const cacheStats = apiCache.normal.getStats()

  return NextResponse.json({
    endpoints,
    systemMetrics,
    cacheStats,
    timestamp: new Date().toISOString(),
  })
}

async function handleGetAllStats() {
  const endpoints = apiMonitor.getAllMetrics()
  const systemMetrics = apiMonitor.getSystemMetrics()
  const cacheStats = {
    normal: apiCache.normal.getStats(),
    fast: apiCache.fast.getStats(),
    persistent: apiCache.persistent.getStats(),
  }

  return NextResponse.json({
    endpoints,
    systemMetrics,
    cacheStats,
    timestamp: new Date().toISOString(),
  })
}

async function handleResetMetrics(endpointName?: string) {
  if (!endpointName) {
    return NextResponse.json({ error: 'Endpoint name required for reset' }, { status: 400 })
  }

  const success = apiMonitor.resetMetrics(endpointName)

  if (!success) {
    return NextResponse.json({ error: `Endpoint ${endpointName} not found` }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    message: `Metrics reset for endpoint ${endpointName}`,
    timestamp: new Date().toISOString(),
  })
}

async function handleClearCache() {
  apiCache.normal.clear()
  apiCache.fast.clear()
  apiCache.persistent.clear()

  return NextResponse.json({
    success: true,
    message: 'All caches cleared',
    timestamp: new Date().toISOString(),
  })
}

async function handleRegisterEndpoint(endpoint: { name: string; url: string; method: string }) {
  try {
    apiMonitor.registerEndpoint(endpoint.name, endpoint.url, endpoint.method)

    return NextResponse.json({
      success: true,
      message: `Endpoint ${endpoint.name} registered successfully`,
      endpoint,
      timestamp: new Date().toISOString(),
    })
  } catch (_error) {
    return NextResponse.json(
      {
        error: 'Failed to register endpoint',
        details: _error instanceof Error ? _error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

async function handleUnregisterEndpoint(endpointName: string) {
  const success = apiMonitor.unregisterEndpoint(endpointName)

  if (!success) {
    return NextResponse.json({ error: `Endpoint ${endpointName} not found` }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    message: `Endpoint ${endpointName} unregistered successfully`,
    timestamp: new Date().toISOString(),
  })
}

async function handleRecordMetric(metric: {
  endpointName: string
  responseTime: number
  success: boolean
  errorDetails?: string
  statusCode?: number
}) {
  try {
    apiMonitor.recordRequest(
      metric.endpointName,
      metric.responseTime,
      metric.success
    )

    return NextResponse.json({
      success: true,
      message: 'Metric recorded successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (_error) {
    return NextResponse.json(
      {
        error: 'Failed to record metric',
        details: _error instanceof Error ? _error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
