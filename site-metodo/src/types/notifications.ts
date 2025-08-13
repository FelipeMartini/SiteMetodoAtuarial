/**
 * Tipos para o Sistema de Notificações
 * Sistema completo para gerenciamento de notificações real-time,
 * email templates, push notifications e centro de notificações
 */

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SECURITY = 'security',
  SYSTEM = 'system',
  USER_ACTION = 'user_action',
  MARKETING = 'marketing',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  WEBHOOK = 'webhook',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface NotificationData {
  id: string
  userId: string
  type: NotificationType
  channel: NotificationChannel
  priority: NotificationPriority
  status: NotificationStatus
  title: string
  message: string
  data?: Record<string, unknown>
  scheduledFor?: Date
  sentAt?: Date
  readAt?: Date
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface NotificationTemplate {
  id: string
  name: string
  type: NotificationType
  channel: NotificationChannel
  subject?: string
  htmlTemplate?: string
  textTemplate?: string
  variables: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NotificationPreferences {
  id: string
  userId: string
  channel: NotificationChannel
  type: NotificationType
  enabled: boolean
  frequency?: 'immediate' | 'daily' | 'weekly' | 'monthly'
  quietHours?: {
    start: string // HH:mm
    end: string // HH:mm
    timezone: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface PushSubscription {
  id: string
  userId: string
  endpoint: string
  p256dh: string
  auth: string
  userAgent?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NotificationQueue {
  id: string
  notificationId: string
  priority: NotificationPriority
  attempts: number
  maxAttempts: number
  nextRetry?: Date
  error?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
}

// Interfaces para criação de notificações
export interface CreateNotificationRequest {
  userId: string | string[]
  type: NotificationType
  channels: NotificationChannel[]
  priority?: NotificationPriority
  title: string
  message: string
  data?: Record<string, unknown>
  templateId?: string
  templateVariables?: Record<string, unknown>
  scheduledFor?: Date
  expiresAt?: Date
}

export interface BulkNotificationRequest {
  [key: string]: unknown
  userIds: string[]
  type: NotificationType
  channels: NotificationChannel[]
  priority?: NotificationPriority
  title: string
  message: string
  data?: Record<string, unknown>
  templateId?: string
  templateVariables?: Record<string, unknown>
  scheduledFor?: Date
  expiresAt?: Date
}

// Interfaces para templates de email
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  text?: string
  variables: string[]
  category?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface EmailData {
  to: string | string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  html?: string
  text?: string
  attachments?: EmailAttachment[]
  templateId?: string
  templateVariables?: Record<string, unknown>
  priority?: NotificationPriority
  scheduledFor?: Date
}

export interface EmailAttachment {
  filename: string
  content: Buffer | string
  contentType?: string
  encoding?: string
  cid?: string // Para imagens inline
}

// Interfaces para WebSocket
export interface WebSocketMessage {
  type: 'notification' | 'ping' | 'pong' | 'status'
  data?: Record<string, unknown>
  timestamp: number
}

export interface NotificationSocketData {
  notification: NotificationData
  unreadCount: number
}

// Interfaces para estatísticas
export interface NotificationStats {
  total: number
  byType: Record<NotificationType, number>
  byChannel: Record<NotificationChannel, number>
  byStatus: Record<NotificationStatus, number>
  deliveryRate: number
  readRate: number
  averageDeliveryTime: number // em milissegundos
  period: {
    start: Date
    end: Date
  }
}

export interface UserNotificationStats {
  userId: string
  unreadCount: number
  totalReceived: number
  lastRead?: Date
  preferredChannels: NotificationChannel[]
  engagementRate: number // percentual de notificações lidas
}

// Interfaces para configurações do sistema
export interface NotificationSystemConfig {
  maxRetries: number
  retryDelay: number // em milissegundos
  batchSize: number
  rateLimits: {
    [key in NotificationChannel]: {
      requests: number
      period: number // em milissegundos
    }
  }
  defaultExpiration: number // em milissegundos
  emailSettings: {
    from: string
    replyTo?: string
    provider: 'smtp' | 'sendgrid' | 'mailgun' | 'aws-ses'
  }
  pushSettings: {
    vapidPublicKey: string
    vapidPrivateKey: string
    subject: string
  }
}

// Interfaces para eventos
export interface NotificationEvent {
  type: 'sent' | 'delivered' | 'read' | 'failed' | 'clicked'
  notificationId: string
  userId: string
  channel: NotificationChannel
  timestamp: Date
  metadata?: Record<string, unknown>
}

// Interfaces para filtros e busca
export interface NotificationFilter {
  [key: string]: unknown
  userId?: string
  types?: NotificationType[]
  channels?: NotificationChannel[]
  statuses?: NotificationStatus[]
  priorities?: NotificationPriority[]
  dateFrom?: Date
  dateTo?: Date
  unreadOnly?: boolean
  search?: string
  limit?: number
  offset?: number
  sortBy?: 'createdAt' | 'priority' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface NotificationSearchResult {
  notifications: NotificationData[]
  total: number
  hasMore: boolean
  aggregations?: {
    byType: Record<NotificationType, number>
    byChannel: Record<NotificationChannel, number>
    byStatus: Record<NotificationStatus, number>
  }
}

// Interfaces para hooks React
export interface UseNotificationsOptions {
  userId: string
  autoRefresh?: boolean
  refreshInterval?: number
  filter?: NotificationFilter
}

export interface UseNotificationsReturn {
  notifications: NotificationData[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
  hasMore: boolean
}

// Interfaces para componentes
export interface NotificationItemProps {
  notification: NotificationData
  onRead?: (notificationId: string) => void
  onDelete?: (notificationId: string) => void
  showActions?: boolean
  compact?: boolean
}

export interface NotificationCenterProps {
  userId: string
  maxHeight?: number
  showHeader?: boolean
  showFilters?: boolean
  autoMarkAsRead?: boolean
  onNotificationClick?: (notification: NotificationData) => void
}

export interface NotificationBadgeProps {
  count: number
  maxCount?: number
  showZero?: boolean
  dot?: boolean
  offset?: [number, number]
}
