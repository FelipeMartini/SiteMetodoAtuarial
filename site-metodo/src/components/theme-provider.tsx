'use client'

import * as React from 'react'
import { useTheme as useZustandTheme } from '@/lib/zustand/hooks'

/**
 * Provider de tema: anteriormente usamos `next-themes`. Agora a aplicação centraliza o tema em Zustand.
 * Este componente é apenas um wrapper de compatibilidade e permite futuras extensões.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// Reexporta o hook `useTheme` para compatibilidade com código que importa de `components/theme-provider`.
export const useTheme = useZustandTheme
