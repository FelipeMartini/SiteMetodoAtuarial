"use client"

import React, { useEffect } from 'react'
import useUIStore from '@/lib/zustand/uiStore'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggleZustand() {
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)

  return (
    <Button variant='ghost' size='icon' onClick={toggleTheme} aria-label='Alternar tema'>
      {theme === 'dark' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
    </Button>
  )
}

export default ThemeToggleZustand

// Hydrate currentUser on client mount
export function HydrateCurrentUser() {
  const setCurrentUser = useUIStore((s) => s.setCurrentUser)

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
          setCurrentUser({ id: String(user.id ?? user.sub ?? ''), email: String(user.email ?? '') })
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
  }, [setCurrentUser])

  return null
}
