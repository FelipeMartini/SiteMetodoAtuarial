"use client";

// Layout cliente moderno usando o novo sistema de temas
import React, { ReactNode, Suspense } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Container, Flex, Texto, Secao, MenuTextStyle } from '../styles/ComponentesBase';
import { Botao } from "./design-system/Botao";
import ThemeToggle from "./components/ThemeToggle";
import { GlobalStyles } from '../styles/GlobalStyles';
import { useTheme } from './contexts/ThemeContext';

// Lazy loading do Rodape para otimizar o carregamento
const Rodape = React.lazy(() => import("./Rodape"));

// Header modernizado
function Header({ menuTextClass }: { menuTextClass: string }) {
  const { data: session } = useSession();
  const { currentTheme, isDarkMode } = useTheme();
  const menuTextColor = isDarkMode ? currentTheme.colors.text : undefined;
  return (
    <header style={{
      borderBottom: '1px solid var(--cor-borda)',
      backgroundColor: 'var(--cor-superficie)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <Container>
        <Flex
          $justify="space-between"
          $align="center"
          style={{ padding: '1rem 0' }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Texto $variante="h3" $peso="negrito" $cor={menuTextColor}>
              Método Atuarial
            </Texto>
          </Link>

          {/* Navegação */}
          <Flex $align="center" $gap="1rem">
            <nav>
              <Flex $gap="0.75rem">
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm" className={menuTextClass}>
                    Início
                  </Botao>
                </Link>
                <Link href="/sobre" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm" className={menuTextClass}>
                    Sobre
                  </Botao>
                </Link>
                <Link href="/servicos" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm" className={menuTextClass}>
                    Serviços
                  </Botao>
                </Link>
                <Link href="/contato" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm" className={menuTextClass}>
                    Contato
                  </Botao>
                </Link>
              </Flex>
            </nav>

            {/* Área de usuário */}
            {session ? (
              <Flex $align="center" $gap="0.75rem">
                <Link href="/area-cliente" style={{ textDecoration: 'none' }}>
                  <Botao variant="secondary" size="sm" className={menuTextClass}>
                    Área Cliente
                  </Botao>
                </Link>
                <Texto $variante="caption" className={menuTextClass}>
                  Olá, {session.user?.name || session.user?.email}
                </Texto>
                <Botao
                  variant="ghost"
                  size="sm"
                  className={menuTextClass}
                  onClick={() => signOut()}
                >
                  Sair
                </Botao>
              </Flex>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Botao variant="primary" size="sm" className={menuTextClass}>
                  Entrar
                </Botao>
              </Link>
            )}

            <ThemeToggle />
          </Flex>
        </Flex>
      </Container>
    </header>
  );
}

// Layout principal
interface LayoutClienteProps {
  children: ReactNode;
}

const LayoutCliente: React.FC<LayoutClienteProps> = ({ children }) => {
  const { currentTheme } = useTheme();

  // Adiciona estilos globais para cor do menu no modo escuro
  const { isDarkMode } = useTheme();
  const menuTextClass = isDarkMode ? 'menu-text-dark' : '';
  return (
    <>
      <GlobalStyles theme={currentTheme} />
      <MenuTextStyle />
      <Container>
        <Flex $direction="column" style={{ minHeight: '100vh' }}>
          <Header menuTextClass={menuTextClass} />

          <main style={{ flex: 1 }}>
            <Secao $padding="lg">
              {children}
            </Secao>
          </main>

          <Suspense fallback={
            <Flex $justify="center" $align="center" style={{ padding: '2rem' }}>
              <Texto $cor="secundario">Carregando rodapé...</Texto>
            </Flex>
          }>
            <Rodape />
          </Suspense>
        </Flex>
      </Container>
    </>
  );
};

export default LayoutCliente;
