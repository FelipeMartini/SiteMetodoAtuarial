// Componente Skeleton do shadcn/ui para placeholders de carregamento
// https://ui.shadcn.com/docs/components/skeleton

import * as React from "react"

import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-pulse rounded-md bg-muted", className)}
    {...props}
  />
))
Skeleton.displayName = "Skeleton"

export { Skeleton }
