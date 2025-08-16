/**
 * Configuração de lazy loading para componentes pesados
 * Otimiza a performance carregando apenas quando necessário
 */

import React, { lazy } from 'react'

// Componentes da área administrativa (carregamento sob demanda)
export const AdminUsersTable = lazy(() =>
  import('@/components/admin/users-table').then(module => ({ default: module.AdminUsersTable }))
)

export const AdminDashboard = lazy(() => import('@/app/admin/dashboard/page'))

// Componentes de cálculos atuariais (pesados)
export const CalculosAtuariais = lazy(() => import('@/app/area-cliente/calculos-atuariais/page'))

// Componentes de auditoria
export const AuditoriaPage = lazy(() => import('@/app/admin/auditoria/page'))

// Componente de ABAC admin (client-side) - precisa apontar para o arquivo client
// Garantimos retorno no formato { default: Component } para satisfazer React.lazy
export const ABACAdmin = lazy(() => import('@/app/admin/abac/page-client').then(m => ({ default: m.default })))

// Componentes de dashboard do usuário
export const DashboardAdmin = lazy(() => import('@/app/area-cliente/dashboard-admin/page'))

// Componente de perfil moderno (componente complexo)
export const PerfilUsuarioModerno = lazy(() => import('@/components/ui/perfil-usuario-moderno'))

/**
 * HOC para wrapping de componentes lazy com loading state
 */
export function withLazyLoading<T extends Record<string, unknown>>(
  Component: React.LazyExoticComponent<React.ComponentType<T>>,
  fallback?: React.ReactNode
) {
  return function LazyWrapper(props: T) {
    return (
      <React.Suspense
        fallback={
          fallback || (
            <div className='flex items-center justify-center p-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            </div>
          )
        }
      >
        <Component {...props} />
      </React.Suspense>
    )
  }
}

/**
 * Componentes otimizados com lazy loading + loading state
 */
export const LazyAdminUsersTable = withLazyLoading(AdminUsersTable)
export const LazyAdminDashboard = withLazyLoading(AdminDashboard)
export const LazyCalculosAtuariais = withLazyLoading(CalculosAtuariais)
export const LazyAuditoriaPage = withLazyLoading(AuditoriaPage)
export const LazyABACAdmin = withLazyLoading(ABACAdmin)
export const LazyDashboardAdmin = withLazyLoading(DashboardAdmin)
export const LazyPerfilUsuarioModerno = withLazyLoading(PerfilUsuarioModerno)
