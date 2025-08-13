import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const notificationId = params.id;

    // Verificar se a notificação existe e pertence ao usuário
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id
      }
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }

    // Marcar como lida se ainda não foi
    if (!notification.read) {
      const updatedNotification = await prisma.notification.update({
        where: { id: notificationId },
        data: {
          read: true,
          readAt: new Date()
        }
      });

      // Log da ação
      await prisma.accessLog.create({
        data: {
          userId: session.user.id,
          subject: session.user.email || '',
          object: 'notification',
          action: 'READ_NOTIFICATION',
          resource: notificationId,
          allowed: true,
          ip: request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              '127.0.0.1',
          userAgent: request.headers.get('user-agent') || ''
        }
      });

      return NextResponse.json(updatedNotification);
    }

    return NextResponse.json(notification);

  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
