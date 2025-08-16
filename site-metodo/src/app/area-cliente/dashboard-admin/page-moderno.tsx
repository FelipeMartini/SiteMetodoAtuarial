"use client"

import React from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import { AdminDashboardStats } from '@/components/admin/dashboard-stats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Activity, Settings, Shield, BarChart3, Database, AlertTriangle } from 'lucide-react'
import { ABACProtectedPage } from '@/lib/abac/hoc'

/**
 * Dashboard administrativo modernizado
 * Interface completa para gerenciamento do sistema
 */
export default function PageDashboardAdminModerno() {
  const { data: session, status } = useAuth()

  if (status === 'loading') {
    return (
      <div className='container mx-auto py-8 px-4 max-w-7xl'>
        <Skeleton className='h-[32px] w-[320px] mb-6' />
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8'>
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className='h-[120px] w-full' />
          ))}
        </div>
        <Skeleton className='h-[400px] w-full' />
      </div>
    )
  }

  return (
    <ABACProtectedPage object='admin:dashboard' action='read'>
      <div className='container mx-auto py-8 px-4 max-w-7xl'>
      {/* Header do Dashboard */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight flex items-center gap-3'>
              <Shield className='h-8 w-8 text-red-500' />
              Dashboard Administrativo
            </h1>
            <p className='text-muted-foreground mt-2'>
              Painel de controle completo do sistema - Bem-vindo, {session?.user?.name || session?.user?.email || 'Admin'}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Badge variant='destructive' className='gap-1'>
              <Shield className='h-3 w-3' />
              ADMIN
            </Badge>
            <Button variant='outline' size='sm'>
              <Settings className='h-4 w-4 mr-2' />
              Configurações
            </Button>
          </div>
        </div>
      </div>

      {/* Estatísticas do Sistema */}
      <div className='mb-8'>
        <AdminDashboardStats />
      </div>

  {/* Tabs de Gerenciamento */}
      <Tabs defaultValue='users' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='users' className='flex items-center gap-2'>
            <Users className='h-4 w-4' />
            Usuários
          </TabsTrigger>
          <TabsTrigger value='activity' className='flex items-center gap-2'>
            <Activity className='h-4 w-4' />
            Atividade
          </TabsTrigger>
          <TabsTrigger value='analytics' className='flex items-center gap-2'>
            <BarChart3 className='h-4 w-4' />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value='system' className='flex items-center gap-2'>
            <Database className='h-4 w-4' />
            Sistema
          </TabsTrigger>
          <TabsTrigger value='security' className='flex items-center gap-2'>
            <AlertTriangle className='h-4 w-4' />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value='users' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                Gestão de Usuários
              </CardTitle>
              <CardDescription>
                Gerencie usuários e suas permissões no sistema ABAC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Componente de gestão de usuários em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='activity' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Activity className='h-5 w-5' />
                Log de Atividades
              </CardTitle>
              <CardDescription>Acompanhe todas as ações realizadas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center gap-4 p-4 rounded-lg border'>
                  <div className='h-2 w-2 rounded-full bg-green-500' />
                  <div className='flex-1'>
                    <p className='font-medium'>Novo usuário cadastrado</p>
                    <p className='text-sm text-muted-foreground'>joao@example.com • há 5 minutos</p>
                  </div>
                  <Badge variant='outline'>LOGIN</Badge>
                </div>
                <div className='flex items-center gap-4 p-4 rounded-lg border'>
                  <div className='h-2 w-2 rounded-full bg-blue-500' />
                  <div className='flex-1'>
                    <p className='font-medium'>Configuração alterada</p>
                    <p className='text-sm text-muted-foreground'>Admin • há 15 minutos</p>
                  </div>
                  <Badge variant='outline'>CONFIG</Badge>
                </div>
                <div className='flex items-center gap-4 p-4 rounded-lg border'>
                  <div className='h-2 w-2 rounded-full bg-orange-500' />
                  <div className='flex-1'>
                    <p className='font-medium'>Tentativa de login falhosa</p>
                    <p className='text-sm text-muted-foreground'>192.168.1.100 • há 1 hora</p>
                  </div>
                  <Badge variant='destructive'>SECURITY</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='analytics' className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Usuários por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg'>
                  <p className='text-muted-foreground'>Gráfico de usuários por mês</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg'>
                  <p className='text-muted-foreground'>Gráfico de distribuição de funções</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='system' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Database className='h-5 w-5' />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium'>Versão da Aplicação</p>
                  <p className='text-sm text-muted-foreground'>v2.1.0</p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium'>Versão do Next.js</p>
                  <p className='text-sm text-muted-foreground'>15.4.6</p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium'>Banco de Dados</p>
                  <p className='text-sm text-muted-foreground'>PostgreSQL 15.0</p>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-medium'>Uptime</p>
                  <p className='text-sm text-muted-foreground'>7 dias, 14 horas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5' />
                Monitoramento de Segurança
              </CardTitle>
              <CardDescription>Alertas e eventos de segurança do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950'>
                  <div>
                    <p className='font-medium text-orange-800 dark:text-orange-200'>
                      Múltiplas tentativas de login
                    </p>
                    <p className='text-sm text-orange-600 dark:text-orange-400'>
                      IP: 192.168.1.100 - 5 tentativas na última hora
                    </p>
                  </div>
                  <Button variant='outline' size='sm'>
                    Investigar
                  </Button>
                </div>
                <div className='flex items-center justify-between p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'>
                  <div>
                    <p className='font-medium text-green-800 dark:text-green-200'>
                      Certificado SSL válido
                    </p>
                    <p className='text-sm text-green-600 dark:text-green-400'>Expira em 89 dias</p>
                  </div>
                  <Badge variant='outline' className='border-green-200 text-green-800'>
                    OK
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </ABACProtectedPage>
  )
}
