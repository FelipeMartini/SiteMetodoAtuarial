// Shim compatível que delega para PushNotificationService quando aplicável.
import PushService, { createPushNotificationService, PushConfig } from './push-service'

// Config placeholder (a aplicação real deve prover via DI ou env)
const defaultConfig: PushConfig = {
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY || '',
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || '',
  vapidEmail: process.env.VAPID_EMAIL || 'no-reply@example.com',
}

const _push = createPushNotificationService(defaultConfig)

export const notificationService = {
  async sendNotification(userId: string, request: any) { return _push.sendToUser(userId, request) },
  async createNotification(request: any) { return _push.sendToUser((request.userId as string) || 'unknown', request).then(() => [String(Date.now())]) },
  async createBulkNotifications(request: { userIds: string[]; [k: string]: any }) { 
    // compat shim: cria notificações em massa, delegando para sendToUsers quando aplicável
    const r = await _push.sendToUsers(request.userIds || [], request as any)
    return request.userIds.map((_: any, i: number) => `notification-${Date.now()}-${i}`)
  },
  async sendBulkNotifications(request: { userIds: string[]; [k: string]: any }) { return _push.sendToUsers(request.userIds || [], request as any).then(r => ({ sent: r.sent, failed: r.failed })) },
  async getNotifications(userId: string, pagination = { page: 1, limit: 20 }) { return { notifications: [], total: 0, page: pagination.page, limit: pagination.limit, pages: 0 } },
  async markAsRead(notificationId: string, userId: string) { return true },
  async markAllAsRead(userId: string) { return 0 },
  async deleteNotification(notificationId: string, userId: string) { return true },
  async getNotificationStats(userId?: string) { return { total: 0, sent: 0, pending: 0, failed: 0, byType: {} } },
  async getUnreadCount(userId: string) { return 0 },
  async getStats(userId?: string, dateFrom?: Date, dateTo?: Date) { return { total: 0, sent: 0, pending: 0, failed: 0, byType: {} } },
  async searchNotifications(filter: Record<string, unknown>) { return { notifications: [], total: 0, page: 1, limit: 20, pages: 0 } },
}

export function getNotificationService() { return notificationService }

export default notificationService
