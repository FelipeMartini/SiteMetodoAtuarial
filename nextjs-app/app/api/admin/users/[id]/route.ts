// API Route para operações específicas em usuários
// PUT, DELETE e operações individuais

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';

// Schema para atualização de usuário
const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  accessLevel: z.number().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
});

// Verificar permissão de admin
async function checkAdminPermission(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return false;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accessLevel: true, isActive: true },
  });

  return user && user.isActive && user.accessLevel >= 4;
}

// GET - Buscar usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasPermission = await checkAdminPermission(request);
    if (!hasPermission) {
      return NextResponse.json({
        error: 'Acesso negado.',
      }, { status: 403 });
    }

    const userId = params.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        accessLevel: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        error: 'Usuário não encontrado.',
      }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

// PUT - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasPermission = await checkAdminPermission(request);
    if (!hasPermission) {
      return NextResponse.json({
        error: 'Acesso negado.',
      }, { status: 403 });
    }

    const userId = params.id;
    const body = await request.json();

    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: validationResult.error.issues,
      }, { status: 400 });
    }

    const updateData = validationResult.data;

    // Verificar se o usuário existe
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({
        error: 'Usuário não encontrado.',
      }, { status: 404 });
    }

    // Se está alterando email, verificar se não existe outro usuário com esse email
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email: updateData.email },
      });

      if (emailExists) {
        return NextResponse.json({
          error: 'Email já está em uso por outro usuário.',
        }, { status: 409 });
      }
    }

    // Hash da nova senha se fornecida
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    // Atualizar usuário
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        accessLevel: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

// DELETE - Excluir usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hasPermission = await checkAdminPermission(request);
    if (!hasPermission) {
      return NextResponse.json({
        error: 'Acesso negado.',
      }, { status: 403 });
    }

    const userId = params.id;
    const session = await auth();

    // Não permitir excluir a si mesmo
    if (session?.user?.id === userId) {
      return NextResponse.json({
        error: 'Você não pode excluir sua própria conta.',
      }, { status: 400 });
    }

    // Verificar se o usuário existe
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        error: 'Usuário não encontrado.',
      }, { status: 404 });
    }

    // Excluir usuário
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: 'Usuário excluído com sucesso',
    });

  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}
