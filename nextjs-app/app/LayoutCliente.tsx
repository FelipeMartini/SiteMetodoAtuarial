"use client";
// Componente de layout visual para alternância de tema
import { Container, AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
// Import removido: 'coresCustomizadas' não utilizado
import { ThemeProvider } from '@mui/material/styles';
import { ProvedorTema, useTema } from './contextoTema';
import React from 'react';
// Importa o contexto do tema para alternância e consumo
import { ContextoTema } from './contextoTema';
import Rodape from "./Rodape";
import Link from "next/link";
import { ReactNode } from "react";

// Componente para o seletor de tema usando Select do Material UI
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
function SeletorTema() {
  // Obtém o tema atual e a função para alterar o tema do contexto
  const { temaAtual, setTemaAtual } = useTema();
  return (
    <Box sx={{ ml: 2, minWidth: 120 }}>
      {/* Select para escolha explícita do tema */}
      <FormControl size="small" variant="outlined" fullWidth>
        <InputLabel id="seletor-tema-label">Tema</InputLabel>
        <Select
          labelId="seletor-tema-label"
          id="seletor-tema"
          value={temaAtual}
          label="Tema"
          onChange={(e) => setTemaAtual(e.target.value as 'escuro' | 'claro')}
        >
          <MenuItem value="escuro">Tema Escuro</MenuItem>
          <MenuItem value="claro">Tema Claro</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

// Layout visual do cliente
export default function LayoutCliente({ children }: { children: ReactNode }) {
  return (
    <ProvedorTema>
      {/* O ContextoTema.Consumer pode retornar undefined se o Provider não estiver corretamente configurado. */}
      <ContextoTema.Consumer>
        {(contexto) => {
          // Se contexto for undefined, exibe um fallback visual e evita erro
          if (!contexto) {
            return (
              <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" color="error">
                  Erro: Contexto do tema não disponível. Verifique se o ProvedorTema está corretamente configurado.
                </Typography>
              </Container>
            );
          }
          // Se contexto existe, renderiza normalmente
          const { temaMui } = contexto; // Removido: 'temaAtual' não utilizado
          // Removido: variável 'cores' não utilizada
          return (
            <ThemeProvider theme={temaMui}>
              {/* Aplica cor de fundo global do tema */}
              <Box sx={{ minHeight: '100vh', background: temaMui.palette.background.default, transition: 'background 0.3s' }}>
                <AppBar position="static" color="primary" sx={{ backgroundColor: temaMui.palette.primary.main }}>
                  <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      Método Atuarial
                    </Typography>
                    <Button color="inherit" component={Link} href="/">Início</Button>
                    <Button color="inherit" component={Link} href="/sobre">Sobre</Button>
                    <Button color="inherit" component={Link} href="/servicos">Serviços</Button>
                    <Button color="inherit" component={Link} href="/orcamento">Orçamento</Button>
                    <Button color="inherit" component={Link} href="/clientes">Área do Cliente</Button>
                    <Button color="inherit" component={Link} href="/contato">Contato</Button>
                    <Button color="inherit" component={Link} href="/login">Login / Cadastro</Button>
                    <SeletorTema />
                  </Toolbar>
                </AppBar>
                <Container maxWidth="lg" sx={{ py: 4, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Box component="main" sx={{ width: '100%', maxWidth: 900 }}>
                    {children}
                  </Box>
                </Container>
                <Rodape />
              </Box>
            </ThemeProvider>
          );
        }}
      </ContextoTema.Consumer>
    </ProvedorTema>
  );
}
