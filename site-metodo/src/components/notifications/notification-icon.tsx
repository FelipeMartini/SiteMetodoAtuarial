'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellRing,
  Check,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Eye,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  createdAt: Date;
  readAt?: Date | null;
  userId: string;
  metadata?: Record<string, unknown>;
}

interface NotificationApiResponse {
  success: boolean;
  data: {
    notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      priority: string;
      read: boolean;
      createdAt: string;
      readAt?: string | null;
      userId: string;
      metadata?: Record<string, unknown>;
    }>;
    unreadCount: number;
  };
}

interface NotificationIconProps {
  className?: string;
}

export function NotificationIcon({ className }: NotificationIconProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const loadNotifications = React.useCallback(async () => {
    try {
      const response = await fetch('/api/notifications?limit=10&unreadOnly=false');
      if (response.ok) {
        const data: NotificationApiResponse = await response.json();
        if (data.success && data.data) {
          setNotifications(data.data.notifications.map((n) => ({
            ...n,
            type: n.type as 'info' | 'success' | 'warning' | 'error',
            priority: n.priority as 'low' | 'medium' | 'high' | 'urgent',
            createdAt: new Date(n.createdAt),
            readAt: n.readAt ? new Date(n.readAt) : null
          })));
          setUnreadCount(data.data.unreadCount || 0);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }, []);

  React.useEffect(() => {
    loadNotifications();
    
    // Recarregar notificações a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = async (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await loadNotifications();
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH'
      });
      if (response.ok) {
        await loadNotifications();
      }
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative h-9 w-9 ${className}`}
        >
          {unreadCount > 0 ? (
            <BellRing className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notificações</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-6 px-2"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Marcar todas
                </Button>
              )}
              <Link href="/admin/notifications">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} {unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}
            </p>
          )}
        </div>

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma notificação encontrada
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const IconComponent = getTypeIcon(notification.type);
                return (
                  <div 
                    key={notification.id}
                    className={`p-3 hover:bg-muted/10 transition-colors ${
                      !notification.read ? 'bg-blue-50/50 border-l-2 border-l-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${getTypeColor(notification.type)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-medium leading-tight ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => markAsRead(notification.id, e)}
                              className="h-6 w-6 p-0 shrink-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.createdAt, {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                          
                          {(notification.priority === 'high' || notification.priority === 'urgent') && (
                            <Badge 
                              variant="secondary"
                              className={`text-xs ${getPriorityBadgeColor(notification.priority)}`}
                            >
                              {notification.priority === 'urgent' ? 'Urgente' : 'Alta'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Link href="/admin/notifications">
                <Button variant="ghost" className="w-full text-sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver todas as notificações
                </Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
