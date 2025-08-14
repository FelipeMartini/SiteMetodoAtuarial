import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const config = { widgets: [], refreshInterval: 60 }
		return NextResponse.json({ config })
	} catch (err) {
		console.error('GET /api/admin/dashboard/config error', err)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

