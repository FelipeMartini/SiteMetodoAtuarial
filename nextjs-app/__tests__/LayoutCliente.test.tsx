import React from 'react';
import { render, screen } from '@testing-library/react';
import LayoutCliente from '../app/LayoutCliente';

describe('LayoutCliente', () => {
  it('renderiza AppBar e navegação', () => {
    render(<LayoutCliente><div>Conteúdo</div></LayoutCliente>);
    expect(screen.getByText('Método Atuarial')).toBeInTheDocument();
    // Valida que todos os textos de navegação aparecem pelo menos uma vez (AppBar ou Rodapé)
    expect(screen.getAllByText('Início').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sobre').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Serviços').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Orçamento').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Área do Cliente').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Contato').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Login / Cadastro').length).toBeGreaterThanOrEqual(1);
  });

  it('renderiza o conteúdo passado como children', () => {
    render(<LayoutCliente><div>Conteúdo Teste</div></LayoutCliente>);
    expect(screen.getByText('Conteúdo Teste')).toBeInTheDocument();
  });
});
