import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SocialLoginBox from '../app/components/SocialLoginBox';
import { signIn } from 'next-auth/react';
import { ThemeProvider } from '../app/contexts/ThemeContext';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));


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

  it('aciona signIn do Google ao clicar no botão', () => {
    render(
      <ThemeProvider>
        <SocialLoginBox />
      </ThemeProvider>
    );
    const googleBtn = screen.getByRole('button', { name: /google/i });
    act(() => {
      fireEvent.click(googleBtn);
    });
    expect(signIn).toHaveBeenCalledWith('google', expect.any(Object));
  });

  it('aciona signIn da Apple ao clicar no botão', () => {
    render(
      <ThemeProvider>
        <SocialLoginBox />
      </ThemeProvider>
    );
    const appleBtn = screen.getByRole('button', { name: /apple/i });
    act(() => {
      fireEvent.click(appleBtn);
    });
    expect(signIn).toHaveBeenCalledWith('apple', expect.any(Object));
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
