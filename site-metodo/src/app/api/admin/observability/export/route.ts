import { NextRequest, NextResponse } from 'next/server'
import { structuredLogger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { serverCheckPermissionDetailed } from '@/lib/abac/server'
import { observabilityQuerySchema, toDateRange, buildCSV } from '@/lib/observability/utils'

const MAX_ROWS = 50000
const BATCH_SIZE = 1000

interface QueryParamsExtended {
  type: string
  from?: string
  to?: string
  level?: string
  action?: string
  resource?: string
  operation?: string
  status?: string
  all?: string // 'true' para exportar até MAX_ROWS
}

function getCorrelationId(req: NextRequest) { return req.headers.get('x-correlation-id') || crypto.randomUUID() }

export async function GET(request: NextRequest) {
  const correlationId = getCorrelationId(request)
  const started = Date.now()
  let params: QueryParamsExtended
  try {
    const raw: Record<string,string> = {}
  request.nextUrl.searchParams.forEach((v: string, k: string)=>{ raw[k]=v })
    const parsed = observabilityQuerySchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Parâmetros inválidos', issues: parsed.error.issues }, { status: 400 })
    }
    params = { ...parsed.data, type: parsed.data.type.toLowerCase(), all: raw.all }
  } catch (e) {
    await structuredLogger.warn('Observability export parse fail', { correlationId })
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: 'Auth required' }, { status: 401 })
    const authRes = await serverCheckPermissionDetailed(session.user.email, 'observability', 'read')
    if (!authRes.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const whereBase: any = {}
    const createdAt = toDateRange(params.from, params.to)
    if (createdAt) whereBase.createdAt = createdAt
    const type = params.type
    const all = params.all === 'true'

    function applyTypeSpecific(where: any) {
      if (type === 'sistema') { if (params.level) where.level = params.level }
      else if (type === 'auditoria') { if (params.action) where.action = params.action; if (params.resource) where.resource = params.resource }
      else if (type === 'performance') { if (params.operation) where.operation = params.operation }
      else if (type === 'email') { if (params.status) where.status = params.status }
      else if (type === 'notificacoes') { if (params.status) where.status = params.status }
      else if (type === 'seguranca') { where.module = { in: ['auth','security'] }; if (params.level) where.level = params.level }
    }

    async function batchQuery(skip: number, take: number) {
      const where: any = { ...whereBase }
      applyTypeSpecific(where)
      switch (type) {
        case 'sistema': return prisma.systemLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take })
        case 'auditoria': return prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take })
        case 'performance': return prisma.performanceLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take })
        case 'email': return prisma.emailLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take })
        case 'notificacoes': return prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take })
        case 'seguranca': return prisma.systemLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take })
        default: return []
      }
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let exported = 0
          let skip = 0
          let headerWritten = false
          while (exported < MAX_ROWS) {
            const data = await batchQuery(skip, BATCH_SIZE)
            if (!data.length) break
            skip += data.length
            exported += data.length
            // gerar cabeçalho somente primeira vez
            const csvChunk = buildCSV(data) // util existente gera cabeçalho automaticamente (ajustada no endpoint principal)
            if (headerWritten) {
              // remover primeira linha (cabeçalho) se já foi escrito
              const lines = csvChunk.split('\n')
              lines.shift()
              controller.enqueue(encoder.encode(lines.join('\n') + '\n'))
            } else {
              controller.enqueue(encoder.encode(csvChunk + '\n'))
              headerWritten = true
            }
            if (!all) break
          }
          controller.enqueue(encoder.encode(`#info: type=${type}; exported<=${Math.min(MAX_ROWS, exported)}; elapsedMs=${Date.now()-started}`))
          controller.close()
          await structuredLogger.info('Observability export completed', { correlationId, type, exported })
        } catch (err) {
          await structuredLogger.error('Observability export stream error', { correlationId, error: err instanceof Error ? err.message : String(err) })
          controller.error(err)
        }
      }
    })

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="observability-${type}-export.csv"`,
        'x-correlation-id': correlationId,
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    await structuredLogger.error('Observability export failed', { correlationId, error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
