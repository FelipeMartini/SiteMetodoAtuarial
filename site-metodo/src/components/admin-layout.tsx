'use client'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'
import { Bell, Search, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface AdminLayoutProps {
  children: React.ReactNode
}

// Função para gerar breadcrumbs baseado na rota
function generateBreadcrumbs(pathname: string | null) {
  if (!pathname) return []

  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = []

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`

    // Mapear rotas para títulos legíveis
    const titleMap: Record<string, string> = {
      'area-cliente': 'Área do Cliente',
      'dashboard-admin': 'Dashboard Admin',
      admin: 'Administração',
      usuarios: 'Usuários',
      lista: 'Lista',
      permissoes: 'Permissões',
      auditoria: 'Auditoria',
      calculos: 'Cálculos Atuariais',
      importar: 'Importar Dados',
      tabelas: 'Tabelas',
      relatorios: 'Relatórios',
      configuracoes: 'Configurações',
      logs: 'Logs do Sistema',
      backup: 'Backup & Restore',
      'api-keys': 'API Keys',
      notificacoes: 'Notificações',
      emails: 'E-mails',
      agenda: 'Agenda',
      financeiro: 'Financeiro',
      faturamento: 'Faturamento',
    }

    breadcrumbs.push({
      title: titleMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: currentPath,
    })
  }

  return breadcrumbs
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const breadcrumbs = generateBreadcrumbs(pathname)

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full'>
        <AdminSidebar />

        <div className='flex flex-1 flex-col'>
          {/* Header */}
          <header className='flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />

            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.href} className='flex items-center gap-1.5'>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.title}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </>
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Search and Actions */}
            <div className='ml-auto flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input placeholder='Buscar...' className='w-[200px] pl-8 md:w-[300px]' />
              </div>

              <Button variant='ghost' size='icon' className='relative'>
                <Bell className='h-4 w-4' />
                <Badge
                  variant='destructive'
                  className='absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs'
                >
                  3
                </Badge>
              </Button>

              <Button variant='ghost' size='icon'>
                <Settings className='h-4 w-4' />
              </Button>

              {/* Alternância de tema acessível unificada */}
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className='flex-1 overflow-auto p-6'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
