// ...existing code...
"use client";
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useTema } from '../contextoTema';
import { coresCustomizadas } from '../temas';

export default function Orcamento() {
  const { temaAtual } = useTema();
  const cores = coresCustomizadas[temaAtual];
  return (
    <ErrorBoundary>
      <main style={{ background: cores.card, color: cores.destaqueTexto, minHeight: '100vh', padding: 32 }}>
        <h1>Orçamento</h1>
        <p>Solicite seu orçamento personalizado!</p>
      </main>
    </ErrorBoundary>
  );
}
