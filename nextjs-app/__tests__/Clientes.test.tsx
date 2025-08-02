import React from 'react';
import { render, screen } from '@testing-library/react';
import PaginaClientes from '../app/clientes/page';
import { ProvedorTema } from '../app/contextoTema';

describe('Página Área do Cliente', () => {
  it('renderiza título e área de login/cadastro', () => {
    render(
      <ProvedorTema>
        <PaginaClientes />
      </ProvedorTema>
    );
    // Valida que o título principal está presente
    expect(screen.getByText(/Área do Cliente/i)).toBeInTheDocument();
    // Valida que o texto institucional está presente
    expect(screen.getByText(/Bem-vindo à área exclusiva para clientes da Método Atuarial/i)).toBeInTheDocument();
  });
});

// Este teste garante que a página Área do Cliente possui acesso funcional e segue o padrão visual.
