"use client";
// Página de login única, moderna, integrada com NextAuth e MUI, usando SocialLoginBox
import React from "react";
import { Container, Box, Typography } from "@mui/material";
import SocialLoginBox from "../components/SocialLoginBox";

const LoginPage: React.FC = () => {
  return (
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
        <SocialLoginBox />
      </Container>
    </Box>
  );
};

export default LoginPage;
