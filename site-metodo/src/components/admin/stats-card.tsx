'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ComponentType, SVGProps } from 'react'
type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  change?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  change,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
        {Icon && <Icon className='h-4 w-4 text-muted-foreground' />}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {(description || change) && (
          <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
            {change && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  change.isPositive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                )}
              >
                {change.isPositive ? '+' : ''}
                {change.value}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
