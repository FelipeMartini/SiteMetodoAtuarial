'use client';

import React from 'react';
import { ClienteSidebarModerna } from '@/components/ui/cliente-sidebar-moderna';

export default function AreaClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar moderna responsiva */}
      <ClienteSidebarModerna />

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto bg-muted/30">
        {children}
      </div>
    </div>
  );
}
