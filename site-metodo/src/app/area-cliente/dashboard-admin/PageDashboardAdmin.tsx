import { auth } from '@/lib/auth'
import { serverCheckPermissionDetailed } from '@/lib/abac/server'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import DashboardAdmin from '@/app/area-cliente/DashboardAdmin'
import { ABACProtectedPage } from '@/lib/abac/hoc'

export const dynamic = 'force-dynamic'

export default async function PageDashboardAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    // Not authenticated -> server redirect to login
    redirect('/login')
  }

  const authResult = await serverCheckPermissionDetailed(session.user.email, 'admin:dashboard', 'read', { ip: 'server' })
  if (!authResult.allowed) {
    // Server-side redirect to unauthorized page
    redirect('/unauthorized')
  }

  return (
    <AdminLayout>
      <ABACProtectedPage serverAuthResult={authResult} object={'admin:dashboard'} action={'read'}>
        <DashboardAdmin />
      </ABACProtectedPage>
    </AdminLayout>
  )
}
