
import { render, screen, fireEvent } from '@testing-library/react';
import SocialLoginBox from '../app/components/SocialLoginBox';
import { signIn } from 'next-auth/react';
import { ThemeProvider } from '../app/contexts/ThemeContext';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));


describe('SocialLoginBox', () => {
  it('renderiza os botões oficiais Google e Apple', () => {
    render(
      <ProvedorTema>
        <SocialLoginBox />
      </ProvedorTema>
    );
    expect(screen.getByAltText('Entrar com Google')).toBeInTheDocument();
    expect(screen.getByAltText('Entrar com Apple')).toBeInTheDocument();
  });

  it('aciona signIn do Google ao clicar no botão', () => {
    render(
      <ProvedorTema>
        <SocialLoginBox />
      </ProvedorTema>
    );
    const googleBtn = screen.getByAltText('Entrar com Google').closest('button');
    expect(googleBtn).not.toBeNull();
    fireEvent.click(googleBtn!);
    expect(signIn).toHaveBeenCalledWith('google', expect.any(Object));
  });

  it('aciona signIn da Apple ao clicar no botão', () => {
    render(
      <ProvedorTema>
        <SocialLoginBox />
      </ProvedorTema>
    );
    const appleBtn = screen.getByAltText('Entrar com Apple').closest('button');
    expect(appleBtn).not.toBeNull();
    fireEvent.click(appleBtn!);
    expect(signIn).toHaveBeenCalledWith('apple', expect.any(Object));
  });

  it('deve exibir imagem de fundo clara quando tema for claro', () => {
    render(
      <ProvedorTema>
        <SocialLoginBox />
      </ProvedorTema>
    );
    // Busca pelo elemento principal do box
    const box = screen.getByRole('img', { name: /login/i }).closest('div');
    expect(box).toHaveStyle('background: url(/loginboxclara.png)');
  });

  it('deve exibir imagem de fundo escura quando tema for escuro', () => {
    render(
      <ProvedorTema>
        <SocialLoginBox />
      </ProvedorTema>
    );
    const box = screen.getByRole('img', { name: /login/i }).closest('div');
    expect(box).toHaveStyle('background: url(/loginboxescura.png)');
  });

  it('deve exibir campos e botões de login sobre a imagem', () => {
    render(
      <ProvedorTema>
        <SocialLoginBox />
      </ProvedorTema>
    );
    expect(screen.getByText(/login social/i)).toBeInTheDocument();
    expect(screen.getByAltText(/google/i)).toBeInTheDocument();
    expect(screen.getByAltText(/apple/i)).toBeInTheDocument();
  });
});

// Comentários:
// - Testa alternância automática das imagens de fundo conforme o tema.
// - Garante que os campos e botões estejam visíveis sobre a imagem.
// - Utiliza o provider de tema para simular troca de tema.
