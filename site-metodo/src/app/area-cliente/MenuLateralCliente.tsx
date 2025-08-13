'use client'
// A diretiva 'use client' deve ser sempre a primeira linha do arquivo para garantir que o componente seja client-side
import React from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { checkClientPermission } from '@/lib/abac/client'
// Diretiva para garantir que o componente seja client-side
/**
 * Componente MenuLateralCliente
 * Menu lateral exclusivo para área do cliente, exibido apenas para usuários autenticados.
 * Os itens podem ser personalizados conforme necessidade do projeto.
 */

// Importação do componente Link do Next.js para navegação interna
import Link from 'next/link'

export default function MenuLateralCliente() {
  const { data: session } = useAuth()
  const [isAdmin, setIsAdmin] = React.useState(false)

  // Verifica se o usuário tem permissão admin usando ABAC puro
  React.useEffect(() => {
    const checkAdminPermission = async () => {
      if (!session?.user?.email) {
        setIsAdmin(false)
        return
      }

      try {
        // Verifica permissão para acessar dashboard admin usando ABAC
          const hasAdminAccess = await checkClientPermission(
            session.user.email,
            'admin:dashboard',
            'read'
        )
        setIsAdmin(hasAdminAccess)
      } catch (error) {
        console.error('Erro ao verificar permissões:', error)
        setIsAdmin(false)
      }
    }

    checkAdminPermission()
  }, [session?.user?.email])

  // Exibe Skeleton enquanto dados do usuário não estão disponíveis
  if (!session?.user) {
    return (
      <aside
        data-testid='menu-lateral'
        className='w-[220px] bg-card rounded-xl shadow-md p-6 mr-8 min-h-[320px] border border-border'
      >
        <nav className='flex flex-col gap-4'>
          <strong className='mb-3 text-lg text-primary'>
            <Skeleton className='h-[24px] w-[140px] mb-2' />
          </strong>
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className='h-[20px] w-[120px] mb-2' />
          ))}
        </nav>
      </aside>
    )
  }
  return (
    <aside
      data-testid='menu-lateral'
      className='w-[220px] bg-card rounded-xl shadow-md p-6 mr-8 min-h-[320px] border border-border'
    >
      <nav className='flex flex-col gap-4'>
        <strong className='mb-3 text-lg text-primary'>Menu do Cliente</strong>
        <Link
          href='/area-cliente'
          className='text-foreground font-medium text-base hover:text-primary hover:underline transition-colors'
        >
          Perfil
        </Link>
        <Link
          href='/area-cliente/account-linking'
          className='text-foreground font-medium text-base hover:text-primary hover:underline transition-colors'
        >
          Gerenciar Provedores
        </Link>
        <Link
          href='/servicos'
          className='text-foreground font-medium text-base hover:text-primary hover:underline transition-colors'
        >
          Serviços
        </Link>
        <Link
          href='/contato'
          className='text-foreground font-medium text-base hover:text-primary hover:underline transition-colors'
        >
          Contato / Orçamento
        </Link>
        <Link
          href='#'
          className='text-foreground font-medium text-base hover:text-primary hover:underline transition-colors'
        >
          Meus Documentos
        </Link>
        <Link
          href='#'
          className='text-foreground font-medium text-base hover:text-primary hover:underline transition-colors'
        >
          Solicitações
        </Link>
        {/* Exibe link administrativo para admins e staff */}
        {isAdmin && (
          <Link
            href='/area-cliente/dashboard-admin'
            className='text-red-600 dark:text-red-400 font-bold text-base hover:text-red-700 dark:hover:text-red-300 hover:underline transition-colors'
          >
            🛡️ Dashboard Admin
          </Link>
        )}
      </nav>
    </aside>
  )
}
