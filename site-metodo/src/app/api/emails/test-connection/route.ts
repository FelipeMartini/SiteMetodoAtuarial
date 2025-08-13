import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { emailService } from '@/lib/email-service'

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const result = await emailService.verifyConnection();

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Conexão SMTP funcionando corretamente'
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error,
        message: 'Falha na conexão SMTP'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Erro ao testar conexão SMTP:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível testar a conexão'
      },
      { status: 500 }
    );
  }
}
