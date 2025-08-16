import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import PushNotificationService from '@/lib/notifications/push-service';
import DatabaseLogger from '@/lib/logging/database-logger';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/database/prisma-client';

export async function POST(request: NextRequest) {
  const correlationId = DatabaseLogger.generateCorrelationId();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { subscription, userAgent } = await request.json();

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { error: 'Dados de assinatura inválidos' },
        { status: 400 }
      );
    }

    // Busca o usuário pelo email da sessão
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verifica se já existe uma assinatura com o mesmo endpoint
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint },
    });

    let result;

    if (existingSubscription) {
      // Atualiza assinatura existente
      result = await prisma.pushSubscription.update({
        where: { id: existingSubscription.id },
        data: {
          userId: user.id,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent,
          isActive: true,
          updatedAt: new Date(),
        },
      });

      await DatabaseLogger.logAudit({
        action: 'UPDATE',
        resource: 'push_subscription',
        resourceId: result.id,
        oldValues: {
          userId: existingSubscription.userId,
          isActive: existingSubscription.isActive,
        },
        newValues: {
          userId: user.id,
          isActive: true,
          userAgent,
        },
        context: {
          userId: user.id,
          correlationId,
          metadata: {
            endpoint: subscription.endpoint,
            updated: true,
          },
        },
      });
    } else {
      // Cria nova assinatura
      result = await prisma.pushSubscription.create({
        data: {
          userId: user.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent,
          isActive: true,
        },
      });

      await DatabaseLogger.logAudit({
        action: 'CREATE',
        resource: 'push_subscription',
        resourceId: result.id,
        newValues: {
          userId: user.id,
          endpoint: subscription.endpoint,
          userAgent,
          isActive: true,
        },
        context: {
          userId: user.id,
          correlationId,
          metadata: {
            endpoint: subscription.endpoint,
            created: true,
          },
        },
      });
    }

    await DatabaseLogger.logSystem({
      level: 'INFO',
      message: `Push subscription ${existingSubscription ? 'atualizada' : 'registrada'} para usuário ${user.email}`,
      module: 'push_notifications',
      operation: 'register_subscription',
      context: {
        userId: user.id,
        correlationId,
        metadata: {
          subscriptionId: result.id,
          endpoint: subscription.endpoint,
          action: existingSubscription ? 'update' : 'create',
        },
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: result.id,
      action: existingSubscription ? 'updated' : 'created',
    });
  } catch (error) {
    await DatabaseLogger.logSystem({
      level: 'ERROR',
      message: 'Falha ao registrar push subscription',
      module: 'push_notifications',
      operation: 'register_subscription',
      error: error instanceof Error ? error.stack : String(error),
      context: {
        correlationId,
        metadata: {
          path: '/api/push/register',
        },
      },
    });

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
