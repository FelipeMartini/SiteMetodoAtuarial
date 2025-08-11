'use client'

import React, { useState, useEffect } from 'react'
import { Bell, BellOff, Check, CheckCheck, Trash2, Filter, Search, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import {
  NotificationData,
  NotificationFilter,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationPriority,
} from '@/types/notifications'
import { useNotifications } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'

interface NotificationCenterProps {
  userId: string
  maxHeight?: number
  showHeader?: boolean
  showFilters?: boolean
  autoMarkAsRead?: boolean
  onNotificationClick?: (notification: NotificationData) => void
}

export function NotificationCenter({
  userId,
  maxHeight = 600,
  showHeader = true,
  showFilters = true,
  autoMarkAsRead = true,
  onNotificationClick,
}: NotificationCenterProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<NotificationFilter>({ userId, limit: 50 })

  const {
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
  } = useNotifications({ userId, filter })

  // Filtros de estado
  const [typeFilters, setTypeFilters] = useState<Set<NotificationType>>(new Set())
  const [channelFilters, setChannelFilters] = useState<Set<NotificationChannel>>(new Set())
  const [statusFilters, setStatusFilters] = useState<Set<NotificationStatus>>(new Set())
  const [priorityFilters, setPriorityFilters] = useState<Set<NotificationPriority>>(new Set())
  const [unreadOnly, setUnreadOnly] = useState(false)

  // Aplica filtros quando mudam
  useEffect(() => {
    const newFilter: NotificationFilter = {
      userId,
      limit: 50,
      search: searchTerm || undefined,
      unreadOnly,
      types: typeFilters.size > 0 ? Array.from(typeFilters) : undefined,
      channels: channelFilters.size > 0 ? Array.from(channelFilters) : undefined,
      statuses: statusFilters.size > 0 ? Array.from(statusFilters) : undefined,
      priorities: priorityFilters.size > 0 ? Array.from(priorityFilters) : undefined,
    }

    setFilter(newFilter)
  }, [userId, searchTerm, unreadOnly, typeFilters, channelFilters, statusFilters, priorityFilters])

  const handleNotificationClick = async (notification: NotificationData) => {
    // Marca como lida automaticamente se habilitado
    if (autoMarkAsRead && !notification.readAt) {
      try {
        await markAsRead(notification.id)
      } catch (_error) {
        console.warn('Erro ao marcar como lida:', error)
      }
    }

    // Callback customizado
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId)
      toast({
        title: 'Sucesso',
        description: 'Notificação marcada como lida',
      })
    } catch (_error) {
      toast({
        title: 'Erro',
        description: 'Erro ao marcar notificação como lida',
        variant: 'destructive',
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const count = await markAllAsRead()
      toast({
        title: 'Sucesso',
        description: `${count} notificações marcadas como lidas`,
      })
    } catch (_error) {
      toast({
        title: 'Erro',
        description: 'Erro ao marcar todas como lidas',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId)
      setSelectedNotifications(prev => {
        const newSet = new Set(prev)
        newSet.delete(notificationId)
        return newSet
      })
      toast({
        title: 'Sucesso',
        description: 'Notificação removida',
      })
    } catch (_error) {
      toast({
        title: 'Erro',
        description: 'Erro ao remover notificação',
        variant: 'destructive',
      })
    }
  }

  const handleBulkAction = async (action: 'mark_read' | 'delete') => {
    if (selectedNotifications.size === 0) return

    try {
      if (action === 'mark_read') {
        for (const id of selectedNotifications) {
          await markAsRead(id)
        }
        toast({
          title: 'Sucesso',
          description: `${selectedNotifications.size} notificações marcadas como lidas`,
        })
      } else if (action === 'delete') {
        for (const id of selectedNotifications) {
          await deleteNotification(id)
        }
        toast({
          title: 'Sucesso',
          description: `${selectedNotifications.size} notificações removidas`,
        })
      }
      setSelectedNotifications(new Set())
    } catch (_error) {
      toast({
        title: 'Erro',
        description: 'Erro na ação em lote',
        variant: 'destructive',
      })
    }
  }

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev)
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId)
      } else {
        newSet.add(notificationId)
      }
      return newSet
    })
  }

  const clearFilters = () => {
    setTypeFilters(new Set())
    setChannelFilters(new Set())
    setStatusFilters(new Set())
    setPriorityFilters(new Set())
    setUnreadOnly(false)
    setSearchTerm('')
  }

  const getNotificationIcon = (type: NotificationType) => {
    const icons = {
      info: '💡',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      security: '🔒',
      system: '⚙️',
      user_action: '👤',
      marketing: '📢',
    }
    return icons[type] || '📧'
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    const colors = {
      low: 'text-gray-500',
      normal: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500',
    }
    return colors[priority] || 'text-gray-500'
  }

  if (error) {
    return (
      <Card className='w-full'>
        <CardContent className='p-6'>
          <div className='text-center text-red-500'>
            <p>Erro ao carregar notificações</p>
            <Button onClick={refresh} className='mt-2'>
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full'>
      {showHeader && (
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='h-5 w-5' />
              Notificações
              {unreadCount > 0 && (
                <Badge variant='destructive' className='ml-2'>
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>

            <div className='flex items-center gap-2'>
              {unreadCount > 0 && (
                <Button variant='ghost' size='sm' onClick={handleMarkAllAsRead} disabled={loading}>
                  <CheckCheck className='h-4 w-4 mr-1' />
                  Marcar todas como lidas
                </Button>
              )}

              <Button variant='ghost' size='sm' onClick={refresh} disabled={loading}>
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className='p-0'>
        {/* Barra de busca e filtros */}
        {showFilters && (
          <div className='p-4 border-b space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Buscar notificações...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm'>
                    <Filter className='h-4 w-4 mr-1' />
                    Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuCheckboxItem checked={unreadOnly} onCheckedChange={setUnreadOnly}>
                    Apenas não lidas
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={clearFilters}>
                    <X className='h-4 w-4 mr-2' />
                    Limpar filtros
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Ações em lote */}
            {selectedNotifications.size > 0 && (
              <div className='flex items-center gap-2 p-2 bg-blue-50 rounded-md'>
                <span className='text-sm text-blue-700'>
                  {selectedNotifications.size} selecionadas
                </span>
                <Button variant='ghost' size='sm' onClick={() => handleBulkAction('mark_read')}>
                  <Check className='h-4 w-4 mr-1' />
                  Marcar como lidas
                </Button>
                <Button variant='ghost' size='sm' onClick={() => handleBulkAction('delete')}>
                  <Trash2 className='h-4 w-4 mr-1' />
                  Remover
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setSelectedNotifications(new Set())}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Lista de notificações */}
        <ScrollArea className={`h-[${maxHeight}px]`}>
          <div className='space-y-1'>
            {loading && notifications.length === 0 ? (
              // Skeleton loading
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='p-4 border-b'>
                  <div className='flex items-start gap-3'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='h-4 w-3/4' />
                      <Skeleton className='h-3 w-1/2' />
                    </div>
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              <div className='p-8 text-center text-gray-500'>
                <BellOff className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                <p>Nenhuma notificação encontrada</p>
              </div>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isSelected={selectedNotifications.has(notification.id)}
                  onSelect={() => toggleNotificationSelection(notification.id)}
                  onClick={() => handleNotificationClick(notification)}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  onDelete={() => handleDelete(notification.id)}
                  getNotificationIcon={getNotificationIcon}
                  getPriorityColor={getPriorityColor}
                />
              ))
            )}
          </div>

          {/* Botão carregar mais */}
          {hasMore && (
            <div className='p-4 text-center'>
              <Button variant='ghost' onClick={loadMore} disabled={loading}>
                {loading ? 'Carregando...' : 'Carregar mais'}
              </Button>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Componente para item individual de notificação
interface NotificationItemProps {
  notification: NotificationData
  isSelected: boolean
  onSelect: () => void
  onClick: () => void
  onMarkAsRead: () => void
  onDelete: () => void
  getNotificationIcon: (type: NotificationType) => string
  getPriorityColor: (priority: NotificationPriority) => string
}

function NotificationItem({
  notification,
  isSelected,
  onSelect,
  onClick,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getPriorityColor,
}: NotificationItemProps) {
  const isUnread = !notification.readAt

  return (
    <div
      className={cn(
        'p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer',
        isUnread && 'bg-blue-50 border-l-4 border-l-blue-500',
        isSelected && 'bg-blue-100'
      )}
    >
      <div className='flex items-start gap-3'>
        {/* Checkbox de seleção */}
        <input
          type='checkbox'
          checked={isSelected}
          onChange={onSelect}
          className='mt-1 rounded'
          onClick={e => e.stopPropagation()}
        />

        {/* Ícone da notificação */}
        <div className='text-2xl mt-1'>{getNotificationIcon(notification.type)}</div>

        {/* Conteúdo da notificação */}
        <div className='flex-1 min-w-0' onClick={onClick}>
          <div className='flex items-start justify-between'>
            <h4 className={cn('font-medium text-sm', isUnread ? 'text-gray-900' : 'text-gray-600')}>
              {notification.title}
            </h4>

            <div className='flex items-center gap-2 ml-2'>
              <Badge
                variant='secondary'
                className={cn('text-xs', getPriorityColor(notification.priority))}
              >
                {notification.priority}
              </Badge>
              <span className='text-xs text-gray-400'>
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <p
            className={cn(
              'text-sm mt-1 line-clamp-2',
              isUnread ? 'text-gray-700' : 'text-gray-500'
            )}
          >
            {notification.message}
          </p>

          <div className='flex items-center gap-2 mt-2'>
            <Badge variant='outline' className='text-xs'>
              {notification.channel}
            </Badge>
            <Badge variant='outline' className='text-xs'>
              {notification.type}
            </Badge>
          </div>
        </div>

        {/* Ações */}
        <div className='flex items-center gap-1'>
          {isUnread && (
            <Button
              variant='ghost'
              size='sm'
              onClick={e => {
                e.stopPropagation()
                onMarkAsRead()
              }}
              title='Marcar como lida'
            >
              <Check className='h-4 w-4' />
            </Button>
          )}

          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
            title='Remover'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
