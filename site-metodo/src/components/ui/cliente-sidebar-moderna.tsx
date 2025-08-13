'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { checkClientPermission } from '@/lib/abac/client';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  User,
  Shield,
  Download,
  Plus,
  Bell,
  Activity,
  CreditCard,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  adminOnly?: boolean;
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/area-cliente',
    icon: LayoutDashboard
  },
  {
    title: 'Meus Documentos',
    href: '/area-cliente/documentos',
    icon: FileText,
    badge: '3'
  },
  {
    title: 'Nova Solicitação',
    href: '/area-cliente/nova-solicitacao',
    icon: Plus
  },
  {
    title: 'Mensagens',
    href: '/area-cliente/mensagens',
    icon: MessageSquare,
    badge: '2'
  },
  {
    title: 'Downloads',
    href: '/area-cliente/downloads',
    icon: Download
  },
  {
    title: 'Notificações',
    href: '/area-cliente/notificacoes',
    icon: Bell
  },
  {
    title: 'Atividades',
    href: '/area-cliente/atividades',
    icon: Activity
  },
  {
    title: 'Pagamentos',
    href: '/area-cliente/pagamentos',
    icon: CreditCard
  },
  {
    title: 'Configurações',
    href: '/area-cliente/configuracoes',
    icon: Settings
  },
  {
    title: 'Ajuda',
    href: '/area-cliente/ajuda',
    icon: HelpCircle
  },
  {
    title: '🛡️ Dashboard Admin',
    href: '/area-cliente/dashboard-admin',
    icon: Shield,
    adminOnly: true
  }
];

export function ClienteSidebarModerna({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Verifica se o usuário tem permissão admin
  React.useEffect(() => {
    const checkAdminPermission = async () => {
      if (!session?.user?.email) {
        setIsAdmin(false);
        return;
      }

      try {
        const hasAdminAccess = await checkClientPermission(
          session.user.email,
          'admin:dashboard',
          'read'
        );
        setIsAdmin(hasAdminAccess);
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        setIsAdmin(false);
      }
    };

    checkAdminPermission();
  }, [session?.user?.email]);

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return session?.user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getUserTypeDisplay = () => {
    if (session?.user?.email?.includes('@admin')) return 'Admin';
    if (session?.user?.email?.includes('@mod')) return 'Mod';
    return 'Cliente';
  };

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header do usuário */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {getUserTypeDisplay()}
          </Badge>
        </div>
      </div>

      {/* Navegação */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu Principal
          </p>
          
          {filteredNavigation.slice(0, 5).map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname ? (pathname === item.href || (item.href !== '/area-cliente' && pathname.startsWith(item.href))) : false;
            
            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 px-3',
                  isActive && 'bg-secondary/50 font-medium'
                )}
                asChild
              >
                <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
                  <IconComponent className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <Badge variant="outline" className="h-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            );
          })}

          <Separator className="my-3" />
          
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Ferramentas
          </p>
          
          {filteredNavigation.slice(5, -1).map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname ? (pathname === item.href || (item.href !== '/area-cliente' && pathname.startsWith(item.href))) : false;
            
            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 px-3',
                  isActive && 'bg-secondary/50 font-medium'
                )}
                asChild
              >
                <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
                  <IconComponent className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <Badge variant="outline" className="h-5 px-1.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            );
          })}

          {/* Link administrativo para admins */}
          {isAdmin && (
            <>
              <Separator className="my-3" />
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administração
              </p>
              {filteredNavigation.slice(-1).map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname ? pathname === item.href : false;
                
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn('w-full justify-start gap-3 px-3', isActive && 'bg-secondary/50 font-medium')}
                    asChild
                  >
                    <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
                      <IconComponent className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.title} <Badge variant="outline" className="ml-2">Admin</Badge></span>
                    </Link>
                  </Button>
                );
              })}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer com logout */}
      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-foreground"
          onClick={() => {
            // Implementar logout
            console.log('Logout clicked');
          }}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-72 transform border-r bg-background transition-transform duration-200 ease-in-out md:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn('hidden md:flex w-72 flex-col border-r bg-background', className)}>
        <SidebarContent />
      </aside>
    </>
  );
}
