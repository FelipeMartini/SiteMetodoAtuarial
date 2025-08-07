
"use client";
// Componente de layout principal do cliente, renderiza o Header e os filhos
import React from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useSessaoAuth } from '@/hooks/useSessaoAuth';
import { Container, Flex, Texto } from '../styles/ComponentesBase';
import { Botao } from "./design-system/Botao";
import ThemeToggle from "./components/ThemeToggle";
import { useTheme } from '@core/theme/ContextoTema';

export default function LayoutCliente({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

function Header() {
  const { usuario: session, status, logout } = useSessaoAuth();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const menuTextColor = isDarkMode ? 'onPrimary' : 'primary';
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  return (
    <header style={{
      borderBottom: '1px solid var(--cor-borda)',
      backgroundColor: 'var(--cor-superficie)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <Container>
        <Flex $justify="space-between" $align="center" style={{ padding: '1rem 0' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Texto $variante="h3" $peso="negrito" $cor={menuTextColor}>
              Método Atuarial
            </Texto>
          </Link>
          {/* Navegação */}
          <Flex $gap="0.75rem">
            <nav>
              <Flex $gap="0.75rem">
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm">Início</Botao>
                </Link>
                <Link href="/sobre" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm">Sobre</Botao>
                </Link>
                <Link href="/servicos" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm">Serviços</Botao>
                </Link>
                <Link href="/contato" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm">Contato</Botao>
                </Link>
              </Flex>
            </nav>
            {/* Área de usuário */}
            {status === 'loading' ? (
              <Botao variant="ghost" size="sm" disabled>...</Botao>
            ) : session ? (
              <Flex $align="center" $gap="0.75rem">
                <Link href="/area-cliente" style={{ textDecoration: 'none' }}>
                  <Botao variant="secondary" size="sm">Área Cliente</Botao>
                </Link>
                <Texto $variante="caption">Olá, {session.name || session.email}</Texto>
                <Botao variant="ghost" size="sm" onClick={handleLogout}>Sair</Botao>
              </Flex>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Botao variant="primary" size="sm">Entrar</Botao>
              </Link>
            )}
            <ThemeToggle />
          </Flex>
        </Flex>
      </Container>
    </header>
  );
}
