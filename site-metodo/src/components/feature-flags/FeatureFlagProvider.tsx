'use client'
import { FlagProvider } from '@unleash/nextjs/client'
import { ReactNode } from 'react'

interface FeatureFlagProviderProps {
  children: ReactNode
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  // Sempre renderizamos o FlagProvider para garantir que a árvore de
  // componentes cliente tenha um provedor consistente entre SSR e CSR.
  // Isso evita erros de hidratação quando componentes filhos usam hooks
  // como `useFlag`/`useFlagContext` antes do provider ser montado.
  // A configuração concreta do cliente (URL/chave) pode ser fornecida via
  // variáveis de ambiente; se não estiver presente, o provider ficará no
  // estado padrão (sem flags ativas) mas mantém a consistência do contexto.
  return <FlagProvider>{children}</FlagProvider>
}
