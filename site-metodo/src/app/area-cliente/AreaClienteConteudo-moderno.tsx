"use client";

import React from "react";
import MenuLateralClienteWrapper from "@/app/area-cliente/MenuLateralClienteWrapper";
import { DashboardUsuarioWidget } from "@/components/ui/dashboard-usuario-widget";

/**
 * Componente client-side modernizado para área do cliente
 * Usa o novo dashboard widget moderno com design responsivo
 */
export default function AreaClienteConteudo({ 
  usuario 
}: { 
  usuario?: { 
    name?: string | null; 
    email?: string | null; 
    image?: string | null 
  } 
}) {
  return (
    <div className="flex flex-row justify-start items-start gap-8 mt-6 w-full px-4 max-w-7xl mx-auto">
      <MenuLateralClienteWrapper />

      <div className="flex-1 min-w-0">
        <DashboardUsuarioWidget />
      </div>
    </div>
  );
}
