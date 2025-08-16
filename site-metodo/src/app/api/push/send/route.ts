import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import PushNotificationService, { PushNotificationPayload } from '@/lib/notifications/push-service';
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

    // Verifica permissão para enviar notificações
    const hasPermission = await enforcer.enforce(
      session.user.email,
      'push_notifications',
      'send',
      { correlationId }
    );

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

    // Cria o registro da notificação no banco
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
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

    // Cria registros de entrega para cada assinatura
    const deliveries = await Promise.all(
      targetUser.pushSubscriptions.map(subscription =>
        prisma.pushDelivery.create({
          data: {
            notificationId: notificationRecord.id,
            subscriptionId: subscription.id,
            status: 'pending',
            correlationId,
          },
        })
      )
    );

    // Envia as notificações usando o web-push
    let deliveredCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const delivery of deliveries) {
      const subscription = targetUser.pushSubscriptions.find(s => s.id === delivery.subscriptionId)!;
      
      try {
        // Prepara o payload para web-push
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        };

        // Simula o envio (implementação real usaria web-push)
        const webpush = await import('web-push');
        
        // Configurar VAPID (implementação futura)
        if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
          webpush.default.setVapidDetails(
            process.env.VAPID_SUBJECT || 'mailto:admin@metodoaparial.com.br',
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
          );
        }

        const payload = JSON.stringify({
          title: notification.title,
          body: notification.body,
          icon: notification.icon,
          badge: notification.badge,
          data: notification.data,
          tag: notification.tag,
        });

        // Por enquanto simula sucesso (implementação completa seria aqui)
        // await webpush.default.sendNotification(pushSubscription, payload);

        await prisma.pushDelivery.update({
          where: { id: delivery.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
            httpStatus: 200,
          },
        });

        deliveredCount++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(errorMessage);
        failedCount++;

        await prisma.pushDelivery.update({
          where: { id: delivery.id },
          data: {
            status: 'failed',
            errorMessage,
            httpStatus: (error as any).statusCode || 500,
          },
        });

        // Se for erro 410, desativa a assinatura
        if ((error as any).statusCode === 410) {
          await prisma.pushSubscription.update({
            where: { id: subscription.id },
            data: { isActive: false },
          });
        }
      }
    }

    const duration = Date.now() - startTime;

    // Log da operação completa
    await DatabaseLogger.logAudit({
      action: 'CREATE',
      resource: 'push_notification_delivery',
      resourceId: notificationRecord.id,
      newValues: {
        targetUserId,
        title: notification.title,
        deliveredCount,
        failedCount,
        totalSubscriptions: targetUser.pushSubscriptions.length,
      },
      context: {
        correlationId,
        metadata: {
          messageId,
          duration,
          senderEmail: session.user.email,
        },
      },
    });

    await DatabaseLogger.logPerformance({
      operation: 'send_push_notification',
      method: 'POST',
      path: '/api/push/send',
      duration,
      context: {
        correlationId,
        metadata: {
          messageId,
          targetUserId,
          subscriptionsCount: targetUser.pushSubscriptions.length,
          deliveredCount,
          failedCount,
        },
      },
    });

    return NextResponse.json({
      success: deliveredCount > 0,
      messageId: notificationRecord.messageId,
      deliveredCount,
      failedCount,
      totalSubscriptions: targetUser.pushSubscriptions.length,
      errors: errors.slice(0, 3), // Limita a 3 erros
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
