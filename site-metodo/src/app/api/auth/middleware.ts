import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/prisma'

  const sessionToken = request.cookies.get('authjs.session-token')?.value
  if (!sessionToken) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }
  const session = await db.session.findUnique({
    where: { sessionToken },
    include: { user: { include: { role: true } } },
  })
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
  }
  if (roles && !roles.includes(session.user.role?.name)) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }
  return session.user
}
