"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const loadingVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-primary",
        secondary: "text-secondary-foreground",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
      },
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof loadingVariants> {
  text?: string
}

/**
 * Componente Loading Spinner inspirado no fuse-react
 * Com variants customizados e animações suaves
 */
const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, variant, size, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-3", className)}
        {...props}
      >
        <div className={cn(loadingVariants({ variant, size }))}>
          <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6v-4z"
            ></path>
          </svg>
        </div>
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

/**
 * Componente de Loading para páginas inteiras
 */
interface PageLoadingProps {
  text?: string
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  text = "Carregando..."
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="xl" />
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium">Aguarde um momento</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente de Loading inline para botões
 */
interface ButtonLoadingProps {
  size?: "sm" | "default" | "lg"
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  size = "default"
}) => {
  return (
    <LoadingSpinner
      size={size}
      className="mr-2"
    />
  )
}

export { LoadingSpinner, loadingVariants }
