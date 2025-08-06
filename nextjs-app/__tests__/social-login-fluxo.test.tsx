// use cliente
// Teste automatizado para login social e tratamento de erro OAuthAccountNotLinked
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SocialLoginBox from '../app/components/SocialLoginBox';
import { ThemeProvider } from '../app/contexts/ThemeContext';


beforeEach(() => {

  // Mock do hook, mas login não é chamado para social (apenas para credentials)
  jest.mock('../hooks/useSessaoAuth', () => ({
    useSessaoAuth: () => ({
      login: jest.fn(),
      status: 'unauthenticated',
    }),
  }));

  describe('SocialLoginBox - Fluxo de login social', () => {
    it('redireciona para rota de login social ao clicar no botão Google', async () => {
      // Mock window.location.href
      const originalLocation = window.location;
      // @ts-ignore
      delete window.location;
      window.location = { href: '' } as any;

      render(
        <ThemeProvider>
          <SocialLoginBox />
        </ThemeProvider>
      );
      const googleBtn = screen.getByRole('button', { name: /google/i });
      fireEvent.click(googleBtn);
      expect(window.location.href).toContain('/api/auth/signin/google');

      // Restaura window.location
      // Restaura window.location de forma segura
      // @ts-ignore
      window.location = originalLocation;
    });
  });


