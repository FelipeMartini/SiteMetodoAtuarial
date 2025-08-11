import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '../../../../lib/rateLimit'

function requireAuth(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  return { id: 1, nome: 'Felipe', role: 'admin' }
}

interface UsuarioAutenticado {
  id: number
  nome: string
  role: string
}
function requireRole(user: UsuarioAutenticado | null, role: string) {
  return !!user && user.role === role
}

function withSecurityHeaders(res: NextResponse) {
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'geolocation=()')
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  return res
}

export async function OPTIONS() {
  return withSecurityHeaders(NextResponse.json({ ok: true }))
}

export async function GET(req: NextRequest) {
  await rateLimit(req, 'atividades-get')
  const user = requireAuth(req)
  if (!user)
    return withSecurityHeaders(NextResponse.json({ error: 'Não autenticado' }, { status: 401 }))
  if (!requireRole(user, 'admin'))
    return withSecurityHeaders(NextResponse.json({ error: 'Sem permissão' }, { status: 403 }))
  const atividades = [
    { usuario: 'Felipe', acao: 'Criou um usuário', data: '09/08/2025 10:12' },
    { usuario: 'Ana', acao: 'Atualizou permissões', data: '09/08/2025 09:55' },
    { usuario: 'Carlos', acao: 'Removeu um acesso', data: '08/08/2025 18:40' },
  ]
  return withSecurityHeaders(NextResponse.json(atividades))
}
