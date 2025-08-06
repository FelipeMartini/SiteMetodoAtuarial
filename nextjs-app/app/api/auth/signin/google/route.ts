import { NextRequest, NextResponse } from 'next/server';

// Redireciona para o Google OAuth2
export async function GET() {
  const clientId = process.env.AUTH_GOOGLE_ID;
  const redirectUri = process.env.NEXT_PUBLIC_URL + '/api/auth/callback/google';
  const scope = 'openid email profile';
  const state = Math.random().toString(36).substring(2); // Para CSRF, ideal usar algo mais robusto
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri!,
      response_type: 'code',
      scope,
      state,
      access_type: 'offline',
      prompt: 'consent',
    }).toString();
  return NextResponse.redirect(url);
}

// Comentário: Esta rota inicia o fluxo OAuth2 do Google, redirecionando o usuário para consentimento.
