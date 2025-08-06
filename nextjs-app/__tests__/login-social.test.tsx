// Teste isolado para login social sem mock global do SocialLoginBox
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import LoginPage from '../app/login/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

// Mock do hook, mas login não é chamado para social (apenas para credentials)
jest.mock('../hooks/useSessaoAuth', () => ({
  useSessaoAuth: () => ({
    login: jest.fn(),
    status: 'unauthenticated',
  }),
}));

describe('Login social isolado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('redireciona para rota de login social ao clicar no botão Google', async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    // Mock window.location.href
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    window.location = { href: '' } as any;

    render(
      <ThemeProvider>
        <React.Suspense fallback={<div data-testid="suspense-fallback" />}>
          <LoginPage />
        </React.Suspense>
      </ThemeProvider>
    );
    const googleBtn = await screen.findByRole('button', { name: /google/i });
    fireEvent.click(googleBtn);

    // Aceita tanto URL relativa quanto absoluta (JSDOM pode resolver para http://localhost/...)
    expect(window.location.href).toContain('/api/auth/signin/google');

    // Restaura window.location
    // Restaura window.location de forma segura
    // @ts-ignore
    window.location = originalLocation;
  });
});
