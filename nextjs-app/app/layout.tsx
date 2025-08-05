import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
// Importa apenas o CSS global principal do app, conforme recomendação oficial do Next.js App Router
import LayoutCliente from "./LayoutCliente";
import ProvedorSessao from "./ProvedorSessao";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import StyledComponentsRegistry from './StyledComponentsRegistry';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
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
  // StyledComponentsRegistry garante SSR correto dos estilos do styled-components
  // Envolvendo todo o conteúdo do layout principal
  // Comentário: a ordem dos providers foi mantida para não alterar a lógica do app
  // Se precisar adicionar outros providers, coloque dentro do StyledComponentsRegistry
  return (
    <html lang="pt-BR" className={`${inter.variable} ${roboto.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <ErrorBoundary>
            <ProvedorSessao>
              <ThemeProvider>
                <LayoutCliente>
                  {children}
                </LayoutCliente>
              </ThemeProvider>
            </ProvedorSessao>
          </ErrorBoundary>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
