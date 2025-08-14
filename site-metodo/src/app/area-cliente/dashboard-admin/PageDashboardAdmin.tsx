'use client'
export const dynamic = 'force-dynamic'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminLayout } from '@/components/admin-layout'
import DashboardAdmin from '@/app/area-cliente/DashboardAdmin'

const PageDashboardAdmin: React.FC = () => {
  const { data: session, status } = useAuth()
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true)

  // Verificar permissões ABAC para admin dashboard
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user?.id) {
        setIsCheckingAccess(false)
        return
      }

      try {
        // Verificar se o usuário tem acesso ao admin dashboard via ABAC
        const response = await fetch('/api/abac/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Usar apenas o email como subject (padronizar)
            subject: session.user.email,
            object: 'admin:dashboard',
            action: 'read',
            context: {
              time: new Date().toISOString(),
              location: session.user.location || 'unknown',
              department: session.user.department || 'unknown'
            }
          })
        })

        if (response.ok) {
          const result = await response.json()
          setHasAdminAccess(result.allowed)
        } else {
          setHasAdminAccess(false)
        }
      } catch (error) {
        console.error('Erro ao verificar permissões ABAC:', error)
        setHasAdminAccess(false)
      } finally {
        setIsCheckingAccess(false)
      }
    }

    checkAdminAccess()
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
