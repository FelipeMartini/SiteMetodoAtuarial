// API para configurações do dashboard administrativo
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

    // Configurações mock do dashboard
    const dashboardConfig = {
      refreshInterval: 5, // minutos
      autoRefresh: true,
      showNotifications: true,
      compactMode: false,

      visibleWidgets: {
        stats: true,
        userGrowth: true,
        recentActivity: true,
        topUsers: true,
        accessLevelChart: true,
      },

      // Configurações de tema
      theme: {
        primaryColor: '#3498db',
        secondaryColor: '#2c3e50',
        backgroundColor: '#ffffff',
        surfaceColor: '#f8f9fa',
        textColor: '#2c3e50',
        textSecondaryColor: '#7f8c8d',
      },

      // Configurações de segurança
      security: {
        sessionTimeout: 30, // minutos
        maxLoginAttempts: 5,
        lockoutDuration: 15, // minutos
        requirePasswordChange: false,
        passwordMinLength: 8,
      },

      // Configurações de backup
      backup: {
        autoBackup: true,
        backupInterval: 24, // horas
        retentionDays: 30,
        lastBackup: new Date(Date.now() - 2 * 3600000), // 2 horas atrás
      },

      // Configurações de notificação
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        notifyNewUsers: true,
        notifyFailedLogins: true,
        notifySystemErrors: true,
      }
    };

    return NextResponse.json(dashboardConfig);

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const configData = await request.json();

    // Validação básica
    if (!configData || typeof configData !== 'object') {
      return NextResponse.json(
        { error: 'Dados de configuração inválidos' },
        { status: 400 }
      );
    }

    // TODO: Salvar configurações no banco de dados
    // Por enquanto apenas retornamos sucesso
    console.log('Configurações atualizadas:', configData);

    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
