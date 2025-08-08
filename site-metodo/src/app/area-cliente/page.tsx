'use client';

import React from 'react';
import { useSessaoAuth } from '@/hooks/useSessaoAuth';
import { redirect } from 'next/navigation';
import AreaClienteConteudo from '@/app/area-cliente/AreaClienteConteudo';

export default function AreaClientePage() {
  const { usuario, status } = useSessaoAuth();

  if (status === 'loading' || status === 'idle') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '1.2rem'
      }}>
        Carregando...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login');
    return null;
  }

  // status === 'authenticated' e usuario existe
  return <AreaClienteConteudo usuario={usuario} />;
}
