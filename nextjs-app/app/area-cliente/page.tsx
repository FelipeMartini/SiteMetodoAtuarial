'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import AreaClienteConteudo from './AreaClienteConteudo';

export default function AreaClientePage() {
  const { data: session, status } = useSession();

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

  if (!session) {
    redirect('/login');
  }

  return <AreaClienteConteudo usuario={session.user} />;
}
