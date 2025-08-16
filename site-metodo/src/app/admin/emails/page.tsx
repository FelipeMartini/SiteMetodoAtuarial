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
  Mail, 
  MailOpen, 
  MailX,
  Send,
  Settings,
  CheckCircle,
  Clock,
  RefreshCw,
  Eye,
  Edit
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  messageId?: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  priority: string;
  sentAt?: Date;
  createdAt: Date;
}

interface EmailTemplate {
  id: string;
  name: string;
  type: 'welcome' | 'security-alert' | 'notification';
  subject: string;
  isActive: boolean;
  lastUsed?: Date;
}

export default function EmailManagementPage() {
  const [logs, setLogs] = React.useState<EmailLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [_stats, _setStats] = React.useState({
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0,
  });

  // Formulário para enviar email
  const [emailForm, setEmailForm] = React.useState({
    to: '',
    subject: '',
    message: '',
    priority: 'normal',
    template: '',
  });

  // Configurações SMTP
  const [smtpSettings, setSmtpSettings] = React.useState({
    host: '',
    port: '587',
    user: '',
    secure: false,
    testConnection: false,
  });

  const [filters, setFilters] = React.useState({
    status: '',
    priority: '',
    search: '',
  });

  const loadLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/emails?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs.map((log: { createdAt: string | Date; sentAt?: string | Date; [key: string]: unknown }) => ({
          ...log,
          createdAt: new Date(log.createdAt),
          sentAt: log.sentAt ? new Date(log.sentAt) : undefined,
        })));
        _setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar logs de email:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const sendEmail = async () => {
    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      });
      
      if (response.ok) {
        setEmailForm({
          to: '',
          subject: '',
          message: '',
          priority: 'normal',
          template: '',
        });
        await loadLogs();
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  };

  const testSmtpConnection = async () => {
    try {
      setSmtpSettings(prev => ({ ...prev, testConnection: true }));
      const response = await fetch('/api/emails/test-connection', {
        method: 'POST',
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Conexão SMTP funcionando corretamente!');
      } else {
        alert(`Erro na conexão: ${result.error}`);
      }
    } catch (_error) {
      alert('Erro ao testar conexão SMTP');
    } finally {
      setSmtpSettings(prev => ({ ...prev, testConnection: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return CheckCircle;
      case 'failed': return MailX;
      case 'pending': return Clock;
      default: return Mail;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'normal': return 'default';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const columns: ColumnDef<EmailLog>[] = [
    {
      accessorKey: 'to',
      header: 'Destinatário',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('to')}</div>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Assunto',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.getValue('subject')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const StatusIcon = getStatusIcon(status);
        return (
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4" />
            <Badge className={getStatusColor(status)}>
              {status.toUpperCase()}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: 'Prioridade',
      cell: ({ row }) => (
        <Badge variant={getPriorityColor(row.getValue('priority'))}>
          {(row.getValue('priority') as string).toUpperCase()}
        </Badge>
      ),
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
      ),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          {row.original.status === 'failed' && (
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Mock data para demonstração
  const _mockEmailLogs: EmailLog[] = [
    {
      id: '1',
      to: 'usuario@exemplo.com',
      subject: 'Bem-vindo ao Método Atuarial',
      messageId: 'msg-123',
      status: 'sent',
      priority: 'normal',
      sentAt: new Date(Date.now() - 1000 * 60 * 30),
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      to: 'admin@metodoatuarial.com',
      subject: 'Alerta de Segurança',
      status: 'failed',
      error: 'Conexão rejeitada',
      priority: 'high',
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: '3',
      to: 'cliente@empresa.com',
      subject: 'Nova Notificação',
      status: 'pending',
      priority: 'normal',
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
    },
  ];

  const mockTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Boas-vindas',
      type: 'welcome',
      subject: 'Bem-vindo ao Método Atuarial',
      isActive: true,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: '2',
      name: 'Alerta de Segurança',
      type: 'security-alert',
      subject: 'Alerta de Segurança - Método Atuarial',
      isActive: true,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: '3',
      name: 'Notificação Geral',
      type: 'notification',
      subject: 'Notificação - Método Atuarial',
      isActive: true,
    },
  ];

  const statsCards = [
    {
      title: "Total Enviados",
      value: logs.length.toString(),
      description: "Emails processados",
      icon: Mail,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Entregues",
      value: logs.filter(e => e.status === 'sent').length.toString(),
      description: "Sucessos",
      icon: MailOpen,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Falharam",
      value: logs.filter(e => e.status === 'failed').length.toString(),
      description: "Precisam reenvio",
      icon: MailX,
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Pendentes",
      value: logs.filter(e => e.status === 'pending').length.toString(),
      description: "Aguardando envio",
      icon: Clock,
      trend: { value: 1, isPositive: true }
    }
  ];

  return (
  <div className="flex min-h-screen bg-background">
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
              <BreadcrumbPage>Emails</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Emails</h1>
              <p className="text-muted-foreground">
                Gerencie envios, templates e configurações de email
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadLogs} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button onClick={testSmtpConnection} disabled={smtpSettings.testConnection}>
                <Settings className="h-4 w-4 mr-2" />
                Testar SMTP
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
        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logs">Logs de Email</TabsTrigger>
            <TabsTrigger value="send">Enviar Email</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {/* Filtros */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Buscar</Label>
                    <Input
                      id="search"
                      placeholder="Email ou assunto..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos</SelectItem>
                        <SelectItem value="sent">Enviado</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
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
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Logs */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Logs de Email
                    </CardTitle>
                    <CardDescription>
                      Histórico de todos os emails enviados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={logs}
                      columns={columns}
                      searchKey="to"
                      searchPlaceholder="Buscar por destinatário..."
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="send" className="space-y-4">
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Enviar Email
                </CardTitle>
                <CardDescription>
                  Envie emails individuais ou usando templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="to">Destinatário</Label>
                    <Input
                      id="to"
                      type="email"
                      value={emailForm.to}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={emailForm.priority} onValueChange={(value) => setEmailForm(prev => ({ ...prev, priority: value }))}>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template (Opcional)</Label>
                  <Select value={emailForm.template} onValueChange={(value) => setEmailForm(prev => ({ ...prev, template: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum template</SelectItem>
                      {mockTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Assunto do email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={emailForm.message}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Conteúdo do email"
                    rows={6}
                  />
                </div>

                <Button 
                  onClick={sendEmail}
                  disabled={!emailForm.to || !emailForm.subject}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map(template => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                        {template.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <CardDescription>{template.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <strong>Tipo:</strong> {template.type}
                      </div>
                      {template.lastUsed && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Último uso:</strong> {format(template.lastUsed, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Configurações SMTP */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações SMTP
                  </CardTitle>
                  <CardDescription>
                    Configure o servidor de email para envios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">Servidor SMTP</Label>
                    <Input
                      id="smtp-host"
                      value={smtpSettings.host}
                      onChange={(e) => setSmtpSettings(prev => ({ ...prev, host: e.target.value }))}
                      placeholder="mail.seudominio.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Porta</Label>
                      <Input
                        id="smtp-port"
                        value={smtpSettings.port}
                        onChange={(e) => setSmtpSettings(prev => ({ ...prev, port: e.target.value }))}
                        placeholder="587"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-user">Usuário</Label>
                      <Input
                        id="smtp-user"
                        value={smtpSettings.user}
                        onChange={(e) => setSmtpSettings(prev => ({ ...prev, user: e.target.value }))}
                        placeholder="sistema@seudominio.com"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smtp-secure"
                      checked={smtpSettings.secure}
                      onCheckedChange={(checked) => setSmtpSettings(prev => ({ ...prev, secure: checked }))}
                    />
                    <Label htmlFor="smtp-secure">Conexão Segura (SSL/TLS)</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={testSmtpConnection} disabled={smtpSettings.testConnection}>
                      {smtpSettings.testConnection ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Testar Conexão
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Configurações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configurações de envio e comportamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Logs Detalhados</Label>
                      <p className="text-sm text-muted-foreground">
                        Registrar detalhes de todos os envios
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Retry Automático</Label>
                      <p className="text-sm text-muted-foreground">
                        Tentar reenviar emails falhados automaticamente
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Limite de Envio</Label>
                      <p className="text-sm text-muted-foreground">
                        Limitar número de emails por hora
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
