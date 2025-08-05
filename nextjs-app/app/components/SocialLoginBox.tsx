"use client";
import React from "react";
import { Box, Paper, Typography, Stack, Divider } from '../design-system';
import { signIn } from "next-auth/react";
import { useTema } from "../theme/ContextoTema";

import Image from 'next/image'; // Importação correta do componente Next.js para imagens otimizadas

// Todos os componentes visuais agora são do design system próprio

interface SocialLoginBoxProps {
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
}

/*
  Componente SocialLoginBox
  Exibe opções de login social (Google e Apple) com estilos adaptados ao tema.
  Utiliza memoização para otimizar renderização.
  Comentários explicativos estão fora do JSX para evitar erros de sintaxe.
*/
const SocialLoginBox: React.FC<SocialLoginBoxProps> = React.memo(function SocialLoginBoxMemo({ onGoogleLogin, onAppleLogin }) {
  const { nomeTemaAtual } = useTema();
  const isDarkMode = nomeTemaAtual === "escuro";

  // URLs oficiais dos botões Google
  // Definição dos temas neutros do projeto
  const temasNeutros = ["verde-natural", "roxo-profissional", "coral-vibrante"];

  // URLs oficiais dos botões Google
  const googleBtn = isDarkMode
    ? 'https://developers.google.com/static/identity/images/btn_google_signin_dark_normal_web.png'
    : temasNeutros.includes(nomeTemaAtual)
      ? 'https://developers.google.com/static/identity/images/btn_google_signin_black_normal_web.png'
      : 'https://developers.google.com/static/identity/images/btn_google_signin_light_normal_web.png';

  // URLs oficiais dos botões Apple
  const appleBtn = isDarkMode
    ? 'https://appleid.cdn-apple.com/appleid/button?height=44&width=260&type=sign_in&color=black'
    : temasNeutros.includes(nomeTemaAtual)
      ? 'https://appleid.cdn-apple.com/appleid/button?height=44&width=260&type=sign_in&color=white-outline'
      : 'https://appleid.cdn-apple.com/appleid/button?height=44&width=260&type=sign_in&color=white';

  // Função de login Google
  const handleGoogleLogin = React.useCallback(() => {
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      signIn("google", { callbackUrl: "/area-cliente" });
    }
  }, [onGoogleLogin]);

  // Função de login Apple
  const handleAppleLogin = React.useCallback(() => {
    if (onAppleLogin) {
      onAppleLogin();
    } else {
      signIn("apple", { callbackUrl: "/area-cliente" });
    }
  }, [onAppleLogin]);

  return (
    <Paper $bg={isDarkMode ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"} $radius="16px" $shadow={isDarkMode ? "0 2px 16px rgba(0,0,0,0.6)" : "0 2px 16px rgba(0,0,0,0.08)"} $padding="0">
      <Box $width="100%" $display="flex" $direction="column" $align="center" $justify="center" $padding="0">
        <Box $width="64px" $height="64px" $bg="rgba(255,255,255,0.2)" $radius="50%" $margin="0 auto 16px auto" $display="flex" $align="center" $justify="center">
          <span role="img" aria-label="Login" style={{ fontSize: 32, color: "white" }}>🔒</span>
        </Box>
        <Typography $variante="h4" $peso="negrito" $cor="#fff" style={{ marginBottom: 4 }}>
          Login Social
        </Typography>
        <Typography $variante="body1" $cor="rgba(255,255,255,0.8)">
          Acesse sua conta com Google ou Apple
        </Typography>
      </Box>
      <Box $padding="32px">
        <Stack $gap="24px" $direction="column">
          {/* Botão oficial Google */}
          <button
            onClick={handleGoogleLogin}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%' }}
            aria-label="Entrar com Google"
          >
            <Image
              src={googleBtn}
              alt="Entrar com Google"
              width={191}
              height={46}
              style={{ maxWidth: '100%', height: 'auto' }}
              priority
            />
          </button>
          {/* Botão oficial Apple */}
          <button
            onClick={handleAppleLogin}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%' }}
            aria-label="Entrar com Apple"
          >
            <Image
              src={appleBtn}
              alt="Entrar com Apple"
              width={260}
              height={44}
              style={{ maxWidth: '100%', height: 'auto' }}
              priority
            />
          </button>
          <Box $margin="24px 0 0 0" $width="100%">
            <Divider $cor={isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"} />
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
});

SocialLoginBox.displayName = "SocialLoginBox";
export default SocialLoginBox;