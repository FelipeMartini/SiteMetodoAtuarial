'use client';

/**
 * AuthGuard Component - Proteção de Rotas Baseada em Roles
 * 
 * Inspirado no FuseAuthorization do fuse-react, adaptado para Next.js
 * Protege rotas e componentes   ], [
    status,
    session,
    userRole,
    requiredRoles,
    pathname,
    navigate,
    loginRedirectUrl,
    unauthorizedRedirectUrl,
    noRedirect,
    onUnauthorized,
  ]);permissões do usuário
 */

import { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { hasPermission, isUserGuest } from '@/lib/auth/permissions';
import { UserRole } from '@/lib/auth/authRoles';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { auditLogger, AuditSeverity } from '@/lib/audit/auditLogger';
import { AuditAction } from '@prisma/client';

interface AuthGuardProps {
  /**
   * Componentes filhos a serem protegidos
   */
  children: ReactNode;
  
  /**
   * Roles necessários para acessar o recurso
   * - null/undefined: acesso público (sem restrições)
   * - []: apenas guests (usuários não autenticados)
   * - ['admin']: apenas administradores
   * - ['admin', 'staff']: administradores ou staff
   */
  requiredRoles?: string[] | string | null;
  
  /**
   * URL para redirecionamento quando não autenticado
   * @default '/auth/login'
   */
  loginRedirectUrl?: string;
  
  /**
   * URL para redirecionamento quando sem permissão
   * @default '/unauthorized'
   */
  unauthorizedRedirectUrl?: string;
  
  /**
   * Componente a ser exibido durante carregamento
   */
  fallback?: ReactNode;
  
  /**
   * Componente a ser exibido quando sem permissão
   */
  unauthorizedComponent?: ReactNode;
  
  /**
   * Se true, não faz redirecionamento automático
   * Apenas renderiza fallback ou unauthorizedComponent
   */
  noRedirect?: boolean;
  
  /**
   * Callback executado quando acesso é negado
   */
  onUnauthorized?: (reason: 'unauthenticated' | 'insufficient_permissions') => void;
}

/**
 * Estende o tipo User do NextAuth para incluir role
 */
interface ExtendedUser {
  role?: string[] | string | null;
}

/**
 * Componente para proteção de rotas e recursos baseado em roles
 */
export function AuthGuard({
  children,
  requiredRoles,
  loginRedirectUrl = '/auth/login',
  unauthorizedRedirectUrl = '/unauthorized',
  fallback,
  unauthorizedComponent,
  noRedirect = false,
  onUnauthorized,
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authReason, setAuthReason] = useState<'unauthenticated' | 'insufficient_permissions' | null>(null);

  // Obtém roles do usuário atual
  const userRole: UserRole = (session?.user as ExtendedUser)?.role || null;

  useEffect(() => {
    // Função para navegação (compatível com Next.js 15)
    const navigate = (url: string) => {
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    };

    // Ainda carregando sessão
    if (status === 'loading') {
      setIsAuthorized(null);
      return;
    }

    // Caminhos que devem ser ignorados pela verificação
    const ignoredPaths = [
      '/',
      '/api',
      '/auth/login',
      '/auth/register',
      '/auth/error',
      '/unauthorized',
      '/404',
      '/500',
    ];

    // Se o path atual está na lista de ignorados, permite acesso
    if (pathname && ignoredPaths.some(path => pathname.startsWith(path))) {
      setIsAuthorized(true);
      return;
    }

    // Verifica permissões
    const hasRequiredPermission = hasPermission(requiredRoles, userRole);
    const isGuest = isUserGuest(userRole);

    // Se tem permissão, autoriza e registra acesso
    if (hasRequiredPermission) {
      setIsAuthorized(true);
      setAuthReason(null);
      
      // Log de acesso autorizado (apenas para rotas protegidas)
      if (requiredRoles && requiredRoles.length > 0) {
        auditLogger.log({
          action: AuditAction.LOGIN_SUCCESS, // Usando como proxy para access granted
          severity: AuditSeverity.LOW,
          userId: session?.user?.id || 'unknown',
          userEmail: session?.user?.email || undefined,
          userRole,
          description: `Access granted to resource: ${pathname}`,
          target: pathname || 'unknown',
          success: true,
        }).catch(error => console.error('Audit log error:', error));
      }
      
      return;
    }

    // Não tem permissão - determina o motivo
    let reason: 'unauthenticated' | 'insufficient_permissions';
    
    if (isGuest) {
      // Usuário não autenticado
      reason = 'unauthenticated';
    } else {
      // Usuário autenticado mas sem permissão suficiente
      reason = 'insufficient_permissions';
    }

    setIsAuthorized(false);
    setAuthReason(reason);
    
    // Log de acesso negado
    auditLogger.log({
      action: AuditAction.LOGIN_FAILED, // Usando como proxy para access denied
      severity: AuditSeverity.MEDIUM,
      userId: session?.user?.id,
      userEmail: session?.user?.email || undefined,
      userRole,
      description: `Access denied to resource: ${pathname}`,
      target: pathname || 'unknown',
      metadata: {
        requiredRoles,
        userRole,
        reason,
      },
      success: false,
    }).catch(error => console.error('Audit log error:', error));
    
    // Chama callback se fornecido
    if (onUnauthorized) {
      onUnauthorized(reason);
    }

    // Faz redirecionamento se habilitado
    if (!noRedirect && pathname) {
      const redirectUrl = reason === 'unauthenticated' 
        ? `${loginRedirectUrl}?callbackUrl=${encodeURIComponent(pathname)}`
        : unauthorizedRedirectUrl;
      
      setTimeout(() => navigate(redirectUrl), 100);
    }
  }, [
    status,
    session,
    userRole,
    requiredRoles,
    pathname,
    loginRedirectUrl,
    unauthorizedRedirectUrl,
    noRedirect,
    onUnauthorized,
  ]);

  // Exibe loading durante verificação
  if (isAuthorized === null) {
    return fallback || <LoadingSpinner className="h-8 w-8 mx-auto mt-8" />;
  }

  // Acesso autorizado
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Acesso negado - exibe componente customizado ou loading
  if (unauthorizedComponent) {
    return <>{unauthorizedComponent}</>;
  }

  // Se noRedirect, exibe fallback
  if (noRedirect) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {authReason === 'unauthenticated' 
              ? 'Acesso Negado' 
              : 'Permissões Insuficientes'
            }
          </h2>
          <p className="text-gray-600">
            {authReason === 'unauthenticated'
              ? 'Você precisa estar logado para acessar este recurso.'
              : 'Você não tem permissões suficientes para acessar este recurso.'
            }
          </p>
        </div>
      </div>
    );
  }

  // Exibe loading durante redirecionamento
  return fallback || <LoadingSpinner className="h-8 w-8 mx-auto mt-8" />;
}

/**
 * Hook para verificar permissões sem renderização condicional
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const userRole: UserRole = (session?.user as ExtendedUser)?.role || null;

  return {
    session,
    status,
    user: session?.user || null,
    userRole,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isGuest: isUserGuest(userRole),
    
    /**
     * Verifica se o usuário tem permissão para um recurso
     */
    hasPermission: (requiredRoles: string[] | string | null | undefined) =>
      hasPermission(requiredRoles, userRole),
    
    /**
     * Verifica se o usuário tem pelo menos uma das roles
     */
    hasAnyRole: (roles: string[]) =>
      hasPermission(roles, userRole),
    
    /**
     * Verifica se o usuário tem role específica
     */
    hasRole: (role: string) =>
      hasPermission([role], userRole),
  };
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
  );

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default AuthGuard;
