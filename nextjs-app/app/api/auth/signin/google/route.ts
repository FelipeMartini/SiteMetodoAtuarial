import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';


// Rota que inicia o fluxo OAuth2 do Google, redirecionando o usuário para consentimento
export async function GET() {
  // Sempre utilize NEXTAUTH_URL para garantir compatibilidade com Auth.js e Google Cloud Console
  const clientId = process.env.AUTH_GOOGLE_ID;
  const redirectUri = process.env.NEXTAUTH_URL + '/api/auth/callback/google';
  const scope = 'openid email profile';
  // Gera um state seguro para CSRF
  const state = randomBytes(16).toString('hex');
  // Monta a URL de autorização usando redirect_uri correto
  // prompt: 'select_account' permite trocar de conta, mas NÃO força consentimento toda vez
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri!,
      response_type: 'code',
      scope,
      state,
      access_type: 'offline',
      prompt: 'select_account',
    }).toString();
  // Seta o state em cookie httpOnly para validação posterior no callback
  const response = NextResponse.redirect(url);
  response.cookies.set('authjs.oauth-state', state, {
    httpOnly: true,
    path: '/',
    maxAge: 10 * 60, // 10 minutos
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

// Comentário: Gera state seguro, salva em cookie httpOnly e redireciona para o Google.
