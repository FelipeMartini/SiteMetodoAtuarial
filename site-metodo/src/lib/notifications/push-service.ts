import webpush from 'web-push';
import { PrismaClient } from '@prisma/client';
import { NotificationData, NotificationPriority } from '@/types/notifications';
import { simpleLogger } from '@/lib/simple-logger';

/**
 * Serviço de Push Notifications para navegadores
 * Suporte para notificações web push usando Web Push Protocol
 */
export class PushNotificationService {
  private prisma: PrismaClient;
  private vapidKeys: {
    publicKey: string;
    privateKey: string;
    subject: string;
  };

  constructor(prisma: PrismaClient, config: PushConfig) {
    this.prisma = prisma;
    this.vapidKeys = {
      publicKey: config.vapidPublicKey,
      privateKey: config.vapidPrivateKey,
      subject: config.subject
    };

    this.initializeWebPush();
  }

  /**
   * Registra subscription de push notification
   */
  async registerSubscription(
    userId: string, 
    subscription: {
      endpoint: string;
      keys: {
        p256dh: string;
        auth: string;
      };
    },
    userAgent?: string
  ): Promise<string> {
    try {
      // Verifica se subscription já existe
      const existing = await this.prisma.pushSubscription.findUnique({
        where: { endpoint: subscription.endpoint }
      });

      if (existing) {
        // Atualiza subscription existente
        await this.prisma.pushSubscription.update({
          where: { endpoint: subscription.endpoint },
          data: {
            userId,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
            userAgent,
            isActive: true
          }
        });

        simpleLogger.info('Push subscription atualizada', { 
          userId, 
          endpoint: this.maskEndpoint(subscription.endpoint) 
        });

        return existing.id;
      } else {
        // Cria nova subscription
        const created = await this.prisma.pushSubscription.create({
          data: {
            userId,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
            userAgent,
            isActive: true
          }
        });

        simpleLogger.info('Nova push subscription registrada', { 
          userId, 
          subscriptionId: created.id 
        });

        return created.id;
      }
    } catch (error) {
      simpleLogger.error('Erro ao registrar push subscription', { error, userId });
      throw error;
    }
  }

  /**
   * Remove subscription
   */
  async unregisterSubscription(endpoint: string): Promise<void> {
    try {
      await this.prisma.pushSubscription.update({
        where: { endpoint },
        data: { isActive: false }
      });

      simpleLogger.info('Push subscription removida', { 
        endpoint: this.maskEndpoint(endpoint) 
      });
    } catch (error) {
      simpleLogger.error('Erro ao remover subscription', { error, endpoint });
      throw error;
    }
  }

  /**
   * Envia push notification para usuário específico
   */
  async sendToUser(userId: string, notification: NotificationData): Promise<boolean> {
    try {
      const subscriptions = await this.prisma.pushSubscription.findMany({
        where: {
          userId,
          isActive: true
        }
      });

      if (subscriptions.length === 0) {
        simpleLogger.warn('Nenhuma subscription ativa encontrada', { userId });
        return false;
      }

      const payload = this.createPushPayload(notification);
      const options = this.getPushOptions(notification.priority);

      let sent = 0;
      const failedSubscriptions: string[] = [];

      for (const subscription of subscriptions) {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          };

          await webpush.sendNotification(pushSubscription, payload, options);
          sent++;

          simpleLogger.debug('Push notification enviada', { 
            userId, 
            subscriptionId: subscription.id 
          });
        } catch (error: any) {
          simpleLogger.warn('Falha ao enviar push notification', { 
            error: error.message, 
            userId, 
            subscriptionId: subscription.id 
          });

          // Se subscription é inválida, marca como inativa
          if (this.isSubscriptionInvalid(error)) {
            failedSubscriptions.push(subscription.endpoint);
          }
        }
      }

      // Remove subscriptions inválidas
      if (failedSubscriptions.length > 0) {
        await this.markSubscriptionsInactive(failedSubscriptions);
      }

      simpleLogger.info('Push notifications enviadas', { 
        userId, 
        sent, 
        total: subscriptions.length,
        failed: failedSubscriptions.length 
      });

      return sent > 0;
    } catch (error) {
      simpleLogger.error('Erro ao enviar push notification', { error, userId });
      return false;
    }
  }

  /**
   * Envia push notification para múltiplos usuários
   */
  async sendToUsers(userIds: string[], notification: NotificationData): Promise<number> {
    let totalSent = 0;

    // Processa em batches para evitar sobrecarga
    const batchSize = 50;
    
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      
      const promises = batch.map(userId => this.sendToUser(userId, notification));
      const results = await Promise.allSettled(promises);
      
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          totalSent++;
        }
      });

      // Pausa entre batches
      if (i + batchSize < userIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return totalSent;
  }

  /**
   * Testa push notification
   */
  async testPushNotification(userId: string): Promise<boolean> {
    const testNotification: NotificationData = {
      id: 'test',
      userId,
      type: 'info' as any,
      channel: 'push' as any,
      priority: 'normal' as any,
      status: 'pending' as any,
      title: 'Teste de Push Notification',
      message: 'Esta é uma notificação de teste enviada em ' + new Date().toLocaleString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.sendToUser(userId, testNotification);
  }

  /**
   * Obtém estatísticas de push notifications
   */
  async getStats(): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    subscriptionsByUser: number;
  }> {
    try {
      const [total, active, byUser] = await Promise.all([
        this.prisma.pushSubscription.count(),
        this.prisma.pushSubscription.count({ where: { isActive: true } }),
        this.prisma.pushSubscription.groupBy({
          by: ['userId'],
          where: { isActive: true },
          _count: { userId: true }
        })
      ]);

      return {
        totalSubscriptions: total,
        activeSubscriptions: active,
        subscriptionsByUser: byUser.length
      };
    } catch (error) {
      simpleLogger.error('Erro ao obter estatísticas push', { error });
      return {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        subscriptionsByUser: 0
      };
    }
  }

  /**
   * Lista subscriptions de um usuário
   */
  async getUserSubscriptions(userId: string) {
    try {
      const subscriptions = await this.prisma.pushSubscription.findMany({
        where: { userId, isActive: true },
        select: {
          id: true,
          endpoint: true,
          userAgent: true,
          createdAt: true
        }
      });

      return subscriptions.map(sub => ({
        ...sub,
        endpoint: this.maskEndpoint(sub.endpoint)
      }));
    } catch (error) {
      simpleLogger.error('Erro ao listar subscriptions do usuário', { error, userId });
      return [];
    }
  }

  /**
   * Gera chaves VAPID
   */
  static generateVapidKeys() {
    return webpush.generateVAPIDKeys();
  }

  /**
   * Inicializa configuração do Web Push
   */
  private initializeWebPush(): void {
    try {
      webpush.setVapidDetails(
        this.vapidKeys.subject,
        this.vapidKeys.publicKey,
        this.vapidKeys.privateKey
      );

      simpleLogger.info('Web Push configurado com sucesso');
    } catch (error) {
      simpleLogger.error('Erro ao configurar Web Push', { error });
      throw error;
    }
  }

  /**
   * Cria payload da push notification
   */
  private createPushPayload(notification: NotificationData): string {
    const payload = {
      title: notification.title,
      body: notification.message,
      icon: '/icons/notification-icon.png',
      badge: '/icons/notification-badge.png',
      data: {
        notificationId: notification.id,
        url: '/',
        ...notification.data
      },
      actions: [
        {
          action: 'view',
          title: 'Visualizar'
        },
        {
          action: 'dismiss',
          title: 'Descartar'
        }
      ],
      tag: notification.type,
      requireInteraction: notification.priority === NotificationPriority.URGENT,
      silent: notification.priority === NotificationPriority.LOW,
      timestamp: notification.createdAt.getTime()
    };

    return JSON.stringify(payload);
  }

  /**
   * Obtém opções de push baseadas na prioridade
   */
  private getPushOptions(priority: NotificationPriority) {
    const options: any = {
      TTL: 86400, // 24 horas
      headers: {}
    };

    switch (priority) {
      case NotificationPriority.URGENT:
        options.urgency = 'high';
        options.TTL = 3600; // 1 hora
        break;
      case NotificationPriority.HIGH:
        options.urgency = 'normal';
        break;
      case NotificationPriority.LOW:
        options.urgency = 'low';
        options.TTL = 604800; // 7 dias
        break;
      default:
        options.urgency = 'normal';
    }

    return options;
  }

  /**
   * Verifica se erro indica subscription inválida
   */
  private isSubscriptionInvalid(error: any): boolean {
    const invalidCodes = [410, 404, 400];
    return invalidCodes.includes(error.statusCode) || 
           error.message?.includes('invalid') ||
           error.message?.includes('expired');
  }

  /**
   * Marca subscriptions como inativas
   */
  private async markSubscriptionsInactive(endpoints: string[]): Promise<void> {
    try {
      await this.prisma.pushSubscription.updateMany({
        where: { endpoint: { in: endpoints } },
        data: { isActive: false }
      });

      simpleLogger.info('Subscriptions inválidas marcadas como inativas', { 
        count: endpoints.length 
      });
    } catch (error) {
      simpleLogger.error('Erro ao marcar subscriptions como inativas', { error });
    }
  }

  /**
   * Mascara endpoint para logs (segurança)
   */
  private maskEndpoint(endpoint: string): string {
    try {
      const url = new URL(endpoint);
      return `${url.origin}/*****`;
    } catch {
      return endpoint.substring(0, 20) + '*****';
    }
  }
}

// Interface para configuração
export interface PushConfig {
  vapidPublicKey: string;
  vapidPrivateKey: string;
  subject: string; // mailto:email@domain.com ou https://domain.com
}

// Factory function
export function createPushNotificationService(config: PushConfig): PushNotificationService {
  const prisma = new PrismaClient();
  return new PushNotificationService(prisma, config);
}

// Cliente para subscription no frontend
export const pushNotificationClient = {
  /**
   * Verifica se push notifications são suportadas
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  /**
   * Solicita permissão para notificações
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications não suportadas');
    }

    return await Notification.requestPermission();
  },

  /**
   * Registra service worker e subscription
   */
  async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
    try {
      if (!this.isSupported()) {
        throw new Error('Push notifications não suportadas');
      }

      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permissão negada para notificações');
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      return subscription;
    } catch (error) {
      console.error('Erro ao subscrever push notifications:', error);
      return null;
    }
  },

  /**
   * Remove subscription
   */
  async unsubscribe(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          return await subscription.unsubscribe();
        }
      }
      return true;
    } catch (error) {
      console.error('Erro ao cancelar subscription:', error);
      return false;
    }
  },

  /**
   * Converte VAPID key para Uint8Array
   */
  urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
};
