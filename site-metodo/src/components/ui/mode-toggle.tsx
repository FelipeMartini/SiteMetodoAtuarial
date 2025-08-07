"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Componente ModeToggle para alternar entre temas claro/escuro/sistema
 * Customizado com design moderno e transições suaves
 */
export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Evita hidratação incorreta
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative h-10 w-10 rounded-full border-2 border-muted-foreground/20 bg-background/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-accent hover:scale-105"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-full border-2 border-muted-foreground/20 bg-background/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-accent hover:scale-105 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 border-2 border-muted-foreground/10 bg-background/95 backdrop-blur-md shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer gap-3 py-3 px-4 transition-all duration-200 hover:bg-accent/80 focus:bg-accent/80"
        >
          <Sun className="h-4 w-4" />
          <span className="font-medium">Claro</span>
          {theme === "light" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer gap-3 py-3 px-4 transition-all duration-200 hover:bg-accent/80 focus:bg-accent/80"
        >
          <Moon className="h-4 w-4" />
          <span className="font-medium">Escuro</span>
          {theme === "dark" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer gap-3 py-3 px-4 transition-all duration-200 hover:bg-accent/80 focus:bg-accent/80"
        >
          <Monitor className="h-4 w-4" />
          <span className="font-medium">Sistema</span>
          {theme === "system" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
