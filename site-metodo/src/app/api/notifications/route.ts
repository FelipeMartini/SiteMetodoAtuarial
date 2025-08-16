// Utilitário para mapear NotificationPriority para o formato aceito pelo serviço
function mapPriority(priority?: NotificationPriority): 'low' | 'medium' | 'high' | undefined {
  switch (priority) {
    case NotificationPriority.LOW:
      return 'low'
    case NotificationPriority.NORMAL:
      return 'medium'
    case NotificationPriority.HIGH:
    case NotificationPriority.URGENT:
      return 'high'
    default:
      return undefined
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getNotificationService } from '@/lib/notifications/notification-service'
import { checkPermissionDetailed } from '@/lib/abac/enforcer-abac-puro'
import {
  NotificationFilter,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
} from '@/types/notifications'
import { structuredLogger } from '@/lib/logger'
import { auditService } from '@/lib/audit'
import { getClientIP } from '@/lib/utils/ip'

/**
 * API para gerenciamento de notificações
 * GET /api/notifications - Lista notificações do usuário
 * POST /api/notifications - Cria nova notificação
 */

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const clientIp = getClientIP(request)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    // Monta filtros da query string
    const filter: NotificationFilter = {
      userId: session.user.id,
      types: searchParams.get('types')?.split(',') as NotificationType[],
      channels: searchParams.get('channels')?.split(',') as NotificationChannel[],
      statuses: searchParams.get('statuses')?.split(',') as NotificationStatus[],
      priorities: searchParams.get('priorities')?.split(',') as NotificationPriority[],
      unreadOnly: searchParams.get('unreadOnly') === 'true',
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sortBy: (searchParams.get('sortBy') as 'status' | 'createdAt' | 'priority') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    }

    // Remove campos undefined
    Object.keys(filter).forEach(key => {
      if (filter[key as keyof NotificationFilter] === undefined) {
        delete filter[key as keyof NotificationFilter]
      }
    })

    const notificationService = getNotificationService()
    const result = await notificationService.searchNotifications(filter)

    // Log da consulta
    await auditService.logApiAccess(session.user.id, 'GET', '/api/notifications', clientIp, {
      filter,
      resultCount: result.notifications.length,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (_error) {
    await structuredLogger.error('Erro ao buscar notificações', { error: _error instanceof Error ? _error.message : String(_error) })
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const clientIp = getClientIP(request)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    // Verifica permissão ABAC para criar notificações
    const subject = session.user.email ? String(session.user.email) : ''
    const permissionResult = await checkPermissionDetailed(
      subject,
      'resource:notifications',
      'create',
      {
        department: session.user.department || '',
        location: session.user.location || '',
        jobTitle: session.user.jobTitle || '',
        timestamp: new Date()
      }
    )
    
    if (!permissionResult.allowed) {
      return NextResponse.json({ error: 'Permissão insuficiente' }, { status: 403 })
    }

    const body = await request.json()
    const { bulk, ...notificationData } = body // Removido 'type' não utilizado

    const notificationService = getNotificationService()
    let notificationIds: string[]

    if (bulk && Array.isArray(notificationData.userIds)) {
      // Criação em lote
      // Monta objeto do tipo BulkNotificationRequest do service
      const bulkRequestService = {
        userIds: notificationData.userIds,
        type: notificationData.type,
        channels: notificationData.channels,
        priority: mapPriority(notificationData.priority),
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data,
        templateId: notificationData.templateId,
        templateVariables: notificationData.templateVariables,
        scheduledFor: notificationData.scheduledFor
          ? new Date(notificationData.scheduledFor)
          : undefined,
        expiresAt: notificationData.expiresAt ? new Date(notificationData.expiresAt) : undefined,
      }

      notificationIds = await notificationService.createBulkNotifications(bulkRequestService)
    } else {
      // Criação individual
      // Monta objeto do tipo NotificationRequest do service
      const createRequestService = {
        userId: notificationData.userId || session.user.id,
        type: notificationData.type,
        channels: notificationData.channels,
        priority: mapPriority(notificationData.priority),
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data,
        templateId: notificationData.templateId,
        templateVariables: notificationData.templateVariables,
        scheduledFor: notificationData.scheduledFor
          ? new Date(notificationData.scheduledFor)
          : undefined,
        expiresAt: notificationData.expiresAt ? new Date(notificationData.expiresAt) : undefined,
      }

      notificationIds = await notificationService.createNotification(createRequestService)
    }

    // Log da criação
    await auditService.logApiAccess(session.user.id, 'POST', '/api/notifications', clientIp, {
      type: bulk ? 'bulk' : 'single',
      notificationCount: notificationIds.length,
      notificationIds: notificationIds.slice(0, 5), // Só logga os primeiros 5 IDs
    })

    return NextResponse.json({
      success: true,
      data: {
        notificationIds,
        count: notificationIds.length,
      },
    })
  } catch (_error) {
    await structuredLogger.error('Erro ao criar notificação', { error: _error instanceof Error ? _error.message : String(_error) })
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
