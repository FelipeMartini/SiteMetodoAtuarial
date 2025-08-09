"use client";
// Painel de gerenciamento de provedores (account linking) - UI/UX moderna, dark/light mode, integração Auth.js v5 + Prisma

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ComponenteBase } from "@/components/ui/ComponenteBase";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

// Tipos de provedores suportados
const PROVIDERS = [
  { id: "google", nome: "Google", icon: "/icons/google.svg" },
  { id: "github", nome: "GitHub", icon: "/icons/github.svg" },
  { id: "apple", nome: "Apple", icon: "/icons/apple.svg" },
  { id: "twitter", nome: "Twitter", icon: "/icons/twitter.svg" },
  { id: "microsoft", nome: "Microsoft", icon: "/icons/microsoft.svg" },
];

// Tipo expandido para exibir status, roles, flags e logs (mock)
interface LinkedAccount {
  provider: string;
  providerAccountId: string;
  createdAt: string;
  status?: 'ativo' | 'bloqueado' | 'pendente';
  role?: 'usuário' | 'admin' | 'guest';
  mfaEnabled?: boolean;
  ultimoAcesso?: string;
  logs?: string[];
}

export default function PainelAccountLinking() {
  const [linked, setLinked] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  // Seleção múltipla
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [dialogAberto, setDialogAberto] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/auth/linked-accounts")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar provedores vinculados");
        const data = await res.json();
        // Mock de campos extras para exibição
        const mockExtras = [
          { status: 'ativo', role: 'usuário', mfaEnabled: true, ultimoAcesso: new Date().toISOString(), logs: ['Login realizado', 'MFA ativado'] },
          { status: 'bloqueado', role: 'admin', mfaEnabled: false, ultimoAcesso: new Date(Date.now() - 86400000).toISOString(), logs: ['Tentativa de login bloqueada'] },
        ];
        setLinked(
          (data.accounts || []).map((acc: LinkedAccount, i: number) => ({
            ...acc,
            ...mockExtras[i % mockExtras.length],
          }))
        );
      })
      .catch(() => setErro("Erro ao buscar provedores vinculados."))
      .finally(() => setLoading(false));
  }, []);

  const handleLink = async (provider: string) => {
    setErro(null); setOk(null); setLoading(true);
    window.location.href = `/api/auth/signin/${provider}?linking=1`;
  };

  const handleUnlink = async (provider: string) => {
    setErro(null); setOk(null); setLoading(true);
    const res = await fetch(`/api/auth/unlink-provider`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setErro(data.error || "Erro ao desvincular provedor.");
    } else {
      setOk("Provedor desvinculado com sucesso.");
      setLinked((prev) => prev.filter((acc) => acc.provider !== provider));
    }
    setLoading(false);
  };

  // Lógica de seleção
  const filtrados = linked.filter(acc => {
    if (!busca.trim()) return true;
    const prov = PROVIDERS.find((p) => p.id === acc.provider);
    const nome = prov?.nome?.toLowerCase() || acc.provider.toLowerCase();
    return (
      nome.includes(busca.toLowerCase()) ||
      acc.providerAccountId.toLowerCase().includes(busca.toLowerCase())
    );
  });
  const todosSelecionados = filtrados.length > 0 && filtrados.every(acc => selecionados.includes(acc.provider));
  const toggleSelecionarTodos = () => {
    if (todosSelecionados) {
      setSelecionados(selecionados.filter(id => !filtrados.some(acc => acc.provider === id)));
    } else {
      setSelecionados([
        ...selecionados,
        ...filtrados.filter(acc => !selecionados.includes(acc.provider)).map(acc => acc.provider)
      ]);
    }
  };
  const handleSelecionar = (provider: string) => {
    setSelecionados((prev) => prev.includes(provider)
      ? prev.filter((id) => id !== provider)
      : [...prev, provider]);
  };
  const handleDesvincularSelecionados = async () => {
    setDialogAberto(false);
    setErro(null); setOk(null); setLoading(true);
    let algumErro = false;
    for (const provider of selecionados) {
      const res = await fetch(`/api/auth/unlink-provider`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        algumErro = true;
        setErro(data.error || `Erro ao desvincular ${provider}.`);
      } else {
        setLinked((prev) => prev.filter((acc) => acc.provider !== provider));
      }
    }
    if (!algumErro) {
      setOk("Provedores desvinculados com sucesso.");
    }
    setSelecionados([]);
    setLoading(false);
  };
  return (
    <ComponenteBase variant="default" size="lg" className="max-w-2xl w-full mx-auto mt-8">
      <div className="mb-6">
        <h2 className="text-center text-2xl font-bold text-gradient">Gerenciar Provedores Vinculados</h2>
      </div>
      <Tabs defaultValue="vinculados" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="vinculados">Vinculados</TabsTrigger>
          <TabsTrigger value="disponiveis">Disponíveis</TabsTrigger>
        </TabsList>
        <TabsContent value="vinculados">
          {erro && <Alert variant="destructive">{erro}</Alert>}
          {ok && <Alert variant="default">{ok}</Alert>}
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Buscar provedor ou ID..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="max-w-xs"
              aria-label="Buscar provedor vinculado"
            />
            {filtrados.length > 0 && (
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Checkbox
                  checked={todosSelecionados}
                  onCheckedChange={toggleSelecionarTodos}
                  aria-label="Selecionar todos"
                  disabled={loading}
                />
                <span className="text-xs text-muted-foreground">Selecionar todos</span>
                {selecionados.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-4"
                    disabled={loading}
                    onClick={() => setDialogAberto(true)}
                  >
                    Desvincular selecionados
                  </Button>
                )}
              </div>
            )}
          </div>
          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-muted/40 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <span className="text-muted-foreground">Nenhum provedor vinculado.</span>
          ) : (
            <div className="flex flex-col gap-4">
              {filtrados.map((acc) => {
                const prov = PROVIDERS.find((p) => p.id === acc.provider);
                return (
                  <div key={acc.provider} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-muted/40 rounded-lg p-4">
                    {/* Checkbox de seleção */}
                    <Checkbox
                      checked={selecionados.includes(acc.provider)}
                      onCheckedChange={() => handleSelecionar(acc.provider)}
                      aria-label={`Selecionar ${prov?.nome || acc.provider}`}
                      disabled={loading}
                    />
                    {/* Avatar e nome do provedor */}
                    <Avatar>
                      <AvatarImage src={prov?.icon} alt={prov?.nome} />
                      <AvatarFallback>{prov?.nome?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 w-full">
                      <div className="font-medium text-foreground">{prov?.nome || acc.provider}</div>
                      <div className="text-xs text-muted-foreground">ID: {acc.providerAccountId}</div>
                      <div className="text-xs text-muted-foreground">Vinculado em: {new Date(acc.createdAt).toLocaleString()}</div>
                      {/* Exibição de status, role, MFA, último acesso e logs */}
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant={acc.status === 'ativo' ? 'default' : acc.status === 'bloqueado' ? 'destructive' : 'outline'}>{acc.status || 'desconhecido'}</Badge>
                        <Badge variant="secondary">{acc.role || 'sem papel'}</Badge>
                        {typeof acc.mfaEnabled !== 'undefined' && (
                          <Badge variant={acc.mfaEnabled ? 'default' : 'outline'}>{acc.mfaEnabled ? 'MFA Ativo' : 'MFA Inativo'}</Badge>
                        )}
                        {acc.ultimoAcesso && (
                          <span className="text-xs text-muted-foreground">Último acesso: {new Date(acc.ultimoAcesso).toLocaleString()}</span>
                        )}
                      </div>
                      {acc.logs && acc.logs.length > 0 && (
                        <details className="mt-1">
                          <summary className="text-xs cursor-pointer">Ver logs</summary>
                          <ul className="list-disc ml-4 text-xs">
                            {acc.logs.map((log, idx) => (
                              <li key={idx}>{log}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                    <Badge variant="outline">Vinculado</Badge>
                    <Button variant="destructive" size="sm" disabled={loading} aria-label={`Desvincular ${prov?.nome}`} onClick={() => handleUnlink(acc.provider)}>
                      Desvincular
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Desvincular provedores selecionados?</DialogTitle>
              </DialogHeader>
              <div className="mb-4">
                <span>Tem certeza que deseja desvincular {selecionados.length} provedor(es)? Esta ação não pode ser desfeita.</span>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogAberto(false)} disabled={loading}>Cancelar</Button>
                <Button variant="destructive" onClick={handleDesvincularSelecionados} disabled={loading}>Desvincular</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="disponiveis">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-muted/40 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {PROVIDERS.filter((p) => !linked.some((acc) => acc.provider === p.id)).map((prov) => (
                <div key={prov.id} className="flex items-center gap-4 bg-muted/40 rounded-lg p-4">
                  <Avatar>
                    <AvatarImage src={prov.icon} alt={prov.nome} />
                    <AvatarFallback>{prov.nome[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{prov.nome}</div>
                  </div>
                  <Button variant="outline" size="sm" disabled={loading} aria-label={`Vincular ${prov.nome}`} onClick={() => handleLink(prov.id)}>
                    Vincular
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ComponenteBase>
  );
}
