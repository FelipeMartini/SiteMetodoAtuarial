// API para gerenciar notificações do dashboard administrativo
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    // Por enquanto retornamos notificações mock
    // TODO: Implementar sistema de notificações real no banco de dados
    const mockNotifications = [
      {
        id: '1',
        title: 'Novo usuário cadastrado',
        message: 'Um novo usuário se cadastrou no sistema há 5 minutos',
        type: 'info',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        actionUrl: '/admin/usuarios'
      },
      {
        id: '2',
        title: 'Backup realizado com sucesso',
        message: 'Backup automático do banco de dados concluído às ' + new Date(Date.now() - 3600000).toLocaleTimeString(),
        type: 'success',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        actionUrl: '/admin/sistema'
      },
      {
        id: '3',
        title: 'Alta atividade detectada',
        message: 'Pico de logins nas últimas 2 horas (150% acima da média)',
        type: 'warning',
        timestamp: new Date(Date.now() - 2 * 3600000),
        read: true,
        actionUrl: '/admin/dashboard'
      },
      {
        id: '4',
        title: 'Usuário bloqueado por tentativas',
        message: 'Usuário joão@exemplo.com foi bloqueado por múltiplas tentativas de login',
        type: 'error',
        timestamp: new Date(Date.now() - 4 * 3600000),
        read: false,
        actionUrl: '/admin/usuarios'
      },
      {
        id: '5',
        title: 'Atualização de segurança disponível',
        message: 'Nova versão do sistema com correções de segurança está disponível',
        type: 'warning',
        timestamp: new Date(Date.now() - 24 * 3600000),
        read: true,
        actionUrl: '/admin/sistema'
      }
    ];

    return NextResponse.json(mockNotifications);

  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, message, type, actionUrl } = body;

    // Validação básica
    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, message, type' },
        { status: 400 }
      );
    }

    // Validar tipo
    const validTypes = ['info', 'success', 'warning', 'error'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: ' + validTypes.join(', ') },
        { status: 400 }
      );
    }

    // TODO: Salvar notificação no banco de dados
    // Por enquanto apenas retornamos um mock
    const newNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      actionUrl: actionUrl || null
    };

    return NextResponse.json(newNotification, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
