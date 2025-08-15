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
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      department: user.department,
      location: user.location,
      jobTitle: user.jobTitle,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
    // Garantir políticas casbin básicas por email (idempotente)
    try {
      const emailSubject = user.email
      const policies = [
        { subject: emailSubject, object: 'usuario:areacliente', action: 'read', effect: 'allow' },
        { subject: emailSubject, object: 'usuario:areacliente', action: 'write', effect: 'allow' },
      ]
      for (const p of policies) {
        const exists = await prisma.casbinRule.findFirst({ where: { v0: p.subject, v1: p.object, v2: p.action, v3: p.effect } })
        if (!exists) {
          await prisma.casbinRule.create({ data: { ptype: 'p', v0: p.subject, v1: p.object, v2: p.action, v3: p.effect } })
        }
      }
    } catch (err) {
      console.error('Erro ao criar políticas casbin para novo usuário:', err)
    }

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
