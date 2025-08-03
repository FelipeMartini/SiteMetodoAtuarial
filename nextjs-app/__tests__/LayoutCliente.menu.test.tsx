// Teste unitário para o menu condicional do LayoutCliente
import React from 'react';
import { render, screen } from '@testing-library/react';
import LayoutCliente from '../app/LayoutCliente';
import { ProvedorTema } from '../app/contextoTema';
import { SessionProvider } from 'next-auth/react';

describe('Menu condicional do LayoutCliente', () => {
  it('exibe Login/Cadastro para usuário deslogado', () => {
    render(
      <SessionProvider session={null}>
        <ProvedorTema>
          <LayoutCliente><div>Conteúdo</div></LayoutCliente>
        </ProvedorTema>
      </SessionProvider>
    );
    expect(screen.getByText('Login / Cadastro')).toBeInTheDocument();
    expect(screen.queryByText('Área do Cliente')).not.toBeInTheDocument();
    expect(screen.queryByText('Sair')).not.toBeInTheDocument();
  });

  it('exibe Área do Cliente e Sair para usuário autenticado', () => {
    const sessaoMock = {
      user: {
        name: 'Usuário Teste',
        email: 'teste@exemplo.com',
        image: 'https://via.placeholder.com/120'
      },
      expires: '2099-12-31T23:59:59.999Z', // Propriedade obrigatória para tipagem Session
    };
    render(
      <SessionProvider session={sessaoMock}>
        <ProvedorTema>
          <LayoutCliente><div>Conteúdo</div></LayoutCliente>
        </ProvedorTema>
      </SessionProvider>
    );
    expect(screen.getByText('Área do Cliente')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
    expect(screen.queryByText('Login / Cadastro')).not.toBeInTheDocument();
  });
});

// Comentário: Este teste garante que o menu principal exibe corretamente as opções de acordo com o estado de autenticação do usuário.
