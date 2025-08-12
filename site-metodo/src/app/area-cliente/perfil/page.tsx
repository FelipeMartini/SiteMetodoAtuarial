'use client'
export const dynamic = 'force-dynamic'

import React from 'react'
import PerfilUsuarioModerno from '@/components/ui/perfil-usuario-moderno'

/**
 * Página de perfil modernizada do usuário
 * Exibe informações completas com design atualizado
 */
export default function PerfilPage() {
  return (
    <div className='container mx-auto py-8 px-4 max-w-6xl'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Meu Perfil</h1>
        <p className='text-muted-foreground'>
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      <PerfilUsuarioModerno />
    </div>
  )
}
