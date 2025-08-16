"use client"

import React, { useEffect, useState } from 'react'
import useUIStore from '@/lib/zustand/uiStore'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { CurrentUser } from '@/lib/zustand/types'

export function ThemeToggleZustand() {
  const [hydrated, setHydrated] = useState(false)
  const theme = useUIStore((s: any) => s.theme)
  const toggleTheme = useUIStore((s: any) => s.toggleTheme)

  useEffect(() => setHydrated(true), [])

  if (!hydrated) {
    // Durante hidratação, mostrar estado neutro para evitar flash
    return (
      <Button variant='ghost' size='icon' aria-label='Carregando tema...'>
        <Sun className='h-4 w-4 opacity-50' />
      </Button>
    )
  }

  return (
    <Button variant='ghost' size='icon' onClick={toggleTheme} aria-label='Alternar tema'>
      {theme === 'dark' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
    </Button>
  )
}

export default ThemeToggleZustand

// Componente de hidratação que garante sincronização SSR-safe
export function HydrateUIStore() {
  useEffect(() => {
    // Rehydrate manualmente após montagem no cliente
    useUIStore.persist.rehydrate()
  }, [])
  
  return null // Componente invisível apenas para hidratação
}

// Hydrate currentUser on client mount
export function HydrateCurrentUser() {
  // Notar: não adicionamos o setter do Zustand nas dependências do efeito porque
  // a identidade da função pode mudar entre rehydrations e provocar re-execuções
  // infinitas do efeito (Maximum update depth). Em vez disso, obtemos o setter
  // diretamente da store via getState() dentro do efeito.
  useEffect(() => {
    let mounted = true

    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/session')
        if (!mounted) return
        if (!res.ok) return
        const data = await res.json()
        if (data?.user) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const user = data.user
          const u = { id: String(user.id ?? user.sub ?? ''), email: String(user.email ?? '') } as CurrentUser
          // obter o setter diretamente para evitar dependências instáveis
          // Somente atualiza a store se o usuário for diferente para evitar updates redundantes
          const current = useUIStore.getState().currentUser
          const shouldUpdate = !current || current.id !== u.id || current.email !== u.email
          if (shouldUpdate) {
            useUIStore.getState().setCurrentUser(u)
          }
          try {
            // Aplicar atributos ABAC se estiverem disponíveis
            // import dinâmico para evitar bundling em contextos server
            const { applyAbacAttributes } = await import('@/lib/zustand/abac')
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            applyAbacAttributes(user.attributes)
          } catch (err) {
            // eslint-disable-next-line no-console
            console.debug('applyAbacAttributes: erro ou módulo não encontrado', err)
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.debug('HydrateCurrentUser: erro ao buscar sessão', err)
      }
    }

    fetchSession()
    return () => {
      mounted = false
    }
  }, [])

  return null
}
