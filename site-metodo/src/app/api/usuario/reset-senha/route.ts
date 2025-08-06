import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// API para resetar senha de usuário (apenas nível 5)
export async function POST(req: NextRequest) {
  // Recupera sessão do Auth.js puro via cookie
  const sessionToken = req.cookies.get('authjs.session-token')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }
  // Busca sessão pelo token
  const sessao = await db.session.findUnique({ where: { sessionToken } });
  if (!sessao) {
    return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
  }
  // Busca usuário logado pela sessão
  const usuario = await db.user.findUnique({ where: { id: sessao.userId } });
  if (!usuario || usuario.accessLevel !== 5) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
  }
  const { id } = await req.json();
  // Gera senha temporária padrão
  const novaSenha = 'Temp1234!';
  const hash = await bcrypt.hash(novaSenha, 10);
  await db.user.update({
    where: { id },
    data: { password: hash },
  });
  return NextResponse.json({ success: true, novaSenha });
}
// Comentário: Esta rota permite resetar a senha de qualquer usuário para uma senha temporária padrão, apenas para nível 5.
