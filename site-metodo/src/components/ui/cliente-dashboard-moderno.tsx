'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Activity, 
  ArrowRight, 
  Bell,
  FileText,
  Download,
  MessageSquare,
  Settings,
  ChevronRight,
  Eye,
  DollarSign,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Dashboard moderno do cliente seguindo padrões do projeto de referência
 * Interface unificada com o admin dashboard mas focada nas necessidades do cliente
 */
export function ClienteDashboardModerno() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  const user = session.user;

  const getUserTypeDisplay = () => {
    if (user.email?.includes('@admin')) return 'Administrador';
    if (user.email?.includes('@mod')) return 'Moderador';
    return 'Cliente';
  };

  const getUserInitials = () => {
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  // Dados mock para demonstração
  const recentActivities = [
    {
      id: 1,
      title: 'Documento visualizado',
      description: 'Relatório Atuarial 2024',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'view',
      icon: Eye
    },
    {
      id: 2,
      title: 'Download realizado',
      description: 'Cálculo de Reservas.pdf',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'download',
      icon: Download
    },
    {
      id: 3,
      title: 'Mensagem enviada',
      description: 'Dúvida sobre cálculos',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      type: 'message',
      icon: MessageSquare
    }
  ];

  const quickActions = [
    {
      title: 'Meus Documentos',
      description: 'Acesse relatórios e cálculos',
      icon: FileText,
      href: '/area-cliente/documentos',
      color: 'bg-blue-500'
    },
    {
      title: 'Nova Solicitação',
      description: 'Solicitar novo cálculo',
      icon: Plus,
      href: '/area-cliente/nova-solicitacao',
      color: 'bg-green-500'
    },
    {
      title: 'Mensagens',
      description: 'Fale com nosso suporte',
      icon: MessageSquare,
      href: '/area-cliente/mensagens',
      color: 'bg-purple-500'
    },
    {
      title: 'Configurações',
      description: 'Gerencie sua conta',
      icon: Settings,
      href: '/area-cliente/configuracoes',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 space-y-6">
        {/* Header com boas-vindas */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Olá, {user.name?.split(' ')[0] || 'Cliente'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta. Aqui está um resumo das suas atividades.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              {getUserTypeDisplay()}
            </Badge>
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +3 este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +12% desde ontem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                2 não lidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Economia</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 4.2k</div>
              <p className="text-xs text-muted-foreground">
                +8% este trimestre
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Atividades Recentes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
                <CardDescription>
                  Suas últimas interações na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(activity.timestamp, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    );
                  })}
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  Ver todas as atividades
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com informações do usuário e progresso */}
          <div className="space-y-4">
            {/* Informações do Perfil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Seu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-medium">{user.name || 'Nome não informado'}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Badge variant="outline" className="text-xs">
                      {getUserTypeDisplay()}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Perfil Completo</span>
                      <span className="text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status e Notificações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Novo documento</p>
                      <p className="text-xs text-muted-foreground">Relatório disponível</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <p className="text-sm font-medium">Cálculo finalizado</p>
                      <p className="text-xs text-muted-foreground">Pronto para download</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Ver todas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all"
                    asChild
                  >
                    <a href={action.href}>
                      <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </a>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
