import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-semibold shadow-lg transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 active:scale-95",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 hover:shadow-xl',
        destructive:
          'bg-destructive text-white shadow-lg hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-2 border-primary/40 bg-background hover:bg-primary/5 hover:shadow-md text-primary',
        secondary: 'bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80',
        ghost: 'hover:bg-accent/40 hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2 text-base',
        sm: 'h-9 rounded-lg px-4 text-sm',
        lg: 'h-14 rounded-2xl px-10 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'ref' | 'as' | 'color'> &
  HTMLMotionProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    className?: string
    children?: React.ReactNode
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
  }

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    // Filtra dinamicamente todas as props de animação e style
    const safeProps = Object.fromEntries(
      Object.entries(props).filter(
        ([key]) =>
          ![
            'whileHover',
            'whileTap',
            'transition',
            'layout',
            'layoutId',
            'animate',
            'initial',
            'exit',
            'drag',
            'dragConstraints',
            'dragElastic',
            'dragMomentum',
            'dragPropagation',
            'onDrag',
            'onDragEnd',
            'onDragStart',
            'onDragTransitionEnd',
            'onDirectionLock',
            'onDragConstraintsChange',
            'onDragTransitionStart',
            'style',
          ].includes(key)
      )
    )
    return (
      <Slot
        data-slot='button'
        className={cn(buttonVariants({ variant, size, className }))}
        {...safeProps}
      >
        {children}
      </Slot>
    )
  }

  // Só passa motionProps para motion.button
  return (
    <motion.button
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export { Button, buttonVariants }
