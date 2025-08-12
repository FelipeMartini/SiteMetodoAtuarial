'use client'

/**
 * AuthGuard Component - Proteção de Rotas Baseada em ABAC (Attribute-Based Access Control)
 *
 * Adaptado para usar sistema ABAC puro, removendo dependências de roles
 * Protege rotas e componentes baseado em atributos do usuário
 */

import { ReactNode, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { auditLogger, AuditSeverity } from '@/lib/audit/auditLogger'
import { AuditAction } from '@prisma/client'

interface AuthGuardProps {
  /**
   * Componentes filhos a serem protegidos
   */
  children: ReactNode

  /**
   * Recursos ou ações necessários para acessar o recurso
   * - null/undefined: acesso público (sem restrições)
   * - 'admin': recurso de administração
   * - 'moderation': recurso de moderação
   * - 'authenticated': apenas usuários autenticados
   */
  requiredResource?: string | null

  /**
   * Ação a ser verificada no contexto ABAC
   */
  action?: string

  /**
   * URL para redirecionamento quando não autenticado
   * @default '/auth/signin'
   */
  loginRedirectUrl?: string

  /**
   * URL para redirecionamento quando sem permissão
   * @default '/auth/error?error=InsufficientPrivileges'
   */
  unauthorizedRedirectUrl?: string

  /**
   * Componente a ser exibido durante carregamento
   */
  fallback?: ReactNode

  /**
   * Componente a ser exibido quando sem permissão
   */
  unauthorizedComponent?: ReactNode

  /**
   * Se true, não faz redirecionamento automático
   * Apenas renderiza fallback ou unauthorizedComponent
   */
  noRedirect?: boolean

  /**
   * Callback executado quando acesso é negado
   */
  onUnauthorized?: (reason: 'unauthenticated' | 'insufficient_permissions') => void
}

/**
 * Verificação ABAC simplificada para AuthGuard
 */
function checkABACAuthorization(
  user: { isActive?: boolean; email?: string | null; name?: string | null; id?: string } | undefined,
  // _action: string = 'access', - parâmetro removido pois não é utilizado
  resource: string | null = null
): boolean {
  try {
    // Usuário não autenticado
    if (!user) {
      return resource === null // Só permite se for recurso público
    }

    // Verificar se usuário está ativo
    if (!user.isActive) {
      return false
    }

    // Recurso público - sempre permitir para usuários autenticados
    if (!resource || resource === 'authenticated') {
      return true
    }

    // Lógica específica para recursos
    if (resource === 'admin') {
      // Admin requer atributos específicos
      return (
        user.email?.includes('@admin') || user.name?.includes('Admin') || user.id === 'admin-user'
      )
    }

    if (resource === 'moderation') {
      // Moderação requer verificação de atributos de moderador
      return (
        user.email?.includes('@mod') || user.name?.includes('Mod') || user.email?.includes('@admin')
      )
    }

    // Para outros recursos, verificar se está autenticado e ativo
    return true
  } catch (error: unknown) {
    console.error('ABAC Authorization Error:', String(_error))
    return false
  }
}
export function AuthGuard({
  children,
  requiredResource,
  action = 'access',
  loginRedirectUrl = '/auth/signin',
  unauthorizedRedirectUrl = '/auth/error?error=InsufficientPrivileges',
  fallback,
  unauthorizedComponent,
  noRedirect = false,
  onUnauthorized,
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [authReason, setAuthReason] = useState<
    'unauthenticated' | 'insufficient_permissions' | null
  >(null)

  useEffect(() => {
    // Função para navegação (compatível com Next.js 15)
    const navigate = (url: string) => {
      if (typeof window !== 'undefined') {
        window.location.href = url
      }
    }

    // Ainda carregando sessão
    if (status === 'loading') {
      setIsAuthorized(null)
      return
    }

    // Caminhos que devem ser ignorados pela verificação
    const ignoredPaths = [
      '/',
      '/api',
      '/auth/signin',
      '/auth/signup',
      '/auth/error',
      '/unauthorized',
      '/404',
      '/500',
    ]

    // Se o path atual está na lista de ignorados, permite acesso
    if (pathname && ignoredPaths.some(path => pathname.startsWith(path))) {
      setIsAuthorized(true)
      return
    }

    // Verifica permissões usando ABAC
    const hasAccess = checkABACAuthorization(session?.user, action, requiredResource)

    // Se tem permissão, autoriza e registra acesso
    if (hasAccess) {
      setIsAuthorized(true)
      setAuthReason(null)

      // Log de acesso autorizado (apenas para recursos protegidos)
      if (requiredResource && requiredResource !== 'authenticated') {
        auditLogger
          .log({
            action: AuditAction.LOGIN_SUCCESS, // Usando como proxy para access granted
            severity: AuditSeverity.LOW,
            userId: session?.user?.id || 'unknown',
            userEmail: session?.user?.email || undefined,
            description: `ABAC access granted to resource: ${pathname}`,
            target: pathname || 'unknown',
            metadata: {
              resource: requiredResource,
              action,
              authMethod: 'ABAC',
            },
            success: true,
          })
          .catch(error => console.error('Audit log error:', String(_error)))
      }

      return
    }

    // Não tem permissão - determina o motivo
    const reason: 'unauthenticated' | 'insufficient_permissions' = !session?.user
      ? 'unauthenticated'
      : 'insufficient_permissions'

    setIsAuthorized(false)
    setAuthReason(reason)

    // Log de acesso negado
    auditLogger
      .log({
        action: AuditAction.LOGIN_FAILED, // Usando como proxy para access denied
        severity: AuditSeverity.MEDIUM,
        userId: session?.user?.id,
        userEmail: session?.user?.email || undefined,
        description: `ABAC access denied to resource: ${pathname}`,
        target: pathname || 'unknown',
        metadata: {
          resource: requiredResource,
          action,
          reason,
          authMethod: 'ABAC',
        },
        success: false,
      })
      .catch(error => console.error('Audit log error:', String(_error)))

    // Chama callback se fornecido
    if (onUnauthorized) {
      onUnauthorized(reason)
    }

    // Faz redirecionamento se habilitado
    if (!noRedirect && pathname) {
      const redirectUrl =
        reason === 'unauthenticated'
          ? `${loginRedirectUrl}?callbackUrl=${encodeURIComponent(pathname)}`
          : unauthorizedRedirectUrl

      setTimeout(() => navigate(redirectUrl), 100)
    }
  }, [
    status,
    session,
    requiredResource,
    action,
    pathname,
    loginRedirectUrl,
    unauthorizedRedirectUrl,
    noRedirect,
    onUnauthorized,
  ])

  // Exibe loading durante verificação
  if (isAuthorized === null) {
    return fallback || <LoadingSpinner className='h-8 w-8 mx-auto mt-8' />
  }

  // Acesso autorizado
  if (isAuthorized) {
    return <>{children}</>
  }

  // Acesso negado - exibe componente customizado ou loading
  if (unauthorizedComponent) {
    return <>{unauthorizedComponent}</>
  }

  // Se noRedirect, exibe fallback
  if (noRedirect) {
    return (
      <div className='flex flex-col items-center justify-center min-h-64 p-8'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            {authReason === 'unauthenticated' ? 'Acesso Negado' : 'Permissões Insuficientes'}
          </h2>
          <p className='text-gray-600'>
            {authReason === 'unauthenticated'
              ? 'Você precisa estar logado para acessar este recurso.'
              : 'Você não tem permissões suficientes para acessar este recurso.'}
          </p>
        </div>
      </div>
    )
  }

  // Exibe loading durante redirecionamento
  return fallback || <LoadingSpinner className='h-8 w-8 mx-auto mt-8' />
}

/**
 * Hook para verificar permissões sem renderização condicional
 */
export function useAuth() {
  const { data: session, status } = useSession()

  return {
    session,
    status,
    user: session?.user || null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isGuest: !session?.user,

    /**
     * Verifica se o usuário tem permissão para um recurso usando ABAC
     */
    hasPermission: (resource: string | null = null, action: string = 'access') =>
      checkABACAuthorization(session?.user, action, resource),

    /**
     * Verifica se o usuário tem acesso a recurso de administração
     */
    isAdmin: () => checkABACAuthorization(session?.user, 'access', 'admin'),

    /**
     * Verifica se o usuário tem acesso a recurso de moderação
     */
    isModerator: () => checkABACAuthorization(session?.user, 'moderate', 'moderation'),
  }
}

/**
 * HOC para proteger páginas inteiras
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  const WrappedComponent = (props: P) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  )

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`

  return WrappedComponent
}

export default AuthGuard
