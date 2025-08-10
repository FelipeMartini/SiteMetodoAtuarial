"use client"
import React, { createContext, useContext, useMemo } from "react"
import { useAuth } from "@/app/hooks/useAuth"

// Tipagem do contexto de sessão
interface SessionContextType {
  user: {
    id: string
    name?: string | null
    email?: string | null
    accessLevel?: number
    role?: string
  } | null
  status: "loading" | "authenticated" | "unauthenticated"
  isLoading: boolean
  isError: boolean
  error: unknown
  refetch: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, status, isLoading, isError, error, refetch } = useAuth()
  // Memoiza o valor do contexto para evitar renders desnecessários
  const value = useMemo(() => ({
    user: data,
    status,
    isLoading,
    isError,
    error,
    refetch,
  }), [data, status, isLoading, isError, error, refetch])
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error("useSession deve ser usado dentro de <SessionProvider>")
  return ctx
}

// Comentário: SessionProvider fornece contexto global de sessão para toda a árvore React, usando useAuth internamente.
