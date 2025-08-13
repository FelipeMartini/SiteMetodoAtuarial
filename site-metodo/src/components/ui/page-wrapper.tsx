"use client"

import { LoadingPage } from "@/components/ui/loading-states"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"

interface PageWrapperProps {
  loading?: boolean
  error?: string | Error | null
  children: React.ReactNode
  onRetry?: () => void
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
}

/**
 * Wrapper para páginas com estados de loading e erro
 * Padroniza a experiência de carregamento e tratamento de erros
 */
export function PageWrapper({
  loading = false,
  error = null,
  children,
  onRetry,
  loadingComponent,
  errorComponent,
}: PageWrapperProps) {
  if (loading) {
    return loadingComponent || <LoadingPage />
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    if (errorComponent) {
      return <>{errorComponent}</>
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center space-y-2">
          <AlertTriangleIcon className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">
            Ops! Algo deu errado
          </h2>
          <p className="text-muted-foreground max-w-md">
            {errorMessage || "Ocorreu um erro inesperado. Tente novamente."}
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
      </div>
    )
  }

  return <>{children}</>
}

interface AsyncWrapperProps<T> {
  data: T | undefined
  loading: boolean
  error: Error | null
  children: (data: T) => React.ReactNode
  onRetry?: () => void
  emptyMessage?: string
  emptyComponent?: React.ReactNode
}

/**
 * Wrapper para dados assíncronos com estados de loading, erro e vazio
 */
export function AsyncWrapper<T>({
  data,
  loading,
  error,
  children,
  onRetry,
  emptyMessage = "Nenhum dado encontrado",
  emptyComponent,
}: AsyncWrapperProps<T>) {
  if (loading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center space-y-2">
          <AlertTriangleIcon className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold">Erro ao carregar dados</h2>
          <p className="text-muted-foreground max-w-md">
            {error.message || "Não foi possível carregar os dados."}
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
      </div>
    )
  }

  if (!data) {
    if (emptyComponent) {
      return <>{emptyComponent}</>
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-2">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return <>{children(data)}</>
}
