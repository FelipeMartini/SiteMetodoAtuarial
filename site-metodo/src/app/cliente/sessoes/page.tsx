"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert } from "@/components/ui/alert"

/**
 * Página de sessões: dispositivos conectados, revogação de sessão
 */
export default function ClienteSessoes() {
  const { data, isLoading, error } = useCurrentUser()
  const user = data?.user

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />
  }
  if (error) {
    return <Alert variant="destructive">Erro ao carregar usuário: {String(error)}</Alert>
  }
  if (!user) {
    return <Alert variant="default">Usuário não autenticado.</Alert>
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Sessões Ativas</h1>
      <Card className="p-6 space-y-4">
        {/* TODO: Listar sessões/dispositivos, permitir revogação */}
        <div>Funcionalidade em desenvolvimento.</div>
      </Card>
    </div>
  )
}
