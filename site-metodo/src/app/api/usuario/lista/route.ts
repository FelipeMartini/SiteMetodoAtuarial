import { NextResponse } from 'next/server';
import { checkApiAuthorization } from '@/lib/auth/apiAuth';
import { db } from '@/lib/prisma';

// API para listar todos os usuários (apenas admin/staff)
export async function GET() {
  const authorizedUser = await checkApiAuthorization(['admin', 'staff']);
  
  if (!authorizedUser) {
    return NextResponse.json({ error: 'Acesso negado. Apenas administradores e staff.' }, { status: 403 });
  }

  try {
    // Lista todos usuários
    const usuarios = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        accessLevel: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
