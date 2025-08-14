import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { getNotificationService } from '@/lib/notifications/notification-service'
import { simpleLogger } from '@/lib/simple-logger'
import { auditService } from '@/lib/audit'
import { getClientIP } from '@/lib/utils/ip'
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro'

/**
 * API para estatísticas de notificações
 * GET /api/notifications/stats - Obtém estatísticas
 */

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const clientIp = getClientIP(request)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d
    
    // Verificar permissão ABAC para incluir estatísticas globais
    const hasGlobalPermission = searchParams.get('includeGlobal') === 'true' 
    ? await checkABACPermission(
      session.user.email ? String(session.user.email) : '',
          'resource:notifications:stats:global',
          'read',
          {
            department: session.user.department || '',
            location: session.user.location || '',
            jobTitle: session.user.jobTitle || '',
            timestamp: new Date()
          }
        )
      : { allowed: false }
    
    const includeGlobal = hasGlobalPermission.allowed

    // Calcula datas baseado no período
    const now = new Date()
    let dateFrom: Date

    switch (period) {
      case '24h':
        dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    const notificationService = getNotificationService()

    // Estatísticas do usuário
    const userStats = await notificationService.getStats(session.user.id, dateFrom, now)
    const unreadCount = await notificationService.getUnreadCount(session.user.id)

    let globalStats = null
    if (includeGlobal) {
      globalStats = await notificationService.getStats(undefined, dateFrom, now)
    }

    // Log da consulta
    await auditService.logApiAccess(session.user.id, 'GET', '/api/notifications/stats', clientIp, {
      period,
      includeGlobal,
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          ...userStats,
          unreadCount,
        },
        global: globalStats,
        period: {
          from: dateFrom,
          to: now,
          label: period,
        },
      },
    })
  } catch (_error) {
    simpleLogger.error('Erro ao obter estatísticas de notificações', { error: _error })
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
