import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
// import { db as prisma } from '@/lib/prisma' // Ainda não utilizado (futuro CRUD real)
// TODO: implementar permissaoSchema e checkRole compatíveis com schema atual
// Placeholders temporários para evitar erro de import inexistente
interface ParseResult { success: boolean; error?: { issues: unknown[] } }
// Placeholders intencionais até implementação real
const permissaoSchema = { safeParse: (_data?: unknown): ParseResult => { void _data; return { success: false, error: { issues: [] } } } }
function checkRole(user: { role?: string }, roles: string | string[]): boolean {
  if (!user?.role) return false
  if (Array.isArray(roles)) return roles.includes(user.role)
  return user.role === roles
}
import { rateLimit } from '@/utils/rateLimit'
import { withCors, withSecurityHeaders } from '@/utils/security'

// GET: Lista todas as permissões (admin/moderador)
export async function GET(req: NextRequest) {
  await rateLimit(req)
  const session = await auth()
  if (!session || !checkRole(session.user, ['admin', 'moderador'])) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  // Not implemented: retornar lista de permissões baseada em accessLevel ou outra estrutura
  return withCors(withSecurityHeaders(NextResponse.json([])))
}

// POST: Cria nova permissão (apenas admin)
export async function POST(req: NextRequest) {
  await rateLimit(req)
  const session = await auth()
  if (!session || !checkRole(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await req.json()
  const parse = permissaoSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parse.error?.issues ?? [] }, { status: 400 })
  }
  return withCors(withSecurityHeaders(NextResponse.json({ message: 'Não implementado' }, { status: 501 })))
}

// PUT: Atualiza permissão (apenas admin)
export async function PUT(req: NextRequest) {
  await rateLimit(req)
  const session = await auth()
  if (!session || !checkRole(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await req.json()
  const parse = permissaoSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parse.error?.issues ?? [] }, { status: 400 })
  }
  return withCors(withSecurityHeaders(NextResponse.json({ message: 'Não implementado' }, { status: 501 })))
}

// DELETE: Remove permissão (apenas admin)
export async function DELETE(req: NextRequest) {
  await rateLimit(req)
  const session = await auth()
  if (!session || !checkRole(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
  }
  return withCors(withSecurityHeaders(NextResponse.json({ message: 'Não implementado' }, { status: 501 })))
}
