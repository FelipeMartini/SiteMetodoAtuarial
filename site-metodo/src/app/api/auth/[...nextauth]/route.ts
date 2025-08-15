import { handlers } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Envolver os handlers padrão para registrar requests e facilitar debug
export async function GET(request: NextRequest) {
	try {
		console.log('[auth-route] GET', { url: request.url, method: 'GET', query: request.nextUrl.searchParams.toString() })
	} catch (err) {
		console.log('[auth-route] GET failed to parse url', String(err))
	}
	return handlers.GET(request as any)
}

export async function POST(request: NextRequest) {
	try {
		console.log('[auth-route] POST', { url: request.url, method: 'POST' })
	} catch (err) {
		console.log('[auth-route] POST failed to parse url', String(err))
	}
	return handlers.POST(request as any)
}
