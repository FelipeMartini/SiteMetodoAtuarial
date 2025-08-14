'use client'

import React from 'react'
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
