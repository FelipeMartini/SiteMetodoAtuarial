// Import estático de CSS global (produção e dev). Em dev injetamos apenas regras de overlay via componente client-side.
import './globals.css'
import DevOverlayFix from '@/components/DevOverlayFix'
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
      <head>
        {/* Inline script anti-FOUC: aplica classe `dark` no html antes da hidratação do React */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `;(function(){try{var theme=localStorage.getItem('theme');if(theme===null){var m=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');if(m && m.matches){document.documentElement.classList.add('dark');} } else if(theme==='dark'){document.documentElement.classList.add('dark');} else if(theme==='light'){document.documentElement.classList.remove('dark');}}catch(e){}})()`
          }}
        />
      </head>
      <body>
        <>
          <FeatureFlagProvider>
            <TanstackQueryProvider>
              <LayoutCliente>
                <HydrateCurrentUser />
                <ThemeProviderClient />
                <DevOverlayFix />
                {children}
              </LayoutCliente>
            </TanstackQueryProvider>
          </FeatureFlagProvider>
        </>
      </body>
    </html>
  )
}
