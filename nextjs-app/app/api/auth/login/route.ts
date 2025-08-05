// API Route para autenticação com credenciais
// Implementa login seguro com bcrypt e validação de dados

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/prisma';

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Interface para response padronizado
interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    accessLevel: number;
    isActive: boolean;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json();

    // Validar dados de entrada
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Dados inválidos',
        error: validationResult.error.issues[0].message,
      }, { status: 400 });
    }

    const { email, password } = validationResult.data;

    // Buscar usuário no banco de dados
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        accessLevel: true,
        isActive: true,
        lastLogin: true,
        loginAttempts: true,
        lockedUntil: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Credenciais inválidas',
        error: 'Email ou senha incorretos',
      }, { status: 401 });
    }

    // Verificar se a conta está ativa
    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Conta desabilitada',
        error: 'Sua conta foi desabilitada. Entre em contato conosco.',
      }, { status: 403 });
    }

    // Verificar se a conta está bloqueada
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const lockTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
      return NextResponse.json({
        success: false,
        message: 'Conta temporariamente bloqueada',
        error: `Muitas tentativas de login. Tente novamente em ${lockTime} minutos.`,
      }, { status: 423 });
    }

    // Verificar senha
    if (!user.password) {
      return NextResponse.json({
        success: false,
        message: 'Erro de configuração',
        error: 'Usuário deve fazer login via provedor social',
      }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Incrementar tentativas de login
      const newAttempts = (user.loginAttempts || 0) + 1;
      const shouldLock = newAttempts >= 5;

      await db.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: newAttempts,
          lockedUntil: shouldLock
            ? new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
            : null,
        },
      });

      return NextResponse.json({
        success: false,
        message: 'Credenciais inválidas',
        error: shouldLock
          ? 'Muitas tentativas. Conta bloqueada por 30 minutos.'
          : 'Email ou senha incorretos',
      }, { status: 401 });
    }

    // Login bem-sucedido - resetar tentativas e atualizar último login
    await db.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        loginAttempts: 0,
        lockedUntil: null,
      },
    });

    // TODO: Registrar atividade de login após migração do banco
    // await db.activity.create({ ... })

    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        accessLevel: user.accessLevel,
        isActive: user.isActive,
      },
    });

  } catch (error) {
    console.error('Erro no login:', error);

    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor',
      error: 'Erro inesperado. Tente novamente.',
    }, { status: 500 });
  }
}
