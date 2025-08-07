"use client";
// A diretiva 'use client' deve ser sempre a primeira linha do arquivo para garantir que o componente seja client-side
import React from "react";
import { useSessaoAuth } from "@/hooks/useSessaoAuth";
import { Skeleton } from "@/components/ui/skeleton";
// Diretiva para garantir que o componente seja client-side
/**
 * Componente MenuLateralCliente
 * Menu lateral exclusivo para área do cliente, exibido apenas para usuários autenticados.
 * Os itens podem ser personalizados conforme necessidade do projeto.
 */

// Importação do componente Link do Next.js para navegação interna
import Link from "next/link";




export default function MenuLateralCliente() {
  const { usuario } = useSessaoAuth();
  const nivel = usuario?.accessLevel;
  // Exibe Skeleton enquanto dados do usuário não estão disponíveis
  if (!usuario) {
    return (
      <aside
        data-testid="menu-lateral"
        className="w-[220px] bg-card rounded-xl shadow-md p-6 mr-8 min-h-[320px] border border-border"
      >
        <nav className="flex flex-col gap-4">
          <strong className="mb-3 text-lg text-primary">
            <Skeleton className="h-[24px] w-[140px] mb-2" />
          </strong>
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className="h-[20px] w-[120px] mb-2" />
          ))}
        </nav>
      </aside>
    );
  }
  return (
    <aside
      data-testid="menu-lateral"
      className="w-[220px] bg-card rounded-xl shadow-md p-6 mr-8 min-h-[320px] border border-border"
    >
      <nav className="flex flex-col gap-4">
        <strong className="mb-3 text-lg text-primary">Menu do Cliente</strong>
        <Link href="/area-cliente" className="text-foreground font-medium text-base hover:text-primary hover:underline transition-colors">Perfil</Link>
        <Link href="/servicos" className="text-foreground font-medium text-base hover:text-primary hover:underline transition-colors">Serviços</Link>
        <Link href="/contato" className="text-foreground font-medium text-base hover:text-primary hover:underline transition-colors">Contato / Orçamento</Link>
        <Link href="#" className="text-foreground font-medium text-base hover:text-primary hover:underline transition-colors">Meus Documentos</Link>
        <Link href="#" className="text-foreground font-medium text-base hover:text-primary hover:underline transition-colors">Solicitações</Link>
        {/* Exibe link administrativo apenas para nível 5 */}
        {nivel === 5 && (
          <Link href="/area-cliente/dashboard-admin" className="text-foreground font-medium text-base hover:text-primary hover:underline transition-colors">Dashboard Administrativo</Link>
        )}
      </nav>
    </aside>
  );
}
