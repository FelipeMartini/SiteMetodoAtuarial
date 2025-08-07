import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET() {
  const clientId = process.env.AUTH_TWITTER_ID;
  const redirectUri = process.env.NEXTAUTH_URL + '/api/auth/callback/twitter';
  const state = randomBytes(16).toString('hex');
  const url =
    'https://twitter.com/i/oauth2/authorize?' +
    new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri!,
      response_type: 'code',
      scope: 'tweet.read users.read offline.access',
      state,
      code_challenge: state,
      code_challenge_method: 'plain',
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
