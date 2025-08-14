import { NextResponse } from 'next/server'
import { auditLogger } from '@/lib/audit/auditLogger'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)

    const filters: Record<string, unknown> = {}
    if (url.searchParams.get('subject')) filters.subject = url.searchParams.get('subject')
    if (url.searchParams.get('object')) filters.object = url.searchParams.get('object')
    if (url.searchParams.get('action')) filters.action = url.searchParams.get('action')
    if (url.searchParams.get('allowed')) filters.allowed = url.searchParams.get('allowed')
    if (url.searchParams.get('startDate')) filters.startDate = url.searchParams.get('startDate')
    if (url.searchParams.get('endDate')) filters.endDate = url.searchParams.get('endDate')

    const pagination = { page, limit }

    const logs = await auditLogger.getAuditLogs(filters, pagination)
    const stats = await auditLogger.getAuditStats()

    return NextResponse.json({ logs, pagination: { ...pagination, total: (logs as any).total || 0 }, stats })
  } catch (err) {
    console.error('GET /api/admin/audit-logs error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

