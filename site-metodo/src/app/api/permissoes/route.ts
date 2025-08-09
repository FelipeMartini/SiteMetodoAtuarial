import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/@auth/authApi'
import { prisma } from '@/src/lib/prisma'
import { permissaoSchema } from '@/src/validators/permissaoSchemas'
import { checkRole } from '@/src/utils/rbac'
import { rateLimit } from '@/src/utils/rateLimit'
import { withCors, withSecurityHeaders } from '@/src/utils/security'

// GET: Lista todas as permissões (admin/moderador)
export async function GET(req: NextRequest) {
  await rateLimit(req)
  const session = await getServerSession(authOptions)
  if (!session || !checkRole(session.user, ['admin', 'moderador'])) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const permissoes = await prisma.role.findMany()
  return withCors(withSecurityHeaders(NextResponse.json(permissoes)))
}

// POST: Cria nova permissão (apenas admin)
export async function POST(req: NextRequest) {
  await rateLimit(req)
  const session = await getServerSession(authOptions)
  if (!session || !checkRole(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await req.json()
  const parse = permissaoSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parse.error.errors }, { status: 400 })
  }
  const permissao = await prisma.role.create({ data: parse.data })
  // logAdminAction(session.user, 'create', permissao)
  return withCors(withSecurityHeaders(NextResponse.json(permissao, { status: 201 })))
}

// PUT: Atualiza permissão (apenas admin)
export async function PUT(req: NextRequest) {
  await rateLimit(req)
  const session = await getServerSession(authOptions)
  if (!session || !checkRole(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await req.json()
  const parse = permissaoSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parse.error.errors }, { status: 400 })
  }
  const permissao = await prisma.role.update({ where: { id: parse.data.id }, data: parse.data })
  // logAdminAction(session.user, 'update', permissao)
  return withCors(withSecurityHeaders(NextResponse.json(permissao)))
}

// DELETE: Remove permissão (apenas admin)
export async function DELETE(req: NextRequest) {
  await rateLimit(req)
  const session = await getServerSession(authOptions)
  if (!session || !checkRole(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
  }
  const permissao = await prisma.role.delete({ where: { id } })
  // logAdminAction(session.user, 'delete', permissao)
  return withCors(withSecurityHeaders(NextResponse.json({ success: true })))
}
