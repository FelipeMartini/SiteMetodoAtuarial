import { coresCustomizadas } from '../app/temas';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { ProvedorTema } from '../app/contextoTema';

describe('Home', () => {
  it('renderiza título e botões principais', () => {
    render(
      <ProvedorTema>
        <Home />
      </ProvedorTema>
    );
    expect(screen.getByText('Método Atuarial')).toBeInTheDocument();
    expect(screen.getByText('Solicitar Orçamento')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
  });

  it('aplica cor do tema corretamente', () => {
    render(
      <ProvedorTema>
        <Home />
      </ProvedorTema>
    );
    const titulo = screen.getByText('Método Atuarial');
    // Valida se o título possui a cor de destaque do tema aplicado
    // Valida se o título possui a cor de destaque do tema aplicado
    const style = window.getComputedStyle(titulo);
    expect(style.color).toBe('rgb(81, 45, 168)');
  });
});
