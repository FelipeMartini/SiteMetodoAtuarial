"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Calculator,
  FileSpreadsheet,
  TrendingUp,
  Users,
  Building,
  ShieldCheck,
  Briefcase,
  ChevronRight
} from "lucide-react"

import { Badge } from "@/components/ui/badge";

import { cn } from "@/utils/cn"

/**
 * Componente de Navegação Principal inspirado no fuse-react
 * Com menus dropdown e design moderno
 */
export const MainNavigation: React.FC = () => {
  const pathname = usePathname()

  const services = [
    {
      title: "Avaliação Atuarial",
      description: "Cálculo de passivos e provisões técnicas",
      icon: Calculator,
      href: "/servicos/avaliacao-atuarial",
      badge: "Popular"
    },
    {
      title: "Relatórios Regulatórios",
      description: "Demonstrações para órgãos reguladores",
      icon: FileSpreadsheet,
      href: "/servicos/relatorios-regulatorios"
    },
    {
      title: "Modelagem de Riscos",
      description: "Análise e mensuração de riscos atuariais",
      icon: TrendingUp,
      href: "/servicos/modelagem-riscos"
    },
    {
      title: "Auditoria Atuarial",
      description: "Revisão independente de cálculos",
      icon: ShieldCheck,
      href: "/servicos/auditoria-atuarial"
    }
  ]

  const solutions = [
    {
      title: "Previdência Privada",
      description: "Fundos de pensão e entidades fechadas",
      icon: Users,
      href: "/solucoes/previdencia-privada"
    },
    {
      title: "Seguradoras",
      description: "Companhias de seguros e resseguros",
      icon: Building,
      href: "/solucoes/seguradoras"
    },
    {
      title: "Consultorias",
      description: "Apoio técnico especializado",
      icon: Briefcase,
      href: "/solucoes/consultorias"
    }
  ]

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap">
        {/* Início */}
        <NavigationMenuItem>
          <Link href="/">
            <NavigationMenuLink
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                pathname === "/" && "bg-accent text-accent-foreground"
              )}
            >
              Início
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Serviços */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              pathname?.startsWith("/servicos") && "bg-accent text-accent-foreground"
            )}
          >
            Serviços
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
              {services.map((service) => (
                <NavigationMenuLink key={service.href} asChild>
                  <Link
                    href={service.href}
                    className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <service.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium leading-none">
                            {service.title}
                          </span>
                          {service.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {service.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Soluções */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              pathname?.startsWith("/solucoes") && "bg-accent text-accent-foreground"
            )}
          >
            Soluções
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 md:w-[400px]">
              {solutions.map((solution) => (
                <NavigationMenuLink key={solution.href} asChild>
                  <Link
                    href={solution.href}
                    className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <solution.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium leading-none">
                          {solution.title}
                        </span>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          {solution.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                    </div>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Empresa */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              pathname?.startsWith("/sobre") || pathname?.startsWith("/documentacao") 
                ? "bg-accent text-accent-foreground" 
                : ""
            )}
          >
            Empresa
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <div className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/sobre-nos"
                  >
                    <Building className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Método Atuarial
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Conheça nossa história, missão e valores. Mais de 15 anos transformando o mercado atuarial.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              <NavigationMenuLink asChild>
                <Link href="/sobre" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="text-sm font-medium leading-none">Sobre Nós</div>
                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                    Nossa trajetória e compromisso com a excelência
                  </p>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link href="/documentacao" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <div className="text-sm font-medium leading-none">Documentação</div>
                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                    APIs, guias técnicos e recursos para desenvolvedores
                  </p>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Contato */}
        <NavigationMenuItem>
          <Link href="/contato">
            <NavigationMenuLink
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                pathname === "/contato" && "bg-accent text-accent-foreground"
              )}
            >
              Contato
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
