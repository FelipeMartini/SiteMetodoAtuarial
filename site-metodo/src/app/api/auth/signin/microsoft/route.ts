import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET() {
  const clientId = process.env.AUTH_MICROSOFT_ID;
  const redirectUri = process.env.NEXTAUTH_URL + '/api/auth/callback/microsoft';
  const scope = 'openid email profile offline_access';
  const state = randomBytes(16).toString('hex');
  const url =
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?' +
    new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri!,
      response_type: 'code',
      scope,
      state,
      response_mode: 'query',
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
