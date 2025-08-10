"use client"
export const dynamic = 'force-dynamic'

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useMfaStatus } from "@/hooks/useMfaStatus"
import { ClientOnly } from "@/components/util/ClientOnly"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert } from "@/components/ui/alert"

/**
 * Página de resumo da área cliente: widgets principais (status MFA, sessões, últimas atividades)
 */
export default function ClienteResumo() {
  return (
    <ClientOnly>
      <ClienteResumoContent />
    </ClientOnly>
  )
}

function ClienteResumoContent() {
  const { data, isLoading, error } = useCurrentUser()
  const user = data?.user
  const { data: mfaData, isLoading: mfaLoading } = useMfaStatus();

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bem-vindo, {user.name || user.email}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="font-semibold">Status MFA</div>
          <div>
            {mfaLoading ? 'Carregando...' : mfaData?.enabled ? 'Ativado' : 'Desativado'}
          </div>
        </Card>
        <Card className="p-4">
          <div className="font-semibold">Sessões Ativas</div>
          {/* TODO: Integrar hook useSessions */}
          <div>1 sessão ativa</div>
        </Card>
        <Card className="p-4">
          <div className="font-semibold">Últimas Atividades</div>
          {/* TODO: Integrar hook useAuditLogs */}
          <div>Login recente</div>
        </Card>
      </div>
    </div>
  )
}
