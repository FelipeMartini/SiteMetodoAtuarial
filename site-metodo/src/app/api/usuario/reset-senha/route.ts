import { NextRequest, NextResponse } from 'next/server'
import { checkApiAuthorization } from '@/lib/auth/apiAuth'
import { db } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import { UserRoleType } from '@prisma/client'

// API para resetar senha de usuário (apenas admin)
export async function POST(req: NextRequest) {
  const authorizedUser = await checkApiAuthorization(UserRoleType.ADMIN)

  if (!authorizedUser) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 })
  }

  try {
    const { userId, newPassword } = await req.json()

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: 'ID do usuário e nova senha são obrigatórios.' },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const hashedPassword = await bcryptjs.hash(newPassword, 12)

    // Atualizar senha do usuário
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: 'Senha resetada com sucesso.' })
  } catch {
    console.error('Erro ao resetar senha:', "Unknown error")
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
