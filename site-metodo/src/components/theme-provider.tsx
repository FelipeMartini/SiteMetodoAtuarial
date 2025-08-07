"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Provider de tema customizado com configurações otimizadas
 * Baseado nos padrões do fuse-react com adaptações para shadcn/ui
 */
export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
  [key: string]: any
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["light", "dark"]}
      storageKey="metodo-atuarial-theme"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

/**
 * Hook customizado para usar o tema com tipagem melhorada
 */
export { useTheme } from "next-themes"
