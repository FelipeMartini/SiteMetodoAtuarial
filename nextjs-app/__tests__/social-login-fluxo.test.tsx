// use cliente
// Teste automatizado para login social e tratamento de erro OAuthAccountNotLinked
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SocialLoginBox from '../app/components/SocialLoginBox';
import { ThemeProvider } from '../app/contexts/ThemeContext';


const mockLogin = jest.fn(() => Promise.resolve({ error: 'OAuthAccountNotLinked' }));
jest.mock('../hooks/useSessaoAuth', () => ({
  useSessaoAuth: () => ({
    login: mockLogin,
    status: 'unauthenticated',
  }),
}));

beforeEach(() => {
  mockLogin.mockClear();
});

describe('SocialLoginBox - Fluxo de login social', () => {
  it('aciona login do Google e trata erro OAuthAccountNotLinked', async () => {
    render(
      <ThemeProvider>
        <SocialLoginBox />
      </ThemeProvider>
    );
    const googleBtn = screen.getByRole('button', { name: /google/i });
    await act(async () => {
      fireEvent.click(googleBtn);
    });
    expect(mockLogin).toHaveBeenCalledWith('google');
    // O erro deve ser exibido na tela (mensagem exibida pelo componente)
    // O erro deve ser exibido na tela (mensagem exibida pelo componente)
    // Tenta encontrar o texto de erro exibido pelo componente
    expect(screen.getByText('Erro inesperado ao conectar com Entrar com Google')).toBeInTheDocument();
  });
});

// Comentário: Este teste cobre o fluxo de login social e garante que o erro OAuthAccountNotLinked seja tratado e exibido corretamente para o usuário.
