import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { db } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Valida dados da requisição
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Dados de entrada inválidos', errors: result.error.issues },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    // Verifica se o usuário já existe
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Usuário com este email já existe' }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await bcryptjs.hash(password, 12)

    // Cria o usuário
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        accessLevel: 1, // Sempre nível 1 por padrão
        isActive: true,
        lastLogin: new Date(),
        emailVerified: null, // Sempre null no registro tradicional
      },
    })

    // Remove a senha da resposta do objeto antes de retornar
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      accessLevel: user.accessLevel,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      image: user.image,
      emailVerified: user.emailVerified,
    }

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (_error) {
    console.error('Erro de registro:', String(_error))
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
