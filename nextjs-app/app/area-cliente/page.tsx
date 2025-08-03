// Página da Área do Cliente
// Só pode ser acessada por usuários autenticados
// Exibe informações do perfil do usuário logado
// Importações necessárias para autenticação, imagem e navegação
import React from "react";
// Importação removida: ErrorBoundary só pode ser usado em Client Component
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import AreaClienteConteudo from "./AreaClienteConteudo";
// Importa o componente client-side que renderiza o menu e perfil do cliente
// Removido import duplicado de React como tipo para evitar erro de sintaxe no Jest/TypeScript

// Função assíncrona da página protegida da área do cliente
export default async function AreaCliente() {
  // Obtém a sessão do usuário autenticado
  const session: Session | null = await getServerSession(authOptions);

  // Se não estiver logado, redireciona para login
  if (!session) {
    redirect("/login");
  }


  // Renderiza o conteúdo client-side passando os dados do usuário via props
  // Renderiza apenas o componente client-side, sem ErrorBoundary
  return (
    <AreaClienteConteudo usuario={{
      name: session.user?.name ?? undefined,
      email: session.user?.email ?? undefined,
      image: session.user?.image || null
    }} />
  );
}

// Comentário: Esta página só pode ser acessada por usuários autenticados. Exibe apenas informações do próprio usuário logado, nunca de outros clientes. O redirecionamento é automático para login se não houver sessão. O menu lateral é exclusivo da área do cliente e pode ser personalizado.
// Tipagem do objeto de sessão foi ajustada para garantir compatibilidade com TypeScript e NextAuth.
// O padrão de importação e nomenclatura segue as diretrizes do projeto.
