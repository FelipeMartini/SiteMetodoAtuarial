'use client'
export const dynamic = 'force-dynamic'

import React from 'react'

import { useAuth } from '@/hooks/useAuth'
// import { useRouter } from 'next/navigation';
import AreaClienteConteudo from '@/app/area-cliente/AreaClienteConteudo-moderno'

export default function AreaClientePage() {
  const { status } = useAuth()
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.replace('/login');
  //   }
  // }, [status, router]);

  if (status === 'loading') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '1.2rem',
        }}
      >
        Carregando...
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  // status === 'authenticated' e session existe
  return <AreaClienteConteudo />
}
