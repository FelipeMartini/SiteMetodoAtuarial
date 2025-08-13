import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkPermission } from '@/lib/abac/enforcer-abac-puro';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar permissão para visualizar logs de auditoria
    const permission = await checkPermission(
      session.user.email,
      'audit_logs',
      'read'
    );

    if (!permission.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const subject = searchParams.get('subject');
    const object = searchParams.get('object');
    const action = searchParams.get('action');
    const allowed = searchParams.get('allowed');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (subject) {
      where.subject = { contains: subject };
    }

    if (object) {
      where.object = { contains: object };
    }

    if (action) {
      where.action = { contains: action };
    }

    if (allowed !== null && allowed !== undefined) {
      where.allowed = allowed === 'true';
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    // Buscar logs com contagem total
    const [logs, total] = await Promise.all([
      prisma.accessLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.accessLog.count({ where })
    ]);

    // Calcular estatísticas
    const stats = await prisma.accessLog.aggregate({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24h
        }
      },
      _count: {
        id: true
      }
    });

    const allowedCount = await prisma.accessLog.count({
      where: {
        ...where,
        allowed: true
      }
    });

    const deniedCount = await prisma.accessLog.count({
      where: {
        ...where,
        allowed: false
      }
    });

    // Atividade por hora nas últimas 24h
    const now = new Date();
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      hour.setMinutes(0, 0, 0);
      return hour;
    });

    const activityByHour = await Promise.all(
      hours.map(async (hour) => {
        const nextHour = new Date(hour.getTime() + 60 * 60 * 1000);
        const count = await prisma.accessLog.count({
          where: {
            timestamp: {
              gte: hour,
              lt: nextHour
            }
          }
        });
        return {
          hour: hour.getHours(),
          count
        };
      })
    );

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        total24h: stats._count.id,
        allowed: allowedCount,
        denied: deniedCount,
        activityByHour
      }
    });

  } catch (error) {
    console.error('Erro ao buscar logs de auditoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
