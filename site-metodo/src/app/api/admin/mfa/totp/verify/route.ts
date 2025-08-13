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

    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Código TOTP é obrigatório' }, { status: 400 })
    }

    const userId = session.user.id

    // Buscar configuração MFA
    const mfaConfig = await prisma.mfaConfig.findUnique({
      where: { userId }
    })

    if (!mfaConfig?.totpSecret) {
      return NextResponse.json({ error: 'TOTP não configurado' }, { status: 400 })
    }

    // Verificar token TOTP
    const verified = speakeasy.totp.verify({
      secret: mfaConfig.totpSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Permite uma janela de tempo para sincronização
    })

    if (verified) {
      // Habilitar TOTP se ainda não estiver habilitado
      if (!mfaConfig.totpEnabled) {
        await prisma.mfaConfig.update({
          where: { userId },
          data: { 
            totpEnabled: true,
            lastUsedAt: new Date()
          }
        })

        // Atualizar o campo mfaEnabled do usuário
        await prisma.user.update({
          where: { id: userId },
          data: { mfaEnabled: true }
        })
      } else {
        // Apenas atualizar o último uso
        await prisma.mfaConfig.update({
          where: { userId },
          data: { lastUsedAt: new Date() }
        })
      }

      // Log da verificação bem-sucedida
      await prisma.mfaLog.create({
        data: {
          userId,
          method: 'totp',
          success: true,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })

      return NextResponse.json({ 
        verified: true,
        message: 'TOTP verificado com sucesso'
      })
    } else {
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
        verified: false,
        error: 'Código TOTP inválido'
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro ao verificar TOTP:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
