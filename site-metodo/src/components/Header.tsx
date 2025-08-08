"use client"

import { ModeToggle } from "@/components/ui/mode-toggle"
import { MainNavigation } from "@/components/ui/main-navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import Link from "next/link"
import { useRouter } from 'next/navigation'

/**
 * Header customizado com sistema de temas e navegação avançada
 * Baseado nos padrões do fuse-react adaptado para shadcn/ui
 */
export function Header() {
  const { data: session, status } = useAuth();
  const router = useRouter();
  // Logout manual: remove cookie e redireciona
  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    // Aguarda a sessão ser invalidada e força atualização do estado
    setTimeout(() => {
      router.push('/');
      window.location.reload(); // força atualização do menu
    }, 200);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo e navegação */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">MA</span>
            </div>
            <span className="font-bold text-lg text-gradient">
              Método Atuarial
            </span>
          </Link>

          {/* Navegação principal - apenas em desktop */}
          <div className="hidden lg:block">
            <MainNavigation />
          </div>
        </div>

        {/* Ações do usuário */}
        <div className="flex items-center gap-3">
          {/* Área de usuário */}
          {status === 'loading' ? (
            <Button variant="ghost" size="sm" disabled>
              ...
            </Button>
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/area-cliente">
                <Button variant="secondary" size="sm">
                  Área Cliente
                </Button>
              </Link>
              {/* Exibe Dashboard Admin só para accessLevel 5 */}
              {session.user.accessLevel === 5 && (
                <Link href="/area-cliente/dashboard-admin">
                  <Button variant="destructive" size="sm">
                    Dashboard Admin
                  </Button>
                </Link>
              )}
              <span className="hidden md:inline text-sm text-muted-foreground">
                Olá, {session.user.name || session.user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  Entrar
                </Button>
              </Link>
              <Link href="/criar-conta">
                <Button size="sm" variant="gradient">
                  Criar Conta
                </Button>
              </Link>
            </>
          )}

          {/* Mode Toggle */}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
