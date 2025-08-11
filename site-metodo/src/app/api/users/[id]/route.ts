/**
 * API para gerenciamento de usuário específico - Versão Completa
 */
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// PUT - Atualizar usuário específico (apenas para admins)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const currentUser = await db.user.findUnique({
      where: { id: sessao.userId },
      select: { accessLevel: true },
    })
    if (!currentUser || currentUser.accessLevel < 4) {
      return NextResponse.json(
        { message: 'Acesso negado - Apenas administradores' },
        { status: 403 }
      )
    }

    const userId = params.id
    const body = await request.json()
    const { name, email, accessLevel, isActive, newPassword } = body

    // Validações
    if (!name || !email) {
      return NextResponse.json({ message: 'Nome e email são obrigatórios' }, { status: 400 })
    }

    if (accessLevel < 1 || accessLevel > 5) {
      return NextResponse.json({ message: 'Nível de acesso inválido (1-5)' }, { status: 400 })
    }

    // Verificar se o usuário existe
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    // Verificar se email já está em uso por outro usuário
    const emailInUse = await db.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    })

    if (emailInUse) {
      return NextResponse.json({ message: 'Email já está em uso' }, { status: 400 })
    }

    // Preparar dados para atualização
    const updateData: Record<string, string | number | boolean | Date> = {
      name,
      email,
      accessLevel: parseInt(accessLevel),
      isActive: isActive !== false,
      updatedAt: new Date(),
    }

    // Se nova senha foi fornecida, adicionar ao update
    if (newPassword && newPassword.trim() !== '') {
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    // Atualizar usuário
    const updatedUser = await db.user.update({
      where: { id: userId },
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
  } catch (_error) {
    console.error('Erro ao atualizar usuário:', String(error))
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Excluir usuário específico (apenas para admins)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    const currentUser = await db.user.findUnique({
      where: { id: sessao.userId },
      select: { accessLevel: true },
    })
    if (!currentUser || currentUser.accessLevel < 4) {
      return NextResponse.json(
        { message: 'Acesso negado - Apenas administradores' },
        { status: 403 }
      )
    }
    const userId = params.id
    // Não permitir que o usuário exclua a si mesmo
    if (userId === sessao.userId) {
      return NextResponse.json(
        { message: 'Não é possível excluir sua própria conta' },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    // Excluir usuário
    await db.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ message: 'Usuário excluído com sucesso' })
  } catch (_error) {
    console.error('Erro ao excluir usuário:', String(error))
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
