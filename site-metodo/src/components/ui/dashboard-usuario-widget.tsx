'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AvatarCustom } from '@/components/ui/avatar-custom'
import { 
  User, 
  Activity, 
  Shield, 
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  Bell
} from 'lucide-react'

/**
 * Widget moderno de dashboard do usuário
 * Exibe resumo das atividades e informações importantes
 */
export function DashboardUsuarioWidget() {
  const { data: session } = useSession()

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Faça login para ver seu dashboard
          </p>
        </CardContent>
      </Card>
    )
  }

  const user = session.user
  const role = session.user?.role || 'USER'
  const accessLevel = session.user?.accessLevel || 0

  const getRoleDisplayName = () => {
    const roleStr = Array.isArray(role) ? role[0] : (role || 'USER')
    return roleStr.toUpperCase()
  }

  const getRoleBadgeColor = () => {
    const roleStr = Array.isArray(role) ? role[0] : (role || 'USER')
    switch(roleStr.toUpperCase()) {
      case 'ADMIN': return 'destructive'
      case 'MODERATOR': return 'default' 
      case 'PREMIUM': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header de Boas-vindas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AvatarCustom
                src={user.image}
                name={user.name || undefined}
                email={user.email || undefined}
                size="lg"
                showStatus={true}
                status="online"
              />
              <div>
                <CardTitle className="text-xl">
                  Olá, {user.name?.split(' ')[0] || 'Usuário'}! 👋
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  Bem-vindo de volta à sua área
                  <Badge variant={getRoleBadgeColor()} className="ml-2">
                    {getRoleDisplayName()}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Ver Perfil
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Grid de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Último Acesso
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Hoje</div>
            <p className="text-xs text-muted-foreground">
              às 14:30
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atividades
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 desde ontem
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nível de Acesso
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessLevel}</div>
            <p className="text-xs text-muted-foreground">
              Permissões ativas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notificações
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 não lidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Login realizado</p>
                <p className="text-xs text-muted-foreground">Há 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Perfil visualizado</p>
                <p className="text-xs text-muted-foreground">Há 1 hora</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Configurações alteradas</p>
                <p className="text-xs text-muted-foreground">Há 2 dias</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver todas as atividades
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progresso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Perfil Completo</span>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Configurações</span>
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Segurança</span>
                <span className="text-sm text-muted-foreground">90%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <User className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Histórico
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
