"use client";


// Lazy loading do componente de Serviços para otimizar performance
import React, { Suspense } from 'react';
const Servicos = React.lazy(() => import('../components/Servicos'));

export default function Page() {
  // Suspense exibe fallback enquanto o componente é carregado
  return (
    <Suspense fallback={<div>Carregando serviços...</div>}>
      <Servicos />
    </Suspense>
  );
}
