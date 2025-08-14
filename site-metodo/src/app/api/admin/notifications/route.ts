import { NextResponse } from 'next/server'
import { notificationService } from '@/lib/notifications/notification-service'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '20', 10)

    // Para admin: retornar estatísticas gerais ou lista filtrada
    const data = await notificationService.getStats(undefined)

    return NextResponse.json({ notifications: [], stats: data, pagination: { page, limit, total: 0 } })
  } catch (err) {
    console.error('GET /api/admin/notifications error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

