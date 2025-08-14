'use client'
import { FlagProvider } from '@unleash/nextjs/client'
import { ReactNode } from 'react'

interface FeatureFlagProviderProps {
  children: ReactNode
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  // Config pode ser omitido se usar variáveis de ambiente
  // Veja .env.example para detalhes
  // Se a URL do frontend do Unleash não estiver configurada, não inicializamos
  // o cliente aqui para evitar mensagens de "connection refused" em desenvolvimento.
  // A aplicação continua a funcionar normalmente sem flags quando a variável não existe.
  const unleashFrontendUrl = process.env.NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL
  if (!unleashFrontendUrl) {
    return <>{children}</>
  }

  return <FlagProvider>{children}</FlagProvider>
}
