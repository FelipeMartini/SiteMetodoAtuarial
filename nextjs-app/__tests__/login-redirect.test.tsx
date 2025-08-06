import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../app/login/page';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));




globalThis.mockStatus = 'unauthenticated';
const mockLogin = jest.fn(() => {
  globalThis.mockStatus = 'authenticated';
  return Promise.resolve({ ok: true });
});
jest.mock('../hooks/useSessaoAuth', () => ({
  useSessaoAuth: () => ({
    login: mockLogin,
    get status() { return globalThis.mockStatus; },
  }),
}));
afterEach(() => { globalThis.mockStatus = 'unauthenticated'; });


describe('Fluxo de login e redirecionamento', () => {
  it('deve autenticar e redirecionar para a área do cliente', async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(
      <ThemeProvider>
        <LoginPage />
      </ThemeProvider>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'teste@cliente.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('credentials', expect.objectContaining({
        email: 'teste@cliente.com',
        password: '123456',
      }));
    });

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/area-cliente');
    });
  });
});
