/**
 * SocialLoginBox - ESTRATÉGIA HÍBRIDA Auth.js v5
 * Versão migrada para Tailwind CSS + shadcn/ui
 * Sistema de login social completo com design moderno e responsivo
 * Atualizado para os 5 provedores OAuth: Google, Microsoft, Discord, Facebook, Apple
 */
'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

// Função helper para redirecionar via Auth.js v5 handler
function loginSocial(provider: string) {
  window.location.href = `/api/auth/signin/${provider}`
}

interface ProviderInfo {
  id: string
  name?: string
  type?: string
}

// Tipagem das props do componente
interface SocialLoginBoxProps {
  className?: string
  /** Exibe ou oculta o título principal */
  showTitle?: boolean
}

// Componente principal migrado para Tailwind + shadcn/ui
const SocialLoginBox: React.FC<SocialLoginBoxProps> = ({ className, showTitle = true }) => {
  const [providers, setProviders] = useState<ProviderInfo[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch('/api/auth/providers')
      .then(r => r.json() as Promise<Record<string, ProviderInfo>>)
      .then(data => {
        if (!active) return
        // data é um objeto chave->definição; transformamos em array
        const arr: ProviderInfo[] = Object.keys(data || {}).map(k => {
          const prov = (data?.[k] || {}) as ProviderInfo
          const clone: ProviderInfo = { ...prov, id: k }
          return clone
        })
        setProviders(arr)
      })
      .catch(() => {
        if (active) setProviders([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const isAvailable = (id: string) => providers?.some(p => p.id === id)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-4 p-6',
        'bg-card text-card-foreground rounded-lg border border-border shadow-sm',
        className
      )}
    >
      {showTitle && (
        <h3 className='text-lg font-semibold text-foreground text-center mb-2'>
          Entrar com suas redes sociais
        </h3>
      )}

      {/* Container dos botões de login social - 5 PROVEDORES OAUTH MODERNOS */}
      <div className='grid grid-cols-1 gap-3 w-full'>
        {loading && (
          <p className='text-sm text-muted-foreground text-center'>Carregando provedores...</p>
        )}

        {/* Botão Google */}
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200'
          onClick={() => loginSocial('google')}
          aria-label='Entrar com Google'
          disabled={!isAvailable('google')}
          title={!isAvailable('google') ? 'Google não configurado' : undefined}
        >
          <svg className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='#4285f4'
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            />
            <path
              fill='#34a853'
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            />
            <path
              fill='#fbbc05'
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            />
            <path
              fill='#ea4335'
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            />
          </svg>
          <span>Continuar com Google</span>
        </Button>

        {/* Botão Microsoft */}
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200'
          onClick={() => loginSocial('microsoft-entra-id')}
          aria-label='Entrar com Microsoft'
          disabled={!isAvailable('microsoft-entra-id')}
          title={!isAvailable('microsoft-entra-id') ? 'Microsoft não configurado' : undefined}
        >
          <svg className='w-5 h-5' fill='#00a4ef' viewBox='0 0 24 24'>
            <path d='M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z' />
          </svg>
          <span>Continuar com Microsoft</span>
        </Button>

        {/* Botão Discord */}
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200'
          onClick={() => loginSocial('discord')}
          aria-label='Entrar com Discord'
          disabled={!isAvailable('discord')}
          title={!isAvailable('discord') ? 'Discord não configurado' : undefined}
        >
          <svg className='w-5 h-5' fill='#5865f2' viewBox='0 0 24 24'>
            <path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z' />
          </svg>
          <span>Continuar com Discord</span>
        </Button>

        {/* Botão Facebook */}
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200'
          onClick={() => loginSocial('facebook')}
          aria-label='Entrar com Facebook'
          disabled={!isAvailable('facebook')}
          title={!isAvailable('facebook') ? 'Facebook não configurado' : undefined}
        >
          <svg className='w-5 h-5' fill='#1877f2' viewBox='0 0 24 24'>
            <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
          </svg>
          <span>Continuar com Facebook</span>
        </Button>

        {/* Botão Apple */}
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200'
          onClick={() => loginSocial('apple')}
          aria-label='Entrar com Apple'
          disabled={!isAvailable('apple')}
          title={!isAvailable('apple') ? 'Apple não configurado' : undefined}
        >
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701' />
          </svg>
          <span>Continuar com Apple</span>
        </Button>
      </div>

      {/* Texto informativo */}
      <p className='text-xs text-muted-foreground text-center mt-4 leading-relaxed'>
        Conecte-se rapidamente com sua conta favorita
      </p>
    </div>
  )
}

export default SocialLoginBox
