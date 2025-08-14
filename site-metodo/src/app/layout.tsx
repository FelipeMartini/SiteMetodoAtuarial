import './globals.css' // CSS global com Tailwind e variáveis CSS do tema
import LayoutCliente from '@/app/LayoutCliente'

import ThemeProviderClient from '@/components/ui/ThemeProviderClient'
import { HydrateCurrentUser } from '@/components/ui/ThemeProviderZustand'
import { FeatureFlagProvider } from '@/components/feature-flags/FeatureFlagProvider'
import TanstackQueryProvider from '@/app/providers/TanstackQueryProvider'

// import { ErrorBoundary } from "@/components/ErrorBoundary";

// Removido uso de next/font/google por instabilidade de rede

export const metadata = {
  title: 'Método Atuarial - Consultoria Especializada em Previdência',
  description:
    'Consultoria especializada em previdência e soluções atuariais. Oferecemos avaliação de passivos, relatórios regulatórios, modelagem atuarial e gestão de riscos.',
  keywords:
    'consultoria atuarial, previdência, passivos atuariais, relatórios regulatórios, gestão de riscos, modelagem atuarial',
  authors: [{ name: 'Método Atuarial' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4F46E5' },
    { media: '(prefers-color-scheme: dark)', color: '#0F0F23' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <body>
  <>
          <FeatureFlagProvider>
            <TanstackQueryProvider>
              <LayoutCliente>
                <HydrateCurrentUser />
    <ThemeProviderClient />
                {children}
              </LayoutCliente>
            </TanstackQueryProvider>
          </FeatureFlagProvider>
  </>
      </body>
    </html>
  )
}
