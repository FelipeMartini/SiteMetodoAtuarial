import DatabaseLogger from '../logging/database-logger';
import prisma from '@/lib/prisma';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  data?: Record<string, any>;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
  vibrate?: number[];
}

export interface SendNotificationRequest {
  userId: string;
  notification: PushNotificationPayload;
  priority?: 'low' | 'normal' | 'high';
  scheduleTime?: Date;
  expiresAt?: Date;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface UserPushSubscription {
  id: string;
  userId: string;
  subscription: PushSubscription;
  userAgent?: string;
  createdAt: Date;
  isActive: boolean;
}

/**
 * Serviço de push notifications com suporte Web Push Protocol
 * Implementa registro de assinatura, envio e histórico
 */
export class PushNotificationService {
  private static VAPID_KEYS = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT || 'mailto:admin@metodoaparial.com.br',
  };

  /**
   * Registra uma nova assinatura push para um usuário
   */
  static async registerSubscription(
    userId: string,
    subscription: PushSubscription,
    userAgent?: string,
    context?: { correlationId?: string }
  ): Promise<UserPushSubscription> {
    try {
      // Verifica se já existe uma assinatura igual
      const existingSubscription = await this.findExistingSubscription(userId, subscription.endpoint);
      
      if (existingSubscription) {
        // Atualiza a assinatura existente
        await DatabaseLogger.logSystem({
          level: 'INFO',
          message: `Atualizando assinatura push existente para usuário ${userId}`,
          module: 'push_notifications',
          operation: 'update_subscription',
          context: {
            userId,
            correlationId: context?.correlationId,
            metadata: { endpoint: subscription.endpoint },
          },
        });

        // TODO: Atualizar no banco de dados
        return {
          id: existingSubscription.id,
          userId,
          subscription,
          userAgent,
          createdAt: existingSubscription.createdAt,
          isActive: true,
        };
      }

      // Cria nova assinatura
      const newSubscription: UserPushSubscription = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        subscription,
        userAgent,
        createdAt: new Date(),
        isActive: true,
      };

      // TODO: Salvar no banco de dados (modelo PushSubscription)
      await DatabaseLogger.logAudit({
        action: 'CREATE',
        resource: 'push_subscription',
        resourceId: newSubscription.id,
        newValues: {
          userId,
          endpoint: subscription.endpoint,
          userAgent,
        },
        context: {
          userId,
          correlationId: context?.correlationId,
          metadata: { subscriptionRegistered: true },
        },
      });

      await DatabaseLogger.logSystem({
        level: 'INFO',
        message: `Nova assinatura push registrada para usuário ${userId}`,
        module: 'push_notifications',
        operation: 'register_subscription',
        context: {
          userId,
          correlationId: context?.correlationId,
          metadata: { endpoint: subscription.endpoint },
        },
      });

      return newSubscription;
    } catch (error) {
      await DatabaseLogger.logSystem({
        level: 'ERROR',
        message: 'Falha ao registrar assinatura push',
        module: 'push_notifications',
        operation: 'register_subscription',
        error: error instanceof Error ? error.stack : String(error),
        context: {
          userId,
          correlationId: context?.correlationId,
          metadata: { endpoint: subscription.endpoint },
        },
      });

      throw error;
    }
  }

  /**
   * Envia uma push notification para um usuário
   */
  static async sendNotification(request: SendNotificationRequest): Promise<{
    success: boolean;
    messageId: string;
    deliveredCount: number;
    failedCount: number;
    errors: string[];
  }> {
    const correlationId = DatabaseLogger.generateCorrelationId();
    const startTime = Date.now();

    try {
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Obtém todas as assinatura ativas do usuário
      const userSubscriptions = await this.getUserSubscriptions(request.userId);
      
      if (userSubscriptions.length === 0) {
        await DatabaseLogger.logSystem({
          level: 'WARN',
          message: `Nenhuma assinatura push ativa encontrada para usuário ${request.userId}`,
          module: 'push_notifications',
          operation: 'send_notification',
          context: {
            userId: request.userId,
            correlationId,
            metadata: { messageId, notificationTitle: request.notification.title },
          },
        });

        return {
          success: false,
          messageId,
          deliveredCount: 0,
          failedCount: 0,
          errors: ['Nenhuma assinatura push ativa encontrada'],
        };
      }

      // Envia para todas as assinaturas do usuário
      const results = await Promise.allSettled(
        userSubscriptions.map(subscription =>
          this.sendToSubscription(subscription, request.notification, { messageId, correlationId })
        )
      );

      const deliveredCount = results.filter(r => r.status === 'fulfilled').length;
      const failedCount = results.filter(r => r.status === 'rejected').length;
      const errors = results
        .filter(r => r.status === 'rejected')
        .map(r => (r as PromiseRejectedResult).reason.message || String((r as PromiseRejectedResult).reason));

      const duration = Date.now() - startTime;

      // Log da operação de envio
      await DatabaseLogger.logAudit({
        action: 'CREATE',
        resource: 'push_notification',
        resourceId: messageId,
        newValues: {
          userId: request.userId,
          title: request.notification.title,
          body: request.notification.body,
          priority: request.priority || 'normal',
          deliveredCount,
          failedCount,
        },
        context: {
          userId: request.userId,
          correlationId,
          metadata: {
            totalSubscriptions: userSubscriptions.length,
            duration,
          },
        },
      });

      await DatabaseLogger.logPerformance({
        operation: 'send_push_notification',
        method: 'POST',
        path: `/notifications/${request.userId}`,
        duration,
        context: {
          userId: request.userId,
          correlationId,
          metadata: {
            messageId,
            subscriptionsCount: userSubscriptions.length,
            deliveredCount,
            failedCount,
          },
        },
      });

      // Se houver falhas, registra no log de sistema
      if (failedCount > 0) {
        await DatabaseLogger.logSystem({
          level: 'WARN',
          message: `Falhas no envio de push notification: ${failedCount}/${userSubscriptions.length} falharam`,
          module: 'push_notifications',
          operation: 'send_notification',
          context: {
            userId: request.userId,
            correlationId,
            metadata: {
              messageId,
              deliveredCount,
              failedCount,
              errors: errors.slice(0, 3), // Primeiros 3 erros
            },
          },
        });
      }

      return {
        success: deliveredCount > 0,
        messageId,
        deliveredCount,
        failedCount,
        errors,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      await DatabaseLogger.logSystem({
        level: 'ERROR',
        message: 'Falha crítica no envio de push notification',
        module: 'push_notifications',
        operation: 'send_notification',
        error: error instanceof Error ? error.stack : String(error),
        context: {
          userId: request.userId,
          correlationId,
          duration,
          metadata: { notificationTitle: request.notification.title },
        },
      });

      throw error;
    }
  }

  /**
   * Envia notificação para uma assinatura específica
   */
  private static async sendToSubscription(
    userSubscription: UserPushSubscription,
    notification: PushNotificationPayload,
    context: { messageId: string; correlationId: string }
  ): Promise<void> {
    try {
      // Implementação do Web Push Protocol seria aqui
      // Por enquanto simula o envio
      
      const webpush = await this.getWebPushInstance();
      const payload = JSON.stringify(notification);

      await webpush.sendNotification(userSubscription.subscription, payload);

      await DatabaseLogger.logSystem({
        level: 'DEBUG',
        message: `Push notification enviada com sucesso`,
        module: 'push_notifications',
        operation: 'send_to_subscription',
        context: {
          userId: userSubscription.userId,
          correlationId: context.correlationId,
          metadata: {
            messageId: context.messageId,
            endpoint: userSubscription.subscription.endpoint.substring(0, 50) + '...',
          },
        },
      });
    } catch (error) {
      // Se for erro 410 (Gone), marca assinatura como inativa
      if ((error as any).statusCode === 410) {
        await this.deactivateSubscription(userSubscription.id, 'subscription_expired');
      }

      await DatabaseLogger.logSystem({
        level: 'ERROR',
        message: `Falha ao enviar para assinatura específica`,
        module: 'push_notifications',
        operation: 'send_to_subscription',
        error: error instanceof Error ? error.stack : String(error),
        context: {
          userId: userSubscription.userId,
          correlationId: context.correlationId,
          metadata: {
            messageId: context.messageId,
            subscriptionId: userSubscription.id,
            endpoint: userSubscription.subscription.endpoint.substring(0, 50) + '...',
          },
        },
      });

      throw error;
    }
  }

  /**
   * Obtém instância configurada do web-push
   */
  private static async getWebPushInstance() {
    // Importação dinâmica para evitar problemas de SSR
    const webpush = (await import('web-push')).default;

    if (!this.VAPID_KEYS.publicKey || !this.VAPID_KEYS.privateKey) {
      throw new Error('VAPID keys não configuradas');
    }

    webpush.setVapidDetails(
      this.VAPID_KEYS.subject!,
      this.VAPID_KEYS.publicKey,
      this.VAPID_KEYS.privateKey
    );

    return webpush;
  }

  /**
   * Encontra assinatura existente por endpoint
   */
  private static async findExistingSubscription(_userId: string, _endpoint: string): Promise<UserPushSubscription | null> {
    // Busca no banco de dados por endpoint
    try {
      const rec = await prisma.pushSubscription.findUnique({ where: { endpoint: _endpoint } });
      if (!rec) return null;
      return {
        id: rec.id,
        userId: rec.userId,
        subscription: { endpoint: rec.endpoint, keys: { p256dh: rec.p256dh, auth: rec.auth } },
        userAgent: rec.userAgent || undefined,
        createdAt: rec.createdAt,
        isActive: rec.isActive,
      };
    } catch (error) {
      await DatabaseLogger.logSystem({
        level: 'ERROR',
        message: 'Erro ao buscar assinatura existente',
        module: 'push_notifications',
        operation: 'find_existing_subscription',
        error: error instanceof Error ? error.stack : String(error),
        context: {},
      });
      return null;
    }
  }

  /**
   * Obtém todas as assinaturas ativas de um usuário
   */
  static async getUserSubscriptions(_userId: string): Promise<UserPushSubscription[]> {
    // Busca todas as assinaturas ativas do usuário no banco
    try {
  const recs = await prisma.pushSubscription.findMany({ where: { userId: _userId, isActive: true } });
  return recs.map((rec: any) => ({
        id: rec.id,
        userId: rec.userId,
        subscription: { endpoint: rec.endpoint, keys: { p256dh: rec.p256dh, auth: rec.auth } },
        userAgent: rec.userAgent || undefined,
        createdAt: rec.createdAt,
        isActive: rec.isActive,
      }));
    } catch (error) {
      await DatabaseLogger.logSystem({
        level: 'ERROR',
        message: 'Erro ao obter assinaturas do usuário',
        module: 'push_notifications',
        operation: 'get_user_subscriptions',
        error: error instanceof Error ? error.stack : String(error),
        context: { userId: _userId },
      });
      return [];
    }
  }

  /**
   * Desativa uma assinatura
   */
  static async deactivateSubscription(subscriptionId: string, reason: string): Promise<void> {
    try {
      const old = await prisma.pushSubscription.findUnique({ where: { id: subscriptionId } });
      await prisma.pushSubscription.update({ where: { id: subscriptionId }, data: { isActive: false } });

      await DatabaseLogger.logAudit({
        action: 'UPDATE',
        resource: 'push_subscription',
        resourceId: subscriptionId,
        oldValues: old ? { isActive: old.isActive } : null,
        newValues: { isActive: false, reason },
        context: {
          metadata: { deactivationReason: reason },
        },
      });
    } catch (error) {
      await DatabaseLogger.logSystem({
        level: 'ERROR',
        message: 'Erro ao desativar assinatura',
        module: 'push_notifications',
        operation: 'deactivate_subscription',
        error: error instanceof Error ? error.stack : String(error),
        context: { metadata: { subscriptionId, reason } },
      });
    }
  }

  /**
   * Remove todas as assinaturas inativas antigas
   */
  static async cleanupInactiveSubscriptions(daysOld: number = 30): Promise<{
    removed: number;
    errors: string[];
  }> {
    const correlationId = DatabaseLogger.generateCorrelationId();
    
    try {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);

  const result = await prisma.pushSubscription.deleteMany({ where: { isActive: false, updatedAt: { lt: cutoff } } });
  const removed = result.count;

      await DatabaseLogger.logSystem({
        level: 'INFO',
        message: `Limpeza de assinaturas push: ${removed} assinaturas removidas`,
        module: 'push_notifications',
        operation: 'cleanup_subscriptions',
        context: {
          correlationId,
          metadata: { daysOld, removed },
        },
      });

      return { removed, errors: [] };
    } catch (error) {
      await DatabaseLogger.logSystem({
        level: 'ERROR',
        message: 'Falha na limpeza de assinaturas push',
        module: 'push_notifications',
        operation: 'cleanup_subscriptions',
        error: error instanceof Error ? error.stack : String(error),
        context: {
          correlationId,
          metadata: { daysOld },
        },
      });

  return { removed: 0, errors: [String(error)] };
    }
  }

  /**
   * Envia notificação broadcast para múltiplos usuários
   */
  static async sendBroadcast(
    userIds: string[],
    notification: PushNotificationPayload,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<{
    messageId: string;
    totalUsers: number;
    successCount: number;
    failureCount: number;
    details: Array<{
      userId: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const correlationId = DatabaseLogger.generateCorrelationId();
    const messageId = `broadcast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    try {
      await DatabaseLogger.logSystem({
        level: 'INFO',
        message: `Iniciando broadcast de push notification para ${userIds.length} usuários`,
        module: 'push_notifications',
        operation: 'send_broadcast',
        context: {
          correlationId,
          metadata: {
            messageId,
            totalUsers: userIds.length,
            notificationTitle: notification.title,
          },
        },
      });

      // Envia para todos os usuários em paralelo (máximo de 10 por vez)
      const chunkSize = 10;
      const results: Array<{
        userId: string;
        success: boolean;
        error?: string;
      }> = [];

      for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        
        const chunkResults = await Promise.allSettled(
          chunk.map(async (userId) => {
            const result = await this.sendNotification({
              userId,
              notification,
              priority,
            });

            return {
              userId,
              success: result.success,
              error: result.errors.length > 0 ? result.errors[0] : undefined,
            };
          })
        );

        results.push(
          ...chunkResults.map((r, idx) => {
            if (r.status === 'fulfilled') {
              return r.value;
            } else {
              return {
                userId: chunk[idx],
                success: false,
                error: r.reason.message || String(r.reason),
              };
            }
          })
        );
      }

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;
      const duration = Date.now() - startTime;

      await DatabaseLogger.logPerformance({
        operation: 'send_push_broadcast',
        method: 'POST',
        path: '/notifications/broadcast',
        duration,
        context: {
          correlationId,
          metadata: {
            messageId,
            totalUsers: userIds.length,
            successCount,
            failureCount,
          },
        },
      });

      return {
        messageId,
        totalUsers: userIds.length,
        successCount,
        failureCount,
        details: results,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      await DatabaseLogger.logSystem({
        level: 'ERROR',
        message: 'Falha crítica no broadcast de push notifications',
        module: 'push_notifications',
        operation: 'send_broadcast',
        error: error instanceof Error ? error.stack : String(error),
        context: {
          correlationId,
          duration,
          metadata: {
            messageId,
            totalUsers: userIds.length,
            notificationTitle: notification.title,
          },
        },
      });

      throw error;
    }
  }
}

// Estatísticas utilitárias do serviço
export const PushNotificationServiceStats = {
  async getStats() {
    try {
      const total = await prisma.pushSubscription.count();
      const active = await prisma.pushSubscription.count({ where: { isActive: true } });
      const inactive = total - active;
      return { totalSubscriptions: total, activeSubscriptions: active, inactiveSubscriptions: inactive };
    } catch (error) {
      await DatabaseLogger.logSystem({ level: 'ERROR', message: 'Erro ao coletar estatísticas de push', module: 'push_notifications', operation: 'get_stats', error: error instanceof Error ? error.stack : String(error) });
      return { totalSubscriptions: 0, activeSubscriptions: 0, inactiveSubscriptions: 0 };
    }
  }
} as const

// Tipos e factory exportados para compatibilidade com shims e imports existentes
export interface PushConfig {
  vapidPublicKey?: string;
  vapidPrivateKey?: string;
  vapidEmail?: string;
}

/**
 * Factory compatível com `notification-service.ts` que espera métodos como
 * `sendToUser` e `sendToUsers`.
 */
export function createPushNotificationService(_config?: PushConfig) {
  return {
    // compat wrapper para enviar a um usuário
    async sendToUser(userId: string, request: any) {
      // request pode conter { notification, priority, scheduleTime, expiresAt }
      const notification = request.notification || request;
      return await PushNotificationService.sendNotification({
        userId,
        notification,
        priority: request.priority,
        scheduleTime: request.scheduleTime,
        expiresAt: request.expiresAt,
      });
    },

    // compat wrapper para enviar a múltiplos usuários
    async sendToUsers(userIds: string[], request: any) {
      const notification = request.notification || request;
      return await PushNotificationService.sendBroadcast(userIds, notification, request.priority || 'normal');
    },

    // expor registro de assinatura
    async registerSubscription(userId: string, subscription: any, userAgent?: string, context?: any) {
      return await PushNotificationService.registerSubscription(userId, subscription, userAgent, context);
    },

    async cleanupInactiveSubscriptions(daysOld?: number) {
      return await PushNotificationService.cleanupInactiveSubscriptions(daysOld);
    },
    // Métodos compatíveis adicionais esperados por shims/rotas legadas
    async testPushNotification(userId: string) {
      // Execução de teste: chama sendNotification com payload mínimo (não persiste)
      try {
        const res = await PushNotificationService.sendNotification({
          userId,
          notification: { title: 'Test', body: 'Test push notification from system' },
        });
        return res;
      } catch (err) {
        return { success: false, messageId: '', deliveredCount: 0, failedCount: 1, errors: [String(err)] };
      }
    },

    async unregisterSubscription(endpoint: string) {
      try {
        const rec = await prisma.pushSubscription.findUnique({ where: { endpoint } });
        if (!rec) return false;
        await PushNotificationService.deactivateSubscription(rec.id, 'unregister');
        return true;
      } catch (error) {
        await DatabaseLogger.logSystem({ level: 'ERROR', message: 'Erro ao desregistrar assinatura', module: 'push_notifications', operation: 'unregister_subscription', error: error instanceof Error ? error.stack : String(error), context: { metadata: { endpoint } } });
        return false;
      }
    },

    async getUserSubscriptions(userId: string) {
      return await PushNotificationService.getUserSubscriptions(userId);
    },

    async getStats() {
      return await PushNotificationServiceStats.getStats();
    },
  };
}

export default PushNotificationService;
