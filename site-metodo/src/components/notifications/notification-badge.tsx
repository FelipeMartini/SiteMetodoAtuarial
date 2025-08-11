'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { NotificationCenter } from './notification-center';
import { useUnreadCount } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  userId: string;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onNotificationClick?: (notification: any) => void;
}

export function NotificationBadge({
  userId,
  maxCount = 99,
  showZero = false,
  dot = false,
  size = 'md',
  className,
  onNotificationClick
}: NotificationBadgeProps) {
  const { count, loading } = useUnreadCount(userId);

  const shouldShowBadge = count > 0 || (showZero && count === 0);
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative",
            sizeClasses[size],
            className
          )}
          disabled={loading}
        >
          <Bell className={iconSizes[size]} />
          
          {shouldShowBadge && !loading && (
            <Badge
              variant="destructive"
              className={cn(
                "absolute -top-1 -right-1 h-5 min-w-[20px] p-0 flex items-center justify-center text-xs",
                dot && "h-3 w-3 min-w-0 p-0"
              )}
            >
              {!dot && displayCount}
            </Badge>
          )}
          
          {loading && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-gray-300 rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-96 p-0"
        sideOffset={8}
      >
        <NotificationCenter
          userId={userId}
          maxHeight={400}
          showHeader={true}
          showFilters={false}
          autoMarkAsRead={true}
          onNotificationClick={onNotificationClick}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Badge simples de contagem (sem dropdown)
 */
interface SimpleNotificationBadgeProps {
  userId: string;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SimpleNotificationBadge({
  userId,
  maxCount = 99,
  showZero = false,
  dot = false,
  onClick,
  className
}: SimpleNotificationBadgeProps) {
  const { count, loading } = useUnreadCount(userId);

  const shouldShowBadge = count > 0 || (showZero && count === 0);
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("relative h-9 w-9", className)}
      onClick={onClick}
      disabled={loading}
    >
      <Bell className="h-5 w-5" />
      
      {shouldShowBadge && !loading && (
        <Badge
          variant="destructive"
          className={cn(
            "absolute -top-1 -right-1 h-5 min-w-[20px] p-0 flex items-center justify-center text-xs",
            dot && "h-3 w-3 min-w-0 p-0"
          )}
        >
          {!dot && displayCount}
        </Badge>
      )}
      
      {loading && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-gray-300 rounded-full animate-pulse" />
      )}
    </Button>
  );
}

/**
 * Indicador de notificações para usar em qualquer lugar
 */
interface NotificationIndicatorProps {
  count: number;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function NotificationIndicator({
  count,
  maxCount = 99,
  showZero = false,
  dot = false,
  size = 'sm',
  className
}: NotificationIndicatorProps) {
  const shouldShow = count > 0 || (showZero && count === 0);
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeClasses = {
    xs: "h-4 min-w-[16px] text-xs",
    sm: "h-5 min-w-[20px] text-xs",
    md: "h-6 min-w-[24px] text-sm",
    lg: "h-7 min-w-[28px] text-sm"
  };

  const dotSizeClasses = {
    xs: "h-2 w-2",
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className={cn(
        "p-0 flex items-center justify-center font-medium",
        dot ? dotSizeClasses[size] : sizeClasses[size],
        dot && "min-w-0 rounded-full",
        className
      )}
    >
      {!dot && displayCount}
    </Badge>
  );
}
