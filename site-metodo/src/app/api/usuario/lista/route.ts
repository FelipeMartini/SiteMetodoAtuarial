import { NextResponse } from 'next/server'
import { checkApiAuthorization } from '@/lib/auth/apiAuth'
import { db } from '@/lib/prisma'
import { UserRoleType } from '@prisma/client'

// API para listar todos os usuários (apenas admin/moderator)
export async function GET() {
  const authorizedUser = await checkApiAuthorization(UserRoleType.MODERATOR)

  if (!authorizedUser) {
    return NextResponse.json(
      { error: 'Acesso negado. Apenas moderadores e administradores.' },
      { status: 403 }
    )
  }

  try {
    // Lista todos usuários
    const usuarios = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roleType: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ usuarios })
  } catch (_error) {
    console.error('Erro ao listar usuários:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
