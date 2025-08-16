"use client"

// Página unificada de logs (FE-1) mostra subset de audit logs e notifications
// e linka para páginas detalhadas existentes.

import React, { useEffect, useState } from 'react'
import { ABACProtectedPage } from '@/lib/abac/hoc'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/admin/stats-card'
import { Activity, Bell, Shield, RefreshCw, ArrowRight } from 'lucide-react'
import { fetchWithJsonError } from '@/utils/fetchWithJsonError'
import { formatDateTime } from '@/utils/dateFormat'

interface MiniAuditLog { id: string; action: string; resource: string; timestamp: string; userId?: string | null; allowed?: boolean }
interface MiniNotification { id: string; title: string; type: string; createdAt: string; read: boolean }

export default function LogsOverviewPage() {
  const [audit, setAudit] = useState<MiniAuditLog[]>([])
  const [notifications, setNotifications] = useState<MiniNotification[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      // Audit subset
      const auditRes = await fetch('/api/admin/audit-logs?page=1&limit=10')
      if (auditRes.ok) {
        const data = await auditRes.json()
        setAudit((data.logs || []).slice(0, 5))
      }
      // Notifications subset (usar endpoint público interno já existente)
      const notifRes = await fetch('/api/notifications?limit=10')
      if (notifRes.ok) {
        const data = await notifRes.json()
        setNotifications((data.notifications || []).slice(0, 5))
      }
    } catch (e) {
      console.error('Erro ao carregar subsets de logs', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <ABACProtectedPage object='admin:logs' action='read'>
      <div className='container mx-auto py-6 space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Logs & Notificações</h1>
            <p className='text-muted-foreground'>Visão unificada rápida de auditoria e notificações do sistema</p>
          </div>
          <Button variant='outline' size='sm' onClick={loadData} disabled={loading} className='flex items-center gap-2'>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
        </div>

        <div className='grid gap-4 grid-cols-1 md:grid-cols-3'>
          <StatsCard title='Eventos Audit (24h)' value={audit.length} description='Subset exibido' icon={Shield} />
          <StatsCard title='Notificações Recentes' value={notifications.length} description='Últimas 5' icon={Bell} />
          <StatsCard title='Total Itens' value={audit.length + notifications.length} description='Audit + Notifs' icon={Activity} />
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Audit Logs (Subset)</CardTitle>
                <CardDescription>Últimos eventos de auditoria</CardDescription>
              </div>
              <Button variant='ghost' size='sm' onClick={() => { window.location.href = '/admin/audit-logs' }}>Ver todos <ArrowRight className='h-4 w-4 ml-1' /></Button>
            </CardHeader>
            <CardContent className='space-y-3'>
              {audit.length === 0 && <p className='text-sm text-muted-foreground'>Nenhum log recente.</p>}
              {audit.map(a => (
                <div key={a.id} className='border rounded-md p-3 flex items-center justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Badge variant={a.allowed ? 'outline' : 'destructive'}>{a.action}</Badge>
                      <span className='text-xs text-muted-foreground'>{formatDateTime(a.timestamp)}</span>
                    </div>
                    <p className='text-sm font-medium'>{a.resource}</p>
                  </div>
                  {a.userId && <span className='text-xs text-muted-foreground'>User: {a.userId}</span>}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Notificações (Subset)</CardTitle>
                <CardDescription>Últimas notificações geradas</CardDescription>
              </div>
              <Button variant='ghost' size='sm' onClick={() => { window.location.href = '/admin/notifications' }}>Ver todas <ArrowRight className='h-4 w-4 ml-1' /></Button>
            </CardHeader>
            <CardContent className='space-y-3'>
              {notifications.length === 0 && <p className='text-sm text-muted-foreground'>Nenhuma notificação recente.</p>}
              {notifications.map(n => (
                <div key={n.id} className='border rounded-md p-3 flex items-center justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Badge variant={n.read ? 'outline' : 'default'}>{n.type}</Badge>
                      <span className='text-xs text-muted-foreground'>{formatDateTime(n.createdAt)}</span>
                    </div>
                    <p className='text-sm font-medium'>{n.title}</p>
                  </div>
                  {!n.read && <span className='text-[10px] uppercase text-primary font-semibold'>Novo</span>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ABACProtectedPage>
  )
}
"use client"
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/admin/stats-card'
import { ArrowRight } from 'lucide-react'

export default function AdminLogsHub() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Central de Logs & Notificações</h1>
        <p className="text-sm text-muted-foreground">Ponto único para acessar auditoria, logs do sistema, métricas e centro de notificações.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Link href="/admin/audit-logs" className="group">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Histórico detalhado de acessos e decisões ABAC</p>
              <ArrowRight className="opacity-60 group-hover:opacity-100" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/notifications" className="group">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Centro de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Gerencie notificações, broadcasts e entregas</p>
              <ArrowRight className="opacity-60 group-hover:opacity-100" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/auditoria" className="group">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Dashboard de Auditoria</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Visão com métricas e gráficos (resumo)</p>
              <ArrowRight className="opacity-60 group-hover:opacity-100" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
