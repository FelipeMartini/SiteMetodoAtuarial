// ...existing code...
// Página de contato adaptada para alternância de tema
"use client";
// Página de contato adaptada para alternância de tema
import React from 'react';
import { useTema } from '../contextoTema';
import { coresCustomizadas } from '../temas';

export default function Contato() {
  const { temaAtual } = useTema();
  const cores = coresCustomizadas[temaAtual];
  return (
    <main style={{ background: cores.rodape, color: cores.rodapeTexto, minHeight: '100vh', padding: 32 }}>
      <h1>Contato</h1>
      <p>Entre em contato conosco!</p>
    </main>
  );
}
