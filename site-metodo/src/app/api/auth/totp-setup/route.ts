import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Gera segredo TOTP e QR code para setup
export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get('authjs.session-token')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  // Busca usuário autenticado
  const session = await db.session.findUnique({ where: { sessionToken }, include: { user: true } });
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
  }
  // Gera segredo TOTP
  const secret = speakeasy.generateSecret({ length: 32, name: `MetodoAtuarial (${session.user.email})` });
  // Salva segredo no usuário
  await db.user.update({ where: { id: session.user.id }, data: { totpSecret: secret.base32 } });
  // Gera QR code
  const otpauth = secret.otpauth_url;
  const qr = await qrcode.toDataURL(otpauth);
  return NextResponse.json({ otpauth, qr });
}
