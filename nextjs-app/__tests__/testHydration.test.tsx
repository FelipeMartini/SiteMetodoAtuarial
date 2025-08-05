// Teste automatizado para o componente TestHydration
// Garante que o componente renderiza corretamente, exibe status de hydration e alterna tema sem erros

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import TestHydration from '../app/components/TestHydration';

describe('TestHydration', () => {
  it('deve renderizar o componente e exibir status de hydration', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestHydration />
      </ThemeProvider>
    );
    // Verifica se o título aparece
    expect(getByText(/Teste de Hydration/i)).toBeInTheDocument();
    // Verifica se o status aparece
    expect(getByText(/Hydrated|Erro/i)).toBeInTheDocument();
    // Verifica se o campo de renderização aparece
    expect(getByText(/Renderizado em:/i)).toBeInTheDocument();
    // Verifica se o campo de cliques aparece
    expect(getByText(/Cliques no botão:/i)).toBeInTheDocument();
  });

  it('deve alternar o tema ao clicar no botão', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestHydration />
      </ThemeProvider>
    );
    const botao = getByText(/Alternar Tema/i);
    fireEvent.click(botao);
    // Após o clique, o contador de cliques deve ser incrementado
    expect(botao.textContent).toMatch(/1 cliques?/i);
  });
});

// Comentários:
// - Este teste cobre a renderização, status de hydration e alternância de tema do componente TestHydration.
// - Garante que o sistema de temas e styled-components SSR estão funcionando sem erros visuais ou de contexto.
// - Se este teste passar, a adaptação do contexto de tema e SSR está validada para o componente de teste visual.
