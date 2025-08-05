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

  // Imagem de fundo conforme tema
  const imagemFundo = isDarkMode ? "/loginboxescura.png" : "/loginboxclara.png";

  // Funções de login (apenas uma instância de cada)
  const handleGoogleLogin = React.useCallback(() => {
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      signIn("google", { callbackUrl: "/area-cliente" });
    }
  }, [onGoogleLogin]);

  const handleAppleLogin = React.useCallback(() => {
    if (onAppleLogin) {
      onAppleLogin();
    } else {
      signIn("apple", { callbackUrl: "/area-cliente" });
    }
  }, [onAppleLogin]);
  // Medidas estimadas dos campos (ajuste conforme necessário)
  const boxWidth = 400;
  const boxHeight = 480;
  // Email: top 90px, left 40px, width 320px, height 48px
  // Senha: top 150px, left 40px, width 320px, height 48px
  // Botão login: top 210px, left 40px, width 320px, height 48px
  // Google: top 290px, left 40px, width 320px, height 48px
  // Apple: top 350px, left 40px, width 320px, height 48px

  return (
    <div
      style={{
        position: 'relative',
        width: boxWidth,
        height: boxHeight,
        background: `url(${imagemFundo}) center/cover no-repeat`,
        borderRadius: 24,
        boxShadow: isDarkMode ? "0 2px 16px rgba(0,0,0,0.6)" : "0 2px 16px rgba(0,0,0,0.08)",
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      {/* Campo de email invisível */}
      <input
        type="email"
        aria-label="Email address"
        tabIndex={1}
        style={{
          position: 'absolute',
          top: 90,
          left: 40,
          width: 320,
          height: 48,
          opacity: 0,
          pointerEvents: 'auto',
        }}
      />
      {/* Campo de senha invisível */}
      <input
        type="password"
        aria-label="Password"
        tabIndex={2}
        style={{
          position: 'absolute',
          top: 150,
          left: 40,
          width: 320,
          height: 48,
          opacity: 0,
          pointerEvents: 'auto',
        }}
      />
      {/* Botão login invisível */}
      <button
        type="submit"
        aria-label="Log in"
        tabIndex={3}
        style={{
          position: 'absolute',
          top: 210,
          left: 40,
          width: 320,
          height: 48,
          opacity: 0,
          pointerEvents: 'auto',
          border: 'none',
          background: 'transparent',
        }}
      />
      {/* Botão Google invisível */}
      <button
        type="button"
        aria-label="Continue with Google"
        tabIndex={4}
        onClick={handleGoogleLogin}
        style={{
          position: 'absolute',
          top: 290,
          left: 40,
          width: 320,
          height: 48,
          opacity: 0,
          pointerEvents: 'auto',
          border: 'none',
          background: 'transparent',
        }}
      />
      {/* Botão Apple invisível */}
      <button
        type="button"
        aria-label="Continue with Apple"
        tabIndex={5}
        onClick={handleAppleLogin}
        style={{
          position: 'absolute',
          top: 350,
          left: 40,
          width: 320,
          height: 48,
          opacity: 0,
          pointerEvents: 'auto',
          border: 'none',
          background: 'transparent',
        }}
      />
      {/* Comentário: Todos os campos e botões são invisíveis, mas funcionais e acessíveis. Ajuste as medidas conforme necessário para alinhar perfeitamente com a imagem. */}
    </div>
  );
});

SocialLoginBox.displayName = "SocialLoginBox";
export default SocialLoginBox;