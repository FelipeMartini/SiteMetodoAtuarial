// API para marcar uma notificação específica como lida
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se é admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { accessLevel: true }
    });

    if (!user || user.accessLevel < 4) {
      return NextResponse.json(
        { error: 'Acesso negado. Necessário nível de admin.' },
        { status: 403 }
      );
    }

    const notificationId = params.id;

    // TODO: Implementar marcação como lida no banco de dados
    // Por enquanto apenas retornamos sucesso
    console.log(`Notificação ${notificationId} marcada como lida`);

    return NextResponse.json({
      success: true,
      notificationId,
      message: 'Notificação marcada como lida'
    });

  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
