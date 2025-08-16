'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Send, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Settings,
  BarChart3,
  MessageSquare,
  Broadcast
} from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface PushStats {
  subscriptions: {
    total: number;
    active: number;
    inactive: number;
    activeRate: number;
  };
  notifications: {
    totalLast30Days: number;
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    deliveryRate: number;
    priorityBreakdown: Array<{
      priority: string;
      count: number;
    }>;
  };
  recentNotifications: Array<{
    id: string;
    title: string;
    body: string;
    priority: string;
    createdAt: string;
    deliveryCount: number;
    successCount: number;
    failedCount: number;
  }>;
  topUsers: Array<{
    id: string;
    name: string;
    email: string;
    subscriptionsCount: number;
  }>;
  generatedAt: string;
}

export default function PushNotificationsAdmin() {
  const pushHook = usePushNotifications();
  const [stats, setStats] = useState<PushStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para formulários
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    body: '',
    icon: '/icons/icon-192x192.png',
    priority: 'normal',
    targetUserId: '',
    requireInteraction: false,
    tag: '',
  });

  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    body: '',
    icon: '/icons/icon-192x192.png',
    priority: 'normal',
    userIds: '',
    requireInteraction: false,
    tag: '',
  });

  // Carrega estatísticas
  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await fetch('/api/push/stats');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Envia notificação individual
  const sendNotification = async () => {
    if (!notificationForm.title || !notificationForm.body || !notificationForm.targetUserId) {
      setError('Título, corpo e usuário alvo são obrigatórios');
      return;
    }

    try {
      setIsSending(true);
      setError(null);

      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: notificationForm.targetUserId,
          notification: {
            title: notificationForm.title,
            body: notificationForm.body,
            icon: notificationForm.icon,
            requireInteraction: notificationForm.requireInteraction,
            tag: notificationForm.tag || undefined,
            data: {
              url: '/dashboard',
              type: 'admin_notification',
              timestamp: Date.now(),
            },
          },
          priority: notificationForm.priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess(`Notificação enviada! ${result.deliveredCount} entregue(s), ${result.failedCount} falha(s)`);
        // Limpa formulário
        setNotificationForm({
          title: '',
          body: '',
          icon: '/icons/icon-192x192.png',
          priority: 'normal',
          targetUserId: '',
          requireInteraction: false,
          tag: '',
        });
        // Recarrega estatísticas
        loadStats();
      } else {
        setError(`Falha no envio: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsSending(false);
    }
  };

  // Envia broadcast
  const sendBroadcast = async () => {
    if (!broadcastForm.title || !broadcastForm.body || !broadcastForm.userIds) {
      setError('Título, corpo e lista de usuários são obrigatórios');
      return;
    }

    // Parse da lista de usuários (separados por vírgula ou quebra de linha)
    const userIds = broadcastForm.userIds
      .split(/[,\n]/)
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (userIds.length === 0) {
      setError('Lista de usuários inválida');
      return;
    }

    if (userIds.length > 1000) {
      setError('Máximo de 1000 usuários por broadcast');
      return;
    }

    try {
      setIsSending(true);
      setError(null);

      const response = await fetch('/api/push/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds,
          notification: {
            title: broadcastForm.title,
            body: broadcastForm.body,
            icon: broadcastForm.icon,
            requireInteraction: broadcastForm.requireInteraction,
            tag: broadcastForm.tag || undefined,
            data: {
              url: '/dashboard',
              type: 'broadcast',
              timestamp: Date.now(),
            },
          },
          priority: broadcastForm.priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess(
          `Broadcast enviado! ${result.sentCount}/${result.totalSubscriptions} entregue(s) ` +
          `para ${result.usersWithSubscriptions}/${result.totalTargets} usuário(s)`
        );
        // Limpa formulário
        setBroadcastForm({
          title: '',
          body: '',
          icon: '/icons/icon-192x192.png',
          priority: 'normal',
          userIds: '',
          requireInteraction: false,
          tag: '',
        });
        // Recarrega estatísticas
        loadStats();
      } else {
        setError(`Falha no broadcast: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar broadcast:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsSending(false);
    }
  };

  // Carrega dados iniciais
  useEffect(() => {
    loadStats();
  }, []);

  // Limpa mensagens após tempo
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Push Notifications</h1>
          <p className="text-muted-foreground">
            Gerencie assinaturas e envie notificações push
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadStats}
            disabled={isLoadingStats}
            variant="outline"
            size="sm"
          >
            {isLoadingStats ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {/* Mensagens de status */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="send">
            <Send className="h-4 w-4 mr-2" />
            Enviar
          </TabsTrigger>
          <TabsTrigger value="broadcast">
            <Broadcast className="h-4 w-4 mr-2" />
            Broadcast
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          {isLoadingStats ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : stats ? (
            <>
              {/* Cards de estatísticas gerais */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Assinaturas Totais
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.subscriptions.total}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.subscriptions.active} ativas ({Math.round(stats.subscriptions.activeRate)}%)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Notificações (30d)
                    </CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.notifications.totalLast30Days}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.notifications.totalDeliveries} entregas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Taxa de Entrega
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(stats.notifications.deliveryRate)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.notifications.successfulDeliveries} de {stats.notifications.totalDeliveries}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Falhas
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.notifications.failedDeliveries}</div>
                    <p className="text-xs text-muted-foreground">
                      Entregas falhadas
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Notificações recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações Recentes</CardTitle>
                    <CardDescription>
                      Últimas 10 notificações enviadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentNotifications.length > 0 ? (
                        stats.recentNotifications.map((notification) => (
                          <div key={notification.id} className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <Badge variant={notification.priority === 'high' ? 'destructive' : 
                                             notification.priority === 'normal' ? 'default' : 'secondary'}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notification.body}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{new Date(notification.createdAt).toLocaleString('pt-BR')}</span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {notification.successCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                {notification.failedCount}
                              </span>
                            </div>
                            <Separator className="mt-2" />
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Nenhuma notificação enviada recentemente
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top usuários */}
                <Card>
                  <CardHeader>
                    <CardTitle>Usuários com Mais Assinaturas</CardTitle>
                    <CardDescription>
                      Top 10 usuários por número de dispositivos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.topUsers.length > 0 ? (
                        stats.topUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                            <Badge variant="outline">
                              {user.subscriptionsCount} dispositivo(s)
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Nenhum usuário com assinaturas ativas
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </TabsContent>

        <TabsContent value="send" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Notificação Individual</CardTitle>
              <CardDescription>
                Envia uma push notification para um usuário específico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="targetUserId">ID do Usuário Alvo *</Label>
                  <Input
                    id="targetUserId"
                    placeholder="ID ou email do usuário"
                    value={notificationForm.targetUserId}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, targetUserId: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Título da notificação"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="body">Corpo *</Label>
                  <Textarea
                    id="body"
                    placeholder="Corpo da notificação"
                    value={notificationForm.body}
                    onChange={(e) => setNotificationForm(prev => ({ ...prev, body: e.target.value }))}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={notificationForm.priority}
                      onValueChange={(value) => setNotificationForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tag">Tag (opcional)</Label>
                    <Input
                      id="tag"
                      placeholder="Tag da notificação"
                      value={notificationForm.tag}
                      onChange={(e) => setNotificationForm(prev => ({ ...prev, tag: e.target.value }))}
                    />
                  </div>
                </div>

                <Button
                  onClick={sendNotification}
                  disabled={isSending || !notificationForm.title || !notificationForm.body || !notificationForm.targetUserId}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Notificação
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast de Notificações</CardTitle>
              <CardDescription>
                Envia uma push notification para múltiplos usuários (máximo 1000)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="userIds">IDs dos Usuários *</Label>
                  <Textarea
                    id="userIds"
                    placeholder="IDs ou emails dos usuários (separados por vírgula ou quebra de linha)"
                    value={broadcastForm.userIds}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, userIds: e.target.value }))}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Máximo de 1000 usuários por broadcast
                  </p>
                </div>

                <div>
                  <Label htmlFor="broadcastTitle">Título *</Label>
                  <Input
                    id="broadcastTitle"
                    placeholder="Título da notificação"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="broadcastBody">Corpo *</Label>
                  <Textarea
                    id="broadcastBody"
                    placeholder="Corpo da notificação"
                    value={broadcastForm.body}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, body: e.target.value }))}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="broadcastPriority">Prioridade</Label>
                    <Select
                      value={broadcastForm.priority}
                      onValueChange={(value) => setBroadcastForm(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="broadcastTag">Tag (opcional)</Label>
                    <Input
                      id="broadcastTag"
                      placeholder="Tag da notificação"
                      value={broadcastForm.tag}
                      onChange={(e) => setBroadcastForm(prev => ({ ...prev, tag: e.target.value }))}
                    />
                  </div>
                </div>

                <Button
                  onClick={sendBroadcast}
                  disabled={isSending || !broadcastForm.title || !broadcastForm.body || !broadcastForm.userIds}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando Broadcast...
                    </>
                  ) : (
                    <>
                      <Broadcast className="h-4 w-4 mr-2" />
                      Enviar Broadcast
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Pessoais</CardTitle>
              <CardDescription>
                Configure suas próprias notificações push
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Status das Push Notifications</h4>
                  <p className="text-xs text-muted-foreground">
                    {pushHook.isSupported
                      ? pushHook.isSubscribed
                        ? 'Você está inscrito para receber notificações'
                        : 'Você pode se inscrever para receber notificações'
                      : 'Seu navegador não suporta push notifications'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    pushHook.isSubscribed ? 'default' : 
                    pushHook.permission === 'granted' ? 'secondary' : 
                    'outline'
                  }>
                    {pushHook.isSubscribed ? 'Inscrito' : 
                     pushHook.permission === 'granted' ? 'Permitido' :
                     pushHook.permission === 'denied' ? 'Negado' : 'Padrão'}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                {!pushHook.isSubscribed && pushHook.isSupported && (
                  <Button
                    onClick={pushHook.subscribe}
                    disabled={pushHook.isLoading}
                    variant="outline"
                  >
                    {pushHook.isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Bell className="h-4 w-4 mr-2" />
                    )}
                    Inscrever-se
                  </Button>
                )}

                {pushHook.isSubscribed && (
                  <Button
                    onClick={pushHook.unsubscribe}
                    disabled={pushHook.isLoading}
                    variant="outline"
                  >
                    {pushHook.isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Cancelar Inscrição
                  </Button>
                )}

                <Button
                  onClick={pushHook.sendTestNotification}
                  disabled={pushHook.isLoading || !pushHook.isSubscribed}
                  variant="outline"
                >
                  {pushHook.isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Testar Notificação
                </Button>
              </div>

              {pushHook.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{pushHook.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
