import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/App.css";
import "../styles/index.css";
import Link from "next/link";
import { Container, AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import theme from './mui-theme';
import Rodape from "./Rodape";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Método Atuarial - Consultoria Especializada em Previdência",
  description: "Consultoria especializada em previdência e soluções atuariais. Oferecemos avaliação de passivos, relatórios regulatórios, modelagem atuarial e gestão de riscos.",
  keywords: "consultoria atuarial, previdência, passivos atuariais, relatórios regulatórios, gestão de riscos, modelagem atuarial",
  authors: [{ name: "Método Atuarial" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Arquivo principal de layout do projeto Next.js
  // Define o layout global, menu de navegação e integra o footer moderno
  return (
    <html lang="pt-br">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider theme={theme}>
          <AppBar position="static" color="primary">
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
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ py: 4, minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box component="main" sx={{ width: '100%', maxWidth: 900 }}>
              {children}
            </Box>
          </Container>
          {/* Footer moderno e abstrato */}
          <Rodape />
        </ThemeProvider>
      </body>
    </html>
  );
}
