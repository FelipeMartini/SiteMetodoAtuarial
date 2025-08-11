import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getNotificationService } from '@/lib/notifications/notification-service';
import { simpleLogger } from '@/lib/simple-logger';
import { auditService } from '@/lib/audit';
import { getClientIP } from '@/lib/utils/ip';

/**
 * API para ações em notificações específicas
 * PATCH /api/notifications/[id] - Marca como lida
 * DELETE /api/notifications/[id] - Remove notificação
 */

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const clientIp = getClientIP(request);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const notificationId = params.id;
    const body = await request.json();
    const { action } = body;

    const notificationService = getNotificationService();

    switch (action) {
      case 'mark_as_read':
        await notificationService.markAsRead(notificationId, session.user.id);
        break;

      default:
        return NextResponse.json(
          { error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }

    // Log da ação
    await auditService.logApiAccess(
      session.user.id,
      'PATCH',
      `/api/notifications/${notificationId}`,
      clientIp,
      { action }
    );

    return NextResponse.json({
      success: true,
      message: 'Ação executada com sucesso'
    });

  } catch (_error) {
    simpleLogger.error('Erro ao atualizar notificação', { error, id: params.id });
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const clientIp = getClientIP(request);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const notificationId = params.id;
    const notificationService = getNotificationService();

    await notificationService.deleteNotification(notificationId, session.user.id);

    // Log da remoção
    await auditService.logApiAccess(
      session.user.id,
      'DELETE',
      `/api/notifications/${notificationId}`,
      clientIp,
      {}
    );

    return NextResponse.json({
      success: true,
      message: 'Notificação removida com sucesso'
    });

  } catch (_error) {
    simpleLogger.error('Erro ao remover notificação', { error, id: params.id });
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
