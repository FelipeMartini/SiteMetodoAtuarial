import { auth } from '@/lib/auth'
import { serverCheckPermissionDetailed } from '@/lib/abac/server'
import { AdminLayout } from '@/components/admin-layout'
import DashboardAdmin from '@/app/area-cliente/DashboardAdmin'
import { ABACProtectedPage } from '@/lib/abac/hoc'

export const dynamic = 'force-dynamic'

export default async function PageDashboardAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    // Not authenticated -> server redirect to login
    return new Response(null, { status: 302, headers: { Location: '/login' } })
  }

  const authResult = await serverCheckPermissionDetailed(session.user.email, 'admin:dashboard', 'read', { ip: 'server' })
  if (!authResult.allowed) {
    // Server-side redirect to unauthorized page
    return new Response(null, { status: 302, headers: { Location: '/unauthorized' } })
  }

  return (
    <AdminLayout>
      <ABACProtectedPage serverAuthResult={authResult} object={'admin:dashboard'} action={'read'}>
        <DashboardAdmin />
      </ABACProtectedPage>
    </AdminLayout>
  )
}
