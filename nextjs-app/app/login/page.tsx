"use client";
// Importações individuais do Material-UI para melhor performance e evitar duplicidade
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// Página de login única, moderna, integrada com NextAuth e MUI, usando SocialLoginBox
// ...existing code...
// Removido import agrupado do MUI para evitar duplicidade
// import { Container, Box, Typography } from "@mui/material";
// Lazy loading do SocialLoginBox para otimizar o carregamento da página de login
import React, { Suspense } from "react";
import { ErrorBoundary } from '../components/ErrorBoundary';
const SocialLoginBox = React.lazy(() => import("../components/SocialLoginBox"));

const LoginPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)"
              : "linear-gradient(135deg, #f0f2f5 0%, #ffffff 50%, #f0f2f5 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            sx={{ mb: 4, color: (theme) => theme.palette.text.primary }}
          >
            Login
          </Typography>
          {/* Box de login social moderno, tema automático */}
          {/* Suspense exibe fallback enquanto SocialLoginBox carrega */}
          <Suspense fallback={<div>Carregando login social...</div>}>
            <SocialLoginBox />
          </Suspense>
        </Container>
      </Box>
    </ErrorBoundary>
  );
};

export default LoginPage;
