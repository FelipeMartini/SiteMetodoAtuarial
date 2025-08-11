// Componente Skeleton baseado no padrão shadcn/ui
import * as React from 'react'
import { cn } from '@/utils/cn'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
))
Skeleton.displayName = 'Skeleton'

export { Skeleton }
