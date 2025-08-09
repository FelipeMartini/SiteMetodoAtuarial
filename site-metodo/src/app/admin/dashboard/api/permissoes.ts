
import { NextRequest, NextResponse } from 'next/server'
import { permissaoSchema } from './schemas'
import { rateLimit } from '../../../../lib/rateLimit'

function requireAuth(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  return { id: 1, nome: 'Felipe', role: 'admin' }
}

function requireRole(user: any, role: string) {
  return user && user.role === role
}

function withSecurityHeaders(res: NextResponse) {
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'geolocation=()')
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  return res
}

const permissoes = [
  { id: 1, nome: 'admin', descricao: 'Administrador' },
  { id: 2, nome: 'editor', descricao: 'Editor de conteúdo' },
  { id: 3, nome: 'viewer', descricao: 'Visualizador' },
  { id: 4, nome: 'financeiro', descricao: 'Financeiro' },
  { id: 5, nome: 'suporte', descricao: 'Suporte' },
  { id: 6, nome: 'dev', descricao: 'Desenvolvedor' },
  { id: 7, nome: 'rh', descricao: 'Recursos Humanos' },
  { id: 8, nome: 'marketing', descricao: 'Marketing' },
]

export async function OPTIONS() {
  return withSecurityHeaders(NextResponse.json({ ok: true }))
}

export async function GET(req: NextRequest) {
  await rateLimit(req, 'permissoes-get')
  const user = requireAuth(req)
  if (!user) return withSecurityHeaders(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
  if (!requireRole(user, 'admin')) return withSecurityHeaders(NextResponse.json({ error: 'Sem permissão' }, { status: 403 }))
  return withSecurityHeaders(NextResponse.json(permissoes))
}

export async function POST(req: NextRequest) {
  await rateLimit(req, 'permissoes-post')
  const user = requireAuth(req)
  if (!user) return withSecurityHeaders(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
  if (!requireRole(user, 'admin')) return withSecurityHeaders(NextResponse.json({ error: 'Sem permissão' }, { status: 403 }))
  const body = await req.json()
  const parse = permissaoSchema.safeParse(body)
  if (!parse.success) return withSecurityHeaders(NextResponse.json({ error: parse.error.flatten() }, { status: 400 }))
  const nova = { ...parse.data, id: permissoes.length + 1 }
  if (!nova.descricao) nova.descricao = 'Sem descrição'
  permissoes.push(nova)
  return withSecurityHeaders(NextResponse.json(nova, { status: 201 }))
}

export async function PUT(req: NextRequest) {
  await rateLimit(req, 'permissoes-put')
  const user = requireAuth(req)
  if (!user) return withSecurityHeaders(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
  if (!requireRole(user, 'admin')) return withSecurityHeaders(NextResponse.json({ error: 'Sem permissão' }, { status: 403 }))
  const body = await req.json()
  const parse = permissaoSchema.safeParse(body)
  if (!parse.success) return withSecurityHeaders(NextResponse.json({ error: parse.error.flatten() }, { status: 400 }))
  const idx = permissoes.findIndex(p => p.id === body.id)
  if (idx === -1) return withSecurityHeaders(NextResponse.json({ error: 'Permissão não encontrada' }, { status: 404 }))
  permissoes[idx] = { ...permissoes[idx], ...parse.data }
  return withSecurityHeaders(NextResponse.json(permissoes[idx]))
}

export async function DELETE(req: NextRequest) {
  await rateLimit(req, 'permissoes-delete')
  const user = requireAuth(req)
  if (!user) return withSecurityHeaders(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
  if (!requireRole(user, 'admin')) return withSecurityHeaders(NextResponse.json({ error: 'Sem permissão' }, { status: 403 }))
  const { id } = await req.json()
  const idx = permissoes.findIndex(p => p.id === id)
  if (idx === -1) return withSecurityHeaders(NextResponse.json({ error: 'Permissão não encontrada' }, { status: 404 }))
  const removida = permissoes.splice(idx, 1)[0]
  return withSecurityHeaders(NextResponse.json(removida))
}
