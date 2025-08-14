import { emailService as emailServiceServer, EmailOptions, TemplateEmailOptions, IEmailService } from '@/lib/email-service.server';
import { prisma } from '@/lib/prisma';
// Mantemos imports de templates e loggers por compatibilidade, mas alguns deles
// não são usados diretamente aqui. Se removê-los causar erro em outros módulos,
// favor avisar para ajustarmos a exportação central.
import { renderEmailTemplate, EmailTemplateType, getEmailTemplate } from '@/emails/templates';
import { simpleLogger } from '@/lib/simple-logger';
import { emailLogger, logEmailSent, logEmailFailed, logEmailPending } from '@/lib/email-logger';

// Reusar tipos exportados pelo serviço server para garantir consistência de API

// Este arquivo fornece uma API compatível (legacy) que delega
// a toda a lógica de envio para o serviço server (`email-service.server`).
// Evitamos referências diretas a nodemailer aqui para não poluir o bundle
// e para manter as tipagens apenas no server.

// Instância compatível que apenas reexporta métodos do serviço server.
export const emailService: IEmailService = {
  sendEmail: async (options: EmailOptions) => emailServiceServer.sendEmail(options),
  sendTemplateEmail: async (options: TemplateEmailOptions) => emailServiceServer.sendTemplateEmail(options),
  sendBulkEmails: async (emails: EmailOptions[]) => emailServiceServer.sendBulkEmails(emails),
  sendWelcomeEmail: async (to: string, name: string, email: string) => emailServiceServer.sendWelcomeEmail(to, name, email),
  sendSecurityAlert: async (to: string, name: string, alertType: string, details: Record<string, unknown>) => emailServiceServer.sendSecurityAlert(to, name, alertType, details),
  sendNotificationEmail: async (to: string, name: string, notificationTitle: string, notificationMessage: string, notificationType?: 'info' | 'success' | 'warning' | 'error', priority?: 'low' | 'normal' | 'high') =>
    emailServiceServer.sendNotificationEmail(to, name, notificationTitle, notificationMessage, notificationType, priority),
  sendPasswordResetEmail: async (to: string, name: string, resetUrl: string, expiresIn?: string) => emailServiceServer.sendPasswordResetEmail(to, name, resetUrl, expiresIn),
  verifyConnection: async () => emailServiceServer.verifyConnection(),
  getEmailStats: async () => emailServiceServer.getEmailStats(),
  getEmailLogs: async (filters?: any) => emailServiceServer.getEmailLogs(filters),
  cleanupOldEmailLogs: async (daysToKeep?: number) => emailServiceServer.cleanupOldEmailLogs(daysToKeep),
  getDetailedEmailStats: async () => (emailServiceServer as any).getDetailedEmailStats(),
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
