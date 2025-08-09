import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

// Permite desativar o TOTP (remover segredo)
export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get('authjs.session-token')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  const session = await db.session.findUnique({ where: { sessionToken }, include: { user: true } });
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
  }
  await db.user.update({ where: { id: session.user.id }, data: { totpSecret: null } });
  return NextResponse.json({ ok: true });
}
