"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { useTema } from "../theme/ContextoTema";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import AppleIcon from "@mui/icons-material/Apple";
import LoginIcon from "@mui/icons-material/Login";

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

  // Estilos do container principal
  const containerStyles = React.useMemo(() => ({
    width: 400,
    maxWidth: "90vw",
    mx: "auto",
    my: 4,
    backgroundColor: isDarkMode ? "#18181b" : "#fff",
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: isDarkMode ? "0 8px 32px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.1)",
    border: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
  }), [isDarkMode]);

  // Estilos do botão Google
  const googleButtonStyles = React.useMemo(() => ({
    width: "100%",
    height: 56,
    borderRadius: 2,
    backgroundColor: isDarkMode ? "#232323" : "#fff",
    color: isDarkMode ? "#fff" : "#757575",
    border: isDarkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid #dadce0",
    textTransform: "none" as const,
    fontSize: "16px",
    fontWeight: 500,
    boxShadow: "none",
  }), [isDarkMode]);

  // Estilos do botão Apple
  const appleButtonStyles = React.useMemo(() => ({
    width: "100%",
    height: 56,
    borderRadius: 2,
    backgroundColor: isDarkMode ? "#fff" : "#000",
    color: isDarkMode ? "#000" : "#fff",
    textTransform: "none" as const,
    fontSize: "16px",
    fontWeight: 500,
    boxShadow: "none",
  }), [isDarkMode]);

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
    <Paper elevation={0} sx={containerStyles}>
      {/* Box superior com avatar e título */}
      <Box
        sx={{
          background: isDarkMode ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          p: 4,
          textAlign: "center",
          position: "relative",
        }}
      >
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
        <Typography variant="h4" fontWeight="bold" color="white" sx={{ mb: 1, position: "relative", zIndex: 2 }}>
          Login
        </Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ position: "relative", zIndex: 2 }}>
          Acesse sua conta rapidamente
        </Typography>
      </Box>
      {/* Box inferior com botões de login e informações */}
      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Botão de login com Google */}
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
            onClick={handleGoogleLogin}
            sx={googleButtonStyles}
          >
            Continuar com Google
          </Button>
          {/* Botão de login com Apple */}
          <Button
            variant="contained"
            startIcon={<AppleIcon sx={{ fontSize: 20 }} />}
            onClick={handleAppleLogin}
            sx={appleButtonStyles}
          >
            Continuar com Apple
          </Button>
          {/* Divisor visual entre opções */}
          <Box sx={{ position: "relative", my: 3 }}>
            <Divider sx={{ borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
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
          {/* Informações de termos e privacidade */}
          <Typography
            variant="caption"
            align="center"
            sx={{ color: isDarkMode ? "#888" : "#666", lineHeight: 1.4, mt: 2, textAlign: "center" }}
          >
            Ao continuar, você concorda com nossos{" "}
            <Box component="a" href="/termos" target="_blank" sx={{ color: isDarkMode ? "#4facfe" : "#1976d2", cursor: "pointer", textDecoration: "underline", mx: 0.5 }}>
              Termos de Uso
            </Box>{" "}
            e{" "}
            <Box component="a" href="/privacidade" target="_blank" sx={{ color: isDarkMode ? "#4facfe" : "#1976d2", cursor: "pointer", textDecoration: "underline", mx: 0.5 }}>
              Política de Privacidade
            </Box>
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
});

// Adiciona displayName para evitar erro de lint e facilitar debug
SocialLoginBox.displayName = "SocialLoginBox";
// Exportação do componente memoizado
export default SocialLoginBox;