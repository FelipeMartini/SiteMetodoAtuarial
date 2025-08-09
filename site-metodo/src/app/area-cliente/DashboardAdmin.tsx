
"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import UsuariosTable from "./dashboard-admin/UsuariosTable";
import UsuariosTableFilters from "./dashboard-admin/UsuariosTableFilters";
import { Button } from "@/components/ui/button";

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

const DashboardAdmin: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(10);
  // Estado de seleção de usuários (IDs)
  const [selecionados, setSelecionados] = useState<string[]>([]);
  // Mock de feature flags (Unleash)
  const [flags, setFlags] = useState({
    darkMode: true,
    betaTable: false,
    mfaObrigatorio: false,
    logsAvancados: true,
  });

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/usuario/lista");
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        setUsuarios(data.usuarios || []);
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

  // Filtro e paginação client-side (pode ser adaptado para server-side)
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
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-gradient">Manutenção de Usuários</h2>
      {/* Painel de Feature Flags (mock Unleash) */}
      <div className="mb-6 p-4 rounded border bg-muted flex flex-wrap gap-6 items-center">
        <span className="font-semibold text-base mr-4">Feature Flags (Admin)</span>
        {Object.entries(flags).map(([flag, value]) => (
          <div key={flag} className="flex items-center gap-2">
            <Switch
              id={`flag-${flag}`}
              checked={value}
              onCheckedChange={checked => setFlags(f => ({ ...f, [flag]: checked }))}
              aria-label={`Ativar/desativar ${flag}`}
            />
            <label htmlFor={`flag-${flag}`} className="text-sm cursor-pointer capitalize">
              {flag.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </label>
            <Badge variant={value ? "default" : "outline"}>{value ? "Ativo" : "Inativo"}</Badge>
          </div>
        ))}
      </div>
      {mensagem && <div className="mb-4 text-center text-sm font-medium text-primary animate-pulse">{mensagem}</div>}
      <UsuariosTableFilters
        filtro={filtro}
        onFiltroChange={valor => { setFiltro(valor); setPagina(1); }}
        onLimpar={() => { setFiltro(""); setPagina(1); }}
      />
      {/* Barra de ações em lote */}
      {selecionados.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-muted rounded border animate-in fade-in">
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
      <div className="flex justify-between items-center mt-4 gap-2">
        <span className="text-sm text-muted-foreground">Página {pagina} de {totalPaginas}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPagina(1)} disabled={pagina === 1}>Início</Button>
          <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</Button>
          <Button size="sm" variant="outline" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>Próxima</Button>
          <Button size="sm" variant="outline" onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}>Fim</Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
