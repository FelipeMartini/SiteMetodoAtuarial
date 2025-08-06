import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

// API para listar todos os usuários (apenas nível 5)
export async function GET(req: NextRequest) {
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
  // Lista todos usuários
  const usuarios = await db.user.findMany();
  return NextResponse.json({ usuarios });
}
// Comentário: Esta rota retorna todos os usuários apenas para quem tem nível 5 (SuperAdmin).
