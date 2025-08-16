import { NextRequest, NextResponse } from 'next/server';
import DatabaseLogger from '@/lib/logging/database-logger';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/database/prisma-client';
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro';
import { PushNotificationServiceStats } from '@/lib/notifications/push-service';

export async function GET(_request: NextRequest) {
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

    // Verifica permissão para visualizar estatísticas de push
  const hasPermission = await checkABACPermission(session.user.email, 'push_notifications', 'read', { correlationId })

  if (!hasPermission.allowed) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

  // Use PushNotificationServiceStats to collect subscription counts
  const stats = await PushNotificationServiceStats.getStats();
  const totalSubscriptions = stats.totalSubscriptions;
  const activeSubscriptions = stats.activeSubscriptions;
  const inactiveSubscriptions = stats.inactiveSubscriptions;

    // Estatísticas de notificações (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const notificationStats = await prisma.pushNotification.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        deliveries: true,
      },
    });

  const totalNotifications = notificationStats.length;
    let totalDeliveries = 0;
    let successfulDeliveries = 0;
    let failedDeliveries = 0;

    notificationStats.forEach((notification: any) => {
      notification.deliveries.forEach((delivery: any) => {
        totalDeliveries++;
        if (delivery.status === 'sent' || delivery.status === 'delivered') {
          successfulDeliveries++;
        } else if (delivery.status === 'failed') {
          failedDeliveries++;
        }
      });
    });

    const deliveryRate = totalDeliveries > 0 ? (successfulDeliveries / totalDeliveries * 100) : 0;

    // Estatísticas por prioridade
    const priorityStats = await prisma.pushNotification.groupBy({
      by: ['priority'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    // Notificações recentes
    const recentNotifications = await prisma.pushNotification.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        deliveries: {
          select: {
            status: true,
          },
        },
      },
    });

    // Top usuários por assinaturas
    const topUsers = await prisma.user.findMany({
      where: {
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
      orderBy: {
        pushSubscriptions: {
          _count: 'desc',
        },
      },
      take: 10,
    });

  const response = {
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        inactive: inactiveSubscriptions,
        activeRate: totalSubscriptions > 0 ? (activeSubscriptions / totalSubscriptions * 100) : 0,
      },
      notifications: {
        totalLast30Days: totalNotifications,
        totalDeliveries,
        successfulDeliveries,
        failedDeliveries,
        deliveryRate,
        priorityBreakdown: priorityStats.map((stat: any) => ({
          priority: stat.priority,
          count: stat._count.id,
        })),
      },
      recentNotifications: recentNotifications.map((notification: any) => ({
        id: notification.id,
        title: notification.title,
        body: notification.body.substring(0, 100) + (notification.body.length > 100 ? '...' : ''),
        priority: notification.priority,
        createdAt: notification.createdAt,
        deliveryCount: notification.deliveries.length,
        successCount: notification.deliveries.filter((d: any) => d.status === 'sent' || d.status === 'delivered').length,
        failedCount: notification.deliveries.filter((d: any) => d.status === 'failed').length,
      })),
      topUsers: topUsers.map((user: any) => ({
        id: user.id,
        name: user.name || 'Usuário sem nome',
        email: user.email,
        subscriptionsCount: user.pushSubscriptions.length,
      })),
      generatedAt: new Date().toISOString(),
    };

    await DatabaseLogger.logSystem({
      level: 'INFO',
      message: `Estatísticas de push notifications consultadas por ${session.user.email}`,
      module: 'push_notifications',
      operation: 'get_stats',
      context: {
        correlationId,
        metadata: {
          totalSubscriptions,
          totalNotifications,
          deliveryRate: Math.round(deliveryRate),
        },
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    await DatabaseLogger.logSystem({
      level: 'ERROR',
      message: 'Falha ao consultar estatísticas de push notifications',
      module: 'push_notifications',
      operation: 'get_stats',
      error: error instanceof Error ? error.stack : String(error),
      context: {
        correlationId,
        metadata: {
          path: '/api/push/stats',
        },
      },
    });

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
