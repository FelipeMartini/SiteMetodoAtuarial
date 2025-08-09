"use client";
// Painel de gerenciamento de provedores (account linking) - UI/UX moderna, dark/light mode, integração Auth.js v5 + Prisma

import React, { useEffect, useState } from "react";
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

interface LinkedAccount {
  provider: string;
  providerAccountId: string;
  createdAt: string;
}

export default function PainelAccountLinking() {
  const [linked, setLinked] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/auth/linked-accounts")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar provedores vinculados");
        const data = await res.json();
        setLinked(data.accounts || []);
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
          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-muted/40 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {linked.length === 0 && <span className="text-muted-foreground">Nenhum provedor vinculado.</span>}
              {linked.map((acc) => {
                const prov = PROVIDERS.find((p) => p.id === acc.provider);
                return (
                  <div key={acc.provider} className="flex items-center gap-4 bg-muted/40 rounded-lg p-4">
                    <Avatar>
                      <AvatarImage src={prov?.icon} alt={prov?.nome} />
                      <AvatarFallback>{prov?.nome?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{prov?.nome || acc.provider}</div>
                      <div className="text-xs text-muted-foreground">ID: {acc.providerAccountId}</div>
                      <div className="text-xs text-muted-foreground">Vinculado em: {new Date(acc.createdAt).toLocaleString()}</div>
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
