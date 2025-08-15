"use client"

import { useEffect } from 'react'
import useUIStore from '@/lib/zustand/uiStore'
import { ThemeOption } from '@/lib/zustand/types'

/**
 * Aplica a classe de tema (`dark`) no elemento root (<html>) com base no estado do Zustand.
 * Suporta três opções: 'light' | 'dark' | 'system'.
 */
export default function ThemeProviderClient() {
  const theme = useUIStore((s: any) => s.theme)

  useEffect(() => {
    const root = document.documentElement

    const apply = (t: ThemeOption) => {
      if (t === 'system') {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', isDark)
      } else {
        root.classList.toggle('dark', t === 'dark')
      }
    }

    apply(theme)

    const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
    const listener = () => {
      // se o usuário optou por 'system', atualiza quando a preferência do sistema muda
      if (theme === 'system') apply('system')
    }

    if (mql) {
      // addEventListener é preferível, mas nem todos os browsers suportam
      if (mql.addEventListener) mql.addEventListener('change', listener)
      else if ((mql as any).addListener) (mql as any).addListener(listener)
    }

    return () => {
      if (mql) {
        if (mql.removeEventListener) mql.removeEventListener('change', listener)
        else if ((mql as any).removeListener) (mql as any).removeListener(listener)
      }
    }
  }, [theme])

  return null
}
