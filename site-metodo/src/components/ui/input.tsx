"use client";
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { motion } from "framer-motion"
const inputVariants = cva(
  "flex w-full rounded-lg border bg-background px-3 py-2 text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary hover:border-primary/50 hover:shadow-md",
        destructive:
          "border-destructive/50 focus-visible:ring-2 focus-visible:ring-destructive/20 focus-visible:border-destructive hover:shadow-destructive/20",
        success:
          "border-success/50 focus-visible:ring-2 focus-visible:ring-success/20 focus-visible:border-success hover:shadow-success/20",
        ghost:
          "border-transparent bg-muted/50 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 hover:shadow-md",
      },
      inputSize: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 py-1 text-sm",
        lg: "h-14 px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
  VariantProps<typeof inputVariants> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, error, type, ...props }, ref) => {
    return (
      <motion.input
        type={type}
        className={cn(
          inputVariants({
            variant: error ? "destructive" : variant,
            inputSize,
            className
          })
        )}
        ref={ref}
        whileFocus={{ scale: 1.03, boxShadow: "0 4px 16px 0 rgba(0,0,0,0.08)" }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
