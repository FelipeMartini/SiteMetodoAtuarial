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
  // Medidas precisas dos campos e botões (obtidas visualmente das imagens)
  // Box: 400x480px
  // Email: top 110px, left 40px, width 320px, height 48px
  // Senha: top 170px, left 40px, width 320px, height 48px
  // Botão login: top 235px, left 40px, width 320px, height 56px
  // Botão Google: top 320px, left 40px, width 320px, height 48px
  // Botão Apple: top 380px, left 40px, width 320px, height 48px

  // Estado para campos
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  // Função submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui pode chamar a função de login normal
    // signIn('credentials', { email, senha })
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        position: 'relative',
        width: 400,
        height: 480,
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
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="email"
        maxLength={40} // Limite de caracteres para não ultrapassar o campo visual
        style={{
          position: 'absolute',
          top: 110,
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
        value={senha}
        onChange={e => setSenha(e.target.value)}
        autoComplete="current-password"
        maxLength={24} // Limite de caracteres para não ultrapassar o campo visual
        style={{
          position: 'absolute',
          top: 170,
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
          top: 235,
          left: 40,
          width: 320,
          height: 56,
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
          top: 320,
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
          top: 380,
          left: 40,
          width: 320,
          height: 48,
          opacity: 0,
          pointerEvents: 'auto',
          border: 'none',
          background: 'transparent',
        }}
      />
      {/* Comentário: Todos os campos e botões são invisíveis, mas funcionais e acessíveis. Medidas alinhadas visualmente com as imagens fornecidas. */}
    </form>
  );
});

SocialLoginBox.displayName = "SocialLoginBox";
export default SocialLoginBox;