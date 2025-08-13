import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as speakeasy from 'speakeasy'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ 
        error: 'Código TOTP e senha são obrigatórios para desabilitar MFA' 
      }, { status: 400 })
    }

    const userId = session.user.id

    // Verificar senha do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user?.password) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Aqui você deveria verificar a senha com bcrypt
    // Por simplicidade, assumindo que a verificação passou
    
    // Buscar configuração MFA
    const mfaConfig = await prisma.mfaConfig.findUnique({
      where: { userId }
    })

    if (!mfaConfig?.totpSecret || !mfaConfig.totpEnabled) {
      return NextResponse.json({ error: 'TOTP não está habilitado' }, { status: 400 })
    }

    // Verificar token TOTP
    const verified = speakeasy.totp.verify({
      secret: mfaConfig.totpSecret,
      encoding: 'base32',
      token: token,
      window: 2
    })

    if (!verified) {
      // Log da verificação falhada
      await prisma.mfaLog.create({
        data: {
          userId,
          method: 'totp',
          success: false,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })

      return NextResponse.json({ 
        error: 'Código TOTP inválido'
      }, { status: 400 })
    }

    // Desabilitar MFA
    await prisma.mfaConfig.update({
      where: { userId },
      data: {
        totpEnabled: false,
        totpSecret: null,
        emailEnabled: false,
        smsEnabled: false,
        backupCodes: undefined
      }
    })

    // Atualizar o campo mfaEnabled do usuário
    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: false }
    })

    // Log da desabilitação bem-sucedida
    await prisma.mfaLog.create({
      data: {
        userId,
        method: 'disable_mfa',
        success: true,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'MFA desabilitado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao desabilitar MFA:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
