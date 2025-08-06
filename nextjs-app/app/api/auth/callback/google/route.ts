import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { randomBytes } from 'crypto';

// Troca o code do Google por token, busca perfil, cria usuário e sessão
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  if (error) {
    return NextResponse.redirect('/login?error=oauth_error');
  }
  if (!code) {
    return NextResponse.redirect('/login?error=missing_code');
  }
  // Troca code por token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.AUTH_GOOGLE_ID!,
      client_secret: process.env.AUTH_GOOGLE_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_URL + '/api/auth/callback/google',
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect('/login?error=token_exchange_failed');
  }
  const tokenData = await tokenRes.json();
  // Busca perfil do usuário
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!profileRes.ok) {
    return NextResponse.redirect('/login?error=profile_fetch_failed');
  }
  const profile = await profileRes.json();
  // Cria ou atualiza usuário no banco
  let user = await db.user.findUnique({ where: { email: profile.email } });
  if (!user) {
    user = await db.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        image: profile.picture,
        emailVerified: profile.email_verified,
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
  // Seta cookie e redireciona
  const response = NextResponse.redirect('/area-cliente');
  response.cookies.set('authjs.session-token', sessionToken, {
    httpOnly: true,
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

// Comentário: Esta rota finaliza o login social Google, cria usuário/sessão e redireciona para área do cliente.
