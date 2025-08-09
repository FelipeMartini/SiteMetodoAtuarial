import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
// import { db as prisma } from '@/lib/prisma' // Futuro CRUD real
// TODO: implementar permissaoSchema real (usando zod) alinhado ao modelo de permissões
// Placeholder mínimo enquanto schema não definido
interface ParseResult { success: boolean; error?: { issues: unknown[] } }
// Placeholder: aceita qualquer payload como válido até definição real
const permissaoSchema = { safeParse: (_data: unknown): ParseResult => ({ success: true }) }
import { checkRole } from '@/utils/rbac'
import { rateLimit } from '@/utils/rateLimit'
import { withCors, withSecurityHeaders } from '@/utils/security'

// GET: Lista todas as permissões (admin/moderador)
export async function GET(req: NextRequest) {
  await rateLimit(req)
  const session = await auth()
  // Aceita roles admin ou moderador
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
