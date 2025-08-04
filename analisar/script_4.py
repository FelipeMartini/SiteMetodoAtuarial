# 4. ARQUIVO: layout.tsx corrigido com registry
layout_corrigido = '''import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/App.css";
import "../styles/index.css";
import LayoutCliente from "./LayoutCliente";
import ProvedorSessao from "./ProvedorSessao";
import { ProvedorTema } from "./theme/ContextoTema";
import { ErrorBoundary } from "./components/ErrorBoundary";
import StyledComponentsRegistry from "./lib/StyledComponentsRegistry";

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
  metadataBase: new URL('https://metodoatuarial.com.br'),
  openGraph: {
    title: "Método Atuarial - Consultoria Especializada",
    description: "Consultoria especializada em previdência e soluções atuariais",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4F46E5" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0F23" }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Meta tag para styled-components SSR */}
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* 
          StyledComponentsRegistry DEVE ser o wrapper mais externo 
          para coletar estilos antes de qualquer renderização
        */}
        <StyledComponentsRegistry>
          <ErrorBoundary>
            <ProvedorSessao>
              <ProvedorTema>
                <LayoutCliente>
                  {children}
                </LayoutCliente>
              </ProvedorTema>
            </ProvedorSessao>
          </ErrorBoundary>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

/**
 * Principais mudanças no layout:
 * 
 * 1. **StyledComponentsRegistry como wrapper principal**:
 *    - Deve ser o componente mais externo para coletar todos os estilos
 *    - Garante que estilos sejam injetados no <head> antes do conteúdo
 * 
 * 2. **Meta tag para insertion point**:
 *    - Permite controle preciso de onde os estilos são inseridos
 *    - Evita conflitos com outros CSS-in-JS
 * 
 * 3. **Ordem dos providers**:
 *    - Registry → ErrorBoundary → Sessão → Tema → Layout → Children
 *    - Essa ordem garante funcionamento correto de todos os recursos
 * 
 * 4. **Metadata melhorado**:
 *    - OpenGraph para redes sociais
 *    - metadataBase para URLs absolutas
 *    - Locale brasileiro
 */'''

# Salvando arquivo 4
with open('layout_corrigido.tsx', 'w', encoding='utf-8') as f:
    f.write(layout_corrigido)

print("✅ Arquivo 4 criado: layout_corrigido.tsx")