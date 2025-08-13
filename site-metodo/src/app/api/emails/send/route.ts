import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { emailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject, message, priority = 'normal' } = body;

    // Validações básicas
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Destinatário, assunto e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await emailService.sendEmail({
      to,
      subject,
      html: message,
      priority
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        messageId: result.messageId,
        message: 'Email enviado com sucesso'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
