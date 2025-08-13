"use client"

import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { renderEmailTemplate, EmailTemplateType, getEmailTemplate } from '@/emails/templates';
import { simpleLogger } from '@/lib/simple-logger';

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
  templateType: 'welcome' | 'security-alert' | 'notification';
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

      // Log do envio
      await this.logEmailSent({
        to: options.to,
        subject: options.subject,
        messageId: info.messageId,
        status: 'sent',
        priority: options.priority,
      });

      simpleLogger.info('Email enviado com sucesso', {
        to: options.to,
        subject: options.subject,
        messageId: info.messageId,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      // Log do erro
      await this.logEmailSent({
        to: options.to,
        subject: options.subject,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        priority: options.priority,
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
   * Envia email usando template
   */
  async sendTemplateEmail(options: TemplateEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = getEmailTemplate(options.templateType, options.templateData);
      
      return await this.sendEmail({
        to: options.to,
        subject: options.subject,
        html,
        priority: options.priority,
      });
    } catch (error) {
      simpleLogger.error('Erro ao enviar email com template', {
        templateType: options.templateType,
        to: options.to,
        subject: options.subject,
        error: error instanceof Error ? error.message : String(error),
      });

      return { success: false, error: error instanceof Error ? error.message : String(error) };
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
      subject: alertTitles[alertType as keyof typeof alertTitles] || 'Alerta de Segurança',
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
        notificationTitle,
        notificationMessage,
        priority,
        actionUrl: `${process.env.NEXTAUTH_URL}/notifications`,
        actionText: 'Ver Notificações',
        timestamp: new Date().toLocaleString('pt-BR'),
      },
      priority,
    });
  }

  /**
   * Verifica conectividade do SMTP
   */
  async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.transporter.verify();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Obtém estatísticas de email
   */
  async getEmailStats(userId?: string): Promise<EmailStats> {
    const where = userId ? { userId } : {};
    
    const [total, sent, failed, pending, lastEmailLog] = await Promise.all([
      prisma.emailLog.count({ where }),
      prisma.emailLog.count({ where: { ...where, status: 'sent' } }),
      prisma.emailLog.count({ where: { ...where, status: 'failed' } }),
      prisma.emailLog.count({ where: { ...where, status: 'pending' } }),
      prisma.emailLog.findFirst({
        where: { ...where, status: 'sent' },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      sent,
      failed,
      pending,
      lastSent: lastEmailLog?.createdAt,
    };
  }

  /**
   * Log interno de emails enviados
   */
  private async logEmailSent(data: {
    to: string | string[];
    subject: string;
    messageId?: string;
    status: 'sent' | 'failed' | 'pending';
    error?: string;
    priority?: string;
    userId?: string;
  }): Promise<void> {
    try {
      await prisma.emailLog.create({
        data: {
          to: Array.isArray(data.to) ? data.to.join(', ') : data.to,
          subject: data.subject,
          messageId: data.messageId,
          status: data.status,
          error: data.error,
          priority: data.priority || 'normal',
          userId: data.userId,
          sentAt: data.status === 'sent' ? new Date() : null,
        },
      });
    } catch (error) {
      simpleLogger.error('Erro ao salvar log de email', { error });
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
