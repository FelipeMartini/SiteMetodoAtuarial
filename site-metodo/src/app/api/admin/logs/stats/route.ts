'use client';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro';
import DatabaseLogger from '@/lib/logging/database-logger';

/**
 * API para estatísticas e métricas rápidas de logs
 * GET /api/admin/logs/stats
 */
export async function GET(_request: NextRequest) {
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
      return NextResponse.json({ error: 'Sem permissão para visualizar estatísticas de logs' }, { status: 403 });
    }

    // Busca estatísticas rápidas
    const [recentErrors, slowestOps] = await Promise.all([
      DatabaseLogger.getRecentErrors(10),
      DatabaseLogger.getSlowestOperations(10),
    ]);

    // Calcula métricas adicionais
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [errorsLastHour, errorsLastDay] = await Promise.all([
      DatabaseLogger.getSystemLogs({
        level: 'ERROR',
        startDate: oneHourAgo,
        endDate: now,
        limit: 1,
      }),
      DatabaseLogger.getSystemLogs({
        level: 'ERROR',
        startDate: oneDayAgo,
        endDate: now,
        limit: 1,
      }),
    ]);

    const stats = {
      recentErrors: recentErrors.map(log => ({
        id: log.id,
        message: log.message,
        module: log.module,
        createdAt: log.createdAt,
        user: log.user,
      })),
      slowestOperations: slowestOps.map(log => ({
        id: log.id,
        operation: log.operation,
        duration: log.duration,
        path: log.path,
        createdAt: log.createdAt,
      })),
      errorCounts: {
        lastHour: errorsLastHour.pagination.total,
        lastDay: errorsLastDay.pagination.total,
      },
      summary: {
        totalErrors: recentErrors.length,
        avgResponseTime: slowestOps.length > 0 
          ? Math.round(slowestOps.reduce((sum, op) => sum + op.duration, 0) / slowestOps.length)
          : 0,
        lastErrorTime: recentErrors[0]?.createdAt || null,
      },
    };

    // Log da consulta de estatísticas
    await DatabaseLogger.logAudit({
      action: 'VIEW',
      resource: 'log_statistics',
      context: {
        userId: session.user.id,
        metadata: {
          statsRequested: true,
          timestamp: now.toISOString(),
        },
      },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[API] Erro ao buscar estatísticas de logs:', error);

    await DatabaseLogger.logSystem({
      level: 'ERROR',
      message: 'Falha na API de estatísticas de logs',
      module: 'api',
      operation: 'get_log_stats',
      error: error instanceof Error ? error.stack : String(error),
    });

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
