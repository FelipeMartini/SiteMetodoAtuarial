/**
 * ComponenteBase
 * -----------------------------------------------------------------------------
 * Componente base para UI moderna, elegante e padronizada, com animação e variantes.
 *
 * - Sempre use este componente apenas em Client Components (arquivos com 'use client').
 * - NÃO use 'export *' neste arquivo. Use apenas exportação nomeada ou default.
 * - Nunca importe este componente diretamente em Server Components.
 * - Baseado nos padrões mais atuais de Next.js 15+, Framer Motion e shadcn/ui (2025).
 *
 * Exemplos de uso:
 *
 * import { ComponenteBase } from "@/components/ui/ComponenteBase";
 *
 * <ComponenteBase variant="accent" size="lg">Conteúdo</ComponenteBase>
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns
 * @see https://ui.shadcn.com/docs/components/card
 * @see https://motion.dev/docs/react
 */
'use client'
import * as React from 'react'
import { cva } from 'class-variance-authority'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

// Variantes e tamanhos padronizados, seguindo tokens globais do projeto
const componenteBaseVariants = cva('rounded-xl p-4 shadow-lg transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground',
      accent: 'bg-accent text-accent-foreground',
    },
    size: {
      sm: 'text-sm py-2 px-3',
      md: 'text-base py-3 px-5',
      lg: 'text-lg py-4 px-7',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export interface ComponenteBaseProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

/**
 * ComponenteBase
 *
 * @param variant - Variante visual (default | accent)
 * @param size - Tamanho (sm | md | lg)
 * @param className - Classes adicionais
 * @param children - Conteúdo do componente
 * @returns JSX.Element
 */
export const ComponenteBase = React.forwardRef<HTMLDivElement, ComponenteBaseProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(componenteBaseVariants({ variant, size, className }))}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, type: 'spring', bounce: 0.18 }}
      {...props}
    >
      {children}
    </motion.div>
  )
)
ComponenteBase.displayName = 'ComponenteBase'
