// Teste de fumaça: verifica se o site carrega sem erros
import React from 'react';
import { render } from '@testing-library/react';
import Home from '../app/page';
import { ThemeProvider } from '../app/contexts/ThemeContext';

describe('Smoke Test', () => {
  it('deve renderizar a página inicial sem erros', () => {
    const { getByText } = render(
      <ProvedorTema>
        <Home />
      </ProvedorTema>
    );
    // Verifica se o título principal aparece
    expect(getByText(/Método Atuarial/i)).toBeInTheDocument();
  });
});
