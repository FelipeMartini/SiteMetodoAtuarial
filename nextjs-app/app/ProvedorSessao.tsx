"use client";
// Provedor de sessão NextAuth para Client Components
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function ProvedorSessao({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
// Comentário: Este componente garante que o SessionProvider seja usado apenas em Client Components, evitando erro de contexto em Server Components do Next.js moderno.
