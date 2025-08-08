// use cliente
// Rota para retornar a sessão autenticada baseada no cookie 'authjs.session-token'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

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
  // Retorna o objeto Session padrão do Auth.js (https://authjs.dev/reference/core/types#session)
  return NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    },
    expires: session.expires.toISOString(),
  }, { status: 200 });
}

// Comentário: Esta rota permite ao frontend saber se há usuário autenticado lendo o cookie de sessão e buscando no banco.
