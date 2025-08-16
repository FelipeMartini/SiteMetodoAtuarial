"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ABACProtectedPage } from '@/lib/abac/hoc'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/admin/stats-card'
import { Activity, Bell, Shield, RefreshCw, ArrowRight } from 'lucide-react'
import { formatDateTime } from '@/utils/dateFormat'

interface MiniAuditLog { 
  id: string; 
  action: string; 
  resource: string; 
  timestamp: string; 
  userId?: string | null; 
  allowed?: boolean 
}

interface MiniNotification { 
  id: string; 
  title: string; 
  type: string; 
  createdAt: string; 
  read: boolean 
}

export default function LogsOverviewPage() {
  const [audit, setAudit] = useState<MiniAuditLog[]>([])
  const [notifications, setNotifications] = useState<MiniNotification[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const auditRes = await fetch('/api/admin/audit-logs?page=1&limit=10')
      if (auditRes.ok) {
        const data = await auditRes.json()
        setAudit((data.logs || []).slice(0, 5))
      }
      
      const notifRes = await fetch('/api/notifications?limit=10')
      if (notifRes.ok) {
        const data = await notifRes.json()
        setNotifications((data.notifications || []).slice(0, 5))
      }
    } catch (_e) {
      console.error('Erro ao carregar subsets de logs', _e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <ABACProtectedPage object='admin:logs' action='read'>
      <div className='container mx-auto py-6 space-y-6'>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Central de Logs & Notificações</h1>
          <p className="text-sm text-muted-foreground">
            Ponto único para acessar auditoria, logs do sistema, métricas e centro de notificações.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
          <Link href="/admin/audit-logs" className="group">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Logs de Auditoria
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Histórico detalhado de acessos e decisões ABAC</p>
                <ArrowRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/notifications" className="group">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Centro de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Gerencie notificações, broadcasts e entregas</p>
                <ArrowRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/auditoria" className="group">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Dashboard de Auditoria
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Visão com métricas e gráficos (resumo)</p>
                <ArrowRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6'>
          <StatsCard title='Logs Hoje' value='142' description='Acessos nas últimas 24h' icon={Activity} />
          <StatsCard title='Notificações' value='23' description='Não lidas' icon={Bell} />
          <StatsCard title='Taxa Aprovação' value='87%' description='Permissões concedidas' icon={Shield} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card>
            <CardHeader className='flex-row items-center justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Últimos Acessos
                </CardTitle>
                <CardDescription>Preview dos logs de auditoria</CardDescription>
              </div>
              <Button variant='outline' onClick={loadData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </CardHeader>
            <CardContent className='space-y-3'>
              {audit.length === 0 ? (
                <p className='text-sm text-muted-foreground'>Nenhum log encontrado</p>
              ) : (
                audit.map(log => (
                  <div key={log.id} className='flex items-center justify-between p-2 rounded border'>
                    <div className='flex-1'>
                      <div className='font-medium text-sm'>{log.action} → {log.resource}</div>
                      <div className='text-xs text-muted-foreground'>{formatDateTime(new Date(log.timestamp))}</div>
                    </div>
                    <Badge variant={log.allowed ? 'default' : 'destructive'}>
                      {log.allowed ? 'Permitido' : 'Negado'}
                    </Badge>
                  </div>
                ))
              )}
              <Link href='/admin/audit-logs'>
                <Button variant='outline' size='sm' className='w-full mt-3'>
                  Ver todos os logs de auditoria
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex-row items-center justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2'>
                  <Bell className='h-5 w-5' />
                  Notificações Recentes
                </CardTitle>
                <CardDescription>Preview das notificações</CardDescription>
              </div>
              <Button variant='outline' onClick={loadData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </CardHeader>
            <CardContent className='space-y-3'>
              {notifications.length === 0 ? (
                <p className='text-sm text-muted-foreground'>Nenhuma notificação encontrada</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className='flex items-center justify-between p-2 rounded border'>
                    <div className='flex-1'>
                      <div className='font-medium text-sm'>{n.title}</div>
                      <div className='text-xs text-muted-foreground'>{formatDateTime(new Date(n.createdAt))}</div>
                    </div>
                    {!n.read && <span className='text-[10px] uppercase text-primary font-semibold'>Novo</span>}
                  </div>
                ))
              )}
              <Link href='/admin/notifications'>
                <Button variant='outline' size='sm' className='w-full mt-3'>
                  Ver todas as notificações
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </ABACProtectedPage>
  )
}
