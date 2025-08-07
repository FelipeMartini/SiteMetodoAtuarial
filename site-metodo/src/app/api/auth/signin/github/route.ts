import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET() {
  const clientId = process.env.AUTH_GITHUB_ID;
  const redirectUri = process.env.NEXTAUTH_URL + '/api/auth/callback/github';
  const scope = 'read:user user:email';
  const state = randomBytes(16).toString('hex');
  const url =
    'https://github.com/login/oauth/authorize?' +
    new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri!,
      response_type: 'code',
      scope,
      state,
      allow_signup: 'true',
    }).toString();
  const response = NextResponse.redirect(url);
  response.cookies.set('authjs.oauth-state', state, {
    httpOnly: true,
    path: '/',
    maxAge: 10 * 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
