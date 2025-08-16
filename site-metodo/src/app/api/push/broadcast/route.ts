import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import DatabaseLogger from '@/lib/logging/database-logger';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/database/prisma-client';
import { enforcer } from '@/lib/abac/enforcer-abac-puro';

export async function POST(request: NextRequest) {
  const correlationId = DatabaseLogger.generateCorrelationId();
  const startTime = Date.now();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verifica permissão para broadcast (requer admin)
    const hasPermission = await enforcer.enforce(
      session.user.email,
      'admin',
      'broadcast_notifications',
      { correlationId }
    );

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

    // Cria o registro da notificação
    const messageId = `broadcast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const notificationRecord = await prisma.pushNotification.create({
      data: {
        title: notification.title,
        body: notification.body,
        icon: notification.icon,
        badge: notification.badge,
        image: notification.image,
        data: notification.data,
        actions: notification.actions,
        tag: notification.tag,
        priority: priority || 'normal',
        requireInteraction: notification.requireInteraction || false,
        silent: notification.silent || false,
        vibrate: notification.vibrate,
        messageId,
        correlationId,
        createdBy: session.user.email,
      },
    });

    // Cria o registro do broadcast
    const broadcastRecord = await prisma.pushBroadcast.create({
      data: {
        notificationId: notificationRecord.id,
        targetUserIds: userIds,
        totalTargets: userIds.length,
        status: 'processing',
        correlationId,
        createdBy: session.user.email,
        startedAt: new Date(),
      },
    });

    let totalSubscriptions = 0;
    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Processa cada usuário
    for (const user of users) {
      totalSubscriptions += user.pushSubscriptions.length;

      for (const subscription of user.pushSubscriptions) {
        try {
          // Cria registro de entrega
          const delivery = await prisma.pushDelivery.create({
            data: {
              notificationId: notificationRecord.id,
              subscriptionId: subscription.id,
              status: 'pending',
              correlationId,
            },
          });

          // Prepara payload
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          };

          const payload = JSON.stringify({
            title: notification.title,
            body: notification.body,
            icon: notification.icon,
            badge: notification.badge,
            data: notification.data,
            tag: notification.tag,
          });

          // Simula envio (implementação real usaria web-push)
          // const webpush = await import('web-push');
          // await webpush.default.sendNotification(pushSubscription, payload);

          await prisma.pushDelivery.update({
            where: { id: delivery.id },
            data: {
              status: 'sent',
              sentAt: new Date(),
              httpStatus: 200,
            },
          });

          sentCount++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          errors.push(`${user.email}: ${errorMessage}`);
          failedCount++;

          await DatabaseLogger.logSystem({
            level: 'ERROR',
            message: `Falha no broadcast para ${user.email}`,
            module: 'push_notifications',
            operation: 'broadcast_send',
            error: errorMessage,
            context: {
              correlationId,
              metadata: {
                broadcastId: broadcastRecord.id,
                userId: user.id,
                userEmail: user.email,
              },
            },
          });
        }
      }
    }

    const duration = Date.now() - startTime;

    // Atualiza o registro do broadcast
    await prisma.pushBroadcast.update({
      where: { id: broadcastRecord.id },
      data: {
        status: 'completed',
        sentCount,
        deliveredCount: sentCount, // Por enquanto assume que sent = delivered
        failedCount,
        completedAt: new Date(),
        duration,
        errorMessage: errors.length > 0 ? errors.slice(0, 5).join('; ') : null,
      },
    });

    // Log da operação completa
    await DatabaseLogger.logAudit({
      action: 'CREATE',
      resource: 'push_broadcast',
      resourceId: broadcastRecord.id,
      newValues: {
        totalTargets: userIds.length,
        usersWithSubscriptions: users.length,
        totalSubscriptions,
        sentCount,
        failedCount,
        duration,
      },
      context: {
        correlationId,
        metadata: {
          messageId,
          notificationTitle: notification.title,
          senderEmail: session.user.email,
        },
      },
    });

    await DatabaseLogger.logPerformance({
      operation: 'send_push_broadcast',
      method: 'POST',
      path: '/api/push/broadcast',
      duration,
      context: {
        correlationId,
        metadata: {
          messageId,
          broadcastId: broadcastRecord.id,
          totalTargets: userIds.length,
          totalSubscriptions,
          sentCount,
          failedCount,
        },
      },
    });

    await DatabaseLogger.logSystem({
      level: 'INFO',
      message: `Broadcast de push notification completado: ${sentCount}/${totalSubscriptions} enviadas`,
      module: 'push_notifications',
      operation: 'broadcast',
      context: {
        correlationId,
        metadata: {
          messageId,
          broadcastId: broadcastRecord.id,
          totalTargets: userIds.length,
          sentCount,
          failedCount,
          duration,
          senderEmail: session.user.email,
        },
      },
    });

    return NextResponse.json({
      success: sentCount > 0,
      messageId: notificationRecord.messageId,
      broadcastId: broadcastRecord.id,
      totalTargets: userIds.length,
      usersWithSubscriptions: users.length,
      totalSubscriptions,
      sentCount,
      failedCount,
      duration,
      errors: errors.slice(0, 10), // Limita a 10 erros
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
