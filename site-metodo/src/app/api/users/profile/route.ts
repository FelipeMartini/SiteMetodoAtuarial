/**
 * API para gerenciamento do perfil do usuário logado - Versão Completa
 */
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// PATCH - Atualizar perfil do usuário logado
export async function PATCH(request: NextRequest) {
  try {
    // Recupera sessão do Auth.js puro via cookie
    const sessionToken = request.cookies.get('authjs.session-token')?.value
    if (!sessionToken) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }
    // Busca sessão pelo token
    const sessao = await db.session.findUnique({ where: { sessionToken } })
    if (!sessao) {
      return NextResponse.json({ message: 'Sessão inválida' }, { status: 401 })
    }
    // Busca usuário logado pela sessão
    const usuarioLogado = await db.user.findUnique({ where: { id: sessao.userId } })
    if (!usuarioLogado) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { name, email, newPassword } = body

    // Validações
    if (!name || !email) {
      return NextResponse.json({ message: 'Nome e email são obrigatórios' }, { status: 400 })
    }

    // Verificar se email já está em uso por outro usuário
    const emailInUse = await db.user.findFirst({
      where: {
        email,
        NOT: { id: usuarioLogado.id },
      },
    })

    if (emailInUse) {
      return NextResponse.json({ message: 'Email já está em uso' }, { status: 400 })
    }

    // Preparar dados para atualização
    const updateData: Record<string, string | Date> & { password?: string } = {
      name,
      email,
      updatedAt: new Date(),
    }

    // Se nova senha foi fornecida, adicionar ao update
    if (newPassword && newPassword.trim() !== '') {
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    // Atualizar usuário
    const updatedUser = await db.user.update({
      where: { id: usuarioLogado.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        accessLevel: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch {
    console.error('Erro ao atualizar perfil:', "Unknown error")
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
