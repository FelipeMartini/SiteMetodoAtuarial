"use client"; // 'use client' deve ser a primeira linha para evitar warnings do ESLint e garantir funcionamento correto do Next.js
import { Container, Typography, Box } from '@mui/material';
import Button from '@mui/material/Button'; // Import do componente Button do Material UI
import { useTema } from "./contextoTema";
import { coresCustomizadas } from "./temas";
// 'use client' deve ser a primeira linha para evitar warnings do ESLint e garantir funcionamento correto do Next.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Button from '@mui/material/Button'; // Import do componente Button do Material UI
import { useTema } from "./contextoTema";
import { coresCustomizadas } from "./temas";

export default function Home() {
  const { temaAtual, temaMui } = useTema();
  const cores = coresCustomizadas[temaAtual];
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, color: cores.destaque, textShadow: `0 2px 8px ${temaMui.palette.background.paper}` }}>
        Método Atuarial
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4, color: temaMui.palette.text.primary }}>
        Consultoria especializada em previdência e soluções atuariais
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" sx={{ background: cores.botao, color: cores.botaoTexto, transition: 'background 0.3s, color 0.3s' }} href="/orcamento">Solicitar Orçamento</Button>
        <Button variant="outlined" sx={{ borderColor: cores.destaque, color: cores.destaque, transition: 'border-color 0.3s, color 0.3s' }} href="/sobre">Sobre</Button>
      </Box>
      {/* Comentário: Todas as cores da página principal agora mudam conforme o tema selecionado, facilitando manutenção e expansão. */}
    </Container>
  );
}
