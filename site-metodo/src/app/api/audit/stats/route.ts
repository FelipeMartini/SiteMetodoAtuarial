import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { auditService } from '@/lib/audit'
import { structuredLogger } from '@/lib/logger'
import { getClientIP } from '@/lib/utils/ip'
import { z } from 'zod'

// Schema para validação dos parâmetros
const StatsParamsSchema = z.object({
  period: z.enum(['day', 'week', 'month']).default('week'),
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
      structuredLogger.security('Unauthorized audit stats access attempt', 'high', {
        userId: session.user.id,
        email: session.user.email,
        accessLevel: session.user.accessLevel,
        ip: getClientIP(request),
      })
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Extrair e validar parâmetros
    const searchParams = request.nextUrl.searchParams
    const params = StatsParamsSchema.parse({
      period: searchParams.get('period') || 'week',
    })

    // Buscar estatísticas
    const stats = await auditService.getAuditStats(params.period)

    // Log do acesso às estatísticas
    structuredLogger.audit('AUDIT_STATS_ACCESSED', {
      performedBy: session.user.id || '',
      ip: getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'Unknown',
      period: params.period,
    })

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (_error) {
    structuredLogger.error('Error fetching audit stats', error as Error, {
      userId: (await auth())?.user?.id,
      ip: getClientIP(request),
    })
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
