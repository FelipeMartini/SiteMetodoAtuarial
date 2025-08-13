import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { emailService } from '@/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { to: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Buscar logs de email
    const [logs, total] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.emailLog.count({ where })
    ]);

    // Calcular estatísticas
    const stats = await emailService.getEmailStats();

    return NextResponse.json({
      logs,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar logs de email:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'send':
        const result = await emailService.sendEmail({
          to: data.to,
          subject: data.subject,
          html: data.message,
          priority: data.priority || 'normal'
        });

        if (result.success) {
          return NextResponse.json({ 
            success: true, 
            messageId: result.messageId 
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            error: result.error 
          }, { status: 400 });
        }

      case 'send-template':
        const templateResult = await emailService.sendTemplateEmail({
          templateType: data.templateType,
          to: data.to,
          subject: data.subject,
          templateData: data.templateData || {},
          priority: data.priority || 'normal'
        });

        if (templateResult.success) {
          return NextResponse.json({ 
            success: true, 
            messageId: templateResult.messageId 
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            error: templateResult.error 
          }, { status: 400 });
        }

      case 'bulk-send':
        const bulkResult = await emailService.sendBulkEmails(data.emails);
        return NextResponse.json({
          success: true,
          sent: bulkResult.sent,
          failed: bulkResult.failed,
          results: bulkResult.results
        });

      default:
        return NextResponse.json(
          { error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Erro na API de emails:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
