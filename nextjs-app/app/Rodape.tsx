// Componente Footer moderno e inovador para consultoria atuarial
// Utiliza elementos abstratos, ícones e layout responsivo

import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function Rodape() {
  // Componente Rodape: Footer moderno e inovador para consultoria atuarial
  // Utiliza elementos abstratos, ícones, layout responsivo e informações institucionais
  return (
    <Box
      component="footer"
      // Alterando o fundo do rodapé para preto com gradiente escuro
      sx={{
        background: "linear-gradient(90deg, #000000 0%, #222 100%)", // Gradiente preto
        color: "#fff",
        py: 6,
        px: { xs: 2, md: 8 },
        mt: 8,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        boxShadow: 4,
      }}
    >
      {/* Elemento visual abstrato */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {/* Elemento visual abstrato agora com gradiente escuro */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "radial-gradient(circle, #333 0%, #000 100%)", // Gradiente escuro
            boxShadow: 3,
            opacity: 0.7,
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* Informações institucionais */}
        <Box>
          <Typography variant="h6" fontWeight={700} mb={1}>
            Consultoria Atuarial Inovadora
          </Typography>
          <Typography variant="body2" mb={1}>
            SBS - Quadra 02 - Bloco S - Sala 601 - Brasília/DF
          </Typography>
          <Typography variant="body2">
            contato@consultoriaexemplo.com | (61) 3322-0068
          </Typography>
        </Box>
        {/* Links institucionais */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Institucional
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Link href="/sobre" color="inherit" underline="hover">Sobre</Link>
            <Link href="/servicos" color="inherit" underline="hover">Serviços</Link>
            <Link href="/contato" color="inherit" underline="hover">Contato</Link>
            <Link href="/privacidade" color="inherit" underline="hover">Privacidade</Link>
          </Box>
        </Box>
        {/* Redes sociais */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Redes Sociais
          </Typography>
          <Box>
            <IconButton href="#" color="inherit" aria-label="LinkedIn">
              <LinkedInIcon />
            </IconButton>
            <IconButton href="#" color="inherit" aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
            <IconButton href="#" color="inherit" aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {/* Direitos autorais e créditos */}
      <Box sx={{ textAlign: "center", mt: 4, opacity: 0.7 }}>
        <Typography variant="caption">
          © 2025 Consultoria Atuarial Inovadora. Todos os direitos reservados. Layout abstrato inspirado em tendências globais de consultoria.
        </Typography>
      </Box>
    </Box>
  );
}
