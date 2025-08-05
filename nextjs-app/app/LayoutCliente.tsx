"use client";

// Layout cliente moderno usando o novo sistema de temas
import React, { ReactNode, Suspense } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Container, Flex, Texto, Secao } from '../styles/ComponentesBase';
import { Botao } from "./design-system/Botao";
import ThemeToggle from "./components/ThemeToggle";

// Lazy loading do Rodape para otimizar o carregamento
const Rodape = React.lazy(() => import("./Rodape"));

// Header modernizado
function Header() {
  const { data: session } = useSession();

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
            <Texto $variante="h3" $peso="negrito">
              Método Atuarial
            </Texto>
          </Link>

          {/* Navegação */}
          <Flex $alinhar="center" $gap="md">
            <nav>
              <Flex $gap="sm">
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
              <Flex $alinhar="center" $gap="sm">
                <Link href="/area-cliente" style={{ textDecoration: 'none' }}>
                  <Botao variant="secondary" size="sm">
                    Área Cliente
                  </Botao>
                </Link>
                <Texto $variante="legenda" $cor="secundario">
                  Olá, {session.user?.name || session.user?.email}
                </Texto>
                <Botao
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
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
  return (
    <Container>
      <Flex $direcao="column" style={{ minHeight: '100vh' }}>
        <Header />

        <main style={{ flex: 1 }}>
          <Secao $padding="lg">
            {children}
          </Secao>
        </main>

        <Suspense fallback={
          <Flex $justificar="center" $alinhar="center" style={{ padding: '2rem' }}>
            <Texto $cor="secundario">Carregando rodapé...</Texto>
          </Flex>
        }>
          <Rodape />
        </Suspense>
      </Flex>
    </Container>
  );
};

export default LayoutCliente;
