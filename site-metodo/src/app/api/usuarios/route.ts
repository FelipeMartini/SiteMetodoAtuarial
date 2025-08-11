import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db as prisma } from '@/lib/prisma'
import { UserRoleType } from '@prisma/client'
import { usuarioSchema, usuarioUpdateSchema } from '@/validators/usuarioSchemas'
// Removido import do RBAC - usando ABAC puro
import { rateLimit } from '@/utils/rateLimit'
import { withCors, withSecurityHeaders } from '@/utils/security'

/**
 * Verificação ABAC simplificada para APIs
 */
function checkABACAccess(user: any, resource: string): boolean {
  if (!user?.isActive) return false
  
  if (resource === 'admin') {
    return user.email?.includes('@admin') || user.name?.includes('Admin') || user.id === 'admin-user'
  }
  
  if (resource === 'moderation') {
    return user.email?.includes('@mod') || user.name?.includes('Mod') || user.email?.includes('@admin')
  }
  
  return false
}

// GET: Lista todos os usuários (apenas admin)
export async function GET(req: NextRequest) {
  await rateLimit(req)
  const session = await auth()
  if (!session || !session.user || !checkABACAccess(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const usuarios = await prisma.user.findMany({ select: { id: true, name: true, email: true, isActive: true, createdAt: true } })
  return withCors(withSecurityHeaders(NextResponse.json(usuarios)))
}

// POST: Cria novo usuário (apenas admin)
export async function POST(req: NextRequest) {
  await rateLimit(req)
  const session = await auth()
  if (!session || !session.user || !checkABACAccess(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await req.json()
  const parse = usuarioSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parse.error.issues }, { status: 400 })
  }
  const user = await prisma.user.create({ 
    data: {
      ...parse.data,
      roleType: parse.data.roleType as UserRoleType // Cast para UserRoleType enum
    }
  })
  // logAdminAction(session.user, 'create', user)
  return withCors(withSecurityHeaders(NextResponse.json(user, { status: 201 })))
}

// PUT: Atualiza usuário (apenas admin)
export async function PUT(req: NextRequest) {
  await rateLimit(req)
  const session = await auth()
  if (!session || !session.user || !checkABACAccess(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const body = await req.json()
  const parse = usuarioUpdateSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parse.error.issues }, { status: 400 })
  }
  const user = await prisma.user.update({ 
    where: { id: parse.data.id }, 
    data: {
      ...parse.data,
      roleType: parse.data.roleType as UserRoleType // Cast para UserRoleType enum
    }
  })
  // logAdminAction(session.user, 'update', user)
  return withCors(withSecurityHeaders(NextResponse.json(user)))
}

// DELETE: Remove usuário (apenas admin)
export async function DELETE(req: NextRequest) {
  await rateLimit(req)
  const session = await auth()
  if (!session || !session.user || !checkABACAccess(session.user, 'admin')) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
  }
  await prisma.user.delete({ where: { id } })
  // logAdminAction(session.user, 'delete', user)
  return withCors(withSecurityHeaders(NextResponse.json({ success: true })))
}
