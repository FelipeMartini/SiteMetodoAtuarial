// API Route para gerenciamento de usuários
// Implementa CRUD completo para administração de usuários

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';

// Schema de validação para criação/atualização de usuário
const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  accessLevel: z.number().min(1).max(5),
  isActive: z.boolean(),
});

// Schema para filtros de listagem
const listUsersSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  search: z.string().optional(),
  accessLevel: z.string().transform(Number).pipe(z.number().min(1).max(5)).optional(),
  isActive: z.string().transform(v => v === 'true').optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'lastLogin']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Verificar se o usuário tem permissão de admin
async function checkAdminPermission(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return false;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { accessLevel: true, isActive: true },
  });

  return user && user.isActive && user.accessLevel >= 4; // Admin ou SuperAdmin
}

// GET - Listar usuários com filtros
export async function GET(request: NextRequest) {
  try {
    // Verificar permissão de admin
    const hasPermission = await checkAdminPermission(request);
    if (!hasPermission) {
      return NextResponse.json({
        error: 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.',
      }, { status: 403 });
    }

    // Extrair parâmetros da query string
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validationResult = listUsersSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Parâmetros inválidos',
        details: validationResult.error.issues,
      }, { status: 400 });
    }

    const {
      page = 1,
      limit = 10,
      search,
      accessLevel,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = validationResult.data;

    // Construir filtros para o Prisma
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (accessLevel !== undefined) {
      where.accessLevel = accessLevel;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Calcular offset para paginação
    const offset = (page - 1) * limit;

    // Buscar usuários com paginação
    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where,
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
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    // Verificar permissão de admin
    const hasPermission = await checkAdminPermission(request);
    if (!hasPermission) {
      return NextResponse.json({
        error: 'Acesso negado. Apenas administradores podem criar usuários.',
      }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = userSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: validationResult.error.issues,
      }, { status: 400 });
    }

    const { name, email, password, accessLevel, isActive } = validationResult.data;

    // Verificar se o email já existe
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({
        error: 'Email já está em uso por outro usuário.',
      }, { status: 409 });
    }

    // Hash da senha se fornecida
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Criar usuário
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        accessLevel,
        isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        accessLevel: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: newUser,
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor',
    }, { status: 500 });
  }
}
