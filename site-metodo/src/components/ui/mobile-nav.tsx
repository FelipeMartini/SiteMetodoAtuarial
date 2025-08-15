'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Session } from 'next-auth'

import { cn } from '@/lib/utils'
import useUIStore from '@/lib/zustand/uiStore'
import { shallow } from 'zustand/shallow'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Menu,
  Users,
  Briefcase,
  Building,
  Info,
  Mail,
  LogIn,
  UserPlus,
  FileText,
  Home,
  BarChart3,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
  {
    title: 'Início',
    href: '/',
    icon: Home,
  },
  {
    title: 'Serviços',
    href: '/servicos',
    description: 'Nossos serviços especializados',
    icon: Briefcase,
  },
  {
    title: 'Cálculos',
    href: '/calculos-atuariais',
    description: 'Ferramenta de cálculos',
    icon: BarChart3,
  },
  {
    title: 'Soluções',
    href: '/solucoes',
    description: 'Soluções por segmento',
    icon: Building,
  },
  {
    title: 'Sobre Nós',
    href: '/sobre-nos',
    description: 'Nossa história e missão',
    icon: Users,
  },
  {
    title: 'Sobre',
    href: '/sobre',
    description: 'Conheça nossa empresa',
    icon: Info,
  },
  {
    title: 'Documentação',
    href: '/documentacao',
    description: 'APIs e guias técnicos',
    icon: FileText,
  },
  {
    title: 'Contato',
    href: '/contato',
    description: 'Entre em contato conosco',
    icon: Mail,
  },
]

interface MobileNavProps {
  session?: Session | null
  onLogout?: () => void
}

export function MobileNav({ session, onLogout }: MobileNavProps) {
  // Em desenvolvimento, opcionalmente use um fallback local para isolar problemas com a store
  const isDev = process.env.NODE_ENV === 'development'

  const [devOpen, setDevOpen] = React.useState(false)

  // Sempre chamar o hook para manter a ordem dos Hooks; depois aplicamos o fallback dev
  const store = useUIStore(
    (s: any) => ({
      mobileMenuOpen: s.mobileMenuOpen,
      setMobileMenuOpen: s.setMobileMenuOpen,
      toggleMobileMenu: s.toggleMobileMenu,
      allowedNavItems: s.allowedNavItems,
      hiddenNavItems: s.hiddenNavItems,
    }),
    shallow
  )

  const { mobileMenuOpen: open, setMobileMenuOpen, toggleMobileMenu } = isDev
    ? { mobileMenuOpen: devOpen, setMobileMenuOpen: (v: boolean) => setDevOpen(v), toggleMobileMenu: () => setDevOpen(o => !o) }
    : store

  // Selecionamos lista de navegação separadamente para reduzir re-renders quando abrir/fechar o menu
  const { allowedNavItems, hiddenNavItems } = isDev
    ? { allowedNavItems: undefined as string[] | undefined, hiddenNavItems: undefined as string[] | undefined }
    : { allowedNavItems: store.allowedNavItems, hiddenNavItems: store.hiddenNavItems }
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href) || false
  }

  // Aplica filtragem ABAC se disponível
  const filteredNavigation = React.useMemo(() => {
    let items = navigation
    if (allowedNavItems && allowedNavItems.length > 0) {
      const setAllowed = new Set(allowedNavItems)
      items = items.filter(i => setAllowed.has(i.href))
    }
    if (!allowedNavItems && hiddenNavItems && hiddenNavItems.length > 0) {
      const setHidden = new Set(hiddenNavItems)
      items = items.filter(i => !setHidden.has(i.href))
    }
    return items
  }, [allowedNavItems, hiddenNavItems])

  return (
    <Sheet open={open} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden'
          aria-label='Abrir menu'
          onClick={toggleMobileMenu}
        >
          <Menu className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-80 p-0'>
        <SheetHeader className='border-b p-6'>
          <div className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
              <span className='text-sm font-bold text-primary-foreground'>MA</span>
            </div>
            <SheetTitle className='text-left font-bold text-lg'>Método Atuarial</SheetTitle>
          </div>
        </SheetHeader>

        <div className='flex flex-col h-full'>
          {/* Navegação principal */}
          <nav className='flex-1 p-6'>
            <div className='space-y-1'>
      {filteredNavigation.map(item => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
        onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      isActive(item.href) && 'bg-accent text-accent-foreground'
                    )}
                  >
                    {Icon && <Icon className='h-4 w-4' />}
                    <div className='flex flex-col'>
                      <span>{item.title}</span>
                      {item.description && (
                        <span className='text-xs text-muted-foreground'>{item.description}</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Seção do usuário */}
          <div className='border-t p-6'>
            {session?.user ? (
              <div className='space-y-3'>
                <div className='text-sm font-medium'>
                  Olá, {session.user.name || session.user.email}
                </div>

                <div className='space-y-2'>
                  <Link href='/area-cliente' onClick={() => setMobileMenuOpen(false)}>
                    <Button variant='secondary' size='sm' className='w-full justify-start'>
                      <Users className='mr-2 h-4 w-4' />
                      Área Cliente
                    </Button>
                  </Link>

                  {/* TODO: Implementar verificação ABAC para Dashboard Admin */}
                  {/* Temporariamente comentado até implementar ABAC completo */}
                  {/* {(session.user.role?.includes('admin') ||
                    session.user.role?.includes('staff')) && ( */}
                    <Link href='/area-cliente/dashboard-admin' onClick={() => setMobileMenuOpen(false)}>
                      <Button variant='destructive' size='sm' className='w-full justify-start'>
                        <Building className='mr-2 h-4 w-4' />
                        Dashboard Admin
                      </Button>
                    </Link>
                  {/* )} */}

                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      onLogout?.()
                      setMobileMenuOpen(false)
                    }}
                    className='w-full justify-start'
                  >
                    Sair
                  </Button>
                </div>
              </div>
            ) : (
              <div className='space-y-2'>
                <Link href='/login' onClick={() => setMobileMenuOpen(false)}>
                  <Button variant='ghost' size='sm' className='w-full justify-start'>
                    <LogIn className='mr-2 h-4 w-4' />
                    Entrar
                  </Button>
                </Link>
                <Link href='/criar-conta' onClick={() => setMobileMenuOpen(false)}>
                  <Button size='sm' className='w-full justify-start'>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
