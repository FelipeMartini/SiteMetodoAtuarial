
"use client";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useTema } from "./contextoTema";
import { coresCustomizadas } from "./temas";

/**
 * Componente Rodape (Footer) padronizado para o site Método Atuarial.
 * Apresenta informações institucionais, links úteis, redes sociais e créditos.
 * Todas as cores e textos seguem o tema selecionado.
 *
 * @returns JSX.Element Rodapé institucional e responsivo.
 */
const Rodape: React.FC = React.memo(function Rodape() {
  const { temaAtual } = useTema();
  const cores = coresCustomizadas[temaAtual];
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
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
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
        <Box>
          <Typography variant="subtitle2" fontWeight={600} mb={1} sx={{ color: cores.destaqueTexto }}>
            Institucional
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Link href="/sobre" sx={{ color: cores.rodapeTexto }} underline="hover" aria-label="Ir para página Sobre">Sobre</Link>
            <Link href="/servicos" sx={{ color: cores.rodapeTexto }} underline="hover" aria-label="Ir para página Serviços">Serviços</Link>
            <Link href="/contato" sx={{ color: cores.rodapeTexto }} underline="hover" aria-label="Ir para página Contato">Contato</Link>
            <Link href="/privacidade" sx={{ color: cores.rodapeTexto }} underline="hover" aria-label="Ir para página de Privacidade">Privacidade</Link>
          </Box>
        </Box>
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
      <Box sx={{ textAlign: "center", mt: 4, opacity: 0.7 }}>
        <Typography variant="caption" sx={{ color: cores.rodapeTexto }}>
          © 2025 Consultoria Atuarial Inovadora. Todos os direitos reservados. Layout abstrato inspirado em tendências globais de consultoria.
        </Typography>
      </Box>
    </Box>
  );
});
// Adiciona displayName para evitar erro de lint e facilitar debug
Rodape.displayName = "Rodape";

export default Rodape;
