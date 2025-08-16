'use client';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro';
import DatabaseLogger from '@/lib/logging/database-logger';

/**
 * API para consulta de logs de performance
 * GET /api/admin/logs/performance?page=1&limit=50&operation=auth&minDuration=100
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verifica permissão ABAC
    const canViewLogs = await checkABACPermission(
      session.user.email,
      'admin:logs',
      'read',
      {}
    );

    if (!canViewLogs) {
      return NextResponse.json({ error: 'Sem permissão para visualizar logs de performance' }, { status: 403 });
    }

    // Extrai parâmetros da query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const operation = searchParams.get('operation') || undefined;
    const method = searchParams.get('method') || undefined;
    const minDuration = searchParams.get('minDuration') ? parseInt(searchParams.get('minDuration')!) : undefined;
    const maxDuration = searchParams.get('maxDuration') ? parseInt(searchParams.get('maxDuration')!) : undefined;
    const userId = searchParams.get('userId') || undefined;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

    // Busca logs de performance
    const result = await DatabaseLogger.getPerformanceLogs({
      page,
      limit,
      operation,
      method,
      minDuration,
      maxDuration,
      userId,
      startDate,
      endDate,
    });

    // Log da ação de visualização
    await DatabaseLogger.logAudit({
      action: 'VIEW',
      resource: 'performance_logs',
      context: {
        userId: session.user.id,
        metadata: {
          filters: { operation, method, minDuration, maxDuration, userId },
          pagination: { page, limit },
        },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Erro ao buscar logs de performance:', error);

    await DatabaseLogger.logSystem({
      level: 'ERROR',
      message: 'Falha na API de consulta de logs de performance',
      module: 'api',
      operation: 'get_performance_logs',
      error: error instanceof Error ? error.stack : String(error),
    });

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
