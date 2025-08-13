"use client"

import { simpleLogger } from '@/lib/simple-logger';
import { emailService } from '@/lib/email-service';
import { emailLogger } from '@/lib/email-logger';
import { prisma } from '@/lib/prisma';

export interface NotificationOptions {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'normal' | 'high' | 'critical';
  channels: ('in_app' | 'email' | 'push' | 'sms')[];
  emailOptions?: {
    subject?: string;
    templateData?: Record<string, any>;
    actionUrl?: string;
    actionText?: string;
  };
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;
  inAppNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  emailTypes: {
    security: boolean;
    system: boolean;
    marketing: boolean;
    updates: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string;   // "08:00"
    timezone: string;
  };
}

export interface NotificationDeliveryResult {
  success: boolean;
  channel: string;
  messageId?: string;
  error?: string;
  deliveredAt: Date;
}

class NotificationService {
  /**
   * Envia notificação pelos canais especificados
   */
  async sendNotification(options: NotificationOptions): Promise<{
    success: boolean;
    deliveryResults: NotificationDeliveryResult[];
    notificationId: string;
  }> {
    try {
      // Buscar preferências do usuário
      const user = await prisma.user.findUnique({
        where: { id: options.userId },
        include: { notificationPreferences: true },
      });

      if (!user) {
        throw new Error(`Usuário não encontrado: ${options.userId}`);
      }

      // Criar registro da notificação
      const notification = await prisma.notification.create({
        data: {
          userId: options.userId,
          title: options.title,
          message: options.message,
          type: options.type,
          priority: options.priority,
          metadata: options.metadata ? JSON.stringify(options.metadata) : undefined,
          createdAt: new Date(),
        },
      });

      const deliveryResults: NotificationDeliveryResult[] = [];
      const preferences = user.notificationPreferences;

      // Verificar se está em horário de silêncio
      const isQuietHours = this.isQuietHours(preferences);
      
      // Filtrar canais baseado nas preferências do usuário
      const allowedChannels = this.filterChannelsByPreferences(options.channels, preferences, isQuietHours, options.priority);

      // Enviar por cada canal permitido
      for (const channel of allowedChannels) {
        try {
          let result: NotificationDeliveryResult;

          switch (channel) {
            case 'in_app':
              result = await this.sendInAppNotification(notification.id, options);
              break;
            case 'email':
              result = await this.sendEmailNotification(user, options);
              break;
            case 'push':
              result = await this.sendPushNotification(user, options);
              break;
            case 'sms':
              result = await this.sendSMSNotification(user, options);
              break;
            default:
              throw new Error(`Canal não suportado: ${channel}`);
          }

          deliveryResults.push(result);
        } catch (error) {
          deliveryResults.push({
            success: false,
            channel,
            error: error instanceof Error ? error.message : String(error),
            deliveredAt: new Date(),
          });

          simpleLogger.error(`Falha ao enviar notificação via ${channel}`, {
            userId: options.userId,
            notificationId: notification.id,
            channel,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      // Atualizar status da notificação
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: deliveryResults.some(r => r.success) ? 'sent' : 'failed',
          metadata: JSON.stringify({
            ...(notification.metadata ? JSON.parse(String(notification.metadata)) : {}),
            deliveryLog: deliveryResults
          }),
          updatedAt: new Date(),
        },
      });

      const success = deliveryResults.some(r => r.success);

      simpleLogger.info('Notificação processada', {
        userId: options.userId,
        notificationId: notification.id,
        channels: allowedChannels,
        success,
        deliveryCount: deliveryResults.filter(r => r.success).length,
      });

      return {
        success,
        deliveryResults,
        notificationId: notification.id,
      };
    } catch (error) {
      simpleLogger.error('Erro ao enviar notificação', {
        userId: options.userId,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * Envia notificação in-app
   */
  private async sendInAppNotification(
    notificationId: string, 
    options: NotificationOptions
  ): Promise<NotificationDeliveryResult> {
    try {
      // A notificação in-app já foi criada no banco
      // Aqui poderia integrar com WebSocket para notificação em tempo real
      
      // TODO: Implementar WebSocket/Server-Sent Events para notificações em tempo real
      
      return {
        success: true,
        channel: 'in_app',
        messageId: notificationId,
        deliveredAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        channel: 'in_app',
        error: error instanceof Error ? error.message : String(error),
        deliveredAt: new Date(),
      };
    }
  }

  /**
   * Envia notificação por email
   */
  private async sendEmailNotification(
    user: any, 
    options: NotificationOptions
  ): Promise<NotificationDeliveryResult> {
    try {
      const emailOptions = options.emailOptions || {};
      
      const result = await emailService.sendTemplateEmail({
        templateType: 'notification',
        to: user.email,
        subject: emailOptions.subject || options.title,
        templateData: {
          name: user.name || 'Usuário',
          email: user.email,
          notificationType: options.type,
          title: options.title,
          message: options.message,
          actionText: emailOptions.actionText,
          actionUrl: emailOptions.actionUrl,
          metadata: {
            timestamp: new Date().toLocaleString('pt-BR'),
            source: 'Sistema',
            priority: options.priority,
          },
          ...emailOptions.templateData,
        },
        priority: this.mapPriorityToEmail(options.priority),
      });

      return {
        success: result.success,
        channel: 'email',
        messageId: result.messageId,
        error: result.error,
        deliveredAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        channel: 'email',
        error: error instanceof Error ? error.message : String(error),
        deliveredAt: new Date(),
      };
    }
  }

  /**
   * Envia notificação push
   */
  private async sendPushNotification(
    user: any, 
    options: NotificationOptions
  ): Promise<NotificationDeliveryResult> {
    try {
      // TODO: Implementar notificações push usando web-push ou service similar
      
      simpleLogger.info('Push notification seria enviada', {
        userId: user.id,
        title: options.title,
        message: options.message,
      });

      return {
        success: true,
        channel: 'push',
        messageId: `push_${Date.now()}`,
        deliveredAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        channel: 'push',
        error: error instanceof Error ? error.message : String(error),
        deliveredAt: new Date(),
      };
    }
  }

  /**
   * Envia notificação por SMS
   */
  private async sendSMSNotification(
    user: any, 
    options: NotificationOptions
  ): Promise<NotificationDeliveryResult> {
    try {
      // TODO: Implementar SMS usando Twilio, AWS SNS ou service similar
      
      simpleLogger.info('SMS seria enviado', {
        userId: user.id,
        phone: user.phone,
        message: options.message,
      });

      return {
        success: true,
        channel: 'sms',
        messageId: `sms_${Date.now()}`,
        deliveredAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        channel: 'sms',
        error: error instanceof Error ? error.message : String(error),
        deliveredAt: new Date(),
      };
    }
  }

  /**
   * Verifica se está em horário de silêncio
   */
  private isQuietHours(preferences: any): boolean {
    if (!preferences?.quietHours?.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { startTime, endTime } = preferences.quietHours;
    
    // Lógica simplificada - pode ser melhorada com bibliotecas de timezone
    if (startTime < endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Filtra canais baseado nas preferências do usuário
   */
  private filterChannelsByPreferences(
    channels: NotificationOptions['channels'],
    preferences: any,
    isQuietHours: boolean,
    priority: NotificationOptions['priority']
  ): NotificationOptions['channels'] {
    const allowedChannels = channels.filter(channel => {
      // Verificar preferências básicas
      switch (channel) {
        case 'in_app':
          return preferences?.inAppNotifications !== false;
        case 'email':
          return preferences?.emailNotifications !== false;
        case 'push':
          return preferences?.pushNotifications !== false;
        case 'sms':
          return preferences?.smsNotifications !== false;
        default:
          return false;
      }
    });

    // Durante horário de silêncio, só permite notificações críticas
    if (isQuietHours && priority !== 'critical') {
      return allowedChannels.filter(channel => channel === 'in_app');
    }

    return allowedChannels;
  }

  /**
   * Mapeia prioridade da notificação para prioridade de email
   */
  private mapPriorityToEmail(priority: NotificationOptions['priority']): 'low' | 'normal' | 'high' {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'high';
      case 'low':
        return 'low';
      default:
        return 'normal';
    }
  }

  /**
   * Busca notificações do usuário
   */
  async getUserNotifications(
    userId: string,
    filters: {
      type?: NotificationOptions['type'];
      priority?: NotificationOptions['priority'];
      read?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    try {
      const where: any = { userId };

      if (filters.type) where.type = filters.type;
      if (filters.priority) where.priority = filters.priority;
      if (filters.read !== undefined) where.readAt = filters.read ? { not: null } : null;

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      });

      return notifications;
    } catch (error) {
      simpleLogger.error('Erro ao buscar notificações do usuário', {
        userId,
        filters,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Marca notificação como lida
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId,
        },
        data: {
          readAt: new Date(),
          updatedAt: new Date(),
        },
      });

      simpleLogger.info('Notificação marcada como lida', {
        notificationId,
        userId,
      });
    } catch (error) {
      simpleLogger.error('Erro ao marcar notificação como lida', {
        notificationId,
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Atualiza preferências de notificação do usuário
   */
  async updateNotificationPreferences(
    userId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      await prisma.userNotificationPreferences.upsert({
        where: { userId },
        update: {
          ...preferences,
          updatedAt: new Date(),
        },
        create: {
          userId,
          ...preferences,
          createdAt: new Date(),
        },
      });

      simpleLogger.info('Preferências de notificação atualizadas', {
        userId,
        preferences,
      });
    } catch (error) {
      simpleLogger.error('Erro ao atualizar preferências de notificação', {
        userId,
        preferences,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

// Instância singleton
export const notificationService = new NotificationService();

// Funções auxiliares para facilitar o uso
export async function sendSecurityAlert(
  userId: string,
  alertType: string,
  details: Record<string, any>
) {
  return notificationService.sendNotification({
    userId,
    title: `🔒 Alerta de Segurança: ${alertType}`,
    message: 'Atividade suspeita detectada em sua conta.',
    type: 'warning',
    priority: 'high',
    channels: ['in_app', 'email'],
    emailOptions: {
      subject: `Alerta de Segurança - ${alertType}`,
      actionUrl: `${process.env.NEXTAUTH_URL}/security`,
      actionText: 'Revisar Segurança',
      templateData: {
        alertType,
        ...details,
      },
    },
  });
}

export async function sendWelcomeNotification(userId: string, userName: string) {
  return notificationService.sendNotification({
    userId,
    title: '🎉 Bem-vindo ao Método Atuarial!',
    message: 'Sua conta foi criada com sucesso. Explore nossos recursos.',
    type: 'success',
    priority: 'normal',
    channels: ['in_app', 'email'],
    emailOptions: {
      subject: 'Bem-vindo ao Método Atuarial!',
      actionUrl: `${process.env.NEXTAUTH_URL}/dashboard`,
      actionText: 'Explorar Plataforma',
      templateData: {
        name: userName,
      },
    },
  });
}

export async function sendSystemUpdate(
  userId: string,
  updateTitle: string,
  updateMessage: string
) {
  return notificationService.sendNotification({
    userId,
    title: `📢 Atualização do Sistema: ${updateTitle}`,
    message: updateMessage,
    type: 'info',
    priority: 'normal',
    channels: ['in_app', 'email'],
    emailOptions: {
      subject: `Atualização do Sistema - ${updateTitle}`,
      actionUrl: `${process.env.NEXTAUTH_URL}/updates`,
      actionText: 'Ver Detalhes',
    },
  });
}
