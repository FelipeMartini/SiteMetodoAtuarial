import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const code = form.get('code');
  const state = form.get('state');
  const _error = form.get('error');
  const stateCookie = request.cookies.get('authjs.oauth-state')?.value;
  if (!state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect('/login?error=invalid_state');
  }
  if (error) {
    return NextResponse.redirect('/login?error=oauth_error');
  }
  if (!code) {
    return NextResponse.redirect('/login?error=missing_code');
  }
  // Troca code por token
  const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: code as string,
      client_id: process.env.AUTH_APPLE_ID!,
      client_secret: process.env.AUTH_APPLE_SECRET!,
      redirect_uri: process.env.NEXTAUTH_URL + '/api/auth/callback/apple',
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect('/login?error=token_exchange_failed');
  }
  const tokenData = await tokenRes.json();
  // Busca perfil do usuário (Apple não fornece endpoint de perfil, decodifica id_token)
  const idToken = tokenData.id_token;
  let email = undefined;
  let name = undefined;
  if (idToken) {
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    email = payload.email;
    name = payload.name || undefined;
  }
  if (!email) {
    return NextResponse.redirect('/login?error=profile_fetch_failed');
  }
  // Cria ou atualiza usuário
  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({
      data: {
        email,
        name,
        image: undefined,
        emailVerified: new Date(),
      },
    });
  }
  // Cria sessão
  const sessionToken = randomBytes(32).toString('hex');
  await db.session.deleteMany({ where: { userId: user.id } });
  await db.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  const response = NextResponse.redirect(process.env.NEXTAUTH_URL + '/area-cliente');
  response.cookies.set('authjs.session-token', sessionToken, {
    httpOnly: true,
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
