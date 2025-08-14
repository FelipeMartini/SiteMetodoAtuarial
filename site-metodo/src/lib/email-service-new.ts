import { emailService as emailServiceServer } from '@/lib/email-service.server';
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

// Este arquivo fornece uma API compatível (legacy) que delega
// a toda a lógica de envio para o serviço server (`email-service.server`).
// Evitamos referências diretas a nodemailer aqui para não poluir o bundle
// e para manter as tipagens apenas no server.

// Instância compatível que apenas reexporta métodos do serviço server.
export const emailService = {
  sendEmail: async (options: EmailOptions) => emailServiceServer.sendEmail(options as any),
  sendTemplateEmail: async (options: TemplateEmailOptions) => emailServiceServer.sendTemplateEmail(options as any),
  sendBulkEmails: async (emails: EmailOptions[]) => emailServiceServer.sendBulkEmails(emails as any),
  sendWelcomeEmail: async (to: string, name: string, email: string) => emailServiceServer.sendWelcomeEmail(to, name, email),
  sendSecurityAlert: async (to: string, name: string, alertType: string, details: Record<string, unknown>) => emailServiceServer.sendSecurityAlert(to, name, alertType, details),
  sendNotificationEmail: async (to: string, name: string, notificationTitle: string, notificationMessage: string, notificationType?: any, priority?: any) => emailServiceServer.sendNotificationEmail(to, name, notificationTitle, notificationMessage, notificationType, priority),
  sendPasswordResetEmail: async (to: string, name: string, resetUrl: string, expiresIn?: string) => emailServiceServer.sendPasswordResetEmail(to, name, resetUrl, expiresIn),
  verifyConnection: async () => emailServiceServer.verifyConnection(),
  getEmailStats: async () => emailServiceServer.getEmailStats(),
  getEmailLogs: async (filters?: any) => emailServiceServer.getEmailLogs(filters),
  cleanupOldEmailLogs: async (daysToKeep?: number) => emailServiceServer.cleanupOldEmailLogs(daysToKeep),
};

// Função helper para integração com notificações (compat)
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
