
import { NextRequest, NextResponse } from 'next/server'
import { usuarioSchema } from './schemas'
import { rateLimit } from '../../../../lib/rateLimit'

// Simulação de autenticação forte e RBAC
function requireAuth(req: NextRequest) {
  // Exemplo: checa header Authorization (substitua por Auth.js v5 real)
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  // Simula usuário admin
  return { id: 1, nome: 'Felipe', role: 'admin' }
}

function requireRole(user: any, role: string) {
  return user && user.role === role
}

// CORS e headers de segurança
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

// Simulação de dados
const usuarios = [
  { id: 1, nome: 'Felipe', email: 'felipe@email.com', role: 'admin' },
  { id: 2, nome: 'Ana', email: 'ana@email.com', role: 'editor' },
]

export async function OPTIONS() {
  // Preflight CORS
  return withSecurityHeaders(NextResponse.json({ ok: true }))
}

export async function GET(req: NextRequest) {
  // Rate limit
  await rateLimit(req, 'usuarios-get')
  const user = requireAuth(req)
  if (!user) return withSecurityHeaders(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
  if (!requireRole(user, 'admin')) return withSecurityHeaders(NextResponse.json({ error: 'Sem permissão' }, { status: 403 }))
  return withSecurityHeaders(NextResponse.json(usuarios))
}

export async function POST(req: NextRequest) {
  await rateLimit(req, 'usuarios-post')
  const user = requireAuth(req)
  if (!user) return withSecurityHeaders(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
  if (!requireRole(user, 'admin')) return withSecurityHeaders(NextResponse.json({ error: 'Sem permissão' }, { status: 403 }))
  const body = await req.json()
  const parse = usuarioSchema.safeParse(body)
  if (!parse.success) return withSecurityHeaders(NextResponse.json({ error: parse.error.flatten() }, { status: 400 }))
  const novo = { ...parse.data, id: usuarios.length + 1 }
  usuarios.push(novo)
  return withSecurityHeaders(NextResponse.json(novo, { status: 201 }))
}

export async function PUT(req: NextRequest) {
  await rateLimit(req, 'usuarios-put')
  const user = requireAuth(req)
  if (!user) return withSecurityHeaders(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
  if (!requireRole(user, 'admin')) return withSecurityHeaders(NextResponse.json({ error: 'Sem permissão' }, { status: 403 }))
  const body = await req.json()
  const parse = usuarioSchema.safeParse(body)
  if (!parse.success) return withSecurityHeaders(NextResponse.json({ error: parse.error.flatten() }, { status: 400 }))
  const idx = usuarios.findIndex(u => u.id === body.id)
  if (idx === -1) return withSecurityHeaders(NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 }))
  usuarios[idx] = { ...usuarios[idx], ...parse.data }
  return withSecurityHeaders(NextResponse.json(usuarios[idx]))
}

export async function DELETE(req: NextRequest) {
  await rateLimit(req, 'usuarios-delete')
  const user = requireAuth(req)
  if (!user) return withSecurityHeaders(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
  if (!requireRole(user, 'admin')) return withSecurityHeaders(NextResponse.json({ error: 'Sem permissão' }, { status: 403 }))
  const { id } = await req.json()
  const idx = usuarios.findIndex(u => u.id === id)
  if (idx === -1) return withSecurityHeaders(NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 }))
  const removido = usuarios.splice(idx, 1)[0]
  return withSecurityHeaders(NextResponse.json(removido))
}
