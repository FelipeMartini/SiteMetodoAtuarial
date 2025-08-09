import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

/**
 * Rota de logout universal para Auth.js puro
 * POST /api/auth/signout
 * Remove o cookie de sessão e apaga a sessão do banco
 */
export async function POST(request: NextRequest) {
  // Recupera o token da sessão do cookie
  const sessionToken = request.cookies.get('authjs.session-token')?.value;
  if (sessionToken) {
    // Remove a sessão do banco
    await db.session.deleteMany({ where: { sessionToken } });
  }
  // Remove o cookie
  const response = NextResponse.json({ ok: true });
  response.cookies.set('authjs.session-token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

// Comentário: Esta rota faz logout removendo o cookie e a sessão do banco, compatível com Auth.js puro.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

/**
 * Rota de logout universal para Auth.js puro
 * POST /api/auth/signout
 * Remove o cookie de sessão e apaga a sessão do banco
 */
export async function POST(request: NextRequest) {
  // Recupera o token da sessão do cookie
  const sessionToken = request.cookies.get('authjs.session-token')?.value;
  if (sessionToken) {
    // Remove a sessão do banco
    await db.session.deleteMany({ where: { sessionToken } });
  }
  // Remove o cookie
  const response = NextResponse.json({ ok: true });
  response.cookies.set('authjs.session-token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

// Comentário: Esta rota faz logout removendo o cookie e a sessão do banco, compatível com Auth.js puro.
