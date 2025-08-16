import { auth } from '@/lib/auth'
import { serverCheckPermissionDetailed } from '@/lib/abac/server'

export default async function ABACPageServer() {
  const session = await auth()
  if (!session?.user?.email) {
    return new Response(null, { status: 302, headers: { Location: '/login' } })
  }

  const authResult = await serverCheckPermissionDetailed(session.user.email, 'admin:abac', 'read')
  if (!authResult.allowed) {
    return new Response(null, { status: 302, headers: { Location: '/unauthorized' } })
  }

  const { default: ABACClient } = await import('./page-client')
  const ABACClientComp = ABACClient
  return (
    <ABACClientComp />
  )
}
/*
  O resto do arquivo contia a versão client-side do admin ABAC com JSX e
  hooks. Foi comentado temporariamente para resolver um erro de sintaxe
  enquanto priorizamos correções transversais (logging, validação, etc).
  Se precisar restaurar a UI, recompor a partir do arquivo original ou mover
  para `page-client.tsx` e importar dinamicamente.
*/
