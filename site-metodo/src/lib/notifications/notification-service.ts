// Shim compatível que delega para PushNotificationService quando aplicável.
import { createPushNotificationService, PushConfig } from './push-service'

// Config placeholder (a aplicação real deve prover via DI ou env)
const defaultConfig: PushConfig = {
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY || '',
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || '',
  vapidEmail: process.env.VAPID_EMAIL || 'no-reply@example.com',
}

const _push = createPushNotificationService(defaultConfig)

export const notificationService = {
  async sendNotification(_userId: string, _request: any) { return _push.sendToUser(_userId, _request) },
  async createNotification(_request: any) { return _push.sendToUser(((_request.userId as string) || 'unknown'), _request).then(() => [String(Date.now())]) },
  async createBulkNotifications(_request: { userIds: string[]; [k: string]: any }) { 
    // compat shim: cria notificações em massa, delegando para sendToUsers quando aplicável
    const _r = await _push.sendToUsers(_request.userIds || [], _request as any)
    return _request.userIds.map((__unused: any, i: number) => `notification-${Date.now()}-${i}`)
  },
  async sendBulkNotifications(_request: { userIds: string[]; [k: string]: any }) {
    const _r = await _push.sendToUsers(_request.userIds || [], _request as any)
    // _r has shape { messageId, totalUsers, successCount, failureCount, details }
    return { sent: _r.successCount, failed: _r.failureCount }
  },
  async getNotifications(_userId: string, _pagination = { page: 1, limit: 20 }) { return { notifications: [], total: 0, page: _pagination.page, limit: _pagination.limit, pages: 0 } },
  async markAsRead(_notificationId: string, _userId: string) { return true },
  async markAllAsRead(_userId: string) { return 0 },
  async deleteNotification(_notificationId: string, _userId: string) { return true },
  async getNotificationStats(_userId?: string) { return { total: 0, sent: 0, pending: 0, failed: 0, byType: {} } },
  async getUnreadCount(_userId: string) { return 0 },
  async getStats(_userId?: string, _dateFrom?: Date, _dateTo?: Date) { return { total: 0, sent: 0, pending: 0, failed: 0, byType: {} } },
  async searchNotifications(_filter: Record<string, unknown>) { return { notifications: [], total: 0, page: 1, limit: 20, pages: 0 } },
}

export function getNotificationService() { return notificationService }

export default notificationService
