'use client'
export const dynamic = 'force-dynamic'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import { checkClientPermission } from '@/lib/abac/client'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminLayout } from '@/components/admin-layout'
import DashboardAdmin from '@/app/area-cliente/DashboardAdmin'

const PageDashboardAdmin: React.FC = () => {
  const { data: session, status } = useAuth()
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true)

  // Verificar permissões ABAC para admin dashboard
  useEffect(() => {
    let mounted = true
    const checkAdminAccess = async () => {
      if (!session?.user?.id) {
        if (mounted) setIsCheckingAccess(false)
        return
      }

      try {
        const allowed = await checkClientPermission(
          session.user.email,
          'admin:dashboard',
          'read'
        )
        if (mounted) setHasAdminAccess(prev => (prev === allowed ? prev : allowed))
      } catch (error) {
        console.error('Erro ao verificar permissões ABAC:', error)
        if (mounted) setHasAdminAccess(false)
      } finally {
        if (mounted) setIsCheckingAccess(false)
      }
    }

    checkAdminAccess()
    return () => {
      mounted = false
    }
  }, [session])

  if (status === 'loading' || isCheckingAccess) {
    return (
      <AdminLayout>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
          <Skeleton className='h-[32px] w-[320px] mb-6' />
          <Skeleton className='h-[48px] w-full mb-2' />
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className='h-[40px] w-full mb-2' />
          ))}
        </div>
      </AdminLayout>
    )
  }
  if (!session?.user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    return null
  }

  // Verificar se o usuário tem permissões de admin via ABAC
  if (!hasAdminAccess) {
    if (typeof window !== 'undefined') {
      window.alert('Acesso restrito: apenas para administradores.')
      window.location.href = '/area-cliente'
    }
    return null
  }

  return (
    <AdminLayout>
      <DashboardAdmin />
    </AdminLayout>
  )
}

export default PageDashboardAdmin
