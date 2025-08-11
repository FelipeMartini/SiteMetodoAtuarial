import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNotificationService } from '@/lib/notifications/notification-service';
import { 
  CreateNotificationRequest, 
  BulkNotificationRequest,
  NotificationFilter 
} from '@/types/notifications';
import { simpleLogger } from '@/lib/simple-logger';
import { auditService } from '@/lib/audit';
import { getClientIP } from '@/lib/utils/ip';

/**
 * API para gerenciamento de notificações
 * GET /api/notifications - Lista notificações do usuário
 * POST /api/notifications - Cria nova notificação
 */

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const clientIp = getClientIP(request);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Monta filtros da query string
    const filter: NotificationFilter = {
      userId: session.user.id,
      types: searchParams.get('types')?.split(',') as any[],
      channels: searchParams.get('channels')?.split(',') as any[],
      statuses: searchParams.get('statuses')?.split(',') as any[],
      priorities: searchParams.get('priorities')?.split(',') as any[],
      unreadOnly: searchParams.get('unreadOnly') === 'true',
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc'
    };

    // Remove campos undefined
    Object.keys(filter).forEach(key => {
      if (filter[key as keyof NotificationFilter] === undefined) {
        delete filter[key as keyof NotificationFilter];
      }
    });

    const notificationService = getNotificationService();
    const result = await notificationService.searchNotifications(filter);

    // Log da consulta
    await auditService.logApiAccess(
      session.user.id,
      'GET',
      '/api/notifications',
      clientIp,
      { filter, resultCount: result.notifications.length }
    );

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    simpleLogger.error('Erro ao buscar notificações', { error });
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const clientIp = getClientIP(request);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Verifica permissão para criar notificações
    if (!session.user.roles?.includes('admin') && !session.user.roles?.includes('manager')) {
      return NextResponse.json(
        { error: 'Permissão insuficiente' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, bulk, ...notificationData } = body;

    const notificationService = getNotificationService();
    let notificationIds: string[];

    if (bulk && Array.isArray(notificationData.userIds)) {
      // Criação em lote
      const bulkRequest: BulkNotificationRequest = {
        userIds: notificationData.userIds,
        type: notificationData.type,
        channels: notificationData.channels,
        priority: notificationData.priority,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data,
        templateId: notificationData.templateId,
        templateVariables: notificationData.templateVariables,
        scheduledFor: notificationData.scheduledFor ? new Date(notificationData.scheduledFor) : undefined,
        expiresAt: notificationData.expiresAt ? new Date(notificationData.expiresAt) : undefined
      };

      notificationIds = await notificationService.createBulkNotifications(bulkRequest);
    } else {
      // Criação individual
      const createRequest: CreateNotificationRequest = {
        userId: notificationData.userId || session.user.id,
        type: notificationData.type,
        channels: notificationData.channels,
        priority: notificationData.priority,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data,
        templateId: notificationData.templateId,
        templateVariables: notificationData.templateVariables,
        scheduledFor: notificationData.scheduledFor ? new Date(notificationData.scheduledFor) : undefined,
        expiresAt: notificationData.expiresAt ? new Date(notificationData.expiresAt) : undefined
      };

      notificationIds = await notificationService.createNotification(createRequest);
    }

    // Log da criação
    await auditService.logApiAccess(
      session.user.id,
      'POST',
      '/api/notifications',
      clientIp,
      { 
        type: bulk ? 'bulk' : 'single',
        notificationCount: notificationIds.length,
        notificationIds: notificationIds.slice(0, 5) // Só logga os primeiros 5 IDs
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        notificationIds,
        count: notificationIds.length
      }
    });

  } catch (error) {
    simpleLogger.error('Erro ao criar notificação', { error });
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
