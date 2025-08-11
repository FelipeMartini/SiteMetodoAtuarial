'use client'

// Substitua ModeToggle por ThemeToggle para dark mode acessível
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MainNavigation } from '@/components/ui/main-navigation'
import { MobileNav } from '@/components/ui/mobile-nav'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

/**
 * Header customizado com sistema de temas e navegação avançada
 * Baseado nos padrões do fuse-react adaptado para shadcn/ui
 */
export function Header() {
  const { data: session, status } = useAuth()

  // Logout usando next-auth
  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: '/',
        redirect: true,
      })
    } catch (_error) {
      console.error('Erro no logout:', String(error))
      // Fallback caso dê erro
      window.location.href = '/'
    }
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between px-4 md:px-6'>
        {/* Menu Mobile + Logo */}
        <div className='flex items-center gap-3'>
          {/* Menu Mobile - apenas em mobile */}
          <div className='lg:hidden'>
            <MobileNav session={session} onLogout={handleLogout} />
          </div>

          {/* Logo */}
          <Link
            href='/'
            className='flex items-center space-x-2 transition-opacity hover:opacity-80'
          >
            <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
              <span className='text-sm font-bold text-primary-foreground'>MA</span>
            </div>
            <span className='font-bold text-lg text-gradient'>Método Atuarial</span>
          </Link>

          {/* Navegação principal - apenas em desktop */}
          <div className='hidden lg:block ml-8'>
            <MainNavigation />
          </div>
        </div>

        {/* Ações do usuário */}
        <div className='flex items-center gap-3'>
          {/* Área de usuário */}
          {status === 'loading' ? (
            <Button variant='ghost' size='sm' disabled>
              ...
            </Button>
          ) : session?.user ? (
            <div className='flex items-center gap-3'>
              <Link href='/area-cliente' className='hidden md:inline-flex'>
                <Button variant='secondary' size='sm'>
                  Área Cliente
                </Button>
              </Link>
              {/* Exibe Dashboard Admin só para roles admin ou staff */}
              {(session.user.role?.includes('admin') || session.user.role?.includes('staff')) && (
                <Link href='/area-cliente/dashboard-admin' className='hidden md:inline-flex'>
                  <Button variant='destructive' size='sm'>
                    Dashboard Admin
                  </Button>
                </Link>
              )}
              <span className='hidden md:inline text-sm text-muted-foreground'>
                Olá, {session.user.name || session.user.email}
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleLogout}
                className='hidden md:inline-flex'
              >
                Sair
              </Button>
            </div>
          ) : (
            <>
              <Link href='/login' className='hidden md:inline-flex'>
                <Button variant='ghost' size='sm'>
                  Entrar
                </Button>
              </Link>
              <Link href='/criar-conta' className='hidden sm:inline-flex'>
                <Button size='sm' variant='default'>
                  Criar Conta
                </Button>
              </Link>
            </>
          )}

          {/* Alternância de tema acessível */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
