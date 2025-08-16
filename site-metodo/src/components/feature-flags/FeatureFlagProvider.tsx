'use client'
import { FlagProvider } from '@unleash/nextjs/client'
import { ReactNode } from 'react'

interface FeatureFlagProviderProps {
  children: ReactNode
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  // Evita inicializar o cliente Unleash quando a URL do frontend não estiver
  // configurada (ex.: desenvolvedor local sem Unleash rodando). O SDK por
  // padrão tenta se conectar em http://localhost:4242, o que gera erros de
  // rede visíveis no console e ruidosos no overlay de desenvolvimento.
  //
  // Se a variável de ambiente NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL não estiver
  // definida, retornamos as crianças diretamente (comportamento sem flags).
  // Caso contrário inicializamos o FlagProvider normalmente.
  const frontendUrl = process.env.NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL
  if (!frontendUrl) {
    return <>{children}</>
  }

  return <FlagProvider>{children}</FlagProvider>
}
