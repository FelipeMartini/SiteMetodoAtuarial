import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const userId = session.user.id

    // Buscar configuração MFA
    const mfaConfig = await prisma.mfaConfig.findUnique({
      where: { userId }
    })

    // Buscar estatísticas de uso
    const mfaLogs = await prisma.mfaLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10
    })

    const successfulLogins = await prisma.mfaLog.count({
      where: { 
        userId,
        success: true
      }
    })

    const failedLogins = await prisma.mfaLog.count({
      where: { 
        userId,
        success: false
      }
    })

    return NextResponse.json({
      totpEnabled: mfaConfig?.totpEnabled || false,
      emailEnabled: mfaConfig?.emailEnabled || false,
      smsEnabled: mfaConfig?.smsEnabled || false,
      lastUsedAt: mfaConfig?.lastUsedAt,
      recentActivity: mfaLogs,
      statistics: {
        successfulLogins,
        failedLogins
      }
    })

  } catch (error) {
    console.error('Erro ao buscar status MFA:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
