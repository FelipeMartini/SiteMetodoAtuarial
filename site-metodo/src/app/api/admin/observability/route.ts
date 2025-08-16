import { NextRequest, NextResponse } from 'next/server'
import { structuredLogger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { serverCheckPermissionDetailed } from '@/lib/abac/server'
import { observabilityQuerySchema, buildPagination, toDateRange, buildCSV } from '@/lib/observability/utils'

interface QueryParamsExtended {
  type: string
  page: number
  pageSize: number
  sort?: string
  order: 'asc' | 'desc'
  from?: string
  to?: string
  level?: string
  action?: string
  resource?: string
  operation?: string
  status?: string
  export?: 'csv' | 'json'
  summary?: boolean
}

function getOrCreateCorrelationId(req: NextRequest) {
  const existing = req.headers.get('x-correlation-id')
  return existing || crypto.randomUUID()
}

async function handleSystem(params: QueryParamsExtended) {
  const where: any = {}
  const createdAt = toDateRange(params.from, params.to)
  if (createdAt) where.createdAt = createdAt
  if (params.level) where.level = params.level
  const [total, data] = await Promise.all([
    prisma.systemLog.count({ where }),
    prisma.systemLog.findMany({ where, orderBy: { createdAt: 'desc' }, ...buildPagination(params) })
  ])
  return { total, data }
}

async function handleAudit(params: QueryParamsExtended) {
  const where: any = {}
  const createdAt = toDateRange(params.from, params.to)
  if (createdAt) where.createdAt = createdAt
  if (params.action) where.action = params.action
  if (params.resource) where.resource = params.resource
  const [total, data] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, ...buildPagination(params) })
  ])
  return { total, data }
}

async function handlePerformance(params: QueryParamsExtended) {
  const where: any = {}
  const createdAt = toDateRange(params.from, params.to)
  if (createdAt) where.createdAt = createdAt
  if (params.operation) where.operation = params.operation
  const [total, data] = await Promise.all([
    prisma.performanceLog.count({ where }),
    prisma.performanceLog.findMany({ where, orderBy: { createdAt: 'desc' }, ...buildPagination(params) })
  ])
  return { total, data }
}

async function handleEmail(params: QueryParamsExtended) {
  const where: any = {}
  const createdAt = toDateRange(params.from, params.to)
  if (createdAt) where.createdAt = createdAt
  if (params.status) where.status = params.status
  const [total, data] = await Promise.all([
    prisma.emailLog.count({ where }),
    prisma.emailLog.findMany({ where, orderBy: { createdAt: 'desc' }, ...buildPagination(params) })
  ])
  return { total, data }
}

async function handleNotificacoes(params: QueryParamsExtended) {
  const where: any = {}
  const createdAt = toDateRange(params.from, params.to)
  if (createdAt) where.createdAt = createdAt
  if (params.status) where.status = params.status
  const [total, data] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, ...buildPagination(params) })
  ])
  return { total, data }
}

async function handleSeguranca(params: QueryParamsExtended) {
  const where: any = { module: { in: ['auth', 'security'] } }
  const createdAt = toDateRange(params.from, params.to)
  if (createdAt) where.createdAt = createdAt
  if (params.level) where.level = params.level
  const [total, data] = await Promise.all([
    prisma.systemLog.count({ where }),
    prisma.systemLog.findMany({ where, orderBy: { createdAt: 'desc' }, ...buildPagination(params) })
  ])
  return { total, data }
}

export async function GET(request: NextRequest) {
  const started = Date.now()
  const correlationId = getOrCreateCorrelationId(request)
  let params: QueryParamsExtended
  try {
    const raw: Record<string,string> = {}
    request.nextUrl.searchParams.forEach((v,k)=>{ raw[k]=v })
    const parsed = observabilityQuerySchema.safeParse(raw)
    if (!parsed.success) {
      await structuredLogger.warn('Observability params validation failed', { correlationId, issues: parsed.error.issues })
      return NextResponse.json({ error: 'Parâmetros inválidos', issues: parsed.error.issues }, { status: 400 })
    }
    params = { ...parsed.data, type: parsed.data.type.toLowerCase() }
  } catch (err) {
    await structuredLogger.warn('Observability params parse failed', { correlationId, error: err instanceof Error ? err.message : String(err) })
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Auth required' }, { status: 401 })
    }
    const authRes = await serverCheckPermissionDetailed(session.user.email, 'observability', 'read')
    if (!authRes.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let result
    switch (params.type) {
      case 'sistema': result = await handleSystem(params); break
      case 'auditoria': result = await handleAudit(params); break
      case 'performance': result = await handlePerformance(params); break
      case 'email': result = await handleEmail(params); break
      case 'notificacoes': result = await handleNotificacoes(params); break
      case 'seguranca': result = await handleSeguranca(params); break
      default: return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }

    let summary: any = undefined
    if (params.summary) {
      const since24h = new Date(Date.now() - 24*60*60*1000)
      if (params.type === 'performance') {
  const perfLast24 = await prisma.performanceLog.findMany({ where: { createdAt: { gte: since24h } }, select: { duration: true } })
  const durations = perfLast24.map((p: { duration: number }) => p.duration).sort((a: number,b: number)=>a-b)
        const idx = Math.floor(durations.length*0.95)-1
        summary = { count24h: durations.length, p95DurationMs: durations.length ? durations[Math.max(0,idx)] : 0 }
      } else if (params.type === 'sistema') {
        const [count24h, errors24h] = await Promise.all([
          prisma.systemLog.count({ where: { createdAt: { gte: since24h } } }),
          prisma.systemLog.count({ where: { createdAt: { gte: since24h }, level: { in: ['ERROR','error'] } } })
        ])
        summary = { count24h, errors24h }
      } else if (params.type === 'auditoria') {
        const count24h = await prisma.auditLog.count({ where: { createdAt: { gte: since24h } } })
        summary = { count24h }
      } else if (params.type === 'email') {
        const [count24h, errors24h] = await Promise.all([
          prisma.emailLog.count({ where: { createdAt: { gte: since24h } } }),
          prisma.emailLog.count({ where: { createdAt: { gte: since24h }, status: { in: ['error','failed'] } } }),
        ])
        summary = { count24h, errors24h }
      } else if (params.type === 'notificacoes') {
        const count24h = await prisma.notification.count({ where: { createdAt: { gte: since24h } } })
        summary = { count24h }
      } else if (params.type === 'seguranca') {
        const [count24h, errors24h] = await Promise.all([
          prisma.systemLog.count({ where: { module: { in: ['auth','security'] }, createdAt: { gte: since24h } } }),
          prisma.systemLog.count({ where: { module: { in: ['auth','security'] }, createdAt: { gte: since24h }, level: { in: ['ERROR','error'] } } }),
        ])
        summary = { count24h, errors24h }
      }
    }

    if (params.export) {
      const currentPageData = result.data
      if (params.export === 'json') {
        return NextResponse.json({ type: params.type, total: result.total, page: params.page, pageSize: params.pageSize, data: currentPageData, summary, exportedPageOnly: true, correlationId })
      }
      const csv = buildCSV(currentPageData)
      return new NextResponse(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="observability-${params.type}.csv"`, 'x-correlation-id': correlationId } })
    }

    const elapsedMs = Date.now() - started
    return NextResponse.json({ type: params.type, page: params.page, pageSize: params.pageSize, total: result.total, data: result.data, elapsedMs, summary, correlationId })
  } catch (error) {
    await structuredLogger.error('Observability endpoint failed', { correlationId, error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
