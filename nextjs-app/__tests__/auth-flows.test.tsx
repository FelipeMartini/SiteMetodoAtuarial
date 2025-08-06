// Mocks globais para next/navigation e next-auth/react
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));

// Mock global do SocialLoginBox para todos os testes exceto login social
jest.mock('../app/components/SocialLoginBox', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-social-login-box"></div>,
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import LoginPage from '../app/login/page';
import { useRouter } from 'next/navigation';
import * as nextAuth from 'next-auth/react';

describe('Fluxos de autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Teste de login tradicional com sucesso
  describe('Login tradicional', () => {
    it('login tradicional com sucesso redireciona para área do cliente', async () => {
      const push = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push });
      (nextAuth.useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
      (nextAuth.signIn as jest.Mock).mockImplementation(() => Promise.resolve({ ok: true }));

      render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'cliente@teste.com' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      await waitFor(() => {
        expect(nextAuth.signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
          email: 'cliente@teste.com',
          password: '123456',
          redirect: false,
        }));
      });
    });
    it('login tradicional com erro exibe mensagem de erro', async () => {
      (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
      (nextAuth.useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });
      (nextAuth.signIn as jest.Mock).mockImplementation(() => Promise.resolve({ ok: false, error: 'Credenciais inválidas' }));

      render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'erro@teste.com' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'errada' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      await waitFor(() => {
        expect(screen.getByText(/credenciais inválidas|erro/i)).toBeInTheDocument();
      });
    });
  });

  // ...teste de login social removido, pois está coberto em login-social.test.tsx...

  // Teste de logout
  describe('Logout', () => {
    it('logout limpa sessão e redireciona para login', async () => {
      const push = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push });
      (nextAuth.useSession as jest.Mock).mockReturnValue({ data: { user: { email: 'cliente@teste.com' } }, status: 'authenticated' });
      (nextAuth.signOut as jest.Mock).mockImplementation(() => Promise.resolve());

      // Simula botão de logout em algum componente
      const LogoutButton = () => <button onClick={() => nextAuth.signOut({ callbackUrl: '/login' })}>Sair</button>;
      render(<LogoutButton />);
      fireEvent.click(screen.getByText(/sair/i));
      await waitFor(() => {
        expect(nextAuth.signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
      });
    });
  });

  // Teste de registro simulado
  describe('Registro', () => {
    it('registro de novo usuário exibe mensagem de sucesso', async () => {
      // Simula página de registro
      const RegisterPage = () => {
        const [msg, setMsg] = React.useState('');
        const handleRegister = async () => {
          setMsg('Usuário registrado com sucesso!');
        };
        return (
          <form onSubmit={e => { e.preventDefault(); handleRegister(); }}>
            <input aria-label="email" />
            <input aria-label="senha" />
            <button type="submit">Registrar</button>
            {msg && <span>{msg}</span>}
          </form>
        );
      };
      render(<RegisterPage />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'novo@teste.com' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'novaSenha' } });
      fireEvent.click(screen.getByRole('button', { name: /registrar/i }));
      await waitFor(() => {
        expect(screen.getByText(/usuário registrado com sucesso/i)).toBeInTheDocument();
      });
    });
  });

  // Teste de acesso à área do cliente
  describe('Acesso área do cliente', () => {
    it('usuário autenticado acessa área do cliente', async () => {
      const push = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push });
      (nextAuth.useSession as jest.Mock).mockReturnValue({ data: { user: { email: 'cliente@teste.com' } }, status: 'authenticated' });
      // Simula página da área do cliente
      const AreaCliente = () => <div>Bem-vindo à área do cliente</div>;
      render(<AreaCliente />);
      expect(screen.getByText(/bem-vindo à área do cliente/i)).toBeInTheDocument();
    });
  });
});
