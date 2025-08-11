import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { auditService } from '@/lib/audit'
import { structuredLogger } from '@/lib/logger'
import { getClientIP } from '@/lib/utils/ip'
import { z } from 'zod'

// Schema para validação dos filtros
const LogFiltersSchema = z.object({
  userId: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  endDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  success: z.string().optional().transform(str => str === 'true' ? true : str === 'false' ? false : undefined),
  limit: z.string().optional().transform(str => str ? parseInt(str) : 50),
  offset: z.string().optional().transform(str => str ? parseInt(str) : 0),
  search: z.string().optional(),
  export: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação e permissões
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin (accessLevel >= 100)
    if ((session.user.accessLevel || 0) < 100) {
      structuredLogger.security('Unauthorized audit logs access attempt', 'high', {
        userId: session.user.id,
        email: session.user.email,
        accessLevel: session.user.accessLevel,
        ip: getClientIP(request),
      })
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Extrair e validar parâmetros
    const searchParams = request.nextUrl.searchParams
    const rawFilters = Object.fromEntries(searchParams.entries())
    
    const filters = LogFiltersSchema.parse(rawFilters)

    // Verificar se é export
    if (filters.export) {
      return await handleExport(filters, session.user.id)
    }

    // Buscar logs
    const result = await auditService.searchLogs({
      userId: filters.userId,
      action: filters.action as any,
      startDate: filters.startDate,
      endDate: filters.endDate,
      success: filters.success,
      limit: filters.limit,
      offset: filters.offset,
    })

    // Filtrar por busca se especificado
    let filteredLogs = result.logs
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredLogs = result.logs.filter(log => 
        log.action.toLowerCase().includes(searchTerm) ||
        log.target?.toLowerCase().includes(searchTerm) ||
        log.user?.name?.toLowerCase().includes(searchTerm) ||
        log.user?.email?.toLowerCase().includes(searchTerm) ||
        log.ipAddress?.includes(searchTerm)
      )
    }

    // Log do acesso aos logs de auditoria
    structuredLogger.audit('AUDIT_LOGS_ACCESSED', {
      performedBy: session.user.id,
      ip: getClientIP(request),
      userAgent: request.headers.get('user-agent'),
      filters: filters,
      resultCount: filteredLogs.length,
    })

    return NextResponse.json({
      success: true,
      logs: filteredLogs,
      total: result.total,
      hasMore: result.hasMore,
    })
  } catch (error) {
    structuredLogger.error('Error fetching audit logs', error, {
      userId: (await auth())?.user?.id,
      ip: getClientIP(request),
    })
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function handleExport(filters: any, userId: string) {
  try {
    // Buscar todos os logs (sem paginação para export)
    const result = await auditService.searchLogs({
      ...filters,
      limit: 10000, // Limite grande para export
      offset: 0,
    })

    // Converter para CSV
    const csvHeaders = [
      'ID',
      'Data/Hora',
      'Usuário',
      'Email',
      'Ação',
      'Alvo',
      'IP',
      'User Agent',
      'Status',
      'Detalhes'
    ].join(',')

    const csvRows = result.logs.map(log => [
      log.id,
      new Date(log.createdAt).toISOString(),
      log.user?.name || 'Sistema',
      log.user?.email || '',
      log.action,
      log.target || '',
      log.ipAddress || '',
      log.userAgent ? `"${log.userAgent.replace(/"/g, '""')}"` : '',
      log.success ? 'Sucesso' : 'Falha',
      log.details ? `"${JSON.stringify(log.details).replace(/"/g, '""')}"` : ''
    ].join(','))

    const csvContent = [csvHeaders, ...csvRows].join('\n')

    // Log da exportação
    structuredLogger.security('audit_logs_exported', 'medium', {
      userId,
      exportedCount: result.logs.length,
      filters,
    })

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    structuredLogger.error('Error exporting audit logs', error, { userId })
    return NextResponse.json(
      { error: 'Erro ao exportar logs' },
      { status: 500 }
    )
  }
}
