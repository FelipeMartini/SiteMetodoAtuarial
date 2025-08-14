 'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/lib/zustand/hooks'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CustomButton } from '@/components/ui/button-custom'

/**
 * Componente ModeToggle para alternar entre temas claro/escuro/sistema
 * Customizado com design moderno e transições suaves
 */
export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Evita hidratação incorreta
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant='outline'
        size='icon'
        className='relative h-10 w-10 rounded-full border-2 border-muted-foreground/20 bg-background/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-accent hover:scale-105'
      >
        <Sun className='h-4 w-4' />
        <span className='sr-only'>Alternar tema</span>
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <CustomButton
          variant='glass'
          size='icon'
          className='relative border-2 border-muted-foreground/20 bg-background/80 backdrop-blur-sm hover:border-primary/50 hover:bg-accent hover:scale-105 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
          aria-label='Alternar tema'
        >
          <Sun className='h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Alternar tema</span>
        </CustomButton>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        fixed
        className='w-52 border-2 border-muted-foreground/10 bg-background/95 backdrop-blur-md shadow-xl'
      >
        <div className='flex flex-col gap-1'>
          <CustomButton
            variant={theme === 'light' ? 'glass' : 'ghost'}
            size='default'
            className='flex items-center gap-3 py-3 px-4 justify-start'
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
          >
            <Sun className='h-5 w-5' />
            <span className='font-medium'>Claro</span>
            {theme === 'light' && (
              <div className='ml-auto h-2 w-2 rounded-full bg-primary animate-pulse' />
            )}
          </CustomButton>
          <CustomButton
            variant={theme === 'dark' ? 'glass' : 'ghost'}
            size='default'
            className='flex items-center gap-3 py-3 px-4 justify-start'
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
          >
            <Moon className='h-5 w-5' />
            <span className='font-medium'>Escuro</span>
            {theme === 'dark' && (
              <div className='ml-auto h-2 w-2 rounded-full bg-primary animate-pulse' />
            )}
          </CustomButton>
          <CustomButton
            variant={theme === 'system' ? 'glass' : 'ghost'}
            size='default'
            className='flex items-center gap-3 py-3 px-4 justify-start'
            onClick={() => setTheme('system')}
            aria-pressed={theme === 'system'}
          >
            <Monitor className='h-5 w-5' />
            <span className='font-medium'>Sistema</span>
            {theme === 'system' && (
              <div className='ml-auto h-2 w-2 rounded-full bg-primary animate-pulse' />
            )}
          </CustomButton>
        </div>
      </PopoverContent>
    </Popover>
  )
}
