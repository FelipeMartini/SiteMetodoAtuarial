'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Previne hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='w-9 h-9'>
        <div className='w-5 h-5' />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Button
        variant='ghost'
        size='icon'
        aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className='w-9 h-9 transition-colors'
      >
        <motion.span
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className='flex items-center justify-center'
        >
          {isDark ? (
            <svg
              width='20'
              height='20'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='text-yellow-500'
            >
              <path
                d='M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71m16.97 0l-.71-.71M4.05 4.93l-.71-.71M21 12h-1M4 12H3'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <circle
                cx='12'
                cy='12'
                r='5'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          ) : (
            <svg
              width='20'
              height='20'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='text-slate-600 dark:text-slate-300'
            >
              <path
                d='M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </motion.span>
      </Button>
    </motion.div>
  )
}
