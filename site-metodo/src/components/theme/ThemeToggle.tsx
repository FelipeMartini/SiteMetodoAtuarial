'use client'

import * as React from 'react'
import { useTheme } from '@/lib/zustand/hooks'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button variant='outline' size='sm' onClick={() => (toggleTheme ? toggleTheme() : undefined)}>
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  )
}
