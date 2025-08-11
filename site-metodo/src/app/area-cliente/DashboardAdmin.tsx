
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  UserCheck, 
  UserX, 
  Settings,
  Shield,
  Database,
  Clock,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import UsuariosTable from "./dashboard-admin/UsuariosTable";
import UsuariosTableFilters from "./dashboard-admin/UsuariosTableFilters";

interface Usuario {
  id: string;
  name: string;
  email: string;
  image?: string;
  accessLevel: number;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsuarios: number;
  usuariosAtivos: number;
  usuariosInativos: number;
  novosMes: number;
  loginsMes: number;
  admins: number;
}

const DashboardAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(10);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    usuariosInativos: 0,
    novosMes: 0,
    loginsMes: 0,
    admins: 0
  });

  // Mock de feature flags (Unleash)
  const [flags, setFlags] = useState({
    darkMode: true,
    betaTable: false,
    mfaObrigatorio: false,
    logsAvancados: true,
    calculosAtuariais: true,
    abacPermissions: false,
  });

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/usuario/lista");
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        const usuariosList = data.usuarios || [];
        setUsuarios(usuariosList);
        
        // Calcular estatísticas
        const totalUsuarios = usuariosList.length;
        const usuariosAtivos = usuariosList.filter((u: Usuario) => u.isActive).length;
        const usuariosInativos = totalUsuarios - usuariosAtivos;
        const admins = usuariosList.filter((u: Usuario) => u.accessLevel >= 100).length;
        
        // Mock de dados para demonstração
        const novosMes = Math.floor(totalUsuarios * 0.1);
        const loginsMes = Math.floor(totalUsuarios * 0.8);
        
        setStats({
          totalUsuarios,
          usuariosAtivos,
          usuariosInativos,
          novosMes,
          loginsMes,
          admins
        });
      } catch {
        setMensagem("Erro ao buscar usuários.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const handleResetSenha = async (id: string) => {
    setMensagem(null);
    const res = await fetch(`/api/usuario/reset-senha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setMensagem("Senha resetada!");
    else setMensagem("Erro ao resetar senha.");
  };

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    setMensagem(null);
    const res = await fetch(`/api/usuario/editar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, campo: "isActive", valor: ativo }),
    });
    if (res.ok) setMensagem("Status atualizado!");
    else setMensagem("Erro ao atualizar status.");
    // Atualiza lista
    const data = await res.json();
    setUsuarios(data.usuarios || usuarios.map(u => u.id === id ? { ...u, isActive: ativo } : u));
  };

  const handleChangeNivel = async (id: string, nivel: number) => {
    setMensagem(null);
    const res = await fetch(`/api/usuario/editar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, campo: "accessLevel", valor: nivel }),
    });
    if (res.ok) setMensagem("Nível atualizado!");
    else setMensagem("Erro ao atualizar nível.");
    // Atualiza lista
    const data = await res.json();
    setUsuarios(data.usuarios || usuarios.map(u => u.id === id ? { ...u, accessLevel: nivel } : u));
  };

  // Filtro e paginação client-side
  const usuariosFiltrados = usuarios.filter(u =>
    u.name?.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email?.toLowerCase().includes(filtro.toLowerCase())
  );
  const totalPaginas = Math.ceil(usuariosFiltrados.length / porPagina) || 1;
  const usuariosPagina = usuariosFiltrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  // Funções de seleção
  const handleSelecionar = (id: string, checked: boolean) => {
    setSelecionados(prev => checked ? [...prev, id] : prev.filter(sid => sid !== id));
  };
  const handleSelecionarTodos = (checked: boolean) => {
    if (checked) {
      setSelecionados(usuariosPagina.map(u => u.id));
    } else {
      setSelecionados([]);
    }
  };

  // Mock das ações em lote
  const handleBatchDelete = () => {
    setMensagem(`Usuários deletados: ${selecionados.join(", ")}`);
    setSelecionados([]);
  };
  const handleBatchChangeRole = () => {
    setMensagem(`Papel alterado para usuários: ${selecionados.join(", ")}`);
    setSelecionados([]);
  };
  const handleBatchResetMFA = () => {
    setMensagem(`MFA resetado para usuários: ${selecionados.join(", ")}`);
    setSelecionados([]);
  };

  return (
    <div className="space-y-6">
      {/* Header do Dashboard */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, permissões e monitore atividades do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Backup
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.novosMes} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.usuariosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.usuariosAtivos / stats.totalUsuarios) * 100 || 0).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.usuariosInativos}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.usuariosInativos / stats.totalUsuarios) * 100 || 0).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">
              Nível de acesso 100+
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logins Este Mês</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.loginsMes}</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Uptime último mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Feature Flags - Controle de Funcionalidades
          </CardTitle>
          <CardDescription>
            Ative ou desative funcionalidades do sistema em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(flags).map(([flag, value]) => (
              <div key={flag} className="flex items-center justify-between space-x-2 p-3 rounded-lg border bg-muted/50">
                <div className="flex items-center gap-3">
                  <Switch
                    id={`flag-${flag}`}
                    checked={value}
                    onCheckedChange={checked => setFlags(f => ({ ...f, [flag]: checked }))}
                    aria-label={`Ativar/desativar ${flag}`}
                  />
                  <div>
                    <label htmlFor={`flag-${flag}`} className="text-sm font-medium cursor-pointer capitalize">
                      {flag.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {value ? 'Funcionalidade ativa' : 'Funcionalidade desativa'}
                    </p>
                  </div>
                </div>
                <Badge variant={value ? "default" : "outline"} className="flex items-center gap-1">
                  {value ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  {value ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mensagem de Feedback */}
      {mensagem && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-800">
              <Activity className="h-4 w-4" />
              <span className="font-medium">{mensagem}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs de Gestão */}
      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usuarios">Gestão de Usuários</TabsTrigger>
          <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Usuários</CardTitle>
              <CardDescription>
                Gerencie usuários, permissões e níveis de acesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UsuariosTableFilters
                filtro={filtro}
                onFiltroChange={valor => { setFiltro(valor); setPagina(1); }}
                onLimpar={() => { setFiltro(""); setPagina(1); }}
              />
              
              {/* Barra de ações em lote */}
              {selecionados.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-muted rounded-lg border animate-in fade-in">
                  <span className="text-sm font-medium">{selecionados.length} selecionado(s)</span>
                  <Button size="sm" variant="destructive" onClick={handleBatchDelete}>Deletar</Button>
                  <Button size="sm" variant="secondary" onClick={handleBatchChangeRole}>Alterar Papel</Button>
                  <Button size="sm" variant="outline" onClick={handleBatchResetMFA}>Resetar MFA</Button>
                </div>
              )}
              
              <UsuariosTable
                usuarios={usuariosPagina}
                loading={isLoading}
                onResetSenha={handleResetSenha}
                onToggleAtivo={handleToggleAtivo}
                onChangeNivel={handleChangeNivel}
                selecionados={selecionados}
                onSelecionar={handleSelecionar}
                onSelecionarTodos={handleSelecionarTodos}
                todosSelecionados={usuariosPagina.length > 0 && usuariosPagina.every(u => selecionados.includes(u.id))}
                algumSelecionado={selecionados.length > 0}
              />
              
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm text-muted-foreground">Página {pagina} de {totalPaginas}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setPagina(1)} disabled={pagina === 1}>Início</Button>
                  <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</Button>
                  <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Próxima</Button>
                  <Button size="sm" variant="outline" onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}>Fim</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Logs do Sistema
              </CardTitle>
              <CardDescription>
                Monitore atividades e eventos do sistema em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Funcionalidade de logs será implementada em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics e Relatórios
              </CardTitle>
              <CardDescription>
                Visualize métricas de uso e performance do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Dashboard de analytics será implementado em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAdmin;
