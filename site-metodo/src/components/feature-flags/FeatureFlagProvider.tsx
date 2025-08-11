'use client'
import { FlagProvider } from '@unleash/nextjs/client'
import { ReactNode } from 'react'

interface FeatureFlagProviderProps {
  children: ReactNode
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  // Config pode ser omitido se usar variáveis de ambiente
  // Veja .env.example para detalhes
  return <FlagProvider>{children}</FlagProvider>
}
