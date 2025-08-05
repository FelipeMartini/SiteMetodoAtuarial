"use client";
// Importações individuais do Material-UI para melhor performance e evitar duplicidade
// Removidos imports do MUI
// Substituir por componentes do design system próprio
// Página de login única, moderna, integrada com NextAuth e MUI, usando SocialLoginBox
// ...existing code...
// Removido import agrupado do MUI para evitar duplicidade
// import { Container, Box, Typography } from "@mui/material";
// Lazy loading do SocialLoginBox para otimizar o carregamento da página de login

import React, { Suspense } from "react";
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Box, Typography } from '../design-system';
const SocialLoginBox = React.lazy(() => import("../components/SocialLoginBox"));

const LoginPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Box
        $display="flex"
        $align="center"
        $justify="center"
        $direction="column"
        $bg="linear-gradient(135deg, #f0f2f5 0%, #ffffff 50%, #f0f2f5 100%)"
        style={{ minHeight: '100vh', padding: '32px 0' }}
      >
        <Box $width="100%" style={{ maxWidth: 480, margin: '0 auto' }}>
          <Typography $variante="h3" $peso="negrito" $align="centro" style={{ marginBottom: 32, color: '#4F46E5' }}>
            Login
          </Typography>
          {/* Box de login social moderno, tema automático */}
          {/* Suspense exibe fallback enquanto SocialLoginBox carrega */}
          <Suspense fallback={<div>Carregando login social...</div>}>
            <SocialLoginBox />
          </Suspense>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default LoginPage;
