"use client";
// Componente de layout visual para alternância de tema
import { Container, AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import { ProvedorTema, useTema } from './contextoTema';
import React, { ReactNode } from 'react';
import { ContextoTema } from './contextoTema';
import Rodape from "./Rodape";
import Link from "next/link";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useSession, signOut } from "next-auth/react";
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
  // Hook do NextAuth para saber se o usuário está autenticado
  // Mantendo apenas o status para controle dos botões do menu, sem usar dados da sessão
  const { status } = useSession();

  return (
    <ProvedorTema>
      {/* Consumidor do contexto do tema para garantir que o tema está disponível */}
      <ContextoTema.Consumer>
        {(contexto) => {
          if (!contexto) {
            return (
              <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h6" color="error">
                  Erro: Contexto do tema não disponível. Verifique se o ProvedorTema está corretamente configurado.
                </Typography>
              </Container>
            );
          }
          const { temaMui } = contexto;
          return (
            <ThemeProvider theme={temaMui}>
              <Box sx={{ minHeight: '100vh', background: temaMui.palette.background.default, transition: 'background 0.3s' }}>
                <AppBar position="static" color="primary" sx={{ backgroundColor: temaMui.palette.primary.main }}>
                  <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      Método Atuarial
                    </Typography>
                    {/* Agrupamento dos botões de navegação para melhor organização */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button color="inherit" component={Link} href="/">Início</Button>
                      <Button color="inherit" component={Link} href="/sobre">Sobre</Button>
                      <Button color="inherit" component={Link} href="/servicos">Serviços</Button>
                      <Button color="inherit" component={Link} href="/orcamento">Orçamento</Button>
                      <Button color="inherit" component={Link} href="/contato">Contato</Button>
                    </Box>
                    {/* Bloco de autenticação e seletor de tema alinhados à direita, sem sobreposição */}
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
                      {status === "authenticated" && (
                        <>
                          <Button color="inherit" component={Link} href="/area-cliente">Área do Cliente</Button>
                          <Button color="inherit" onClick={() => signOut({ callbackUrl: '/' })}>Sair</Button>
                        </>
                      )}
                      {status !== "authenticated" && (
                        <Button color="inherit" component={Link} href="/login">Login / Cadastro</Button>
                      )}
                      <SeletorTema />
                    </Box>
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

// Comentário: O menu principal agora exibe 'Área do Cliente' e 'Sair' apenas para usuários autenticados, e 'Login / Cadastro' apenas para deslogados. O botão 'Sair' faz logout e redireciona para a página inicial. O menu lateral da área do cliente permanece exclusivo para logados. Todas as páginas continuam acessíveis após login.
