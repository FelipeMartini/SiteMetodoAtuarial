'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { checkClientPermission } from './client'
// import { AuthorizationError } from './types';

/**
 * Higher-Order Components for ABAC protection
 */

export interface WithABACOptions {
  requiredAction?: string
  resource?: string
  roles?: string[]
  redirectTo?: string
  fallback?: React.ComponentType
  onUnauthorized?: () => void
}

/**
 * HOC that protects components with ABAC authorization
 */
export function withABAC<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options: WithABACOptions = {}
) {
  const {
    requiredAction = 'read',
    resource,
    roles = [],
    redirectTo = '/unauthorized',
    fallback: Fallback,
    onUnauthorized,
  } = options

  return function ProtectedComponent(props: T) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      async function checkAuthorization() {
        if (status === 'loading') return

        if (!session?.user?.email) {
          setIsAuthorized(false)
          setIsLoading(false)
          return
        }

        try {
          // If specific roles are required, check them first
          if (roles.length > 0) {
            const userRole = (session.user as { role?: string }).role || 'user'
            if (!roles.includes(userRole)) {
              setIsAuthorized(false)
              setIsLoading(false)
              return
            }
          }

          // Check ABAC permissions
          const currentResource = resource || window.location.pathname
          const hasPermission = await checkClientPermission(
            session.user.email,
            currentResource,
            requiredAction
          )

          setIsAuthorized(hasPermission)
        } catch (_error) {
          console.error('Authorization check failed:', String(_error))
          setIsAuthorized(false)
        } finally {
          setIsLoading(false)
        }
      }

      checkAuthorization()
    }, [session, status])

    useEffect(() => {
      if (isAuthorized === false && !isLoading) {
        if (onUnauthorized) {
          onUnauthorized()
        } else if (redirectTo) {
          router.push(redirectTo)
        }
      }
    }, [isAuthorized, isLoading, router])

    // Show loading state
    if (isLoading || status === 'loading') {
      return <LoadingComponent />
    }

    // Show unauthorized state
    if (isAuthorized === false) {
      if (Fallback) {
        return <Fallback />
      }
      return <UnauthorizedComponent />
    }

    // Render protected component
    return <WrappedComponent {...props} />
  }
}

/**
 * Hook for checking permissions in components
 */
export function usePermission(resource: string, action: string = 'read') {
  const { data: session } = useSession()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      if (!session?.user?.email) {
        setHasPermission(false)
        setIsLoading(false)
        return
      }

      try {
        const result = await checkClientPermission(session.user.email, resource, action)
        setHasPermission(result)
      } catch (_error) {
        console.error('Permission check error:', String(_error))
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [session, resource, action])

  return { hasPermission, isLoading }
}

/**
 * Component for conditional rendering based on permissions
 */
export function PermissionGate({
  resource,
  action = 'read',
  roles = [],
  children,
  fallback = null,
  loading = <LoadingComponent />,
}: {
  resource: string
  action?: string
  roles?: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
  loading?: React.ReactNode
}) {
  const { data: session } = useSession()
  const { hasPermission, isLoading } = usePermission(resource, action)

  if (isLoading) {
    return <>{loading}</>
  }

  if (!session?.user) {
    return <>{fallback}</>
  }

  // Check roles if specified
  if (roles.length > 0) {
    const userRole = (session.user as { role?: string }).role || 'user'
    if (!roles.includes(userRole)) {
      return <>{fallback}</>
    }
  }

  // Check ABAC permissions
  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Hook for checking if user has specific role
 */
export function useRole() {
  const { data: session } = useSession()

  const hasRole = (role: string): boolean => {
    if (!session?.user) return false
    const userRole = (session.user as { role?: string }).role || 'user'
    return userRole === role
  }

  const hasAnyRole = (roles: string[]): boolean => {
    if (!session?.user) return false
    const userRole = (session.user as { role?: string }).role || 'user'
    return roles.includes(userRole)
  }

  const isAdmin = (): boolean => hasRole('admin')
  const isModerator = (): boolean => hasRole('moderator')
  const isUser = (): boolean => hasRole('user')

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    isUser,
    role: (session?.user as { role?: string })?.role || 'guest',
  }
}

/**
 * Default loading component
 */
function LoadingComponent() {
  return (
    <div className='flex items-center justify-center min-h-[200px]'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      <span className='ml-2'>Verificando permissões...</span>
    </div>
  )
}

/**
 * Default unauthorized component
 */
function UnauthorizedComponent() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
      <div className='text-6xl'>🔒</div>
      <h1 className='text-2xl font-bold text-gray-900'>Acesso Negado</h1>
      <p className='text-gray-600 text-center max-w-md'>
        Você não tem permissão para acessar esta página. Entre em contato com o administrador se
        acredita que isso é um erro.
      </p>
      <button
        onClick={() => window.history.back()}
        className='px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors'
      >
        Voltar
      </button>
    </div>
  )
}

/**
 * Page-level protection wrapper
 */
export function ABACProtectedPage({
  children,
  requiredAction = 'read',
  resource,
  roles = [],
  redirectTo = '/unauthorized',
}: {
  children: React.ReactNode
  requiredAction?: string
  resource?: string
  roles?: string[]
  redirectTo?: string
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAuth() {
      if (status === 'loading') return

      if (!session?.user?.email) {
        router.push('/login')
        return
      }

      try {
        // Check roles
        if (roles.length > 0) {
          const userRole = (session.user as { role?: string }).role || 'user'
          if (!roles.includes(userRole)) {
            setIsAuthorized(false)
            return
          }
        }

        // Check ABAC permissions
        const currentResource = resource || window.location.pathname
        const hasPermission = await checkClientPermission(
          session.user.email,
          currentResource,
          requiredAction
        )

        setIsAuthorized(hasPermission)
      } catch (_error) {
        console.error('Authorization failed:', String(_error))
        setIsAuthorized(false)
      }
    }

    checkAuth()
  }, [session, status, resource, requiredAction, roles, router])

  useEffect(() => {
    if (isAuthorized === false) {
      router.push(redirectTo)
    }
  }, [isAuthorized, router, redirectTo])

  if (status === 'loading' || isAuthorized === null) {
    return <LoadingComponent />
  }

  if (isAuthorized === false) {
    return null // Will redirect
  }

  return <>{children}</>
}
