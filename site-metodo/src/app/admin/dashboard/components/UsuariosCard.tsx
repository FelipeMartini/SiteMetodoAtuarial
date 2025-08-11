'use client'
import { CardMetrica } from './CardMetrica'
import { useUsuarios } from '../hooks/useUsuarios'
import { UserIcon } from 'lucide-react'

export function UsuariosCard() {
  const { data, isLoading } = useUsuarios()
  return (
    <CardMetrica
      titulo='Usuários'
      valor={isLoading ? '...' : (data?.length ?? 0)}
      icone={<UserIcon className='text-primary' />}
      className='bg-gradient-to-br from-primary/90 to-background/80'
    />
  )
}
