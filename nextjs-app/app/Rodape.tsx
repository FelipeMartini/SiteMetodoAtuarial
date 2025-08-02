"use client";
// Componente Footer moderno e inovador para consultoria atuarial
// Utiliza elementos abstratos, ícones e layout responsivo

import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useTema } from "./contextoTema";
import { coresCustomizadas } from "./temas";

export default function Rodape() {
  // Obtém o tema atual do contexto para aplicar cores dinâmicas
  const { temaAtual } = useTema();
  const cores = coresCustomizadas[temaAtual];
  // Componente Rodape: Footer moderno e inovador para consultoria atuarial
  // Utiliza elementos abstratos, ícones, layout responsivo e informações institucionais
  return (
    <Box
      component="footer"
      sx={{
        background: cores.rodape,
        color: cores.rodapeTexto,
        py: 6,
        px: { xs: 2, md: 8 },
        mt: 8,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        boxShadow: 4,
        transition: 'background 0.3s, color 0.3s', // Suaviza troca de tema
      }}
    >
      {/* Elemento visual abstrato */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {/* Elemento visual abstrato agora com cor do destaque do tema */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: cores.destaque,
            boxShadow: 3,
            opacity: 0.7,
            transition: 'background 0.3s',
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
          <Typography variant="h6" fontWeight={700} mb={1} sx={{ color: cores.destaqueTexto }}>
            Consultoria Atuarial Inovadora
          </Typography>
          <Typography variant="body2" mb={1} sx={{ color: cores.rodapeTexto }}>
            SBS - Quadra 02 - Bloco S - Sala 601 - Brasília/DF
          </Typography>
          <Typography variant="body2" sx={{ color: cores.rodapeTexto }}>
            contato@consultoriaexemplo.com | (61) 3322-0068
          </Typography>
        </Box>
        {/* Links institucionais */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1} sx={{ color: cores.destaqueTexto }}>
            Institucional
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Link href="/sobre" sx={{ color: cores.rodapeTexto }} underline="hover">Sobre</Link>
            <Link href="/servicos" sx={{ color: cores.rodapeTexto }} underline="hover">Serviços</Link>
            <Link href="/contato" sx={{ color: cores.rodapeTexto }} underline="hover">Contato</Link>
            <Link href="/privacidade" sx={{ color: cores.rodapeTexto }} underline="hover">Privacidade</Link>
          </Box>
        </Box>
        {/* Redes sociais */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1} sx={{ color: cores.destaqueTexto }}>
            Redes Sociais
          </Typography>
          <Box>
            <IconButton href="#" sx={{ color: cores.destaque }} aria-label="LinkedIn">
              <LinkedInIcon />
            </IconButton>
            <IconButton href="#" sx={{ color: cores.destaque }} aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
            <IconButton href="#" sx={{ color: cores.destaque }} aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {/* Direitos autorais e créditos */}
      <Box sx={{ textAlign: "center", mt: 4, opacity: 0.7 }}>
        <Typography variant="caption" sx={{ color: cores.rodapeTexto }}>
          © 2025 Consultoria Atuarial Inovadora. Todos os direitos reservados. Layout abstrato inspirado em tendências globais de consultoria.
        </Typography>
      </Box>
      {/* Comentário: Todas as cores do rodapé agora mudam conforme o tema selecionado, facilitando manutenção e expansão. */}
    </Box>
  );
}
