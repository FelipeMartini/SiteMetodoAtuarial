'use client'
export const dynamic = 'force-dynamic'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { ClientOnly } from '@/components/util/ClientOnly'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert } from '@/components/ui/alert'

/**
 * Página de perfil do usuário: dados pessoais, preferências, alteração de senha
 */
export default function ClientePerfil() {
  return (
    <ClientOnly>
      <ClientePerfilContent />
    </ClientOnly>
  )
}

function ClientePerfilContent() {
  const { data, isLoading, error } = useCurrentUser()
  const user = data?.user

  if (isLoading) {
    return <Skeleton className='h-32 w-full' />
  }
  if (error) {
    return <Alert variant='destructive'>Erro ao carregar usuário: {String(_error)}</Alert>
  }
  if (!user) {
    return <Alert variant='default'>Usuário não autenticado.</Alert>
  }

  return (
    <div className='space-y-6 max-w-xl'>
      <h1 className='text-2xl font-bold mb-4'>Perfil</h1>
      <Card className='p-6 space-y-4'>
        <div>
          <span className='font-semibold'>Nome:</span> {user.name || '-'}
        </div>
        <div>
          <span className='font-semibold'>Email:</span> {user.email}
        </div>
        {/* TODO: Preferências, alteração de senha, status de verificação */}
      </Card>
    </div>
  )
}
