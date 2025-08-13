'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { LucideIcon } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'user' | 'system' | 'security' | 'calculation'
  title: string
  description: string
  timestamp: Date
  user?: {
    name: string
    avatar?: string
  }
  icon?: LucideIcon
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

interface RecentActivityProps {
  activities: ActivityItem[]
  className?: string
}

const severityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas ações realizadas no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[300px] pr-4'>
          <div className='space-y-4'>
            {activities.map(activity => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className='flex items-start space-x-3'>
                  <div className='flex-shrink-0'>
                    {activity.user ? (
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>
                          {activity.user.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : Icon ? (
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
                        <Icon className='h-4 w-4' />
                      </div>
                    ) : null}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-medium'>{activity.title}</p>
                      {activity.severity && (
                        <Badge
                          variant='secondary'
                          className={severityColors[activity.severity]}
                        >
                          {activity.severity}
                        </Badge>
                      )}
                    </div>
                    <p className='text-sm text-muted-foreground'>{activity.description}</p>
                    <p className='text-xs text-muted-foreground'>
                      {formatDistanceToNow(activity.timestamp, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
