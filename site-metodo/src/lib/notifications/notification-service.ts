// Stub temporário para notification-service enquanto o sistema ABAC está sendo implementado

export interface NotificationRequest {
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  priority?: 'low' | 'medium' | 'high'
  expiresAt?: Date
}

export interface BulkNotificationRequest {
  userIds: string[]
  [key: string]: unknown // Aceita qualquer propriedade adicional
}

export interface NotificationStats {
  total: number
  sent: number
  pending: number
  failed: number
  byType: Record<string, number>
}

export class NotificationService {
  private static instance: NotificationService

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async sendNotification(userId: string, request: NotificationRequest): Promise<{ id: string; success: boolean }> {
    console.log('Send Notification (stub):', { userId, request })
    return { id: `notification-${Date.now()}`, success: true }
  }

  async createNotification(request: any): Promise<string[]> {
    console.log('Create Notification (stub):', request)
    return [`notification-${Date.now()}`]
  }

  async sendBulkNotifications(request: any): Promise<{ sent: number; failed: number }> {
    console.log('Send Bulk Notifications (stub):', request)
    return { sent: request.userIds?.length || 0, failed: 0 }
  }

  async createBulkNotifications(request: any): Promise<string[]> {
    console.log('Create Bulk Notifications (stub):', request)
    const userIds = request.userIds || []
    return userIds.map((_: unknown, index: number) => `notification-${Date.now()}-${index}`)
  }

  async getNotifications(userId: string, pagination = { page: 1, limit: 20 }) {
    console.log('Get Notifications (stub):', { userId, pagination })
    return {
      notifications: [],
      total: 0,
      page: pagination.page,
      limit: pagination.limit,
      pages: 0
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    console.log('Mark as Read (stub):', { notificationId, userId })
    return true
  }

  async markAllAsRead(userId: string): Promise<number> {
    console.log('Mark All as Read (stub):', { userId })
    return 0
  }

  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    console.log('Delete Notification (stub):', { notificationId, userId })
    return true
  }

  async getNotificationStats(userId?: string): Promise<NotificationStats> {
    console.log('Get Notification Stats (stub):', { userId })
    return {
      total: 0,
      sent: 0,
      pending: 0,
      failed: 0,
      byType: {}
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    console.log('Get Unread Count (stub):', { userId })
    return 0
  }

  async getStats(userId?: string, dateFrom?: Date, dateTo?: Date): Promise<NotificationStats> {
    console.log('Get Stats (stub):', { userId, dateFrom, dateTo })
    return {
      total: 0,
      sent: 0,
      pending: 0,
      failed: 0,
      byType: {}
    }
  }

  async searchNotifications(filter: Record<string, unknown> | any) {
    console.log('Search Notifications (stub):', { filter })
    return {
      notifications: [],
      total: 0,
      page: 1,
      limit: 20,
      pages: 0
    }
  }
}

export const notificationService = NotificationService.getInstance()

export function getNotificationService(): NotificationService {
  return notificationService
}

export default notificationService
