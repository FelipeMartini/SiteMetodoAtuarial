'use client';

import React from 'react';
import { useSessaoAuth } from '../../hooks/useSessaoAuth';
import { redirect } from 'next/navigation';
import AreaClienteConteudo from './AreaClienteConteudo';

export default function AreaClientePage() {
  const { usuario, status } = useSessaoAuth();

  if (status === 'loading') {
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

  if (!usuario) {
    redirect('/login');
  }

  return <AreaClienteConteudo usuario={usuario} />;
}
