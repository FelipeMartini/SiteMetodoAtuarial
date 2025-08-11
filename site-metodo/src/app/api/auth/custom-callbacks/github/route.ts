import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const _error = searchParams.get('error');
  const state = searchParams.get('state');
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
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: process.env.AUTH_GITHUB_ID!,
      client_secret: process.env.AUTH_GITHUB_SECRET!,
      redirect_uri: process.env.NEXTAUTH_URL + '/api/auth/callback/github',
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect('/login?error=token_exchange_failed');
  }
  const tokenData = await tokenRes.json();
  // Busca perfil do usuário
  const profileRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!profileRes.ok) {
    return NextResponse.redirect('/login?error=profile_fetch_failed');
  }
  const profile = await profileRes.json();
  // Busca email principal
  let email = profile.email;
  if (!email) {
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (emailsRes.ok) {
      type GithubEmail = { email: string; primary: boolean; verified: boolean };
      const emails: GithubEmail[] = await emailsRes.json();
      const primary = emails.find((e) => e.primary && e.verified);
      email = primary?.email || emails[0]?.email;
    }
  }
  if (!email) {
    return NextResponse.redirect('/login?error=no_email');
  }
  // Cria ou atualiza usuário
  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({
      data: {
        email,
        name: profile.name || profile.login,
        image: profile.avatar_url,
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
