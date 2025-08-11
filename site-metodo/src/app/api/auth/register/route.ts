import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
// Reutiliza prisma singleton definido em src/auth.ts para evitar múltiplas conexões
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Prisma já centralizado em '@/lib/auth'

// Schema de validação de entrada
const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

// Handler POST para criação de usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Dados de entrada inválidos', errors: result.error.issues },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'Usuário com este email já existe' }, { status: 400 })
    }

    const hashedPassword = await bcryptjs.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        accessLevel: 1,
        isActive: true,
        lastLogin: new Date(),
      },
    })

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
      { message: 'Usuário criado com sucesso', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (_error) {
    console.error('Erro de registro:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
