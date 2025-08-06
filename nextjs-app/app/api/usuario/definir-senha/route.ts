import { NextRequest, NextResponse } from 'next/server';


import { auth } from '@/auth';
import { prisma } from '@/prisma/client';
import bcryptjs from 'bcryptjs';

/**
 * Endpoint para definir/atualizar senha do usuário logado (social ou tradicional)
 * Só permite definir senha se o usuário estiver autenticado
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }
    const { senha } = await req.json();
    if (!senha || senha.length < 6) {
      return NextResponse.json({ error: 'Senha inválida.' }, { status: 400 });
    }
    const hash = await bcryptjs.hash(senha, 10);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hash },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao definir senha.' }, { status: 500 });
  }
}

// Comentário: Este endpoint permite que usuários sociais criem uma senha para login tradicional. Utiliza autenticação de sessão e atualiza o campo password no banco de dados.
