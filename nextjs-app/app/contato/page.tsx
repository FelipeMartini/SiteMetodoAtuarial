// ...existing code...
// Página de contato adaptada para alternância de tema
"use client";
// Página de contato adaptada para alternância de tema
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { InputTexto, Botao } from '../design-system';
import { useTema } from '../contextoTema';
import { coresCustomizadas } from '../temas';

export default function Contato() {
  const { temaAtual } = useTema();
  const cores = coresCustomizadas[temaAtual];
  return (
    <ErrorBoundary>
      <main style={{ background: cores.rodape, color: cores.rodapeTexto, minHeight: '100vh', padding: 32 }}>
        <h1>Contato</h1>
        <p>Entre em contato conosco!</p>
        {/* Formulário de contato padronizado com InputTexto e Botao do design system */}
        <form style={{ maxWidth: 400, margin: '32px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Campo Nome: id único para acessibilidade, props inválidas removidas */}
          <InputTexto label="Nome" id="contato-nome" required />
          {/* Campo Email: id único para acessibilidade, props inválidas removidas */}
          <InputTexto label="Email" id="contato-email" type="email" required />
          {/* Campo Mensagem: id único para acessibilidade, props inválidas removidas */}
          <InputTexto label="Mensagem" id="contato-mensagem" required />
          {/* Botão de envio, props de MUI removidas */}
          <Botao type="submit" color="primary">Enviar</Botao>
        </form>
      </main>
    </ErrorBoundary>
  );
}
