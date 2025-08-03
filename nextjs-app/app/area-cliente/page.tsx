// Página da Área do Cliente
// Só pode ser acessada por usuários autenticados
// Exibe informações do perfil do usuário logado
// Importações necessárias para autenticação, imagem e navegação
import React from "react";
import { ErrorBoundary } from '../components/ErrorBoundary';
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/authOptions";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
// Removido import duplicado de React como tipo para evitar erro de sintaxe no Jest/TypeScript

// Função assíncrona da página protegida da área do cliente
export default async function AreaCliente(): Promise<React.ReactElement> {
  // Obtém a sessão do usuário autenticado
  const session: Session | null = await getServerSession(authOptions);

  // Se não estiver logado, redireciona para login
  if (!session) {
    redirect("/login");
  }

  // Importa o menu lateral exclusivo da área do cliente
  const MenuLateralCliente = (await import("./MenuLateralCliente")).default;

  // Renderiza o layout flexível e responsivo
  return (
    <ErrorBoundary>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 24,
          marginTop: 40,
        }}
      >
        {/* Menu lateral exclusivo para usuário autenticado */}
        <MenuLateralCliente />
        <main
          style={{
            maxWidth: 400,
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 8px #0002",
            background: "#fff",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Perfil do Cliente</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Exibe foto do usuário se disponível */}
            {/* Imagem do usuário otimizada com loading="lazy" */}
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="Foto do usuário"
                width={120}
                height={120}
                style={{ borderRadius: "50%" }}
                loading="lazy"
              />
            ) : null}
            <div>
              <strong>Nome:</strong> {session.user?.name || "Não informado"}
            </div>
            <div>
              <strong>Email:</strong> {session.user?.email || "Não informado"}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

// Comentário: Esta página só pode ser acessada por usuários autenticados. Exibe apenas informações do próprio usuário logado, nunca de outros clientes. O redirecionamento é automático para login se não houver sessão. O menu lateral é exclusivo da área do cliente e pode ser personalizado.
// Tipagem do objeto de sessão foi ajustada para garantir compatibilidade com TypeScript e NextAuth.
// O padrão de importação e nomenclatura segue as diretrizes do projeto.
