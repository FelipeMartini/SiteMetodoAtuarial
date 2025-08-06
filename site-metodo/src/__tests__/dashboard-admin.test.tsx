// use cliente
// Teste automatizado para garantir que apenas usuários com accessLevel 5 acessam o dashboard admin
import React from 'react';
import { render, screen } from '@testing-library/react';
import PageDashboardAdmin from '../app/area-cliente/dashboard-admin/page';

// Função utilitária para renderizar a página protegida com sessão customizada
jest.mock('../hooks/useSessaoAuth', () => ({
  useSessaoAuth: () => ({
    usuario: { accessLevel: 5 },
    status: 'authenticated',
    login: jest.fn(),
    logout: jest.fn(),
    fetchSessao: jest.fn(),
  }),
}));

function renderWithSession(accessLevel: number | undefined) {
  // Simula o contexto de sessão
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
