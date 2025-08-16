import { auth } from '@/lib/auth'
import { serverCheckPermissionDetailed } from '@/lib/abac/server'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import DashboardAdmin from '@/app/area-cliente/DashboardAdmin'
import { ABACProtectedPage } from '@/lib/abac/hoc'

export const dynamic = 'force-dynamic'

/**
 * Página de dashboard administrativo (Server Component).
 * Contrato mínimo:
 * - Input: sessão do usuário via `auth()` (server)
 * - Output: renderiza conteúdos administrativos quando autorizado
 * - Erros/permissões: em caso de falha na checagem de permissão, realizamos
 *   um redirect server-side para `/unauthorized` (fail-closed)
 */
export default async function PageDashboardAdmin() {
  // 1) Autenticação (esperamos que `auth()` lance ou retorne sessão)
  let session
  try {
    session = await auth()
  } catch (err) {
    // Falha ao obter sessão -> redirecionar para login
    console.error('auth() failed in PageDashboardAdmin:', err)
    redirect('/login')
  }

  const email = session?.user?.email
  if (!email) {
    // Not authenticated -> server redirect to login (keep UX simple)
    redirect('/login')
  }

  // 2) Checagem ABAC server-side com tratamento de erros.
  // Fail-closed: qualquer erro aqui resulta em negação (redirect)
  let authResult
  try {
    authResult = await serverCheckPermissionDetailed(email, 'admin:dashboard', 'read', { ip: 'server' })
  } catch (err) {
    // Log detalhado para diagnóstico (XLOGS e/ou sistema de logs devem capturar)
    console.error('serverCheckPermissionDetailed failed for', { email }, err)
    // Em caso de erro ao verificar permissões, negar acesso por segurança
    redirect('/unauthorized')
  }

  if (!authResult?.allowed) {
    // Server-side redirect to unauthorized page
    redirect('/unauthorized')
  }

  // 3) Render seguro: passamos o resultado do server-side ao HOC client-side.
  return (
    <AdminLayout>
      <ABACProtectedPage serverAuthResult={authResult} object={'admin:dashboard'} action={'read'}>
        <DashboardAdmin />
      </ABACProtectedPage>
    </AdminLayout>
  )
}
