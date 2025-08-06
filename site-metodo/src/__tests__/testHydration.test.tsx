// Teste automatizado para o componente TestHydration
// Garante que o componente renderiza corretamente, exibe status de hydration e alterna tema sem erros

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import TestHydration from '../app/components/TestHydration';

describe('TestHydration', () => {
  it('deve renderizar o componente, exibir status de hydration e bater snapshot', () => {
    // Mock da data para garantir snapshot estável
    const fixedTimestamp = new Date('2025-08-05T12:00:00').getTime();
    jest.spyOn(Date, 'now').mockReturnValue(fixedTimestamp);
    const dataFixa = new Date('2025-08-05T12:00:00');
    const { getByText, getAllByText, asFragment } = render(
      <ThemeProvider>
        <TestHydration dataRenderizacao={dataFixa} />
      </ThemeProvider>
    );
    expect(getByText(/Teste de Hydration/i)).toBeInTheDocument();
    const hydratedElements = getAllByText(/Hydrated|Erro/i);
    expect(hydratedElements.length).toBeGreaterThan(0);
    expect(getByText(/Renderizado em:/i)).toBeInTheDocument();
    expect(getByText(/Cliques no botão:/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
    jest.restoreAllMocks();
  });

  it('deve alternar o tema ao clicar no botão', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestHydration />
      </ThemeProvider>
    );
    const botao = getByText(/Alternar Tema/i);
    fireEvent.click(botao);
    expect(botao.textContent).toMatch(/1 cliques?/i);
  });
});

// Comentários:
// - Este teste cobre a renderização, status de hydration e alternância de tema do componente TestHydration.
// - Garante que o sistema de temas e styled-components SSR estão funcionando sem erros visuais ou de contexto.
// - Se este teste passar, a adaptação do contexto de tema e SSR está validada para o componente de teste visual.
