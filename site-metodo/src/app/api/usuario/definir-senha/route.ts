import { NextRequest, NextResponse } from 'next/server'

// ...
import { prisma } from '../../../../../prisma/client'
import bcryptjs from 'bcryptjs'

/**
 * Endpoint para definir/atualizar senha do usuário logado (social ou tradicional)
 * Só permite definir senha se o usuário estiver autenticado
 */
export async function POST(request: NextRequest) {
  try {
    // Recupera sessão do Auth.js puro via cookie
    const sessionToken = request.cookies.get('authjs.session-token')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 })
    }
    // Busca sessão pelo token
    const sessao = await prisma.session.findUnique({ where: { sessionToken } })
    if (!sessao) {
      return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 })
    }
    // Busca usuário logado pela sessão
    const usuario = await prisma.user.findUnique({ where: { id: sessao.userId } })
    if (!usuario || !usuario.email) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 })
    }
    const { senha } = await request.json()
    if (!senha || senha.length < 6) {
      return NextResponse.json({ error: 'Senha inválida.' }, { status: 400 })
    }
    const hash = await bcryptjs.hash(senha, 10)
    await prisma.user.update({
      where: { email: usuario.email },
      data: { password: hash },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao definir senha.' }, { status: 500 })
  }
}

// Comentário: Este endpoint permite que usuários sociais criem uma senha para login tradicional. Utiliza autenticação de sessão e atualiza o campo password no banco de dados.
