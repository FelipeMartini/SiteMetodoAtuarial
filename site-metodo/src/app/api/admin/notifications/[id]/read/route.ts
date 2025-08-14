import { NextResponse } from 'next/server'
import { notificationService } from '../../../../../../lib/notifications/notification-service'

export async function POST(req: Request, { params }: { params: { id: string } }) {
	try {
		const id = params.id
		const success = await notificationService.markAsRead(id, 'system')
		return NextResponse.json({ success })
	} catch (err) {
		console.error('POST /api/admin/notifications/[id]/read error', err)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

