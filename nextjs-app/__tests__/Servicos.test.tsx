import React from 'react';
import { render, screen } from '@testing-library/react';
import PaginaServicos from '../app/servicos/page';
import { ProvedorTema } from '../app/contextoTema';

describe('Página Serviços', () => {
  it('renderiza título e lista de serviços', () => {
    render(
      <ProvedorTema>
        <PaginaServicos />
      </ProvedorTema>
    );
    // Valida que o título principal está presente
    expect(screen.getByText(/Serviços Atuariais/i)).toBeInTheDocument();
    // Valida que pelo menos um serviço está listado
    expect(screen.getByText(/Consultoria Atuarial/i)).toBeInTheDocument();
  });
});

// Este teste garante que a página Serviços segue o padrão visual e lista os serviços corretamente.
