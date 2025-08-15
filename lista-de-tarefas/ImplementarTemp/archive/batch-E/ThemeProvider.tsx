'use client'

import * as React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

// Compat wrapper: o controle de tema agora é feito via Zustand.
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>
}
