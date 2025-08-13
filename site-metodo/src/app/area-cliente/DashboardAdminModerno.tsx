'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  Users,
  Activity,
  TrendingUp,
  UserCheck,
  UserX,
  Shield,
  Database,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Calculator,
  FileText,
} from 'lucide-react'
import { StatsCard } from '@/components/admin/stats-card'
import { RecentActivity } from '@/components/admin/recent-activity'
import { DataTable } from '@/components/admin/data-table'
import { columns, Usuario } from '@/components/admin/users-table-columns'

interface DashboardStats {
  totalUsuarios: number
  usuariosAtivos: number
  usuariosInativos: number
  novosMes: number
  loginsMes: number
  admins: number
}

const DashboardAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    usuariosInativos: 0,
    novosMes: 0,
    loginsMes: 0,
    admins: 0,
  })

  // Mock data for recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'user' as const,
      title: 'Novo usuário registrado',
      description: 'João Silva criou uma conta',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      user: {
        name: 'João Silva',
        avatar: undefined,
      },
      severity: 'low' as const,
    },
    {
      id: '2',
      type: 'security' as const,
      title: 'Login com falha detectado',
      description: 'Múltiplas tentativas de login falharam para admin@example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: AlertTriangle,
      severity: 'high' as const,
    },
    {
      id: '3',
      type: 'calculation' as const,
      title: 'Cálculo atuarial processado',
      description: 'Relatório de mortalidade gerado com sucesso',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      icon: Calculator,
      severity: 'low' as const,
    },
    {
      id: '4',
      type: 'system' as const,
      title: 'Backup automático executado',
      description: 'Backup diário do banco de dados concluído',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: Database,
      severity: 'low' as const,
    },
  ]

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/usuario/lista')
        if (!res.ok) throw new Error('Erro ao buscar usuários')
        const data = await res.json()
        const usuariosList = data.usuarios || []
        setUsuarios(usuariosList)

        // Calcular estatísticas
        const totalUsuarios = usuariosList.length
        const usuariosAtivos = usuariosList.filter((u: Usuario) => u.isActive).length
        const usuariosInativos = totalUsuarios - usuariosAtivos
        const admins = usuariosList.filter((u: Usuario) => u.accessLevel >= 100).length

        // Mock de dados para demonstração
        const novosMes = Math.floor(totalUsuarios * 0.1)
        const loginsMes = Math.floor(totalUsuarios * 0.8)

        setStats({
          totalUsuarios,
          usuariosAtivos,
          usuariosInativos,
          novosMes,
          loginsMes,
          admins,
        })
      } catch {
        setMensagem('Erro ao buscar usuários.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsuarios()
  }, [])

  return (
    <div className='space-y-6'>
      {/* Header do Dashboard */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard Admin</h1>
          <p className='text-muted-foreground'>
            Gerencie usuários, permissões e monitore atividades do sistema
          </p>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {mensagem && (
        <div className='rounded-md bg-blue-50 p-4 dark:bg-blue-950'>
          <div className='text-sm text-blue-800 dark:text-blue-200'>{mensagem}</div>
        </div>
      )}

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total de Usuários'
          value={stats.totalUsuarios}
          description='Todos os usuários registrados'
          icon={Users}
          change={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title='Usuários Ativos'
          value={stats.usuariosAtivos}
          description='Usuários ativos no sistema'
          icon={UserCheck}
          change={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title='Administradores'
          value={stats.admins}
          description='Usuários com privilégios administrativos'
          icon={Shield}
          change={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title='Logins Hoje'
          value={24}
          description='Logins realizados hoje'
          icon={Activity}
          change={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>Visão Geral</TabsTrigger>
          <TabsTrigger value='users'>Usuários</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          <TabsTrigger value='system'>Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            {/* Chart Card */}
            <Card className='col-span-4'>
              <CardHeader>
                <CardTitle>Atividade de Usuários</CardTitle>
                <CardDescription>
                  Número de usuários ativos por mês nos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='h-[300px] flex items-center justify-center text-muted-foreground'>
                  Gráfico de atividade será implementado aqui
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <RecentActivity activities={recentActivities} className='col-span-3' />
          </div>

          {/* System Health */}
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Uptime do Sistema</CardTitle>
                <Clock className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>99.9%</div>
                <p className='text-xs text-muted-foreground'>Últimos 30 dias</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Cálculos Processados</CardTitle>
                <Calculator className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>1,234</div>
                <p className='text-xs text-muted-foreground'>Este mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Backup Status</CardTitle>
                <CheckCircle2 className='h-4 w-4 text-green-500' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>OK</div>
                <p className='text-xs text-muted-foreground'>Último backup: 2h atrás</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Logs de Erro</CardTitle>
                <AlertTriangle className='h-4 w-4 text-yellow-500' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>3</div>
                <p className='text-xs text-muted-foreground'>Últimas 24h</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='users' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Usuários</CardTitle>
              <CardDescription>
                Gerencie usuários, permissões e configurações de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='flex items-center justify-center h-[300px]'>
                  <div className='text-muted-foreground'>Carregando usuários...</div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={usuarios}
                  searchKey='name'
                  searchPlaceholder='Buscar usuários...'
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='analytics' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Analytics Avançado</CardTitle>
              <CardDescription>
                Relatórios detalhados e métricas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[400px] flex items-center justify-center text-muted-foreground'>
                Módulo de analytics será implementado aqui
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='system' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configurações avançadas e manutenção do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Manutenção</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Modo manutenção</span>
                        <span className='text-sm text-green-600'>Desabilitado</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Último backup</span>
                        <span className='text-sm text-muted-foreground'>2h atrás</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Performance</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>CPU</span>
                        <span className='text-sm'>45%</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm'>Memória</span>
                        <span className='text-sm'>68%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardAdmin
