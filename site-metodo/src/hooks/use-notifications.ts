'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  NotificationData,
  NotificationStatus,
  UseNotificationsOptions,
  UseNotificationsReturn,
} from '@/types/notifications'

/**
 * Hook para gerenciar notificações no frontend
 * Fornece estado e ações para notificações do usuário
 */
export function useNotifications(options: UseNotificationsOptions): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const {
    userId,
    autoRefresh = true,
    refreshInterval = 30000, // 30 segundos
    filter = {},
  } = options

  /**
   * Busca notificações da API
   */
  const fetchNotifications = useCallback(
    async (reset = false) => {
      try {
        setLoading(true)
        setError(null)

        const currentOffset = reset ? 0 : offset
        const params = new URLSearchParams()

        // Adiciona filtros básicos
        params.append('offset', currentOffset.toString())
        params.append('limit', filter.limit?.toString() || '50')

        // Adiciona outros filtros condicionalmente
        if (filter.userId) params.append('userId', filter.userId)
        if (filter.unreadOnly !== undefined)
          params.append('unreadOnly', filter.unreadOnly.toString())
        if (filter.search) params.append('search', filter.search)
        if (filter.dateFrom) params.append('dateFrom', filter.dateFrom.toISOString())
        if (filter.dateTo) params.append('dateTo', filter.dateTo.toISOString())
        if (filter.sortBy) params.append('sortBy', filter.sortBy)
        if (filter.sortOrder) params.append('sortOrder', filter.sortOrder)

        // Adiciona arrays como strings separadas por vírgula
        if (filter.types && filter.types.length > 0) {
          params.append('types', filter.types.join(','))
        }
        if (filter.channels && filter.channels.length > 0) {
          params.append('channels', filter.channels.join(','))
        }
        if (filter.statuses && filter.statuses.length > 0) {
          params.append('statuses', filter.statuses.join(','))
        }
        if (filter.priorities && filter.priorities.length > 0) {
          params.append('priorities', filter.priorities.join(','))
        }

        const response = await fetch(`/api/notifications?${params}`)

        if (!response.ok) {
          throw new Error('Erro ao buscar notificações')
        }

        const data = await response.json()

        if (data.success) {
          const newNotifications = data.data.notifications

          if (reset) {
            setNotifications(newNotifications)
            setOffset(newNotifications.length)
          } else {
            setNotifications(prev => [...prev, ...newNotifications])
            setOffset(prev => prev + newNotifications.length)
          }

          setHasMore(data.data.hasMore)

          // Atualiza contagem não lidas
          const unreadNotifications = newNotifications.filter((n: NotificationData) => !n.readAt)

          if (reset) {
            setUnreadCount(unreadNotifications.length)
          }
        } else {
          throw new Error(data.error || 'Erro desconhecido')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        console.error('Erro ao buscar notificações:', err)
      } finally {
        setLoading(false)
      }
    },
    [filter, offset]
  )

  /**
   * Busca contagem de não lidas
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/stats?period=7d')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUnreadCount(data.data.user.unreadCount)
        }
      }
    } catch (_error) {
      console.warn(String(_error))
    }
  }, []) // Remove 'error' dependency

  /**
   * Marca notificação como lida
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'mark_as_read' }),
      })

      if (!response.ok) {
        throw new Error('Erro ao marcar como lida')
      }

      // Atualiza estado local
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, readAt: new Date(), status: NotificationStatus.READ }
            : notification
        )
      )

      // Atualiza contagem
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (_error) {
      console.error('Erro ao marcar como lida:', String(_error))
      throw _error
    }
  }, [])

  /**
   * Marca todas as notificações como lidas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_all_as_read',
          notificationIds: [],
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao marcar todas como lidas')
      }

      const data = await response.json()
      const markedCount = data.data.markedAsRead

      // Atualiza estado local
      setNotifications(prev =>
        prev.map(notification =>
          !notification.readAt
            ? { ...notification, readAt: new Date(), status: 'read' as const }
            : notification
        )
      )

      setUnreadCount(0)
      return markedCount
    } catch (_error) {
      console.error('Erro ao marcar todas como lidas:', String(_error))
      throw _error
    }
  }, [])

  /**
   * Remove notificação
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover notificação')
      }

      // Remove do estado local
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId)
        const newNotifications = prev.filter(n => n.id !== notificationId)

        // Atualiza contagem se era não lida
        if (notification && !notification.readAt) {
          setUnreadCount(count => Math.max(0, count - 1))
        }

        return newNotifications
      })
    } catch (_error) {
      console.error('Erro ao remover notificação:', String(_error))
      throw _error
    }
  }, [])

  /**
   * Atualiza a lista
   */
  const refresh = useCallback(async () => {
    setOffset(0)
    await fetchNotifications(true)
  }, [fetchNotifications])

  /**
   * Carrega mais notificações
   */
  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchNotifications(false)
    }
  }, [loading, hasMore, fetchNotifications])

  // Efeito inicial
  useEffect(() => {
    fetchNotifications(true)
    fetchUnreadCount()
  }, [userId, filter, fetchNotifications, fetchUnreadCount])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchUnreadCount()

      // Só faz refresh completo se não há filtros específicos
      if (!filter.search && !filter.types?.length) {
        refresh()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, filter, refresh, fetchUnreadCount])

  // WebSocket para notificações real-time (se disponível)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Tenta conectar ao WebSocket de notificações
    const connectWebSocket = () => {
      try {
        const wsUrl = `ws://localhost:8080?userId=${userId}`
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          console.log('WebSocket conectado para notificações')
        }

        ws.onmessage = event => {
          try {
            const message = JSON.parse(event.data)

            if (message.type === 'notification') {
              const { notification, unreadCount: newUnreadCount } = message.data

              // Adiciona nova notificação no topo
              setNotifications(prev => [notification, ...prev])
              setUnreadCount(newUnreadCount)

              // Notificação browser se permitido
              if (Notification.permission === 'granted') {
                new Notification(notification.title, {
                  body: notification.message,
                  icon: '/icons/notification-icon.png',
                })
              }
            } else if (message.type === 'status') {
              setUnreadCount(message.data.unreadCount)
            }
          } catch (_error) {
            console.warn(String(_error))
          }
        }

        ws.onerror = error => {
          console.warn('WebSocket error:', error)
        }

        ws.onclose = () => {
          console.log('WebSocket desconectado')
          // Reconecta após 5 segundos
          setTimeout(connectWebSocket, 5000)
        }

        return () => {
          ws.close()
        }
      } catch (_error) {
        console.warn(String(_error))
      }
    }

    const cleanup = connectWebSocket()
    return cleanup
  }, [userId])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    loadMore,
    hasMore,
  }
}

/**
 * Hook simples para contagem de não lidas
 */
export function useUnreadCount(userId: string) {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/notifications/stats?period=7d')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setCount(data.data.user.unreadCount)
          }
        }
      } catch (_error) {
        console.warn(String(_error))
      } finally {
        setLoading(false)
      }
    }

    fetchCount()

    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [userId])

  return { count, loading }
}

/**
 * Hook para push notifications
 */
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window)
    setPermission(Notification.permission)
  }, [])

  const requestPermission = async () => {
    if (!isSupported) {
      throw new Error('Push notifications não suportadas')
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const subscribe = async () => {
    try {
      if (permission !== 'granted') {
        await requestPermission()
      }

      // Busca configuração da API
      const configResponse = await fetch('/api/notifications/push?action=config')
      const configData = await configResponse.json()

      if (!configData.success) {
        throw new Error('Erro ao obter configuração push')
      }

      const { vapidPublicKey } = configData.data

      // Registra service worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      // Cria subscription
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey, // Usa diretamente a string
      })

      // Envia para servidor
      const response = await fetch('/api/notifications/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'subscribe',
          subscription: pushSubscription.toJSON(),
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao registrar subscription')
      }

      setSubscription(pushSubscription)
      return pushSubscription
    } catch (_error) {
      console.error('Erro ao subscrever push notifications:', String(_error))
      throw _error
    }
  }

  const unsubscribe = async () => {
    try {
      if (subscription) {
        await fetch('/api/notifications/push', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        })

        await subscription.unsubscribe()
        setSubscription(null)
      }
    } catch (_error) {
      console.error('Erro ao cancelar subscription:', String(_error))
      throw _error
    }
  }

  const testPush = async () => {
    try {
      const response = await fetch('/api/notifications/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test' }),
      })

      const data = await response.json()
      return data.success
    } catch (_error) {
      console.error('Erro no teste push:', String(_error))
      return false
    }
  }

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    testPush,
  }
}

// Utility function para converter VAPID key
