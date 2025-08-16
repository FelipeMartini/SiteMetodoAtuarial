import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  // Autenticação mínima: valida session via helper `auth()` (server-side)
  const session = await auth()
  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? '1')
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '25'), 200)

  const skip = (page - 1) * limit

  // Consulta simples agregada de logs (não modifica dados)
  const [items, total] = await Promise.all([
    prisma.systemLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit, skip }),
    prisma.systemLog.count(),
  ])

  return NextResponse.json({ items, total, page, limit })
}
