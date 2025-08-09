import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/@auth/authApi'
import { prisma } from '@/src/lib/prisma'
import { usuarioSchema, usuarioUpdateSchema } from '@/src/validators/usuarioSchemas'
import { checkRole } from '@/src/utils/rbac'
import { rateLimit } from '@/src/utils/rateLimit'
import { withCors, withSecurityHeaders } from '@/src/utils/security'

// GET: Lista todos os usuários (apenas admin)
export async function GET(req: NextRequest) {
  await rateLimit(req)
  const session = await getServerSession(authOptions)
  if (!session || !checkRole(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const usuarios = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } })
  return withCors(withSecurityHeaders(NextResponse.json(usuarios)))
}

// POST: Cria novo usuário (apenas admin)
export async function POST(req: NextRequest) {
  await rateLimit(req)
  const session = await getServerSession(authOptions)
  if (!session || !checkRole(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await req.json()
  const parse = usuarioSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parse.error.errors }, { status: 400 })
  }
  const user = await prisma.user.create({ data: parse.data })
  // logAdminAction(session.user, 'create', user)
  return withCors(withSecurityHeaders(NextResponse.json(user, { status: 201 })))
}

// PUT: Atualiza usuário (apenas admin)
export async function PUT(req: NextRequest) {
  await rateLimit(req)
  const session = await getServerSession(authOptions)
  if (!session || !checkRole(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await req.json()
  const parse = usuarioUpdateSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parse.error.errors }, { status: 400 })
  }
  const user = await prisma.user.update({ where: { id: parse.data.id }, data: parse.data })
  // logAdminAction(session.user, 'update', user)
  return withCors(withSecurityHeaders(NextResponse.json(user)))
}

// DELETE: Remove usuário (apenas admin)
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
  const user = await prisma.user.delete({ where: { id } })
  // logAdminAction(session.user, 'delete', user)
  return withCors(withSecurityHeaders(NextResponse.json({ success: true })))
}
