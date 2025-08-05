// API Route para estatísticas do dashboard
// Fornece métricas e dados para o painel administrativo

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { auth } from '@/auth';

// Verificar permissão de admin
async function checkAdminPermission() {
  const session = await auth();

  if (!session?.user) {
    return false;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accessLevel: true, isActive: true },
  });

  return user && user.isActive && user.accessLevel >= 4;
}

export async function GET(request: NextRequest) {
  try {
    const hasPermission = await checkAdminPermission();
    if (!hasPermission) {
      return NextResponse.json({
        error: 'Acesso negado.',
      }, { status: 403 });
    }

    // Estatísticas de usuários
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      recentUsers,
      usersWithLastLogin,
    ] = await Promise.all([
      // Total de usuários
      db.user.count(),

      // Usuários ativos
      db.user.count({
        where: { isActive: true },
      }),

      // Usuários inativos
      db.user.count({
        where: { isActive: false },
      }),

      // Usuários com nível admin (4 ou 5)
      db.user.count({
        where: { accessLevel: { gte: 4 } },
      }),

      // Usuários criados nos últimos 30 dias
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Usuários que fizeram login nos últimos 7 dias
      db.user.count({
        where: {
          lastLogin: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Distribuição por nível de acesso
    const accessLevelDistribution = await db.user.groupBy({
      by: ['accessLevel'],
      _count: {
        accessLevel: true,
      },
    });

    // Usuários criados por mês (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const usersByMonth = await db.user.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
      },
    });

    // Agrupar por mês
    const monthlyStats = usersByMonth.reduce((acc, user) => {
      const month = user.createdAt.toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Atividade recente (usuários que fizeram login recentemente)
    const recentActivity = await db.user.findMany({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // últimas 24h
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        lastLogin: true,
      },
      orderBy: {
        lastLogin: 'desc',
      },
      take: 10,
    });

    // Montar resposta com todas as estatísticas
    const stats = {
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers,
        recentUsers,
        usersWithRecentLogin: usersWithLastLogin,
      },
      distribution: {
        byAccessLevel: accessLevelDistribution.map(item => ({
          level: item.accessLevel,
          count: item._count.accessLevel,
          label: getAccessLevelLabel(item.accessLevel),
        })),
        byStatus: [
          { status: 'active', count: activeUsers, label: 'Ativos' },
          { status: 'inactive', count: inactiveUsers, label: 'Inativos' },
        ],
      },
      trends: {
        usersByMonth: monthlyStats,
      },
      recentActivity,
      metrics: {
        userGrowthRate: calculateGrowthRate(recentUsers, totalUsers),
        activeUserRate: Math.round((activeUsers / totalUsers) * 100),
        adminUserRate: Math.round((adminUsers / totalUsers) * 100),
      },
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

// Função auxiliar para obter label do nível de acesso
function getAccessLevelLabel(level: number): string {
  const labels = {
    1: 'Normal',
    2: 'Premium',
    3: 'Manager',
    4: 'Admin',
    5: 'SuperAdmin',
  };
  return labels[level as keyof typeof labels] || 'Desconhecido';
}

// Função auxiliar para calcular taxa de crescimento
function calculateGrowthRate(recent: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((recent / total) * 100);
}
