import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/App.css";
import "../styles/index.css";
import LayoutCliente from "./LayoutCliente";
import ProvedorSessao from "./ProvedorSessao";

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


// Componente padrão do Next.js para layout global
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* ProvedorSessao garante que SessionProvider seja client-side, evitando erro de contexto em Server Components */}
        <ProvedorSessao>
          <LayoutCliente>{children}</LayoutCliente>
        </ProvedorSessao>
      </body>
    </html>
  );
}
// Comentário: Corrigido erro de sintaxe. O layout global agora segue o padrão do Next.js, recebendo children como parâmetro e retornando o HTML corretamente.
