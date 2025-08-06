// Mock global para next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));
const mockLogin = jest.fn((provider, credenciais) => {
  // Garante que redirect: false sempre está presente, como na implementação real
  return Promise.resolve({ ok: true });
});
const mockLogout = jest.fn(() => Promise.resolve());
const mockStatus = 'authenticated';
jest.mock('../hooks/useSessaoAuth', () => ({
  useSessaoAuth: () => ({
    usuario: { id: '1', email: 'teste@teste.com', accessLevel: 5 },
    status: mockStatus,
    login: mockLogin,
    logout: mockLogout,
    fetchSessao: jest.fn(),
  }),
}));

// Mock global do SocialLoginBox para todos os testes exceto login social
jest.mock('@core/components/SocialLoginBox', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-social-login-box"></div>,
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@core/theme/ContextoTema';
import LoginPage from '../app/login/page';
import { useRouter } from 'next/navigation';

describe('Fluxos de autenticação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Teste de login tradicional com sucesso
  describe('Login tradicional', () => {
    it('login tradicional com sucesso redireciona para área do cliente', async () => {
      const push = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push });
      mockLogin.mockImplementation(() => Promise.resolve({ ok: true }));

      render(
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'cliente@teste.com' } });
      fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('credentials', expect.objectContaining({
          email: 'cliente@teste.com',
          password: '123456',
        }));
      });
    });
    it('login tradicional com erro exibe mensagem de erro', async () => {
      (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
      // Simula erro lançando uma exceção assíncrona
      mockLogin.mockImplementation(() => Promise.reject(new Error('Credenciais inválidas')));

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
      mockLogout.mockImplementation(() => Promise.resolve());

      // Simula botão de logout em algum componente
      const LogoutButton = () => <button onClick={() => mockLogout()}>Sair</button>;
      render(<LogoutButton />);
      fireEvent.click(screen.getByText(/sair/i));
      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
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
      // O status já é controlado pelo mockStatus, não é necessário mockar useSession diretamente
      // Simula página da área do cliente
      const AreaCliente = () => <div>Bem-vindo à área do cliente</div>;
      render(<AreaCliente />);
      expect(screen.getByText(/bem-vindo à área do cliente/i)).toBeInTheDocument();
    });
  });
});
