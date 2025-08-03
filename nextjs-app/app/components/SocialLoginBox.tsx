"use client";
// Componente moderno de login social com Google e Apple, adaptado para Next.js + MUI
import React from "react";
import { signIn } from "next-auth/react";
import { useTema } from "../contextoTema"; // Importa o contexto de tema do projeto
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Avatar,
  Stack,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import {
  Apple as AppleIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

// O componente agora utiliza o tema global do projeto, não precisa mais receber isDarkMode
interface SocialLoginBoxProps {
  // Funções de callback opcionais para login customizado
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
}

const SocialLoginBox: React.FC<SocialLoginBoxProps> = ({
  onGoogleLogin,
  onAppleLogin,
}) => {
  const theme = useTheme();
  // Usa o contexto de tema do projeto para definir se está no modo escuro
  const { temaAtual } = useTema();
  const isDarkMode = temaAtual === "escuro";

  // Estilos do container principal
  const containerStyles = {
    width: 400,
    maxWidth: "90vw",
    mx: "auto",
    my: 4,
    backgroundColor: isDarkMode ? "#18181b" : "#fff",
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: isDarkMode
      ? "0 8px 32px rgba(0,0,0,0.4)"
      : "0 4px 20px rgba(0,0,0,0.1)",
    border: isDarkMode
      ? "1px solid rgba(255,255,255,0.1)"
      : "1px solid rgba(0,0,0,0.05)",
  };

  // Estilos do botão Google
  const googleButtonStyles = {
    width: "100%",
    height: 56,
    borderRadius: 2,
    backgroundColor: isDarkMode ? "#232323" : "#fff",
    color: isDarkMode ? "#fff" : "#757575",
    border: isDarkMode
      ? "1px solid rgba(255,255,255,0.2)"
      : "1px solid #dadce0",
    textTransform: "none" as const,
    fontSize: "16px",
    fontWeight: 500,
    boxShadow: "none",
    '&:hover': {
      backgroundColor: isDarkMode ? "#333" : "#f8f9fa",
      boxShadow: isDarkMode
        ? "0 2px 8px rgba(255,255,255,0.1)"
        : "0 1px 3px rgba(0,0,0,0.1)",
    },
    '&:active': {
      transform: "translateY(1px)",
    },
  };

  // Estilos do botão Apple
  const appleButtonStyles = {
    width: "100%",
    height: 56,
    borderRadius: 2,
    backgroundColor: isDarkMode ? "#fff" : "#000",
    color: isDarkMode ? "#000" : "#fff",
    textTransform: "none" as const,
    fontSize: "16px",
    fontWeight: 500,
    boxShadow: "none",
    '&:hover': {
      backgroundColor: isDarkMode ? "#f0f0f0" : "#333",
      transform: "translateY(-1px)",
    },
    '&:active': {
      transform: "translateY(1px)",
    },
  };

  return (
    <Paper elevation={0} sx={containerStyles}>
      {/* Header com gradiente e ícone */}
      <Box
        sx={{
          background: isDarkMode
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          p: 4,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Avatar centralizado com ícone de login, sem imagem personalizada */}
        <Avatar
          sx={{
            mx: "auto",
            mb: 2,
            width: 64,
            height: 64,
            backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <LoginIcon sx={{ fontSize: 32, color: "white" }} />
        </Avatar>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="white"
          sx={{ mb: 1, position: "relative", zIndex: 2 }}
        >
          Login
        </Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ position: "relative", zIndex: 2 }}>
          Acesse sua conta rapidamente
        </Typography>
      </Box>

      {/* Conteúdo dos botões sociais */}
      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Botão Google integrado com NextAuth */}
          <Button
            variant="outlined"
            startIcon={
              <Box
                component="img"
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                sx={{ width: 20, height: 20 }}
              />
            }
            onClick={onGoogleLogin || (() => signIn("google", { callbackUrl: "/area-cliente" }))}
            sx={googleButtonStyles}
          >
            Continuar com Google
          </Button>

          {/* Botão Apple integrado com NextAuth */}
          <Button
            variant="contained"
            startIcon={<AppleIcon sx={{ fontSize: 20 }} />}
            onClick={onAppleLogin || (() => signIn("apple", { callbackUrl: "/area-cliente" }))}
            sx={appleButtonStyles}
          >
            Continuar com Apple
          </Button>

          {/* Divider */}
          <Box sx={{ position: "relative", my: 3 }}>
            <Divider
              sx={{
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: isDarkMode ? "#18181b" : "#fff",
                px: 2,
                color: isDarkMode ? "#888" : "#666",
                fontSize: "14px",
              }}
            >
              ou
            </Typography>
          </Box>

          {/* Termos e privacidade - área destacada e acessível */}
          <Typography
            variant="caption"
            align="center"
            sx={{
              color: isDarkMode ? "#888" : "#666",
              lineHeight: 1.4,
              mt: 2,
              textAlign: "center",
            }}
          >
            Ao continuar, você concorda com nossos{' '}
            <Box
              component="a"
              href="/termos"
              target="_blank"
              sx={{
                color: isDarkMode ? "#4facfe" : "#1976d2",
                cursor: "pointer",
                textDecoration: "underline",
                mx: 0.5,
              }}
            >
              Termos de Uso
            </Box>{' '}
            e{' '}
            <Box
              component="a"
              href="/privacidade"
              target="_blank"
              sx={{
                color: isDarkMode ? "#4facfe" : "#1976d2",
                cursor: "pointer",
                textDecoration: "underline",
                mx: 0.5,
              }}
            >
              Política de Privacidade
            </Box>
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SocialLoginBox;
