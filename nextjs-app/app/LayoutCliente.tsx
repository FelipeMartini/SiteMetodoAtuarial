"use client";
// Importações individuais do Material-UI para melhor performance
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
// ...existing code...
import { ProvedorTema, useTema, ContextoTema } from "./contextoTema";
// Lazy loading do Rodape para otimizar o carregamento do layout
import React, { ReactNode, Suspense } from "react";
const Rodape = React.lazy(() => import("./Rodape"));
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// Componente SeletorTema para alternância de tema
function SeletorTema() {
  const { temaAtual, setTemaAtual } = useTema();
  return (
    <Box sx={{ ml: 2, minWidth: 120 }}>
      <FormControl size="small" variant="outlined" fullWidth>
        <InputLabel id="seletor-tema-label">Tema</InputLabel>
        <Select
          labelId="seletor-tema-label"
          id="seletor-tema"
          value={temaAtual}
          label="Tema"
          onChange={(e) => setTemaAtual(e.target.value as "escuro" | "claro")}
        >
          <MenuItem value="escuro">Tema Escuro</MenuItem>
          <MenuItem value="claro">Tema Claro</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

/**
 * Componente de layout principal do cliente.
 * Renderiza navegação, alternância de tema, autenticação e rodapé.
 * Nomenclatura e props padronizadas em português para máxima clareza.
 *
 * @param children Elementos filhos a serem exibidos no conteúdo principal.
 */
const LayoutCliente: React.FC<{ children: ReactNode }> = React.memo(function LayoutCliente({ children }) {
  const { status } = useSession();
  return (
    <ProvedorTema>
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
              <Box sx={{ minHeight: "100vh", background: temaMui.palette.background.default, transition: "background 0.3s" }}>
                <AppBar position="static" color="primary" sx={{ backgroundColor: temaMui.palette.primary.main }}>
                  <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      Método Atuarial
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button color="inherit" component={Link} href="/">Início</Button>
                      <Button color="inherit" component={Link} href="/contato">Contato</Button>
                    </Box>
                    <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
                      {status === "authenticated" && (
                        <>
                          <Button color="inherit" component={Link} href="/area-cliente">Área do Cliente</Button>
                          <Button color="inherit" onClick={() => signOut({ callbackUrl: "/" })}>Sair</Button>
                        </>
                      )}
                      {status !== "authenticated" && (
                        <Button color="inherit" component={Link} href="/login">Login / Cadastro</Button>
                      )}
                      <SeletorTema />
                    </Box>
                  </Toolbar>
                </AppBar>
                <Container maxWidth="lg" sx={{ py: 4, minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <Box component="main" sx={{ width: "100%", maxWidth: 900 }}>
                    {children}
                  </Box>
                </Container>
                <Suspense fallback={<div>Carregando rodapé...</div>}>
                  <Rodape />
                </Suspense>
              </Box>
            </ThemeProvider>
          );
        }}
      </ContextoTema.Consumer>
    </ProvedorTema>
  );
});

export default LayoutCliente;