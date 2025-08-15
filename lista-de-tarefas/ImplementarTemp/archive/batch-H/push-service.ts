// Arquivado: push-service.ts (stub)
// Copiado antes da remoção do stub ativo

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface PushConfig {
  vapidPublicKey: string
  vapidPrivateKey: string
  vapidEmail: string
  subject?: string
}

export interface PushNotificationData {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: Record<string, unknown>
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export class PushNotificationService {
  constructor(private config: PushConfig) {}

  async subscribe(userId: string, subscription: PushSubscription): Promise<boolean> {
    console.log('Push Subscribe (stub):', { userId, subscription })
    return true
  }

  async registerSubscription(userId: string, subscription: PushSubscription, userAgent?: string): Promise<string> {
    console.log('Register Push Subscription (stub):', { userId, subscription, userAgent })
    return `subscription_${Date.now()}_${userId}`
  }

  async unsubscribe(userId: string, endpoint: string): Promise<boolean> {
    console.log('Push Unsubscribe (stub):', { userId, endpoint })
    return true
  }

  async unregisterSubscription(endpoint: string): Promise<boolean> {
    console.log('Unregister Push Subscription (stub):', { endpoint })
    return true
  }

  async testPushNotification(userId: string): Promise<boolean> {
    console.log('Test Push Notification (stub):', { userId })
    return true
  }

  async getStats(): Promise<{ total: number; active: number; expired: number }> {
    console.log('Get Push Stats (stub)')
    return { total: 0, active: 0, expired: 0 }
  }

  async sendToUser(userId: string, notification: PushNotificationData): Promise<boolean> {
    console.log('Send Push to User (stub):', { userId, notification })
    return true
  }

  async sendToUsers(userIds: string[], notification: PushNotificationData): Promise<{ sent: number; failed: number }> {
    console.log('Send Push to Users (stub):', { userIds, notification })
    return { sent: userIds.length, failed: 0 }
  }

  async sendToSubscription(subscription: PushSubscription, notification: PushNotificationData): Promise<boolean> {
    console.log('Send Push to Subscription (stub):', { subscription, notification })
    return true
  }

  async getUserSubscriptions(userId: string): Promise<PushSubscription[]> {
    console.log('Get User Subscriptions (stub):', { userId })
    return []
  }

  async removeExpiredSubscriptions(): Promise<number> {
    console.log('Remove Expired Subscriptions (stub)')
    return 0
  }
}

export function createPushNotificationService(config: PushConfig): PushNotificationService {
  return new PushNotificationService(config)
}

export default PushNotificationService
