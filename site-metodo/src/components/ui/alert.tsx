import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-xl border-2 px-6 py-4 text-base grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-4 gap-y-1 items-start [&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current shadow-lg backdrop-blur-md',
  {
    variants: {
      variant: {
        default: 'bg-card/95 text-card-foreground border-border',
        destructive:
          'text-destructive bg-card/90 border-destructive/40 [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface AlertProps extends HTMLMotionProps<'div'>, VariantProps<typeof alertVariants> {
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'destructive'
}

function Alert({ className, variant, children, ...props }: AlertProps) {
  return (
    <motion.div
      data-slot='alert'
      role='alert'
      className={cn(alertVariants({ variant }), className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.22, type: 'spring', bounce: 0.18 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-title'
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight text-lg',
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-description'
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-base [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
