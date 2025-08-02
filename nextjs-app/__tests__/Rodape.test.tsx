import React from 'react';
import { render, screen } from '@testing-library/react';
import Rodape from '../app/Rodape';
import { ProvedorTema } from '../app/contextoTema';

describe('Rodape', () => {
  it('renderiza informações institucionais', () => {
    render(
      <ProvedorTema>
        <Rodape />
      </ProvedorTema>
    );
    // Valida que existe pelo menos um elemento com texto institucional do Rodapé
    expect(screen.getAllByText(/Consultoria Atuarial Inovadora/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/SBS - Quadra 02 - Bloco S - Sala 601 - Brasília\/DF/i)).toBeInTheDocument();
    expect(screen.getByText(/contato@consultoriaexemplo.com \| \(61\) 3322-0068/i)).toBeInTheDocument();
    // Busca os ícones sociais pelo atributo aria-label
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
  });
});
