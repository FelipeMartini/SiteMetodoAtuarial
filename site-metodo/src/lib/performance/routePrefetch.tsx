/**
 * Sistema de pré-carregamento de rotas
 * Melhora navegação através de prefetch inteligente
 */

import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState, useCallback, memo } from 'react'

// === INTERFACES ===

// Interface para Network Connection API
interface NetworkConnection {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g'
  saveData?: boolean
  downlink?: number
  rtt?: number
  addEventListener?: (event: string, handler: () => void) => void
  removeEventListener?: (event: string, handler: () => void) => void
}

// Props para SmartLink com extensibilidade
interface SmartLinkProps extends React.ComponentProps<typeof Link> {
  href: string
  children: React.ReactNode
  prefetchStrategy?: 'immediate' | 'hover' | 'visible' | 'none'
  className?: string
}

// === CONFIGURAÇÕES DE PREFETCH ===

/**
 * Rotas críticas que devem ser sempre pré-carregadas
 */
export const CRITICAL_ROUTES = ['/', '/auth/login', '/dashboard', '/perfil'] as const

/**
 * Rotas baseadas em role que devem ser pré-carregadas condicionalmente
 */
export const ROLE_BASED_ROUTES = {
  ADMIN: ['/admin/dashboard', '/admin/usuarios', '/admin/auditoria', '/admin/configuracoes'],
  MODERATOR: ['/moderador/dashboard', '/moderador/usuarios', '/moderador/relatorios'],
  USER: ['/usuario/dashboard', '/usuario/calculadoras', '/usuario/historico'],
  GUEST: ['/publico/sobre', '/publico/calculadoras', '/auth/registro'],
} as const

/**
 * Configuração de prefetch por tipo de rota
 */
export const PREFETCH_CONFIG = {
  immediate: {
    priority: 'high' as const,
    delay: 0,
  },
  onHover: {
    priority: 'low' as const,
    delay: 100, // 100ms delay para evitar prefetch desnecessário
  },
  onVisible: {
    priority: 'low' as const,
    delay: 200,
  },
  background: {
    priority: 'low' as const,
    delay: 2000, // 2 segundos após load
  },
} as const

// === HOOKS CUSTOMIZADOS ===

/**
 * Hook para prefetch inteligente baseado no role do usuário
 */
export function useSmartPrefetch(userRole?: string) {
  const router = useRouter()

  useEffect(() => {
    if (!userRole) return

    // Prefetch rotas críticas imediatamente
    CRITICAL_ROUTES.forEach(route => {
      router.prefetch(route)
    })

    // Prefetch rotas baseadas em role com delay
    setTimeout(() => {
      const roleRoutes = ROLE_BASED_ROUTES[userRole as keyof typeof ROLE_BASED_ROUTES]
      if (roleRoutes) {
        roleRoutes.forEach((route: string) => {
          router.prefetch(route)
        })
      }
    }, PREFETCH_CONFIG.background.delay)
  }, [userRole, router])

  return {
    prefetchRoute: useCallback(
      (route: string) => {
        router.prefetch(route)
      },
      [router]
    ),
  }
}

/**
 * Hook para prefetch baseado em hover
 */
export function useHoverPrefetch() {
  const router = useRouter()
  const [prefetchedRoutes, setPrefetchedRoutes] = useState<Set<string>>(new Set())

  const handleHover = useCallback(
    (route: string) => {
      if (prefetchedRoutes.has(route)) return

      setTimeout(() => {
        router.prefetch(route)
        setPrefetchedRoutes(prev => new Set([...prev, route]))
      }, PREFETCH_CONFIG.onHover.delay)
    },
    [router, prefetchedRoutes]
  )

  return { handleHover }
}

/**
 * Hook para prefetch baseado em visibilidade
 */
export function useVisibilityPrefetch(route: string) {
  const router = useRouter()
  const [hasPrefetched, setHasPrefetched] = useState(false)

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (!node || hasPrefetched) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              router.prefetch(route)
              setHasPrefetched(true)
            }, PREFETCH_CONFIG.onVisible.delay)
            observer.disconnect()
          }
        },
        {
          rootMargin: '100px', // Prefetch quando elemento está 100px de aparecer
          threshold: 0.1,
        }
      )

      observer.observe(node)
      return () => observer.disconnect()
    },
    [route, router, hasPrefetched]
  )

  return { ref }
}

// === COMPONENTES OTIMIZADOS ===

/**
 * Link inteligente com prefetch otimizado
 */
export const SmartLink = memo<SmartLinkProps>(({
  href,
  children,
  prefetchStrategy = 'hover',
  ...linkProps
}) => {
  const { handleHover } = useHoverPrefetch()
  const { ref } = useVisibilityPrefetch(href)

  const finalLinkProps: React.ComponentProps<typeof Link> = {
    href,
    ...linkProps,
  }

  // Configurar prefetch baseado na estratégia
  switch (prefetchStrategy) {
    case 'immediate':
      finalLinkProps.prefetch = true
      break
    case 'hover':
      finalLinkProps.onMouseEnter = () => handleHover(href)
      finalLinkProps.prefetch = false
      break
    case 'visible':
      finalLinkProps.ref = ref
      finalLinkProps.prefetch = false
      break
    case 'none':
      finalLinkProps.prefetch = false
      break
  }

  return <Link {...finalLinkProps}>{children}</Link>
})

SmartLink.displayName = 'SmartLink'

/**
 * Navegação com prefetch inteligente
 */
interface SmartNavigationProps {
  userRole?: string
  className?: string
}

export const SmartNavigation = memo(function SmartNavigation({
  userRole,
  className = '',
}: SmartNavigationProps) {
  useSmartPrefetch(userRole)

  const navigationItems = [
    { href: '/', label: 'Início', strategy: 'immediate' as const },
    { href: '/dashboard', label: 'Dashboard', strategy: 'hover' as const },
    { href: '/perfil', label: 'Perfil', strategy: 'hover' as const },
  ]

  // Adicionar itens baseados em role
  if (userRole === 'ADMIN') {
    navigationItems.push(
      { href: '/admin/dashboard', label: 'Admin', strategy: 'hover' as const },
      { href: '/admin/usuarios', label: 'Usuários', strategy: 'hover' as const }
    )
  }

  return (
    <nav className={`space-x-4 ${className}`}>
      {navigationItems.map(({ href, label, strategy }) => (
        <SmartLink
          key={href}
          href={href}
          prefetchStrategy={strategy}
          className='hover:text-blue-600 transition-colors'
        >
          {label}
        </SmartLink>
      ))}
    </nav>
  )
})

// === UTILITÁRIOS ===

/**
 * Prefetch manual de rota com retry
 */
export async function prefetchWithRetry(
  router: Record<string, unknown>,
  route: string,
  maxRetries = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await (router as { prefetch: (route: string) => Promise<void> }).prefetch(route)
      return true
    } catch {
      console.warn(`Prefetch failed for ${route}, attempt ${attempt}:`)
      if (attempt === maxRetries) {
        return false
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }

  return false
}

/**
 * Análise de rota para determinar prioridade de prefetch
 */
export function getRoutePriority(route: string, userRole?: string): 'high' | 'medium' | 'low' {
  // Rotas críticas têm prioridade alta
  const criticalRoutes = CRITICAL_ROUTES as readonly string[]
  if (criticalRoutes.includes(route)) {
    return 'high'
  }

  // Rotas baseadas em role têm prioridade média
  if (userRole) {
    switch (userRole) {
      case 'ADMIN':
        if (ROLE_BASED_ROUTES.ADMIN.includes(route as typeof ROLE_BASED_ROUTES.ADMIN[number])) return 'medium'
        break
      case 'MODERATOR':
        if (ROLE_BASED_ROUTES.MODERATOR.includes(route as typeof ROLE_BASED_ROUTES.MODERATOR[number])) return 'medium'
        break
      case 'USER':
        if (ROLE_BASED_ROUTES.USER.includes(route as typeof ROLE_BASED_ROUTES.USER[number])) return 'medium'
        break
      case 'GUEST':
        if (ROLE_BASED_ROUTES.GUEST.includes(route as typeof ROLE_BASED_ROUTES.GUEST[number])) return 'medium'
        break
    }
  }

  // Outras rotas têm prioridade baixa
  return 'low'
}

/**
 * Prefetch em batch com priorização
 */
export async function batchPrefetch(
  router: Record<string, unknown>,
  routes: string[],
  userRole?: string
): Promise<void> {
  // Separar rotas por prioridade
  const routesByPriority = routes.reduce(
    (acc, route) => {
      const priority = getRoutePriority(route, userRole)
      if (!acc[priority]) acc[priority] = []
      acc[priority].push(route)
      return acc
    },
    {} as Record<string, string[]>
  )

  // Prefetch em ordem de prioridade
  for (const priority of ['high', 'medium', 'low'] as const) {
    const routesToPrefetch = routesByPriority[priority] || []

    // Prefetch em paralelo dentro da mesma prioridade
  await Promise.allSettled(routesToPrefetch.map((route: string) => prefetchWithRetry(router, route)))

    // Pequeno delay entre prioridades
    if (routesToPrefetch.length > 0 && priority !== 'low') {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
}

/**
 * Detectar conexão lenta e ajustar prefetch
 */
export function useConnectionAwarePrefetch() {
  const [shouldPrefetch, setShouldPrefetch] = useState(true)

  useEffect(() => {
    if (!('connection' in navigator)) return

    const connection = (navigator as Navigator & { connection?: NetworkConnection }).connection

    if (!connection) return

    // Desabilitar prefetch em conexões lentas
    const isSlowConnection =
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData

    setShouldPrefetch(!isSlowConnection)

    const handleChange = () => {
      const isCurrentlySlow =
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.saveData

      setShouldPrefetch(!isCurrentlySlow)
    }

    connection.addEventListener('change', handleChange)
    return () => connection.removeEventListener('change', handleChange)
  }, [])

  return shouldPrefetch
}
