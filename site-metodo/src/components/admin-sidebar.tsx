'use client'

import { 
  BarChart3, 
  Settings, 
  Users, 
  FileText, 
  Shield, 
  Activity,
  Database,
  Bell,
  MessageSquare,
  Calendar,
  TrendingUp,
  Key,
  Archive,
  ChevronRight,
  Home,
  Calculator,
  Wallet
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useSession, signOut } from 'next-auth/react'

// Tipos para o menu
interface BaseMenuItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
}

interface SimpleMenuItem extends BaseMenuItem {
  url: string
  badge?: string
}

interface MenuItemWithSubItems extends BaseMenuItem {
  badge?: string
  items: Array<{
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
  }>
}

type AdminMenuItem = SimpleMenuItem | MenuItemWithSubItems

// Menu items para o admin
const adminMenuItems: AdminMenuItem[] = [
  {
    title: 'Dashboard',
    url: '/area-cliente/dashboard-admin',
    icon: Home,
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: BarChart3,
    badge: 'New',
  },
  {
    title: 'Usuários',
    icon: Users,
    items: [
      {
        title: 'Lista de Usuários',
        url: '/admin/usuarios/lista',
        icon: Users,
      },
      {
        title: 'Permissões',
        url: '/admin/usuarios/permissoes', 
        icon: Shield,
      },
      {
        title: 'Auditoria',
        url: '/admin/auditoria',
        icon: Activity,
      },
    ],
  },
  {
    title: 'Cálculos Atuariais',
    icon: Calculator,
    badge: 'Beta',
    items: [
      {
        title: 'Importar Dados',
        url: '/admin/calculos/importar',
        icon: Database,
      },
      {
        title: 'Tabelas Atuariais',
        url: '/admin/calculos/tabelas',
        icon: FileText,
      },
      {
        title: 'Relatórios',
        url: '/admin/calculos/relatorios',
        icon: TrendingUp,
      },
    ],
  },
  {
    title: 'Sistema',
    icon: Settings,
    items: [
      {
        title: 'Configurações',
        url: '/admin/configuracoes',
        icon: Settings,
      },
      {
        title: 'Logs do Sistema',
        url: '/admin/logs',
        icon: FileText,
      },
      {
        title: 'Backup & Restore',
        url: '/admin/backup',
        icon: Archive,
      },
      {
        title: 'API Keys',
        url: '/admin/api-keys',
        icon: Key,
      },
    ],
  },
  {
    title: 'Comunicação',
    icon: MessageSquare,
    items: [
      {
        title: 'Notificações',
        url: '/admin/notificacoes',
        icon: Bell,
        badge: '12',
      },
      {
        title: 'E-mails',
        url: '/admin/emails',
        icon: MessageSquare,
      },
      {
        title: 'Agenda',
        url: '/admin/agenda',
        icon: Calendar,
      },
    ],
  },
  {
    title: 'Financeiro',
    icon: Wallet,
    items: [
      {
        title: 'Faturamento',
        url: '/admin/financeiro/faturamento',
        icon: TrendingUp,
      },
      {
        title: 'Relatórios Fiscais',
        url: '/admin/financeiro/relatorios',
        icon: FileText,
      },
    ],
  },
] as const

// Helper para verificar se o item tem subitens
function hasSubItems(item: AdminMenuItem): item is MenuItemWithSubItems {
  return 'items' in item
}

export function AdminSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActiveUrl = (url: string) => {
    return pathname === url
  }

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Método Atuarial</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <div key={item.title}>
                  {hasSubItems(item) ? (
                    <Collapsible className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            {'badge' in item && item.badge && (
                              <SidebarMenuBadge className="ml-auto">
                                {item.badge}
                              </SidebarMenuBadge>
                            )}
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={isActiveUrl(subItem.url)}>
                                  <Link href={subItem.url}>
                                    <subItem.icon className="h-4 w-4" />
                                    <span>{subItem.title}</span>
                                    {'badge' in subItem && subItem.badge && (
                                      <SidebarMenuBadge className="ml-auto">
                                        {subItem.badge}
                                      </SidebarMenuBadge>
                                    )}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActiveUrl((item as SimpleMenuItem).url)}>
                        <Link href={(item as SimpleMenuItem).url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {'badge' in item && item.badge && (
                            <SidebarMenuBadge className="ml-auto">
                              {item.badge}
                            </SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage 
                      src={session?.user?.image || ''} 
                      alt={session?.user?.name || 'Admin'} 
                    />
                    <AvatarFallback className="rounded-lg">
                      {session?.user?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name || 'Admin'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {session?.user?.email || 'admin@metodoatuarial.com'}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-auto size-4"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/area-cliente/perfil">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações da Conta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/configuracoes">
                    <Shield className="mr-2 h-4 w-4" />
                    Configurações do Sistema
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => signOut({ redirectTo: '/' })}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
