// use cliente
// Teste automatizado para login social e tratamento de erro OAuthAccountNotLinked
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SocialLoginBox from '../app/components/SocialLoginBox';
import { signIn } from 'next-auth/react';
import { ThemeProvider } from '../app/contexts/ThemeContext';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

describe('SocialLoginBox - Fluxo de login social', () => {
  it('aciona signIn do Google e trata erro OAuthAccountNotLinked', async () => {
    (signIn as jest.Mock).mockImplementationOnce(() => Promise.resolve({ error: 'OAuthAccountNotLinked' }));
    render(
      <ThemeProvider>
        <SocialLoginBox />
      </ThemeProvider>
    );
    const googleBtn = screen.getByRole('button', { name: /google/i });
    await act(async () => {
      fireEvent.click(googleBtn);
    });
    expect(signIn).toHaveBeenCalledWith('google', expect.any(Object));
    // O erro deve ser exibido na tela
    expect(screen.getByText(/já existe, mas foi criada com outro método/i)).toBeInTheDocument();
  });
});

// Comentário: Este teste cobre o fluxo de login social e garante que o erro OAuthAccountNotLinked seja tratado e exibido corretamente para o usuário.
