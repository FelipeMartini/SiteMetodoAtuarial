"use client";
// Provedor de sessão NextAuth para Client Components

import React from "react";

// Provedor de sessão universal (Auth.js puro): apenas repassa os filhos
export default function ProvedorSessao({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
// Comentário: Com Auth.js puro, não é necessário um provider especial para sessão. O hook useSessaoAuth faz toda a gestão.
