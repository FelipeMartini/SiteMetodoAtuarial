import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Valida dados da requisição
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Dados de entrada inválidos', errors: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Usuário com este email já existe' },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove a senha da resposta
    const { password: pw, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro de registro:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
