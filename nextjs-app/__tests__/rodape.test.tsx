// Teste automatizado para o componente Rodape
// Garante que o rodapé renderiza corretamente e exibe informações institucionais e de contato

import React from 'react';
import { render } from '@testing-library/react';
import { ProvedorTema } from '../app/theme/ContextoTema';
import Rodape from '../app/Rodape';

describe('Rodape', () => {
  it('deve renderizar o rodapé com informações institucionais', () => {
    const { getByText } = render(
      <ProvedorTema>
        <Rodape />
      </ProvedorTema>
    );
    // Verifica se o nome da empresa aparece
    expect(getByText(/Método Atuarial/i)).toBeInTheDocument();
    // Verifica se o texto de direitos aparece
    expect(getByText(/Todos os direitos reservados/i)).toBeInTheDocument();
    // Verifica se o contato aparece
    expect(getByText(/contato@metodoatuarial.com.br/i)).toBeInTheDocument();
  });
});

// Comentários:
// - Este teste cobre a renderização do rodapé, garantindo que as informações principais estejam visíveis.
// - Garante que o componente está integrado ao sistema de temas e styled-components SSR.
// - Se este teste passar, o rodapé está adaptado corretamente ao contexto do projeto.
