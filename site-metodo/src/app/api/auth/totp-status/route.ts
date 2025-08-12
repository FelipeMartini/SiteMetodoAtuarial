import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

// Retorna status do MFA TOTP para o usuário autenticado
export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('authjs.session-token')?.value
  if (!sessionToken) {
    return NextResponse.json({ enabled: false }, { status: 200 })
  }
  const session = await db.session.findUnique({
    where: { sessionToken },
    include: { user: { select: { id: true, mfaEnabled: true } } },
  })
  if (!session || !session.user) {
    return NextResponse.json({ enabled: false }, { status: 200 })
  }
  return NextResponse.json({ enabled: session.user.mfaEnabled }, { status: 200 })
}
