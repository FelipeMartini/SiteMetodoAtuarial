'use client'

import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { RegisterSchema } from '@/lib/validations/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = RegisterSchema.parse(body)
    
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Usuário já existe' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await hash(validatedData.password, 12)

    // Criar usuário com dados ABAC
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        isActive: true,
        department: validatedData.department || 'general',
        location: validatedData.location || null,
        jobTitle: validatedData.jobTitle || null,
        validFrom: new Date(),
        validUntil: null,
        mfaEnabled: false,
        loginCount: 0,
        failedLogins: 0
      }
    })

    // Retornar dados do usuário (sem senha)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
