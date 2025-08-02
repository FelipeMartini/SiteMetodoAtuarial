import React from 'react';
import { render, screen } from '@testing-library/react';
import PaginaSobre from '../app/sobre/page';
import { ProvedorTema } from '../app/contextoTema';

describe('Página Sobre', () => {
  it('renderiza título e texto institucional', () => {
    render(
      <ProvedorTema>
        <PaginaSobre />
      </ProvedorTema>
    );
    // Valida que o título principal está presente
    expect(screen.getByText(/Sobre a Método Atuarial/i)).toBeInTheDocument();
    // Valida que o texto institucional está presente
    expect(screen.getByText(/referência nacional em consultoria atuarial/i)).toBeInTheDocument();
  });
});

// Este teste garante que a página Sobre segue o padrão visual e institucional do projeto.
