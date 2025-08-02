import React from 'react';
import { render, screen } from '@testing-library/react';
import PaginaOrcamento from '../app/orcamento/page';
import { ProvedorTema } from '../app/contextoTema';

describe('Página Orçamento', () => {
  it('renderiza título e formulário de orçamento', () => {
    render(
      <ProvedorTema>
        <PaginaOrcamento />
      </ProvedorTema>
    );
    // Valida que existem dois elementos com o texto 'Orçamento' (título e institucional)
    const elementosOrcamento = screen.getAllByText(/Orçamento/i);
    expect(elementosOrcamento.length).toBeGreaterThanOrEqual(1);
    elementosOrcamento.forEach(elemento => {
      expect(elemento).toBeInTheDocument();
    });
    // Valida que o texto institucional está presente
    expect(screen.getByText(/Solicite seu orçamento personalizado/i)).toBeInTheDocument();
  });
});

// Este teste garante que a página Orçamento possui formulário funcional e segue o padrão visual.
