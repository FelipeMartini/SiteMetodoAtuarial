'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface UsuariosTableFiltersProps {
  filtro: string
  onFiltroChange: (valor: string) => void
  onLimpar: () => void
}

export default function UsuariosTableFilters({
  filtro,
  onFiltroChange,
  onLimpar,
}: UsuariosTableFiltersProps) {
  return (
    <div className='flex flex-col sm:flex-row gap-2 items-center mb-4'>
      <Input
        type='text'
        placeholder='Buscar por nome ou e-mail...'
        value={filtro}
        onChange={e => onFiltroChange(e.target.value)}
        className='max-w-xs'
        aria-label='Buscar usuário'
      />
      <Button variant='outline' size='sm' onClick={onLimpar} className='ml-0 sm:ml-2'>
        Limpar
      </Button>
    </div>
  )
}
