import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { renderEmailTemplate, EmailTemplateType, getEmailTemplate } from '@/emails/templates';
import { simpleLogger } from '@/lib/simple-logger';
import { emailLogger, logEmailSent, logEmailFailed, logEmailPending } from '@/lib/email-logger';

export interface EmailOptions {
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
  priority?: 'low' | 'normal' | 'high';
  replyTo?: string;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  encoding?: string;
  cid?: string;
}

export interface TemplateEmailOptions {
  templateType: EmailTemplateType;
  to: string | string[];
  subject: string;
  templateData: Record<string, unknown>;
  priority?: 'low' | 'normal' | 'high';
}

export interface EmailStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  lastSent?: Date;
}

class EmailService {
  private transporter?: nodemailer.Transporter;

  constructor() {
    // transporter será inicializado sob demanda
  }

  private initializeTransporter() {
    if (this.transporter) return;

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      logger: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development',
    });
  }

  private isSendEnabled(): boolean {
    // Para segurança: por padrão no desenvolvimento não envia emails reais
    if (process.env.NODE_ENV === 'production') return true;
    return String(process.env.EMAIL_SEND_ENABLED).toLowerCase() === 'true';
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      await logEmailPending({
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        priority: options.priority || 'normal',
        metadata: {
          userAgent: 'EmailServiceServer',
          provider: 'nodemailer',
        },
      });

      if (!this.isSendEnabled()) {
        const simulatedId = `dev-simulated-${Date.now()}`;
        await logEmailSent({
          to: options.to,
          cc: options.cc,
          bcc: options.bcc,
          subject: options.subject,
          messageId: simulatedId,
          priority: options.priority || 'normal',
          metadata: {
            userAgent: 'EmailServiceServer',
            provider: 'simulated',
            deliveryTime: Date.now(),
          },
          sentAt: new Date(),
        });

        simpleLogger.info('Envio de email simulado (EMAIL_SEND_ENABLED != true)', {
          to: options.to,
          subject: options.subject,
          messageId: simulatedId,
        });

        return { success: true, messageId: simulatedId };
      }

      this.initializeTransporter();
      const info = await this.transporter!.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: options.cc?.join(', '),
        bcc: options.bcc?.join(', '),
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
        priority: options.priority || 'normal',
        replyTo: options.replyTo,
      });

      await logEmailSent({
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        messageId: info.messageId,
        priority: options.priority || 'normal',
        metadata: {
          userAgent: 'EmailServiceServer',
          provider: 'nodemailer',
          deliveryTime: Date.now(),
        },
        sentAt: new Date(),
      });

      simpleLogger.info('Email enviado com sucesso (server)', {
        to: options.to,
        subject: options.subject,
        messageId: info.messageId,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      await logEmailFailed({
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        priority: options.priority || 'normal',
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          userAgent: 'EmailServiceServer',
          provider: 'nodemailer',
          retryCount: 0,
        },
      });

      simpleLogger.error('Erro ao enviar email (server)', {
        to: options.to,
        subject: options.subject,
        error: error instanceof Error ? error.message : String(error),
      });

      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async sendTemplateEmail(options: TemplateEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      await logEmailPending({
        to: options.to,
        subject: options.subject,
        templateType: options.templateType,
        priority: options.priority || 'normal',
        metadata: {
          userAgent: 'EmailServiceServer',
          provider: 'nodemailer',
          templateEngine: 'React Email',
        },
      });

      const html = await renderEmailTemplate(options.templateType, options.templateData);

      return await this.sendEmail({
        to: options.to,
        subject: options.subject,
        html,
        priority: options.priority,
      });
    } catch (error) {
      simpleLogger.warn('Fallback para sistema legado de templates (server)', {
        templateType: options.templateType,
        error: error instanceof Error ? error.message : String(error),
      });

      try {
        const html = getEmailTemplate(options.templateType, options.templateData);
        return await this.sendEmail({
          to: options.to,
          subject: options.subject,
          html,
          priority: options.priority,
        });
      } catch (fallbackError) {
        await logEmailFailed({
          to: options.to,
          subject: options.subject,
          templateType: options.templateType,
          priority: options.priority || 'normal',
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
          metadata: {
            userAgent: 'EmailServiceServer',
            provider: 'nodemailer',
            templateEngine: 'Fallback Failed',
            retryCount: 1,
          },
        });

        simpleLogger.error('Erro ao enviar email com template (fallback falhou) (server)', {
          templateType: options.templateType,
          to: options.to,
          subject: options.subject,
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        });

        return { success: false, error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError) };
      }
    }
  }

  // Compatibilidade: wrapper para sendNotificationEmail
  async sendNotificationEmail(
    to: string,
    name: string,
    notificationTitle: string,
    notificationMessage: string,
    notificationType: 'info' | 'success' | 'warning' | 'error' = 'info',
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return await this.sendTemplateEmail({
      templateType: 'notification',
      to,
      subject: notificationTitle,
      templateData: {
        name,
        email: to,
        notificationType,
        title: notificationTitle,
        message: notificationMessage,
        priority,
        actionUrl: `${process.env.NEXTAUTH_URL}/notifications`,
        actionText: 'Ver Notificações',
        metadata: {
          timestamp: new Date().toLocaleString('pt-BR'),
          source: 'Sistema',
          priority,
        },
      },
      priority,
    });
  }

  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isSendEnabled()) {
        return { success: true };
      }
      this.initializeTransporter();
      await this.transporter!.verify();
      simpleLogger.info('Conexão SMTP verificada com sucesso (server)');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      simpleLogger.error('Erro na verificação da conexão SMTP (server)', { error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  async getEmailStats(): Promise<EmailStats> {
    try {
      const metrics = await emailLogger.getEmailMetrics('all');
      return {
        total: metrics.total,
        sent: metrics.sent,
        failed: metrics.failed,
        pending: metrics.pending,
      };
    } catch (error) {
      simpleLogger.error('Erro ao obter estatísticas de email (server)', { error });
      return { total: 0, sent: 0, failed: 0, pending: 0 };
    }
  }

  async getEmailLogs(filters = {}) {
    try {
      return await emailLogger.getEmailLogs(filters as any);
    } catch (error) {
      simpleLogger.error('Erro ao obter logs de email (server)', { error, filters });
      return [];
    }
  }

  async cleanupOldEmailLogs(daysToKeep: number = 90): Promise<number> {
    try {
      return await emailLogger.cleanupOldLogs(daysToKeep);
    } catch (error) {
      simpleLogger.error('Erro ao limpar logs antigos de email (server)', { error, daysToKeep });
      throw error;
    }
  }
}

export const emailService = new EmailService();

export async function sendNotificationByEmail(
  userId: string,
  notificationTitle: string,
  notificationMessage: string,
  notificationType: 'info' | 'success' | 'warning' | 'error' = 'info',
  priority: 'low' | 'normal' | 'high' = 'normal'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user?.email) {
      return { success: false, error: 'Email do usuário não encontrado' };
    }

    return await emailService.sendNotificationEmail(
      user.email,
      user.name || 'Usuário',
      notificationTitle,
      notificationMessage,
      notificationType,
      priority
    );
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
