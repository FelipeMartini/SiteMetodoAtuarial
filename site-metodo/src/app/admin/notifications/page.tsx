'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/admin/data-table';
import { StatsCard } from '@/components/admin/stats-card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  Bell, 
  BellRing, 
  Check, 
  Eye,
  Plus,
  Settings,
  Mail,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function NotificationsPage() {
  const [loading, setLoading] = React.useState(true);
  
  // Formulário para nova notificação
  const [newNotification, setNewNotification] = React.useState<{
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    priority: 'low' | 'normal' | 'high' | 'urgent';
  }>({
    title: '',
    message: '',
    type: 'info',
    priority: 'normal'
  });

  // Filtros
  const [filters, setFilters] = React.useState({
    type: '',
    priority: '',
    unreadOnly: false,
    search: ''
  });

  // Configurações de notificação
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    pushNotifications: true,
    securityAlerts: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const loadNotifications = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.unreadOnly) params.append('unreadOnly', 'true');
      if (filters.type) params.append('types', filters.type);
      if (filters.priority) params.append('priorities', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/notifications?${params}`);
      if (response.ok) {
        const data = await response.json();
        // Dados processados mas não utilizados no momento
        console.log('Notificações carregadas:', data.notifications.length);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id: string) => {
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

  const createNotification = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotification)
      });
      
      if (response.ok) {
        setNewNotification({
          title: '',
          message: '',
          type: 'info',
          priority: 'normal'
        });
        await loadNotifications();
      }
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
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
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: 'title',
      header: 'Notificação',
      cell: ({ row }) => {
        const IconComponent = getTypeIcon(row.original.type);
        return (
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getTypeColor(row.original.type)}`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className={`font-medium ${!row.original.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                {row.getValue('title')}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {row.original.message}
              </p>
            </div>
            {!row.original.read && (
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'priority',
      header: 'Prioridade',
      cell: ({ row }) => (
        <Badge variant={getPriorityColor(row.getValue('priority'))}>
          {(row.getValue('priority') as string).toUpperCase()}
        </Badge>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Data',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">
            {format(row.getValue('createdAt'), "dd/MM/yyyy", { locale: ptBR })}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(row.getValue('createdAt'), "HH:mm", { locale: ptBR })}
          </span>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {!row.original.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsRead(row.original.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  // Mock data para demonstração
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Sistema atualizado',
      message: 'O sistema foi atualizado com novas funcionalidades de segurança.',
      type: 'success',
      priority: 'normal',
      read: false,
      readAt: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '2',
      title: 'Tentativa de login suspeita',
      message: 'Detectamos uma tentativa de login de um local não reconhecido.',
      type: 'warning',
      priority: 'high',
      read: false,
      readAt: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '3',
      title: 'Backup concluído',
      message: 'O backup automático foi concluído com sucesso.',
      type: 'info',
      priority: 'low',
      read: true,
      readAt: new Date(Date.now() - 1000 * 60 * 60),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
    }
  ];

  const statsCards = [
    {
      title: "Total",
      value: mockNotifications.length.toString(),
      description: "Notificações no sistema",
      icon: Bell,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Não Lidas",
      value: mockNotifications.filter(n => !n.read).length.toString(),
      description: "Requerem atenção",
      icon: BellRing,
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Alta Prioridade",
      value: mockNotifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length.toString(),
      description: "Notificações urgentes",
      icon: AlertTriangle,
      trend: { value: 1, isPositive: false }
    },
    {
      title: "Hoje",
      value: mockNotifications.filter(n => 
        format(n.createdAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      ).length.toString(),
      description: "Notificações de hoje",
      icon: Clock,
      trend: { value: 8, isPositive: true }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/area-cliente">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/area-cliente/dashboard-admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Notificações</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Centro de Notificações</h1>
              <p className="text-muted-foreground">
                Gerencie notificações e alertas do sistema
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadNotifications} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Marcar Todas como Lidas
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Tabs principais */}
        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="create">Criar Notificação</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {/* Filtros */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Buscar</Label>
                    <Input
                      id="search"
                      placeholder="Buscar notificações..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="info">Informação</SelectItem>
                        <SelectItem value="success">Sucesso</SelectItem>
                        <SelectItem value="warning">Aviso</SelectItem>
                        <SelectItem value="error">Erro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as prioridades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="unread-only"
                      checked={filters.unreadOnly}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, unreadOnly: checked }))}
                    />
                    <Label htmlFor="unread-only">Apenas não lidas</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Notificações */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notificações
                    </CardTitle>
                    <CardDescription>
                      Todas as suas notificações em um só lugar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={mockNotifications}
                      columns={columns}
                      searchKey="title"
                      searchPlaceholder="Buscar notificações..."
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nova Notificação
                </CardTitle>
                <CardDescription>
                  Crie uma nova notificação para os usuários
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título da notificação"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Conteúdo da notificação"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={newNotification.type} onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value as typeof newNotification.type }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Informação</SelectItem>
                        <SelectItem value="success">Sucesso</SelectItem>
                        <SelectItem value="warning">Aviso</SelectItem>
                        <SelectItem value="error">Erro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={newNotification.priority} onValueChange={(value) => setNewNotification(prev => ({ ...prev, priority: value as typeof newNotification.priority }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={createNotification}
                  disabled={!newNotification.title || !newNotification.message}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Notificação
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Preferências de Notificação
                </CardTitle>
                <CardDescription>
                  Configure como você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <Label htmlFor="email-notifications">Notificações por Email</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações importantes por email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BellRing className="h-4 w-4" />
                        <Label htmlFor="push-notifications">Notificações Push</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações em tempo real no navegador
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <Label htmlFor="security-alerts">Alertas de Segurança</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre atividades de segurança
                      </p>
                    </div>
                    <Switch
                      id="security-alerts"
                      checked={settings.securityAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, securityAlerts: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <Label htmlFor="system-updates">Atualizações do Sistema</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre atualizações e manutenções
                      </p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={settings.systemUpdates}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, systemUpdates: checked }))}
                    />
                  </div>
                </div>

                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
