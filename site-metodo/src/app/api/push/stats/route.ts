import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import DatabaseLogger from '@/lib/logging/database-logger';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/database/prisma-client';
import { enforcer } from '@/lib/abac/enforcer-abac-puro';

export async function GET(request: NextRequest) {
  const correlationId = DatabaseLogger.generateCorrelationId();
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verifica permissão para visualizar estatísticas de push
    const hasPermission = await enforcer.enforce(
      session.user.email,
      'push_notifications',
      'read',
      { correlationId }
    );

    if (!hasPermission.allowed) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Estatísticas de assinaturas
    const subscriptionStats = await prisma.pushSubscription.groupBy({
      by: ['isActive'],
      _count: {
        id: true,
      },
    });

    const totalSubscriptions = subscriptionStats.reduce((acc, stat) => acc + stat._count.id, 0);
    const activeSubscriptions = subscriptionStats.find(stat => stat.isActive)?._count.id || 0;
    const inactiveSubscriptions = subscriptionStats.find(stat => !stat.isActive)?._count.id || 0;

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

    let totalNotifications = notificationStats.length;
    let totalDeliveries = 0;
    let successfulDeliveries = 0;
    let failedDeliveries = 0;

    notificationStats.forEach(notification => {
      notification.deliveries.forEach(delivery => {
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
        priorityBreakdown: priorityStats.map(stat => ({
          priority: stat.priority,
          count: stat._count.id,
        })),
      },
      recentNotifications: recentNotifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        body: notification.body.substring(0, 100) + (notification.body.length > 100 ? '...' : ''),
        priority: notification.priority,
        createdAt: notification.createdAt,
        deliveryCount: notification.deliveries.length,
        successCount: notification.deliveries.filter(d => d.status === 'sent' || d.status === 'delivered').length,
        failedCount: notification.deliveries.filter(d => d.status === 'failed').length,
      })),
      topUsers: topUsers.map(user => ({
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
