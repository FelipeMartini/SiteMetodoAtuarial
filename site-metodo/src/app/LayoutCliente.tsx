"use client";

// Layout cliente moderno usando o novo sistema de temas
import React, { ReactNode, Suspense } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useSessaoAuth } from '@/hooks/useSessaoAuth';
import { Container, Flex, Texto, Secao } from '../styles/ComponentesBase';
import { Botao } from "./design-system/Botao";
import ThemeToggle from "./components/ThemeToggle";
import { GlobalStyles } from '../styles/GlobalStyles';
import { useTheme } from '@core/theme/ContextoTema';

// Lazy loading do Rodape para otimizar o carregamento
const Rodape = React.lazy(() => import("./Rodape"));

// Header modernizado
function Header() {
  // Hook de autenticação unificado (Auth.js puro)
  const { usuario: session, logout } = useSessaoAuth();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  // Define cor do texto do menu conforme tema
  const menuTextColor = isDarkMode ? 'onPrimary' : 'primary';
  // Função de logout que também redireciona para a home
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
          <Flex $gap="0.75rem">
            <nav>
              <Flex $gap="0.75rem">
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm">
                    Início
                  </Botao>
                </Link>
                <Link href="/sobre" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm">
                    Sobre
                  </Botao>
                </Link>
                <Link href="/servicos" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm">
                    Serviços
                  </Botao>
                </Link>
                <Link href="/contato" style={{ textDecoration: 'none' }}>
                  <Botao variant="ghost" size="sm">
                    Contato
                  </Botao>
                </Link>
              </Flex>
            </nav>

            {/* Área de usuário */}
            {session ? (
              <Flex $align="center" $gap="0.75rem">
                <Link href="/area-cliente" style={{ textDecoration: 'none' }}>
                  <Botao variant="secondary" size="sm">
                    Área Cliente
                  </Botao>
                </Link>
                <Texto $variante="caption">
                  Olá, {session.name || session.email}
                </Texto>
                <Botao
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  Sair
                </Botao>
              </Flex>
            ) : (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Botao variant="primary" size="sm">
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
  // Removido menuTextClass pois Header não aceita essa prop
  return (
    <>
      <GlobalStyles theme={currentTheme} />
      {/* <MenuTextStyle /> Removido: estilização global migrada para styled-components */}
      <Container>
        <Flex $direction="column" style={{ minHeight: '100vh' }}>
          <Header />

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
