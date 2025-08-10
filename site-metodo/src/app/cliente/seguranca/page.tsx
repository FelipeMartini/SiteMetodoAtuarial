"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useMfaStatus } from "@/hooks/useMfaStatus"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert } from "@/components/ui/alert"

/**
 * Página de segurança: status e setup de MFA, sessões, histórico de acessos
 */
export default function ClienteSeguranca() {

  const { data, isLoading, error } = useCurrentUser()
  const user = data?.user
  const { data: mfaData, isLoading: mfaLoading } = useMfaStatus();

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />
  }
  if (error) {
    return <Alert variant="destructive">Erro ao carregar usuário: {error.message}</Alert>
  }

  if (!user) {
    return <Alert variant="default">Usuário não autenticado.</Alert>
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Segurança</h1>
      <Card className="p-6 space-y-4">
        <div>
          <span className="font-semibold">MFA:</span> {mfaLoading ? 'Carregando...' : mfaData?.enabled ? 'Ativado' : 'Desativado'}
        </div>
        {/* TODO: Setup MFA, backup codes, sessões, histórico de acessos */}
      </Card>
    </div>
  )
}
