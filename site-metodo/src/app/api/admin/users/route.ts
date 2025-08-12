import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/../auth'
import { prisma } from '@/lib/prisma'
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar permissões ABAC para listar usuários
    const hasPermission = await checkABACPermission(
      `user:${session.user.id}`,
      'admin:users',
      'read',
      {
        time: new Date().toISOString(),
        location: session.user.location || 'unknown',
        department: session.user.department || 'unknown'
      }
    )

    if (!hasPermission.allowed) {
      return NextResponse.json(
        { error: 'Acesso negado pelo sistema ABAC' },
        { status: 403 }
      )
    }

    // Buscar usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        department: true,
        location: true,
        loginCount: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [
        { isActive: 'desc' },
        { lastLoginAt: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({
      users,
      total: users.length,
      message: 'Usuários carregados com sucesso'
    })

  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}