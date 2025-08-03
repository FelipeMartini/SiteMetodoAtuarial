afterEach(() => {
  jest.restoreAllMocks();
});


// Mock da função signOut do NextAuth para evitar fetch real e erro de URL relativa nos testes
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signOut: jest.fn(),
}));

// Mock global de fetch para evitar qualquer chamada real durante os testes
global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  status: 200,
  statusText: 'OK',
  headers: new Headers(),
  redirected: false,
  type: 'basic',
  url: '',
  clone: () => ({} as Response),
  body: null,
  bodyUsed: false,
  arrayBuffer: async () => new ArrayBuffer(0),
  blob: async () => new Blob(),
  formData: async () => new FormData(),
  json: async () => ({}),
  text: async () => '',
} as Response));
// Comentário: Mock de fetch garante que qualquer chamada feita por dependências (como NextAuth) não cause erro de URL relativa.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import LayoutCliente from '../app/LayoutCliente';

describe('LayoutCliente', () => {

  it('renderiza navegação correta para usuário autenticado', () => {
    // Mocka useSession para simular usuário autenticado
    jest.spyOn(require('next-auth/react'), 'useSession').mockReturnValue({ status: 'authenticated' });
    render(
      <SessionProvider>
        <LayoutCliente><div>Conteúdo</div></LayoutCliente>
      </SessionProvider>
    );
    expect(screen.getByText('Método Atuarial')).toBeInTheDocument();
    expect(screen.getAllByText('Início').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Área do Cliente').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Contato').length).toBeGreaterThanOrEqual(1);
    // Para autenticado, o botão 'Login / Cadastro' não deve aparecer
    expect(screen.queryByText('Login / Cadastro')).toBeNull();
    // Para autenticado, o botão 'Sair' deve aparecer
    expect(screen.getAllByText('Sair').length).toBeGreaterThanOrEqual(1);
  });

  it('renderiza navegação correta para usuário deslogado', () => {
    // Mocka useSession para simular usuário deslogado
    jest.spyOn(require('next-auth/react'), 'useSession').mockReturnValue({ status: 'unauthenticated' });
    render(
      <SessionProvider>
        <LayoutCliente><div>Conteúdo</div></LayoutCliente>
      </SessionProvider>
    );
    expect(screen.getByText('Método Atuarial')).toBeInTheDocument();
    expect(screen.getAllByText('Início').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Contato').length).toBeGreaterThanOrEqual(1);
    // Para deslogado, o botão 'Área do Cliente' não deve aparecer
    expect(screen.queryByText('Área do Cliente')).toBeNull();
    // Para deslogado, o botão 'Sair' não deve aparecer
    expect(screen.queryByText('Sair')).toBeNull();
    // Para deslogado, o botão 'Login / Cadastro' deve aparecer
    expect(screen.getAllByText('Login / Cadastro').length).toBeGreaterThanOrEqual(1);
  });

  it('renderiza o conteúdo passado como children', () => {
    render(
      <SessionProvider>
        <LayoutCliente><div>Conteúdo Teste</div></LayoutCliente>
      </SessionProvider>
    );
    expect(screen.getByText('Conteúdo Teste')).toBeInTheDocument();
  });
});
