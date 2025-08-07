"use client";


import React from "react";
import DashboardAdmin from "../DashboardAdmin";
import { useSessaoAuth } from "../../../hooks/useSessaoAuth";
import { Skeleton } from "@/components/ui/skeleton";


const PageDashboardAdmin: React.FC = () => {
  const { usuario, status } = useSessaoAuth();
  if (status === "loading") {
    // Exibe Skeleton enquanto status está carregando
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
        <Skeleton className="h-[32px] w-[320px] mb-6" />
        <Skeleton className="h-[48px] w-full mb-2" />
        {[...Array(5)].map((_, idx) => (
          <Skeleton key={idx} className="h-[40px] w-full mb-2" />
        ))}
      </div>
    );
  }
  if (!usuario || usuario.accessLevel !== 5) {
    return <div style={{ color: "red", fontWeight: 600, margin: 32 }}>Acesso restrito: apenas para administradores nível 5.</div>;
  }
  return <DashboardAdmin />;
};

export default PageDashboardAdmin;
// Comentário: Página protegida, só renderiza dashboard se usuário for nível 5.
