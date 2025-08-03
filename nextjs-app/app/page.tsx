
"use client";
// Importações individuais do Material-UI para melhor performance e evitar duplicidade
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
// Removido import agrupado do MUI para evitar duplicidade
// import { Container, Typography, Box } from '@mui/material';
import { Botao } from "./design-system";
import { useTema } from "./contextoTema";
import { coresCustomizadas } from "./temas";

// Memoização do componente para evitar renderizações desnecessárias
const Home: React.FC = React.memo(function Home() {
  const { temaAtual, temaMui } = useTema();
  const cores = coresCustomizadas[temaAtual];
  return (
    <ErrorBoundary>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, color: cores.destaque, textShadow: `0 2px 8px ${temaMui.palette.background.paper}` }}>
          Método Atuarial
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4, color: temaMui.palette.text.primary }}>
          Consultoria especializada em previdência e soluções atuariais
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {/* Botões padronizados do design system, integrados ao tema */}
          <Botao
            variant="contained"
            style={{ background: cores.botao, color: cores.botaoTexto, transition: 'background 0.3s, color 0.3s' }}
            href="/orcamento"
          >
            Solicitar Orçamento
          </Botao>
          <Botao
            variant="outlined"
            style={{ borderColor: cores.destaque, color: cores.destaque, transition: 'border-color 0.3s, color 0.3s' }}
            href="/sobre"
          >
            Sobre
          </Botao>
        </Box>
        {/* Comentário: Todas as cores da página principal agora mudam conforme o tema selecionado, facilitando manutenção e expansão. */}
      </Container>
    </ErrorBoundary>
  );
});
export default Home;
