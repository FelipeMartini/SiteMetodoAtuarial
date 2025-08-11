import { NextRequest, NextResponse } from 'next/server'
import { monitoring } from '@/lib/monitoring'
import { structuredLogger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const health = await monitoring.checkSystemHealth()
    
    // Determinar status code baseado na saúde
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503

    // Log do health check
    structuredLogger.http('Health check accessed', {
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      systemStatus: health.status,
      uptime: health.uptime,
      memoryUsage: health.memory.percentage,
    })

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    structuredLogger.error('Health check failed', error, {
      ip: request.ip,
    })
    
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}
