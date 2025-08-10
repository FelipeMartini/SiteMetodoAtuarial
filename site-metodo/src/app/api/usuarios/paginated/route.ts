import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/prisma'

// GET /api/usuarios/paginated?page=0&pageSize=10&search=abc
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  // TODO: validar role admin ou permissões específicas
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') || '0', 10)
  const pageSize = Math.min(parseInt(url.searchParams.get('pageSize') || '10', 10), 100)
  const search = url.searchParams.get('search')?.trim()

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : undefined

  const [total, usuarios] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      skip: page * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, accessLevel: true, isActive: true, createdAt: true },
    }),
  ])

  return NextResponse.json({ total, page, pageSize, data: usuarios })
}
