import Image from 'next/image';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

// Container principal com imagem de fundo
const Container = styled.div`
  position: relative;
  width: 400px;
  height: 500px;
`;

// Campos invisíveis posicionados exatamente sobre os campos desenhados na imagem
const InputEmail = styled.input`
  position: absolute;
  top: 110px;
  left: 52px;
  width: 296px;
  height: 40px;
  opacity: 0;
  z-index: 2;
  cursor: pointer;
`;

const InputSenha = styled.input`
  position: absolute;
  top: 160px;
  left: 52px;
  width: 296px;
  height: 40px;
  opacity: 0;
  z-index: 2;
  cursor: pointer;
`;

const ButtonLogin = styled.button`
  position: absolute;
  top: 220px;
  left: 52px;
  width: 296px;
  height: 44px;
  opacity: 0;
  z-index: 2;
  cursor: pointer;
`;

const ButtonGoogle = styled.button`
  position: absolute;
  top: 320px;
  left: 52px;
  width: 296px;
  height: 44px;
  opacity: 0;
  z-index: 2;
  cursor: pointer;
`;

const ButtonApple = styled.button`
  position: absolute;
  top: 370px;
  left: 52px;
  width: 296px;
  height: 44px;
  opacity: 0;
  z-index: 2;
  cursor: pointer;
`;

export default function LoginBoxVisual() {
  const { themeName } = useTheme();
  let imgSrc = '/loginboxclara.png';
  if (themeName === 'dark') imgSrc = '/loginboxescura.png';

  // Funções dos botões
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Adicione aqui a lógica de login
  };

  return (
    <Container>
      {/* Imagem de fundo do login box */}
      <Image src={imgSrc} alt="Login visual completo" width={400} height={500} priority />
      {/* Campos invisíveis sobre os campos desenhados */}
      <form onSubmit={handleLogin}>
        <InputEmail type="email" name="email" autoComplete="email" tabIndex={1} />
        <InputSenha type="password" name="senha" autoComplete="current-password" tabIndex={2} />
        <ButtonLogin type="submit" tabIndex={3} />
      </form>
      <ButtonGoogle type="button" tabIndex={4} onClick={() => window.location.href = '/api/auth/signin/google'} />
      <ButtonApple type="button" tabIndex={5} onClick={() => window.location.href = '/api/auth/signin/apple'} />
    </Container>
  );
}
