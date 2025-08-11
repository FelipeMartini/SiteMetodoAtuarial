import { PrismaClient } from '@prisma/client';
import { 
  NotificationData, 
  CreateNotificationRequest, 
  BulkNotificationRequest,
  NotificationFilter,
  NotificationSearchResult,
  NotificationStats,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority
} from '@/types/notifications';
import { simpleLogger } from '@/lib/simple-logger';

/**
 * Serviço principal para gerenciamento de notificações
 * Responsável por criar, enviar, agendar e gerenciar notificações
 */
export class NotificationService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Cria uma nova notificação
   */
  async createNotification(request: CreateNotificationRequest): Promise<string[]> {
    try {
      const userIds = Array.isArray(request.userId) ? request.userId : [request.userId];
      const notificationIds: string[] = [];

      for (const userId of userIds) {
        // Verifica preferências do usuário para cada canal
        for (const channel of request.channels) {
          const isEnabled = await this.checkUserPreference(userId, request.type, channel);
          
          if (!isEnabled) {
            simpleLogger.warn(`Notificação bloqueada por preferência do usuário`, {
              userId,
              type: request.type,
              channel
            });
            continue;
          }

          const notification = await this.prisma.notification.create({
            data: {
              userId,
              type: request.type,
              channel,
              priority: request.priority || NotificationPriority.NORMAL,
              status: NotificationStatus.PENDING,
              title: request.title,
              message: request.message,
              data: request.data ? JSON.stringify(request.data) : null,
              scheduledFor: request.scheduledFor,
              expiresAt: request.expiresAt,
            }
          });

          notificationIds.push(notification.id);

          // Adiciona à fila de processamento
          await this.addToQueue(notification.id, request.priority || NotificationPriority.NORMAL);

          simpleLogger.info(`Notificação criada`, {
            notificationId: notification.id,
            userId,
            type: request.type,
            channel
          });
        }
      }

      return notificationIds;
    } catch (error) {
      simpleLogger.error('Erro ao criar notificação', { error, request });
      throw error;
    }
  }

  /**
   * Cria notificações em lote
   */
  async createBulkNotifications(request: BulkNotificationRequest): Promise<string[]> {
    try {
      const notificationIds: string[] = [];

      // Processa em batches para evitar sobrecarga
      const batchSize = 100;
      for (let i = 0; i < request.userIds.length; i += batchSize) {
        const batch = request.userIds.slice(i, i + batchSize);
        
        const batchRequest: CreateNotificationRequest = {
          userId: batch,
          type: request.type,
          channels: request.channels,
          priority: request.priority,
          title: request.title,
          message: request.message,
          data: request.data,
          templateId: request.templateId,
          templateVariables: request.templateVariables,
          scheduledFor: request.scheduledFor,
          expiresAt: request.expiresAt,
        };

        const batchIds = await this.createNotification(batchRequest);
        notificationIds.push(...batchIds);
      }

      simpleLogger.info(`Notificações em lote criadas`, {
        totalUsers: request.userIds.length,
        totalNotifications: notificationIds.length,
        type: request.type
      });

      return notificationIds;
    } catch (error) {
      simpleLogger.error('Erro ao criar notificações em lote', { error, request });
      throw error;
    }
  }

  /**
   * Busca notificações com filtros
   */
  async searchNotifications(filter: NotificationFilter): Promise<NotificationSearchResult> {
    try {
      const where: Record<string, unknown> = {};

      if (filter.userId) where.userId = filter.userId;
      if (filter.types?.length) where.type = { in: filter.types };
      if (filter.channels?.length) where.channel = { in: filter.channels };
      if (filter.statuses?.length) where.status = { in: filter.statuses };
      if (filter.priorities?.length) where.priority = { in: filter.priorities };
      if (filter.unreadOnly) where.readAt = null;
      
      if (filter.dateFrom || filter.dateTo) {
        where.createdAt = {};
        if (filter.dateFrom) where.createdAt.gte = filter.dateFrom;
        if (filter.dateTo) where.createdAt.lte = filter.dateTo;
      }

      if (filter.search) {
        where.OR = [
          { title: { contains: filter.search } },
          { message: { contains: filter.search } }
        ];
      }

      const [notifications, total] = await Promise.all([
        this.prisma.notification.findMany({
          where,
          orderBy: {
            [filter.sortBy || 'createdAt']: filter.sortOrder || 'desc'
          },
          take: filter.limit || 50,
          skip: filter.offset || 0,
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }),
        this.prisma.notification.count({ where })
      ]);

      const hasMore = (filter.offset || 0) + notifications.length < total;

      // Agregações opcionais
      let aggregations;
      if (filter.userId) {
        const [byType, byChannel, byStatus] = await Promise.all([
          this.prisma.notification.groupBy({
            by: ['type'],
            where: { userId: filter.userId },
            _count: { type: true }
          }),
          this.prisma.notification.groupBy({
            by: ['channel'],
            where: { userId: filter.userId },
            _count: { channel: true }
          }),
          this.prisma.notification.groupBy({
            by: ['status'],
            where: { userId: filter.userId },
            _count: { status: true }
          })
        ]);

        // Construir agregações usando todos os tipos
        const defaultByType = {
          info: 0,
          success: 0,
          warning: 0,
          error: 0,
          security: 0,
          system: 0,
          user_action: 0,
          marketing: 0
        };
        
        const defaultByChannel = {
          in_app: 0,
          email: 0,
          push: 0,
          sms: 0,
          webhook: 0
        };
        
        const defaultByStatus = {
          pending: 0,
          sent: 0,
          delivered: 0,
          read: 0,
          failed: 0,
          cancelled: 0
        };

        // Aplicar valores reais sobre os defaults
        byType.forEach(item => {
          if (item.type in defaultByType) {
            defaultByType[item.type as keyof typeof defaultByType] = item._count.type;
          }
        });
        
        byChannel.forEach(item => {
          if (item.channel in defaultByChannel) {
            defaultByChannel[item.channel as keyof typeof defaultByChannel] = item._count.channel;
          }
        });
        
        byStatus.forEach(item => {
          if (item.status in defaultByStatus) {
            defaultByStatus[item.status as keyof typeof defaultByStatus] = item._count.status;
          }
        });

        aggregations = {
          byType: defaultByType,
          byChannel: defaultByChannel,
          byStatus: defaultByStatus
        };
      }

      return {
        notifications: notifications.map(this.mapToNotificationData),
        total,
        hasMore,
        aggregations
      };
    } catch (error) {
      simpleLogger.error('Erro ao buscar notificações', { error, filter });
      throw error;
    }
  }

  /**
   * Marca notificação como lida
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const notification = await this.prisma.notification.update({
        where: { 
          id: notificationId,
          userId: userId // Garante que usuário só pode marcar suas próprias notificações
        },
        data: { 
          readAt: new Date(),
          status: NotificationStatus.READ
        }
      });

      // Registra evento
      await this.createEvent(notificationId, userId, 'read', notification.channel as any, {});

      simpleLogger.info(`Notificação marcada como lida`, {
        notificationId,
        userId
      });
    } catch (error) {
      simpleLogger.error('Erro ao marcar notificação como lida', { error, notificationId, userId });
      throw error;
    }
  }

  /**
   * Marca todas as notificações de um usuário como lidas
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await this.prisma.notification.updateMany({
        where: { 
          userId,
          readAt: null
        },
        data: { 
          readAt: new Date(),
          status: NotificationStatus.READ
        }
      });

      simpleLogger.info(`Todas as notificações marcadas como lidas`, {
        userId,
        count: result.count
      });

      return result.count;
    } catch (error) {
      simpleLogger.error('Erro ao marcar todas como lidas', { error, userId });
      throw error;
    }
  }

  /**
   * Deleta uma notificação
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      await this.prisma.notification.delete({
        where: { 
          id: notificationId,
          userId: userId
        }
      });

      simpleLogger.info(`Notificação deletada`, {
        notificationId,
        userId
      });
    } catch (error) {
      simpleLogger.error('Erro ao deletar notificação', { error, notificationId, userId });
      throw error;
    }
  }

  /**
   * Obtém contagem de notificações não lidas
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await this.prisma.notification.count({
        where: {
          userId,
          readAt: null,
          expiresAt: {
            gt: new Date()
          }
        }
      });
    } catch (error) {
      simpleLogger.error('Erro ao obter contagem não lidas', { error, userId });
      return 0;
    }
  }

  /**
   * Obtém estatísticas de notificações
   */
  async getStats(userId?: string, dateFrom?: Date, dateTo?: Date): Promise<NotificationStats> {
    try {
      const where: Record<string, unknown> = {};
      if (userId) where.userId = userId;
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = dateFrom;
        if (dateTo) where.createdAt.lte = dateTo;
      }

      const [total, byType, byChannel, byStatus, deliveryStats] = await Promise.all([
        this.prisma.notification.count({ where }),
        this.prisma.notification.groupBy({
          by: ['type'],
          where,
          _count: { type: true }
        }),
        this.prisma.notification.groupBy({
          by: ['channel'],
          where,
          _count: { channel: true }
        }),
        this.prisma.notification.groupBy({
          by: ['status'],
          where,
          _count: { status: true }
        }),
        this.prisma.notification.aggregate({
          where: {
            ...where,
            sentAt: { not: null }
          },
          _count: {
            id: true
          }
        })
      ]);

      const deliveredCount = byStatus.find(item => item.status === NotificationStatus.DELIVERED)?._count.status || 0;
      const readCount = byStatus.find(item => item.status === NotificationStatus.READ)?._count.status || 0;
      const sentCount = byStatus.find(item => item.status === NotificationStatus.SENT)?._count.status || 0;

      // Construir agregações completas com defaults
      const defaultByType = {
        info: 0,
        success: 0,
        warning: 0,
        error: 0,
        security: 0,
        system: 0,
        user_action: 0,
        marketing: 0
      };
      
      const defaultByChannel = {
        in_app: 0,
        email: 0,
        push: 0,
        sms: 0,
        webhook: 0
      };
      
      const defaultByStatus = {
        pending: 0,
        sent: 0,
        delivered: 0,
        read: 0,
        failed: 0,
        cancelled: 0
      };

      // Aplicar valores reais
      byType.forEach(item => {
        if (item.type in defaultByType) {
          defaultByType[item.type as keyof typeof defaultByType] = item._count.type;
        }
      });
      
      byChannel.forEach(item => {
        if (item.channel in defaultByChannel) {
          defaultByChannel[item.channel as keyof typeof defaultByChannel] = item._count.channel;
        }
      });
      
      byStatus.forEach(item => {
        if (item.status in defaultByStatus) {
          defaultByStatus[item.status as keyof typeof defaultByStatus] = item._count.status;
        }
      });

      return {
        total,
        byType: defaultByType,
        byChannel: defaultByChannel,
        byStatus: defaultByStatus,
        deliveryRate: sentCount > 0 ? (deliveredCount / sentCount) * 100 : 0,
        readRate: deliveredCount > 0 ? (readCount / deliveredCount) * 100 : 0,
        averageDeliveryTime: 0, // Implementar se necessário
        period: {
          start: dateFrom || new Date(0),
          end: dateTo || new Date()
        }
      };
    } catch (error) {
      simpleLogger.error('Erro ao obter estatísticas', { error, userId });
      throw error;
    }
  }

  /**
   * Verifica preferência do usuário para tipo e canal de notificação
   */
  private async checkUserPreference(
    userId: string, 
    type: NotificationType, 
    channel: NotificationChannel
  ): Promise<boolean> {
    try {
      const preference = await this.prisma.notificationPreference.findUnique({
        where: {
          userId_channel_type: {
            userId,
            channel,
            type
          }
        }
      });

      // Se não existe preferência, assume como habilitado
      return preference?.enabled ?? true;
    } catch (error) {
      simpleLogger.warn('Erro ao verificar preferência, assumindo habilitado', { error, userId, type, channel });
      return true;
    }
  }

  /**
   * Adiciona notificação à fila de processamento
   */
  private async addToQueue(notificationId: string, priority: NotificationPriority): Promise<void> {
    try {
      await this.prisma.notificationQueue.create({
        data: {
          notificationId,
          priority,
          attempts: 0,
          maxAttempts: 3,
          status: 'pending'
        }
      });
    } catch (error) {
      simpleLogger.error('Erro ao adicionar à fila', { error, notificationId });
      throw error;
    }
  }

  /**
   * Cria evento de notificação para analytics
   */
  private async createEvent(
    notificationId: string, 
    userId: string, 
    type: string, 
    channel: NotificationChannel,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      await this.prisma.notificationEvent.create({
        data: {
          notificationId,
          userId,
          type,
          channel,
          metadata: JSON.stringify(metadata)
        }
      });
    } catch (error) {
      simpleLogger.warn('Erro ao criar evento', { error, notificationId, type });
    }
  }

  /**
   * Mapeia dados do Prisma para interface NotificationData
   */
  private mapToNotificationData(notification: Record<string, unknown>): NotificationData {
    return {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      channel: notification.channel,
      priority: notification.priority,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      data: notification.data ? JSON.parse(notification.data) : undefined,
      scheduledFor: notification.scheduledFor,
      sentAt: notification.sentAt,
      readAt: notification.readAt,
      expiresAt: notification.expiresAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt
    };
  }
}

// Instância singleton
let notificationService: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!notificationService) {
    const prisma = new PrismaClient();
    notificationService = new NotificationService(prisma);
  }
  return notificationService;
}
