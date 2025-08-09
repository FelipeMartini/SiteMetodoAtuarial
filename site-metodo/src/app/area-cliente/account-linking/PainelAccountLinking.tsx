"use client";
// =============================
// Painel de Account Linking
// (comentários detalhados movidos abaixo para manter diretiva no topo)
// =============================
// Painel de gerenciamento de provedores (account linking) - UI/UX moderna, dark/light mode, integração Auth.js v5 + Prisma

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ComponenteBase } from "@/components/ui/ComponenteBase";
import { FeatureFlagStatus } from "@/components/feature-flags/FeatureFlagStatus";
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

  // Schema Zod para vinculação
  const vincularSchema = z.object({
    provider: z.string().min(2, "Selecione um provedor válido")
  });

  type VincularForm = z.infer<typeof vincularSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<VincularForm>({
    resolver: zodResolver(vincularSchema),
    defaultValues: { provider: "" }
  });

  // Handler de vinculação usando react-hook-form
  const onSubmitVincular = async (data: VincularForm) => {
    setErro(null); setOk(null); setLoading(true);
    // Redireciona para o fluxo de OAuth do provedor
    window.location.href = `/api/auth/signin/${data.provider}?linking=1`;
    reset();
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

  // Lógica de filtro e paginação
  const filtrados = linked.filter(acc => {
    if (!busca.trim()) return true;
    const prov = PROVIDERS.find((p) => p.id === acc.provider);
    const nome = prov?.nome?.toLowerCase() || acc.provider.toLowerCase();
    return (
      nome.includes(busca.toLowerCase()) ||
      acc.providerAccountId.toLowerCase().includes(busca.toLowerCase())
    );
  });

  // Paginação client-side (padrão: 5 por página)
  const [pagina, setPagina] = useState(0);
  const [tamanhoPagina, setTamanhoPagina] = useState(5);
  const totalPaginas = Math.ceil(filtrados.length / tamanhoPagina);
  const paginados = filtrados.slice(pagina * tamanhoPagina, (pagina + 1) * tamanhoPagina);

  // Resetar página ao filtrar
  useEffect(() => { setPagina(0); }, [busca, linked.length]);
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
            <>
              {/* Paginação e controles */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="tamanhoPagina" className="text-xs">Por página:</label>
                  <select
                    id="tamanhoPagina"
                    value={tamanhoPagina}
                    onChange={e => setTamanhoPagina(Number(e.target.value))}
                    className="text-xs rounded border px-1 py-0.5"
                    aria-label="Selecionar quantidade por página"
                  >
                    {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setPagina(0)} disabled={pagina === 0} aria-label="Primeira página">{'<<'}</Button>
                  <Button variant="ghost" size="icon" onClick={() => setPagina(p => Math.max(0, p - 1))} disabled={pagina === 0} aria-label="Página anterior">{'<'}</Button>
                  <span className="text-xs">Página {pagina + 1} de {totalPaginas}</span>
                  <Button variant="ghost" size="icon" onClick={() => setPagina(p => Math.min(totalPaginas - 1, p + 1))} disabled={pagina >= totalPaginas - 1} aria-label="Próxima página">{'>'}</Button>
                  <Button variant="ghost" size="icon" onClick={() => setPagina(totalPaginas - 1)} disabled={pagina >= totalPaginas - 1} aria-label="Última página">{'>>'}</Button>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {paginados.map((acc) => {
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
                        {/* Exemplo de feature flag real: logs avançados */}
                        <FeatureFlagStatus flag="account-linking-logs">
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
                        </FeatureFlagStatus>
                      </div>
                      <Badge variant="outline">Vinculado</Badge>
                      {/* Exemplo de feature flag real: botão de reset MFA */}
                      <FeatureFlagStatus flag="account-linking-reset-mfa">
                        {acc.mfaEnabled && (
                          <Button variant="secondary" size="sm" className="mr-2" aria-label="Resetar MFA" onClick={() => alert('Reset MFA mock')}>Resetar MFA</Button>
                        )}
                      </FeatureFlagStatus>
                      <Button variant="destructive" size="sm" disabled={loading} aria-label={`Desvincular ${prov?.nome}`} onClick={() => handleUnlink(acc.provider)}>
                        Desvincular
                      </Button>
                    </div>
                  );
                })}
              </div>
            </>
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
          {/* Formulário de vinculação com react-hook-form + Zod */}
          <form onSubmit={handleSubmit(onSubmitVincular)} className="flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted/40 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {PROVIDERS.filter((p) => !linked.some((acc) => acc.provider === p.id)).map((prov) => (
                    <label key={prov.id} className="flex items-center gap-4 bg-muted/40 rounded-lg p-4 cursor-pointer">
                      <input
                        type="radio"
                        value={prov.id}
                        {...register("provider")}
                        className="accent-primary h-4 w-4"
                        aria-label={`Selecionar ${prov.nome}`}
                        aria-invalid={!!errors.provider}
                        aria-describedby={errors.provider ? "erro-provider" : undefined}
                        disabled={isSubmitting || loading}
                      />
                      <Avatar>
                        <AvatarImage src={prov.icon} alt={prov.nome} />
                        <AvatarFallback>{prov.nome[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{prov.nome}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.provider && (
                  <span id="erro-provider" className="text-xs text-destructive" role="alert">
                    {errors.provider.message}
                  </span>
                )}
                <Button type="submit" variant="outline" size="sm" disabled={isSubmitting || loading} aria-label="Vincular provedor selecionado">
                  Vincular
                </Button>
              </>
            )}
          </form>
        </TabsContent>
      </Tabs>
    </ComponenteBase>
  );
}
