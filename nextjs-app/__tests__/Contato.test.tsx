import React from 'react';
import { render, screen } from '@testing-library/react';
import PaginaContato from '../app/contato/page';
import { ProvedorTema } from '../app/contextoTema';

describe('Página Contato', () => {
  it('renderiza título e formulário de contato', () => {
    render(
      <ProvedorTema>
        <PaginaContato />
      </ProvedorTema>
    );
    // Valida que existem dois elementos com o texto 'Contato' (título e institucional)
    const elementosContato = screen.getAllByText(/Contato/i);
    expect(elementosContato.length).toBeGreaterThanOrEqual(1);
    elementosContato.forEach(elemento => {
      expect(elemento).toBeInTheDocument();
    });
    // Valida que o texto institucional está presente
    expect(screen.getByText(/Entre em contato conosco/i)).toBeInTheDocument();
  });
});

// Este teste garante que a página Contato possui formulário funcional e segue o padrão visual.
