'use client'

import { SessionProvider } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Desabilitar refetch automático em foco e reduzir polling padrão para minimizar
  // requisições repetidas a /api/auth/session durante desenvolvimento.
  return (
    <SessionProvider
      refetchOnWindowFocus={false}
      // pollInterval não existe na nova API; controlamos via react-query e hooks.
    >
      {children}
    </SessionProvider>
  )
}
