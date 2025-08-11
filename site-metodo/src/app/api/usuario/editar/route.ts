import { NextRequest, NextResponse } from 'next/server'
import { checkApiAuthorization } from '@/lib/auth/apiAuth'
import { db } from '@/lib/prisma'
import { UserRoleType } from '@prisma/client'

// API para editar dados do usuário (apenas admin/moderator)
export async function POST(req: NextRequest) {
  // Verificar autorização
  const authorizedUser = await checkApiAuthorization(UserRoleType.MODERATOR)

  if (!authorizedUser) {
    return NextResponse.json(
      { error: 'Acesso negado. Apenas administradores e staff.' },
      { status: 403 }
    )
  }

  try {
    const { id, campo, valor } = await req.json()

    // Permite editar apenas campos seguros
    const camposPermitidos = ['name', 'email', 'accessLevel', 'isActive', 'image']
    if (!camposPermitidos.includes(campo)) {
      return NextResponse.json({ error: 'Campo não permitido.' }, { status: 400 })
    }

    // Apenas admin pode alterar accessLevel
    if (campo === 'accessLevel' && !authorizedUser.role.includes('admin')) {
      return NextResponse.json(
        { error: 'Apenas administradores podem alterar nível de acesso.' },
        { status: 403 }
      )
    }

    await db.user.update({
      where: { id },
      data: { [campo]: valor },
    })

    return NextResponse.json({ success: true })
  } catch (_error) {
    console.error('Erro ao editar usuário:', String(_error))
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
