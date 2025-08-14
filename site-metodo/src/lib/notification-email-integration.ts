import { emailService, sendNotificationByEmail } from '@/lib/email-service';
import { prisma } from '@/lib/prisma';
import { simpleLogger } from '@/lib/simple-logger';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationEmailIntegrationOptions {
  enabled: boolean;
  types: Array<NotificationType>;
  priorities: Array<NotificationPriority>;
  emailDelay?: number; // Delay em minutos antes de enviar email
}

class NotificationEmailIntegration {
  private options: NotificationEmailIntegrationOptions;

  constructor(options: NotificationEmailIntegrationOptions) {
    this.options = options;
  }

  /**
   * Processa uma notificação para envio por email
   */
  async processNotificationForEmail(notificationId: string): Promise<void> {
    try {
      if (!this.options.enabled) {
        return;
      }

      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      if (!notification || !notification.user) {
        simpleLogger.warn('Notificação ou usuário não encontrado para envio de email', {
          notificationId
        });
        return;
      }

      // Verificar se deve enviar email para este tipo e prioridade
      if (!this.shouldSendEmail(notification.type as NotificationType, notification.priority as NotificationPriority)) {
        return;
      }

      // Verificar preferências do usuário
      const userPreferences = await this.getUserEmailPreferences(notification.userId);
      if (!userPreferences.emailNotifications) {
        return;
      }

      // Mapear prioridade para tipo compatível com email service
      const emailPriority: 'low' | 'normal' | 'high' = (notification.priority as NotificationPriority) === 'urgent' ? 'high' : (notification.priority as 'low' | 'normal' | 'high');
      
      // Enviar email
      const result = await sendNotificationByEmail(
        notification.userId,
        notification.title,
        notification.message,
        notification.type as NotificationType,
        emailPriority
      );

      if (result.success) {
        simpleLogger.info('Email de notificação enviado com sucesso', {
          notificationId,
          userId: notification.userId,
          messageId: result.messageId
        });

        // Marcar que o email foi enviado na notificação
        await this.markEmailSent(notificationId, result.messageId);
      } else {
        simpleLogger.error('Falha ao enviar email de notificação', {
          notificationId,
          userId: notification.userId,
          error: result.error
        });
      }

    } catch (error) {
      simpleLogger.error('Erro no processamento de email de notificação', {
        notificationId,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Envia email de boas-vindas para novo usuário
   */
  async sendWelcomeEmail(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
      });

      if (!user?.email) {
        return { success: false, error: 'Usuário não encontrado ou sem email' };
      }

      const result = await emailService.sendWelcomeEmail(
        user.email,
        user.name || 'Usuário',
        user.email
      );

      if (result.success) {
        // Criar notificação sobre o email de boas-vindas
        await prisma.notification.create({
          data: {
            userId,
            title: 'Email de boas-vindas enviado',
            message: 'Enviamos um email de boas-vindas para você. Verifique sua caixa de entrada.',
            type: 'success',
            priority: 'normal',
            metadata: {
              emailType: 'welcome',
              messageId: result.messageId
            }
          }
        });

        simpleLogger.info('Email de boas-vindas enviado', {
          userId,
          email: user.email,
          messageId: result.messageId
        });
      }

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      simpleLogger.error('Erro ao enviar email de boas-vindas', { userId, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Envia alerta de segurança por email
   */
  async sendSecurityAlert(
    userId: string,
    alertType: string,
    details: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true }
      });

      if (!user?.email) {
        return { success: false, error: 'Usuário não encontrado ou sem email' };
      }

      const result = await emailService.sendSecurityAlert(
        user.email,
        user.name || 'Usuário',
        alertType,
        details
      );

      if (result.success) {
        // Criar notificação sobre o alerta de segurança
        await prisma.notification.create({
          data: {
            userId,
            title: 'Alerta de segurança enviado',
            message: `Enviamos um alerta de segurança para seu email sobre: ${alertType}`,
            type: 'warning',
            priority: 'high',
            metadata: {
              emailType: 'security-alert',
              alertType,
              messageId: result.messageId
            }
          }
        });

        simpleLogger.info('Alerta de segurança enviado', {
          userId,
          email: user.email,
          alertType,
          messageId: result.messageId
        });
      }

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      simpleLogger.error('Erro ao enviar alerta de segurança', { userId, alertType, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Processa emails em lote para notificações não processadas
   */
  async processPendingEmailNotifications(): Promise<void> {
    try {
      if (!this.options.enabled) {
        return;
      }

      // Buscar notificações que precisam de email
      const cutoffDate = new Date();
      cutoffDate.setMinutes(cutoffDate.getMinutes() - (this.options.emailDelay || 5));

      const notifications = await prisma.notification.findMany({
        where: {
          createdAt: {
            lte: cutoffDate
          },
          type: {
            in: this.options.types
          },
          priority: {
            in: this.options.priorities
          },
          metadata: {
            not: {
              path: ['emailSent'],
              equals: true
            }
          }
        },
        take: 10, // Processar até 10 por vez
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      for (const notification of notifications) {
        await this.processNotificationForEmail(notification.id);
        
        // Pequeno delay entre envios
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (notifications.length > 0) {
        simpleLogger.info('Processamento de emails de notificação concluído', {
          processed: notifications.length
        });
      }

    } catch (error) {
      simpleLogger.error('Erro no processamento em lote de emails', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  private shouldSendEmail(
    type: 'info' | 'success' | 'warning' | 'error',
    priority: 'low' | 'normal' | 'high' | 'urgent'
  ): boolean {
    return this.options.types.includes(type) && this.options.priorities.includes(priority);
  }

  private async getUserEmailPreferences(_userId: string): Promise<{ emailNotifications: boolean }> {
    // Por agora, assumir que todos querem receber emails
    // No futuro, pode buscar de uma tabela de preferências
    return { emailNotifications: true };
  }

  private async markEmailSent(notificationId: string, messageId?: string): Promise<void> {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          metadata: {
            emailSent: true,
            emailMessageId: messageId,
            emailSentAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      simpleLogger.error('Erro ao marcar email como enviado', {
        notificationId,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

// Instância global com configurações padrão
export const notificationEmailIntegration = new NotificationEmailIntegration({
  enabled: true,
  types: ['success', 'warning', 'error'], // Não enviar emails para 'info' por padrão
  priorities: ['normal', 'high', 'urgent'], // Não enviar para 'low' por padrão
  emailDelay: 5 // 5 minutos de delay
});

// Função helper para usar em hooks
export async function sendWelcomeEmailToUser(userId: string) {
  return await notificationEmailIntegration.sendWelcomeEmail(userId);
}

export async function sendSecurityAlertToUser(
  userId: string,
  alertType: string,
  details: Record<string, unknown>
) {
  return await notificationEmailIntegration.sendSecurityAlert(userId, alertType, details);
}

// Função para ser chamada em cron job ou background task
export async function processNotificationEmails() {
  return await notificationEmailIntegration.processPendingEmailNotifications();
}
