import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../app/login/page';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockLogin = jest.fn(() => Promise.resolve({ ok: true }));
jest.mock('../hooks/useSessaoAuth', () => ({
  useSessaoAuth: () => ({
    login: mockLogin,
    status: 'unauthenticated',
  }),
}));


describe('Fluxo de login e redirecionamento', () => {
  it('deve autenticar e redirecionar para a área do cliente', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    // Mock de sessão compatível com o tipo NextAuth
    type SessaoMock = {
      data: {
        user: {
          name?: string;
          email?: string;
          image?: string;
        };
        expires: string;
      } | null;
      status: 'authenticated' | 'unauthenticated' | 'loading';
    };
    let session: SessaoMock = { data: null, status: 'unauthenticated' };
    (nextAuth.useSession as jest.Mock).mockImplementation(() => session);

    // Wrapper para forçar re-render ao mudar o estado de sessão
    const Wrapper = () => {
      const [_, setRerender] = React.useState(0);
      React.useEffect(() => {
        if (session.status === 'authenticated') {
          setRerender(r => r + 1);
        }
      }, [session.status]);
      return (
        <ThemeProvider>
          <LoginPage />
        </ThemeProvider>
      );
    };

    render(<Wrapper />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'teste@cliente.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'teste@cliente.com',
        password: '123456',
        redirect: false,
      }));
    });

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/area-cliente');
    });
  });
});
