import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { z } from 'zod';
import speakeasy from 'speakeasy';

const verifySchema = z.object({
  token: z.string().min(6).max(6)
});

// Verifica código TOTP enviado pelo usuário
export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get('authjs.session-token')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  const session = await db.session.findUnique({ where: { sessionToken }, include: { user: { select: { id: true, totpSecret: true } } } });
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
  }
  const body = await request.json();
  const result = verifySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Token inválido.' }, { status: 400 });
  }
  const { token } = result.data;
  const user = session.user;
  if (!user?.totpSecret) {
    return NextResponse.json({ error: 'MFA não configurado.' }, { status: 400 });
  }
  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token
  });
  if (!verified) {
    return NextResponse.json({ error: 'Token incorreto.' }, { status: 401 });
  }
  // MFA verificado com sucesso
  return NextResponse.json({ ok: true });
}
