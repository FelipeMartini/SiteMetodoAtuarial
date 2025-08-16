import { NextRequest, NextResponse } from 'next/server';
import { createPushNotificationService } from '@/lib/notifications/push-service';
import DatabaseLogger from '@/lib/logging/database-logger';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/database/prisma-client';

export async function POST(request: NextRequest) {
  const correlationId = DatabaseLogger.generateCorrelationId();
  
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

    // Delegate to canonical PushNotificationService (compat factory)
    const service = createPushNotificationService();
    const registered = await service.registerSubscription(user.id, subscription, userAgent, { correlationId });

    await DatabaseLogger.logSystem({
      level: 'INFO',
      message: `Push subscription registrada/atualizada para usuário ${user.email}`,
      module: 'push_notifications',
      operation: 'register_subscription',
      context: {
        userId: user.id,
        correlationId,
        metadata: {
          subscriptionId: (registered as any)?.id,
          endpoint: subscription.endpoint,
        },
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: (registered as any)?.id || null,
      action: 'upserted',
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
