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
  cid?: string; // Para imagens inline
}

export interface TemplateEmailOptions {
  templateType: EmailTemplateType;
  to: string | string[];
  subject: string;
  templateData: Record<string, any>;
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
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
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

  /**
   * Envia email simples
   */
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Log tentativa de envio
      await logEmailPending({
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        priority: options.priority || 'normal',
        metadata: {
          userAgent: 'EmailService',
          provider: 'nodemailer',
        },
      });

      const info = await this.transporter.sendMail({
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

      // Log do envio bem-sucedido
      await logEmailSent({
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        messageId: info.messageId,
        priority: options.priority || 'normal',
        metadata: {
          userAgent: 'EmailService',
          provider: 'nodemailer',
          deliveryTime: Date.now(),
        },
        sentAt: new Date(),
      });

      simpleLogger.info('Email enviado com sucesso', {
        to: options.to,
        subject: options.subject,
        messageId: info.messageId,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      // Log do erro
      await logEmailFailed({
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        priority: options.priority || 'normal',
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          userAgent: 'EmailService',
          provider: 'nodemailer',
          retryCount: 0,
        },
      });

      simpleLogger.error('Erro ao enviar email', {
        to: options.to,
        subject: options.subject,
        error: error instanceof Error ? error.message : String(error),
      });

      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Envia email usando template moderno React Email
   */
  async sendTemplateEmail(options: TemplateEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Log tentativa de envio com template
      await logEmailPending({
        to: options.to,
        subject: options.subject,
        templateType: options.templateType,
        priority: options.priority || 'normal',
        metadata: {
          userAgent: 'EmailService',
          provider: 'nodemailer',
          templateEngine: 'React Email',
        },
      });

      // Usar o novo sistema React Email
      const html = await renderEmailTemplate(options.templateType, options.templateData);
      
      return await this.sendEmail({
        to: options.to,
        subject: options.subject,
        html,
        priority: options.priority,
      });
    } catch (error) {
      // Fallback para o sistema legado se React Email falhar
      simpleLogger.warn('Fallback para sistema legado de templates', {
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
        // Log do erro final
        await logEmailFailed({
          to: options.to,
          subject: options.subject,
          templateType: options.templateType,
          priority: options.priority || 'normal',
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
          metadata: {
            userAgent: 'EmailService',
            provider: 'nodemailer',
            templateEngine: 'Fallback Failed',
            retryCount: 1,
          },
        });

        simpleLogger.error('Erro ao enviar email com template (fallback falhou)', {
          templateType: options.templateType,
          to: options.to,
          subject: options.subject,
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        });

        return { success: false, error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError) };
      }
    }
  }

  /**
   * Envia emails em lote
   */
  async sendBulkEmails(emails: EmailOptions[]): Promise<{ sent: number; failed: number; results: Array<{ success: boolean; messageId?: string; error?: string }> }> {
    const results = [];
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      const result = await this.sendEmail(email);
      results.push(result);
      
      if (result.success) {
        sent++;
      } else {
        failed++;
      }

      // Pequeno delay entre envios para evitar spam
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    simpleLogger.info('Envio em lote concluído', { sent, failed, total: emails.length });

    return { sent, failed, results };
  }

  /**
   * Envia email de boas-vindas
   */
  async sendWelcomeEmail(to: string, name: string, email: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return await this.sendTemplateEmail({
      templateType: 'welcome',
      to,
      subject: 'Bem-vindo ao Método Atuarial!',
      templateData: {
        name,
        email,
        loginUrl: `${process.env.NEXTAUTH_URL}/login`,
      },
      priority: 'normal',
    });
  }

  /**
   * Envia alerta de segurança
   */
  async sendSecurityAlert(
    to: string, 
    name: string, 
    alertType: string, 
    details: Record<string, any>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const alertTitles = {
      login_attempt: 'Tentativa de Login Detectada',
      password_change: 'Senha Alterada',
      suspicious_activity: 'Atividade Suspeita Detectada',
    };

    return await this.sendTemplateEmail({
      templateType: 'security-alert',
      to,
      subject: `Alerta de Segurança: ${alertTitles[alertType as keyof typeof alertTitles] || alertType}`,
      templateData: {
        name,
        email: to,
        alertType,
        ...details,
        actionUrl: `${process.env.NEXTAUTH_URL}/security`,
      },
      priority: 'high',
    });
  }

  /**
   * Envia notificação por email
   */
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
      subject: `Notificação: ${notificationTitle}`,
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

  /**
   * Envia email de reset de senha
   */
  async sendPasswordResetEmail(
    to: string,
    name: string,
    resetUrl: string,
    expiresIn: string = '24 horas'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return await this.sendTemplateEmail({
      templateType: 'password-reset',
      to,
      subject: 'Redefinição de Senha - Método Atuarial',
      templateData: {
        name,
        email: to,
        resetUrl,
        expiresIn,
        timestamp: new Date().toLocaleString('pt-BR'),
      },
      priority: 'high',
    });
  }

  /**
   * Verifica conectividade do SMTP
   */
  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.transporter.verify();
      simpleLogger.info('Conexão SMTP verificada com sucesso');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      simpleLogger.error('Erro na verificação da conexão SMTP', { error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Obtém estatísticas de email usando o novo sistema de logs
   */
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
      simpleLogger.error('Erro ao obter estatísticas de email', { error });
      // Fallback para estatísticas básicas
      return {
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
      };
    }
  }

  /**
   * Obtém logs de email detalhados
   */
  async getEmailLogs(filters: {
    status?: 'sent' | 'failed' | 'pending' | 'bounced' | 'delivered' | 'opened' | 'clicked';
    priority?: 'low' | 'normal' | 'high' | 'critical';
    templateType?: string;
    to?: string;
    subject?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      return await emailLogger.getEmailLogs(filters);
    } catch (error) {
      simpleLogger.error('Erro ao obter logs de email', { error, filters });
      return [];
    }
  }

  /**
   * Obtém estatísticas completas de email
   */
  async getDetailedEmailStats() {
    try {
      return await emailLogger.getEmailStats();
    } catch (error) {
      simpleLogger.error('Erro ao obter estatísticas detalhadas de email', { error });
      throw error;
    }
  }

  /**
   * Limpa logs antigos de email
   */
  async cleanupOldEmailLogs(daysToKeep: number = 90): Promise<number> {
    try {
      return await emailLogger.cleanupOldLogs(daysToKeep);
    } catch (error) {
      simpleLogger.error('Erro ao limpar logs antigos de email', { error, daysToKeep });
      throw error;
    }
  }
}

// Instância singleton
export const emailService = new EmailService();

// Função helper para integração com notificações
export async function sendNotificationByEmail(
  userId: string,
  notificationTitle: string,
  notificationMessage: string,
  notificationType: 'info' | 'success' | 'warning' | 'error' = 'info',
  priority: 'low' | 'normal' | 'high' = 'normal'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Buscar dados do usuário
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
