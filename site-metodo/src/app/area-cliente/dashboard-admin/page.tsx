"use client";


import React from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";



const DashboardAdmin = dynamic(() => import("@/app/area-cliente/DashboardAdmin"), {
  loading: () => (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <Skeleton className="h-[32px] w-[320px] mb-6" />
      <Skeleton className="h-[48px] w-full mb-2" />
      {[...Array(5)].map((_, idx) => (
        <Skeleton key={idx} className="h-[40px] w-full mb-2" />
      ))}
    </div>
  ),
  ssr: false,
});

const PageDashboardAdmin: React.FC = () => {
  const { data: session, status } = useAuth();
  
  if (status === "loading") {
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

  // Verifica se o usuário está autenticado
  if (!session?.user) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }

  // Verifica roles - suporta tanto array quanto string
  const userRole = session.user.role;
  const userAccessLevel = session.user.accessLevel;
  
  let isAdmin = false;
  let isStaff = false;
  
  // Verificação por role (sistema moderno)
  if (Array.isArray(userRole)) {
    isAdmin = userRole.includes('admin');
    isStaff = userRole.includes('staff');
  } else if (typeof userRole === 'string') {
    isAdmin = userRole === 'admin';
    isStaff = userRole === 'staff';
  }
  
  // Fallback: verificação por accessLevel (compatibilidade)
  if (!isAdmin && !isStaff && userAccessLevel) {
    isAdmin = userAccessLevel >= 100;
    isStaff = userAccessLevel >= 50;
  }
  
  console.log('🔍 Debug dashboard admin:', {
    userEmail: session.user.email,
    userRole,
    userAccessLevel,
    isAdmin,
    isStaff,
    hasAccess: isAdmin || isStaff
  });
  
  if (!(isAdmin || isStaff)) {
    if (typeof window !== "undefined") {
      window.alert("Acesso restrito: apenas para administradores e staff.");
      window.location.href = "/area-cliente";
    }
    return null;
  }

  return (
    <div>
      <DashboardAdmin />
    </div>
  );
};

export default PageDashboardAdmin;
// Comentário: Página protegida, só renderiza dashboard se usuário for admin ou staff.
