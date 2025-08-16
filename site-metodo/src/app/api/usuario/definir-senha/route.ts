import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'

type Body = { senha?: unknown }

/**
 * Endpoint para definir/atualizar senha do usuário logado (social ou tradicional)
 * Só permite definir senha se o usuário estiver autenticado
 */
export async function POST(request: NextRequest) {
  try {
    // Recupera sessão do Auth.js puro via cookie
    const sessionToken = request.cookies.get('authjs.session-token')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Usuário não autenticado (cookie ausente).' }, { status: 401 })
    }

    // Busca sessão pelo token
    const sessao = await prisma.session.findUnique({ where: { sessionToken } })
    if (!sessao) {
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 })
    }

    // Busca usuário logado pela sessão
    const usuario = await prisma.user.findUnique({ where: { id: sessao.userId } })
    if (!usuario || !usuario.email) {
      return NextResponse.json({ error: 'Usuário não encontrado para a sessão.' }, { status: 401 })
    }

    const body = (await request.json()) as Body
    const senha = typeof body.senha === 'string' ? body.senha.trim() : undefined
    if (!senha || senha.length < 6) {
      return NextResponse.json({ error: 'Senha inválida. Deve ter pelo menos 6 caracteres.' }, { status: 400 })
    }

    const hash = await bcryptjs.hash(senha, 10)
    await prisma.user.update({ where: { id: usuario.id }, data: { password: hash } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    // Log mínimo para ajudar a debugar em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') console.error('definir-senha error:', error)
    return NextResponse.json({ error: 'Erro ao definir senha.' }, { status: 500 })
  }
}

// Comentário: Este endpoint permite que usuários sociais criem uma senha para login tradicional. Utiliza autenticação de sessão e atualiza o campo password no banco de dados.
