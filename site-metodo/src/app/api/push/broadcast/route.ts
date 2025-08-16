import { NextRequest, NextResponse } from 'next/server';
import DatabaseLogger from '@/lib/logging/database-logger';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/database/prisma-client';
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro';
import { createPushNotificationService } from '@/lib/notifications/push-service';

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

  // Verifica permissão para broadcast (requer admin)
  const hasPermission = await checkABACPermission(session.user.email, 'admin', 'broadcast_notifications', { correlationId })

  if (!hasPermission.allowed) {
      await DatabaseLogger.logSystem({
        level: 'WARN',
        message: `Tentativa negada de broadcast de push notification por ${session.user.email}`,
        module: 'push_notifications',
        operation: 'broadcast',
        context: {
          correlationId,
          metadata: {
            userEmail: session.user.email,
            reason: hasPermission.reason || 'Sem permissão de admin',
          },
        },
      });

      return NextResponse.json(
        { error: 'Acesso negado - requer permissões de admin' },
        { status: 403 }
      );
    }

    const { userIds, notification, priority } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Lista de usuários é obrigatória' },
        { status: 400 }
      );
    }

    if (!notification?.title || !notification?.body) {
      return NextResponse.json(
        { error: 'Título e corpo da notificação são obrigatórios' },
        { status: 400 }
      );
    }

    // Limita a 1000 usuários por broadcast para evitar sobrecarga
    if (userIds.length > 1000) {
      return NextResponse.json(
        { error: 'Máximo de 1000 usuários por broadcast' },
        { status: 400 }
      );
    }

    // Busca usuários com assinaturas ativas
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
        pushSubscriptions: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        pushSubscriptions: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nenhum usuário com assinaturas push ativas encontrado',
          messageId: null,
          totalTargets: 0,
          sentCount: 0,
          failedCount: 0,
        },
        { status: 200 }
      );
    }

    // Delegate to PushNotificationService broadcast
    const svc = createPushNotificationService();
    const result = await svc.sendToUsers(userIds, { notification, priority });

    return NextResponse.json({
      success: (result as any).success !== false,
      messageId: (result as any).messageId,
      totalTargets: (result as any).totalUsers || userIds.length,
      successCount: (result as any).successCount || 0,
      failureCount: (result as any).failureCount || 0,
      details: (result as any).details || [],
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    await DatabaseLogger.logSystem({
      level: 'ERROR',
      message: 'Falha crítica no broadcast de push notifications',
      module: 'push_notifications',
      operation: 'broadcast',
      error: error instanceof Error ? error.stack : String(error),
      context: {
        correlationId,
        duration,
        metadata: {
          path: '/api/push/broadcast',
        },
      },
    });

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
