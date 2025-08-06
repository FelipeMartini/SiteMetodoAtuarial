import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

// API para editar dados do usuário (apenas nível 5)
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
  const { id, campo, valor } = await req.json();
  // Permite editar apenas campos seguros
  const camposPermitidos = ['name', 'email', 'accessLevel', 'isActive', 'image'];
  if (!camposPermitidos.includes(campo)) {
    return NextResponse.json({ error: 'Campo não permitido.' }, { status: 400 });
  }
  await db.user.update({
    where: { id },
    data: { [campo]: valor },
  });
  return NextResponse.json({ success: true });
}
// Comentário: Esta rota permite editar dados seguros de qualquer usuário, apenas para nível 5.
