
import "./globals.css"; // CSS global com Tailwind e variáveis CSS do tema
import type { Metadata } from "next";
import LayoutCliente from "@/app/LayoutCliente";

import { ThemeProvider } from '@/components/theme-provider';
import { FeatureFlagProvider } from '@/components/feature-flags/FeatureFlagProvider';
import { SessionProvider } from '@/app/providers/SessionProvider';
import { AuthSessionProvider } from '@/app/providers/AuthSessionProvider';
import TanstackQueryProvider from '@/app/providers/TanstackQueryProvider';

// import { ErrorBoundary } from "@/components/ErrorBoundary";

// Removido uso de next/font/google por instabilidade de rede

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
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <FeatureFlagProvider>
          <ThemeProvider>
            <TanstackQueryProvider>
              <AuthSessionProvider>
                <SessionProvider>
                  <LayoutCliente>
                    {children}
                  </LayoutCliente>
                </SessionProvider>
              </AuthSessionProvider>
            </TanstackQueryProvider>
          </ThemeProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
