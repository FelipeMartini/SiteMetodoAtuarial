'use client'
export const dynamic = 'force-dynamic'

import React from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminLayout } from '@/components/admin-layout'
import DashboardAdmin from '@/app/area-cliente/DashboardAdmin'

const PageDashboardAdmin: React.FC = () => {
  const { data: session, status } = useAuth()
  if (status === 'loading') {
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
  const userRole = session.user.role
  const userAccessLevel = session.user.accessLevel
  let isAdmin = false
  let isStaff = false
  if (Array.isArray(userRole)) {
    isAdmin = userRole.includes('admin')
    isStaff = userRole.includes('staff')
  } else if (typeof userRole === 'string') {
    isAdmin = userRole === 'admin'
    isStaff = userRole === 'staff'
  }
  if (!isAdmin && !isStaff && userAccessLevel) {
    isAdmin = userAccessLevel >= 100
    isStaff = userAccessLevel >= 50
  }
  if (!(isAdmin || isStaff)) {
    if (typeof window !== 'undefined') {
      window.alert('Acesso restrito: apenas para administradores e staff.')
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
