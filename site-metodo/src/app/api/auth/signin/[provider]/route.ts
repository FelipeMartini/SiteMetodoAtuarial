import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

/**
 * Rota de login universal para Auth.js puro (credentials e social)
 * POST /api/auth/signin/[provider]
 * provider: 'credentials' (tradicional) ou nome do provedor social
 */
// No App Router, params deve ser acessado de forma assíncrona
export async function POST(request: NextRequest, context: { params: { provider: string } }) {
  const { provider } = await context.params;
  if (provider === 'credentials') {
    // Login tradicional
    try {
      const { email, password } = await request.json();
      if (!email || !password) {
        return NextResponse.json({ error: 'Email e senha são obrigatórios.' }, { status: 400 });
      }
      const user = await db.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
      }
      // Cria um novo sessionToken
      const sessionToken = randomBytes(32).toString('hex');
      // Remove sessões antigas do usuário
      await db.session.deleteMany({ where: { userId: user.id } });
      // Cria nova sessão
      await db.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        },
      });
      // Seta cookie de sessão
      const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, accessLevel: user.accessLevel } });
      response.cookies.set('authjs.session-token', sessionToken, {
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    } catch {
      return NextResponse.json({ error: 'Erro interno ao autenticar.' }, { status: 500 });
    }
  } else {
    // Login social: não suportado via POST, apenas via redirect GET
    return NextResponse.json({ error: 'Método não permitido para login social. Use o fluxo de redirect.' }, { status: 405 });
  }
}

// Comentário: Esta rota processa login tradicional (credentials) e pode ser expandida para login social. Cria sessão Auth.js pura e retorna cookie.
