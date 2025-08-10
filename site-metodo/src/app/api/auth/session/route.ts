// use cliente
// Rota para retornar a sessão autenticada baseada no cookie 'authjs.session-token'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

// Função para mapear accessLevel para roles moderno
function mapAccessLevelToRole(accessLevel: number): string[] {
  if (accessLevel >= 100) return ['admin']      // Admin completo
  if (accessLevel >= 50) return ['staff']       // Staff/Moderador
  if (accessLevel >= 1) return ['user']         // Usuário padrão
  return []                                      // Guest (não autenticado)
}

export async function GET(request: NextRequest) {
  // Lê o cookie de sessão
  const sessionToken = request.cookies.get('authjs.session-token')?.value;
  if (!sessionToken) {
    return NextResponse.json(null, { status: 200 });
  }
  // Busca a sessão no banco
  const session = await db.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });
  if (!session || !session.user) {
    return NextResponse.json(null, { status: 200 });
  }

  // Converte accessLevel para role moderno
  const roles = mapAccessLevelToRole(session.user.accessLevel);
  
  // Retorna o objeto Session padrão do Auth.js (https://authjs.dev/reference/core/types#session)
  // Inclui tanto accessLevel (compatibilidade) quanto role (sistema moderno)
  return NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      accessLevel: session.user.accessLevel,
      role: roles, // Campo role adicionado para sistema moderno
    },
    expires: session.expires.toISOString(),
  }, { status: 200 });
}

// Comentário: Esta rota permite ao frontend saber se há usuário autenticado lendo o cookie de sessão e buscando no banco.

// Comentário: Esta rota permite ao frontend saber se há usuário autenticado lendo o cookie de sessão e buscando no banco.
