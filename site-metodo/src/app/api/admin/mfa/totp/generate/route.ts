import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as speakeasy from 'speakeasy'
import * as QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const userId = session.user.id

    // Verificar se o usuário já tem TOTP configurado
    let mfaConfig = await prisma.mfaConfig.findUnique({
      where: { userId }
    })

    if (mfaConfig?.totpEnabled) {
      return NextResponse.json({ error: 'TOTP já está habilitado' }, { status: 400 })
    }

    // Gerar secret TOTP
    const secret = speakeasy.generateSecret({
      length: 32,
      name: `Método Atuarial - ${session.user.email}`,
      issuer: 'Método Atuarial'
    })

    if (!secret.base32) {
      return NextResponse.json({ error: 'Erro ao gerar secret TOTP' }, { status: 500 })
    }

    // Salvar ou atualizar configuração MFA
    mfaConfig = await prisma.mfaConfig.upsert({
      where: { userId },
      create: {
        userId,
        totpSecret: secret.base32,
        totpEnabled: false
      },
      update: {
        totpSecret: secret.base32,
        totpEnabled: false
      }
    })

    // Gerar QR Code
    const qrCodeUrl = secret.otpauth_url
    const qrCodeImage = await QRCode.toDataURL(qrCodeUrl!)

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeImage,
      manualEntryKey: secret.base32
    })

  } catch (error) {
    console.error('Erro ao gerar TOTP:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
