"use client"

// Layout base da área cliente
import { ReactNode } from "react"
import { Toaster } from "@/components/ui"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/app/providers/SessionProvider"

/**
 * Layout base para todas as páginas da área cliente.
 * Inclui providers globais, navegação lateral e mensageria.
 */
export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <div className="min-h-screen flex bg-background">
          {/* Sidebar de navegação (placeholder) */}
          <aside className="w-64 bg-card border-r hidden md:block">
            {/* TODO: Implementar menu lateral com links para perfil, segurança, sessões, etc. */}
            <nav className="p-6">
              <ul className="space-y-4">
                <li><a href="/cliente" className="font-semibold">Resumo</a></li>
                <li><a href="/cliente/perfil">Perfil</a></li>
                <li><a href="/cliente/seguranca">Segurança</a></li>
                <li><a href="/cliente/sessoes">Sessões</a></li>
                {/* <li><a href="/cliente/billing">Billing</a></li> */}
              </ul>
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
          <Toaster />
        </div>
      </ThemeProvider>
    </SessionProvider>
  )
}
