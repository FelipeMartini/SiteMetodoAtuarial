"use client";

import React from "react";
import DashboardAdmin from "../DashboardAdmin";
import { useSessaoAuth } from "../../../hooks/useSessaoAuth";


const PageDashboardAdmin: React.FC = () => {
  const { usuario, status } = useSessaoAuth();
  if (status === "loading") return <div>Carregando...</div>;
  if (!usuario || usuario.accessLevel !== 5) {
    return <div style={{ color: "red", fontWeight: 600, margin: 32 }}>Acesso restrito: apenas para administradores nível 5.</div>;
  }
  return <DashboardAdmin />;
};

export default PageDashboardAdmin;
// Comentário: Página protegida, só renderiza dashboard se usuário for nível 5.
