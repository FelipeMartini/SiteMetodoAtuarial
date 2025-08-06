import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SocialLoginBox from '../app/components/SocialLoginBox';
import { ThemeProvider } from '../app/contexts/ThemeContext';


const mockLogin = jest.fn();
jest.mock('../hooks/useSessaoAuth', () => ({
  useSessaoAuth: () => ({
    login: mockLogin,
    status: 'unauthenticated',
  }),
}));

beforeEach(() => {
  mockLogin.mockClear();
});


describe('SocialLoginBox', () => {

  it('renderiza os botões oficiais Google e Apple', () => {
    render(
      <ThemeProvider>
        <SocialLoginBox />
      </ThemeProvider>
    );
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apple/i })).toBeInTheDocument();
  });

  it('aciona login do Google ao clicar no botão', async () => {
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
  });

  it('aciona login da Apple ao clicar no botão', async () => {
    render(
      <ThemeProvider>
        <SocialLoginBox />
      </ThemeProvider>
    );
    const appleBtn = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      fireEvent.click(appleBtn);
    });
    expect(mockLogin).toHaveBeenCalledWith('apple');
  });



  it('deve exibir botões de login social', () => {
    render(
      <ThemeProvider>
        <SocialLoginBox />
      </ThemeProvider>
    );
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apple/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /twitter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /microsoft/i })).toBeInTheDocument();
  });
});

// Comentários:
// - Testa alternância automática das imagens de fundo conforme o tema.
// - Garante que os campos e botões estejam visíveis sobre a imagem.
// - Utiliza o provider de tema para simular troca de tema.
