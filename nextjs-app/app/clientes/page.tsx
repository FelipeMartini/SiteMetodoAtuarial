import React from 'react';
"use client";
import { Container, Typography } from '@mui/material';
import { useTema } from "../contextoTema";
import { coresCustomizadas } from "../temas";

export default function Clientes() {
  const { temaAtual, temaMui } = useTema();
  const cores = coresCustomizadas[temaAtual];
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ color: cores.destaque, textShadow: `0 2px 8px ${temaMui.palette.background.paper}` }}>Área do Cliente</Typography>
      <Typography sx={{ color: temaMui.palette.text.primary }}>Bem-vindo à área exclusiva para clientes da Método Atuarial.</Typography>
      {/* Conteúdo do dashboard do cliente */}
      {/* Comentário: Todas as cores da página Clientes agora mudam conforme o tema selecionado, facilitando manutenção e expansão. */}
    </Container>
  );
}
