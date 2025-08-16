import { NextResponse } from 'next/server'
import { auditLogger } from '@/lib/audit/auditLogger'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)
    const exportFormat = url.searchParams.get('export') // 'csv' | 'json' | null

    const filters: Record<string, unknown> = {}
    if (url.searchParams.get('subject')) filters.subject = url.searchParams.get('subject')
    if (url.searchParams.get('object')) filters.object = url.searchParams.get('object')
    if (url.searchParams.get('action')) filters.action = url.searchParams.get('action')
    if (url.searchParams.get('allowed')) filters.allowed = url.searchParams.get('allowed')
    if (url.searchParams.get('startDate')) filters.startDate = url.searchParams.get('startDate')
    if (url.searchParams.get('endDate')) filters.endDate = url.searchParams.get('endDate')

    const pagination = { page, limit }

    if (exportFormat === 'csv') {
      // Export CSV
      const logs = await auditLogger.getAuditLogs(filters, { page: 1, limit: 10000 }) // All records for export
      const csvHeaders = 'ID,Subject,Object,Action,Allowed,IP,UserAgent,Timestamp,User Email\n'
      const csvRows = (Array.isArray(logs) ? logs : logs?.logs || []).map((log: any) => 
        `"${log.id}","${log.subject || ''}","${log.object || ''}","${log.action || ''}","${log.allowed ? 'Sim' : 'Não'}","${log.ip || ''}","${log.userAgent || ''}","${log.timestamp}","${log.user?.email || ''}"`
      ).join('\n')
      
      const csvContent = csvHeaders + csvRows
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else if (exportFormat === 'json') {
      // Export JSON
      const logs = await auditLogger.getAuditLogs(filters, { page: 1, limit: 10000 })
      const exportData = {
        exportDate: new Date().toISOString(),
        filters,
        logs: Array.isArray(logs) ? logs : logs?.logs || []
      }
      
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

    // Normal pagination response
    const logs = await auditLogger.getAuditLogs(filters, pagination)
    const stats = await auditLogger.getAuditStats()

    return NextResponse.json({ logs, pagination: { ...pagination, total: (logs as any).total || 0 }, stats })
  } catch (_err) {
    console.error('GET /api/admin/audit-logs error', _err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

