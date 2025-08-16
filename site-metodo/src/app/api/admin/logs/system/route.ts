'use client';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro';
import DatabaseLogger from '@/lib/logging/database-logger';

/**
 * API para consulta de logs do sistema
 * GET /api/admin/logs/system?page=1&limit=50&level=ERROR&module=auth
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
      return NextResponse.json({ error: 'Sem permissão para visualizar logs' }, { status: 403 });
    }

    // Extrai parâmetros da query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100); // Máximo 100
    const level = searchParams.get('level') || undefined;
  const moduleName = searchParams.get('module') || undefined;
    const operation = searchParams.get('operation') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

    // Busca logs
    const result = await DatabaseLogger.getSystemLogs({
      page,
      limit,
      level,
  module: moduleName,
      operation,
      userId,
      startDate,
      endDate,
    });

    // Log da ação de visualização
    await DatabaseLogger.logAudit({
      action: 'VIEW',
      resource: 'system_logs',
      context: {
        userId: session.user.id,
        metadata: {
          filters: { level, module: moduleName, operation, userId },
          pagination: { page, limit },
        },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Erro ao buscar logs do sistema:', error);

    // Log do erro
    await DatabaseLogger.logSystem({
      level: 'ERROR',
      message: 'Falha na API de consulta de logs do sistema',
      module: 'api',
      operation: 'get_system_logs',
      error: error instanceof Error ? error.stack : String(error),
    });

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
