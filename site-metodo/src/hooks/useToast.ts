"use client"

import { toast } from "sonner"

/**
 * Hook para toasts modernos e acessíveis
 * Baseado no sonner com configurações otimizadas
 */
export function useToast() {
  const success = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
      position: "bottom-right",
    })
  }

  const error = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
      position: "bottom-right",
    })
  }

  const warning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
      position: "bottom-right",
    })
  }

  const info = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
      position: "bottom-right",
    })
  }

  const loading = (message: string, description?: string) => {
    return toast.loading(message, {
      description,
      position: "bottom-right",
    })
  }

  const promise = <T,>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
      position: "bottom-right",
    })
  }

  const custom = (message: React.ReactNode, options?: Parameters<typeof toast>[1]) => {
    return toast(message, {
      position: "bottom-right",
      ...options,
    })
  }

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId)
  }

  return {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    custom,
    dismiss,
  }
}
