import { NextRequest, NextResponse } from 'next/server';
import { createPushNotificationService } from '@/lib/notifications/push-service';
import DatabaseLogger from '@/lib/logging/database-logger';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/database/prisma-client';
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro';

export async function POST(request: NextRequest) {
  const correlationId = DatabaseLogger.generateCorrelationId();
  const startTime = Date.now();
  
  try {
  const mod = await import('next-auth');
  const getServerSession = (mod as any).getServerSession || (mod as any).default?.getServerSession;
  const session = await (getServerSession as any)(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verifica permissão para enviar notificações
  const hasPermission = await checkABACPermission(session.user.email, 'push_notifications', 'send', { correlationId })

    if (!hasPermission.allowed) {
      await DatabaseLogger.logSystem({
        level: 'WARN',
        message: `Tentativa negada de enviar push notification por ${session.user.email}`,
        module: 'push_notifications',
        operation: 'send_notification',
        context: {
          correlationId,
          metadata: {
            userEmail: session.user.email,
            reason: hasPermission.reason || 'Sem permissão',
          },
        },
      });

      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const { targetUserId, notification, priority } = await request.json();

    if (!targetUserId || !notification?.title || !notification?.body) {
      return NextResponse.json(
        { error: 'Dados de notificação inválidos' },
        { status: 400 }
      );
    }

    // Busca o usuário alvo
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        pushSubscriptions: {
          where: { isActive: true },
        },
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Usuário alvo não encontrado' },
        { status: 404 }
      );
    }

    if (targetUser.pushSubscriptions.length === 0) {
      await DatabaseLogger.logSystem({
        level: 'WARN',
        message: `Nenhuma assinatura push ativa para usuário ${targetUser.email}`,
        module: 'push_notifications',
        operation: 'send_notification',
        context: {
          correlationId,
          metadata: {
            targetUserId,
            targetEmail: targetUser.email,
          },
        },
      });

      return NextResponse.json(
        { 
          success: false,
          error: 'Usuário não possui assinaturas push ativas',
          deliveredCount: 0 
        },
        { status: 200 }
      );
    }

    // Delegate to PushNotificationService
    const svc = createPushNotificationService();
    const res = await svc.sendToUser(targetUserId, { notification, priority });

    // Normalize legacy response shape
    return NextResponse.json({
      success: res.success,
      messageId: res.messageId,
      deliveredCount: res.deliveredCount,
      failedCount: res.failedCount,
      totalSubscriptions: (res as any).totalSubscriptions || undefined,
      errors: (res.errors || []).slice(0, 3),
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    await DatabaseLogger.logSystem({
      level: 'ERROR',
      message: 'Falha crítica ao enviar push notification',
      module: 'push_notifications',
      operation: 'send_notification',
      error: error instanceof Error ? error.stack : String(error),
      context: {
        correlationId,
        duration,
        metadata: {
          path: '/api/push/send',
        },
      },
    });

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
