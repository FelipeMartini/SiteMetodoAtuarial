import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { getNotificationService } from '@/lib/notifications/notification-service'
import { simpleLogger } from '@/lib/simple-logger'
import { auditService } from '@/lib/audit'
import { getClientIP } from '@/lib/utils/ip'

/**
 * API para ações em lote nas notificações
 * POST /api/notifications/bulk - Ações em lote
 */

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const clientIp = getClientIP(request)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { action, notificationIds } = body

    if (!action || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }

    const notificationService = getNotificationService()
    let result: Record<string, unknown> = {}

    switch (action) {
      case 'mark_all_as_read':
        const count = await notificationService.markAllAsRead(session.user.id)
        result = { markedAsRead: count }
        break

      case 'mark_selected_as_read':
        let markedCount = 0
        for (const notificationId of notificationIds) {
          try {
            await notificationService.markAsRead(notificationId, session.user.id)
            markedCount++
          } catch (_error) {
            simpleLogger.warn('Erro ao marcar notificação como lida', {
              error,
              notificationId,
              userId: session.user.id,
            })
          }
        }
        result = { markedAsRead: markedCount }
        break

      case 'delete_selected':
        let deletedCount = 0
        for (const notificationId of notificationIds) {
          try {
            await notificationService.deleteNotification(notificationId, session.user.id)
            deletedCount++
          } catch (_error) {
            simpleLogger.warn('Erro ao deletar notificação', {
              error,
              notificationId,
              userId: session.user.id,
            })
          }
        }
        result = { deleted: deletedCount }
        break

      default:
        return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
    }

    // Log da ação em lote
    await auditService.logApiAccess(session.user.id, 'POST', '/api/notifications/bulk', clientIp, {
      action,
      notificationCount: notificationIds.length,
      result,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (_error) {
    simpleLogger.error('Erro em ação bulk de notificações', { error })
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
