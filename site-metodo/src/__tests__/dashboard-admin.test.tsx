// use cliente
// Teste automatizado para garantir que apenas usuários com accessLevel 5 acessam o dashboard admin
import React from 'react';
import { render, screen } from '@testing-library/react';
import PageDashboardAdmin from '../app/area-cliente/dashboard-admin/page';

// Função utilitária para renderizar a página protegida com sessão customizada
import * as useSessaoAuthModule from '../hooks/useSessaoAuth';
import { useSessaoAuth } from '../hooks/useSessaoAuth';


function renderWithSession(accessLevel: number | undefined) {
  jest.spyOn(useSessaoAuthModule, 'useSessaoAuth').mockReturnValue({
    usuario: accessLevel !== undefined ? { accessLevel } : undefined,
    status: 'authenticated',
    login: jest.fn(),
    logout: jest.fn(),
    fetchSessao: jest.fn(),
  } as ReturnType<typeof useSessaoAuth>);
  return render(<PageDashboardAdmin />);
}

describe('DashboardAdmin - Permissões de acesso', () => {
  it('exibe dashboard para accessLevel 5', () => {
    renderWithSession(5);
    expect(screen.getByText(/manutenção de usuários/i)).toBeInTheDocument();
  });

  it('não exibe dashboard para accessLevel 1', () => {
    renderWithSession(1);
    expect(screen.getByText(/acesso restrito/i)).toBeInTheDocument();
  });

  it('não exibe dashboard para accessLevel indefinido', () => {
    renderWithSession(undefined);
    expect(screen.getByText(/acesso restrito/i)).toBeInTheDocument();
  });
});

// Comentários:
// - Este teste cobre o acesso ao dashboard admin baseado no accessLevel do usuário.
// - Garante que apenas accessLevel 5 visualiza o dashboard.
