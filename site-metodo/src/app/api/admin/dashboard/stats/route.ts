import { NextResponse } from 'next/server'
import { auditLogger } from '@/lib/audit/auditLogger'

export async function GET() {
	try {
		const stats = await auditLogger.getAuditStats()
		return NextResponse.json({ stats })
	} catch (err) {
		console.error('GET /api/admin/dashboard/stats error', err)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

