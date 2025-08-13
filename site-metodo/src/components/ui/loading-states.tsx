"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingCardProps {
  className?: string
  rows?: number
}

/**
 * Skeleton card para loading states
 * Componente reutilizável com padrões acessíveis
 */
export function LoadingCard({ className, rows = 3 }: LoadingCardProps) {
  return (
    <div className={cn("p-4 space-y-3 border rounded-lg", className)}>
      <Skeleton className="h-4 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  )
}

interface LoadingTableProps {
  className?: string
  rows?: number
  columns?: number
}

/**
 * Skeleton table para tabelas em loading
 */
export function LoadingTable({ className, rows = 5, columns = 4 }: LoadingTableProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex space-x-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

interface LoadingListProps {
  className?: string
  items?: number
}

/**
 * Skeleton list para listas em loading
 */
export function LoadingList({ className, items = 3 }: LoadingListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 border rounded">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface LoadingStatsProps {
  className?: string
  cards?: number
}

/**
 * Skeleton stats para cards de estatísticas
 */
export function LoadingStats({ className, cards = 4 }: LoadingStatsProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  )
}

/**
 * Loading state para página inteira
 */
export function LoadingPage({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Stats */}
      <LoadingStats />
      
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LoadingTable />
        </div>
        <div>
          <LoadingList />
        </div>
      </div>
    </div>
  )
}
