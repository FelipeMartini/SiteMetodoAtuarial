"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckIcon, Loader2Icon } from "lucide-react"

interface AsyncButtonProps {
  onAsyncClick?: () => Promise<void>
  successMessage?: string
  loadingText?: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

/**
 * Botão com estados de loading e sucesso automáticos
 * Fornece feedback visual imediato para ações assíncronas
 */
export function AsyncButton({
  onAsyncClick,
  successMessage,
  loadingText,
  children,
  disabled,
  className,
  variant = "default",
  size = "default",
}: AsyncButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle")

  const handleClick = async () => {
    if (!onAsyncClick || state !== "idle") return

    setState("loading")
    try {
      await onAsyncClick()
      setState("success")
      setTimeout(() => setState("idle"), 2000)
    } catch (error) {
      setState("idle")
      throw error
    }
  }

  const isDisabled = disabled || state === "loading" || state === "success"

  return (
    <Button
      disabled={isDisabled}
      onClick={handleClick}
      variant={state === "success" ? "default" : variant}
      size={size}
      className={cn(
        "transition-all duration-200",
        state === "success" && "bg-green-600 hover:bg-green-600",
        className
      )}
    >
      {state === "loading" && (
        <>
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          {loadingText || "Carregando..."}
        </>
      )}
      {state === "success" && (
        <>
          <CheckIcon className="mr-2 h-4 w-4" />
          {successMessage || "Sucesso!"}
        </>
      )}
      {state === "idle" && children}
    </Button>
  )
}

interface ConfirmButtonProps {
  onConfirm: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  disabled?: boolean
}

/**
 * Botão com confirmação em duas etapas
 * Evita ações acidentais em operações críticas
 */
export function ConfirmButton({
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  children,
  variant = "destructive",
  size = "default",
  className,
  disabled,
}: ConfirmButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      setShowConfirm(false)
    } catch (error) {
      console.error("Erro na confirmação:", error)
    } finally {
      setLoading(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          size="sm"
          variant={variant}
          onClick={handleConfirm}
          disabled={loading}
          className={className}
        >
          {loading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              {confirmText}
            </>
          ) : (
            confirmText
          )}
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setShowConfirm(true)}
      className={className}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
