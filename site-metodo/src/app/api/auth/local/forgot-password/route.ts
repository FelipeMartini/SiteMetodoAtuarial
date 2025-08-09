/**
 * API para recuperação de senha
 */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email é obrigatório' }, { status: 400 });
    }

    // Verificar se o usuário existe
    const user = await db.user.findUnique({
      where: { email }
    });

    // Por segurança, sempre retornamos sucesso mesmo se o email não existir
    if (!user) {
      return NextResponse.json({
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
      });
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Salvar token no banco (você pode criar uma tabela específica para isso)
    // Por agora, vamos simular o processo

    // Aqui você implementaria o envio de email
    // Por exemplo, usando Nodemailer, SendGrid, etc.
    console.log('Token de recuperação para', email, ':', resetToken);
    console.log('Link de recuperação: /redefinir-senha?token=' + resetToken);

    return NextResponse.json({
      message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
    });
  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
