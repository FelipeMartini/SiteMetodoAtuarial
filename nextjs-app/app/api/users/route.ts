/**
 * API para gerenciamento de usuários - Versão Completa
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { db } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

// GET - Listar todos os usuários (apenas para admins)
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { accessLevel: true }
    });

    if (!currentUser || currentUser.accessLevel < 4) {
      return NextResponse.json({ message: 'Acesso negado - Apenas administradores' }, { status: 403 });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        accessLevel: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST - Criar novo usuário (apenas para admins)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { accessLevel: true }
    });

    if (!currentUser || currentUser.accessLevel < 4) {
      return NextResponse.json({ message: 'Acesso negado - Apenas administradores' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, accessLevel, isActive, password } = body;

    // Validações
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Nome, email e senha são obrigatórios' }, { status: 400 });
    }

    if (accessLevel < 1 || accessLevel > 5) {
      return NextResponse.json({ message: 'Nível de acesso inválido (1-5)' }, { status: 400 });
    }

    // Verificar se email já existe
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email já está em uso' }, { status: 400 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        accessLevel: parseInt(accessLevel),
        isActive: isActive !== false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        accessLevel: true,
        isActive: true,
        createdAt: true,
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
