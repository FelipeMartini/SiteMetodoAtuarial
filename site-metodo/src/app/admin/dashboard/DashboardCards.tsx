"use client"
import { CardMetrica, UsuariosCard } from "./components"
import { useQuery } from "@tanstack/react-query"

export default function DashboardCards() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const res = await fetch('/api/admin/metrics')
      if (!res.ok) throw new Error('Erro ao carregar métricas')
      return res.json() as Promise<{ totalUsers: number; activeUsers: number; newUsers7d: number; linkedAccounts: number; auditCount: number }>
    },
    staleTime: 30000,
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
      <UsuariosCard />
      <CardMetrica
        titulo="Usuários Ativos"
        valor={isLoading ? '...' : data?.activeUsers ?? 0}
        icone={null}
      />
      <CardMetrica
        titulo="Novos (7d)"
        valor={isLoading ? '...' : data?.newUsers7d ?? 0}
        icone={null}
      />
      <CardMetrica
        titulo="Contas Vinculadas"
        valor={isLoading ? '...' : data?.linkedAccounts ?? 0}
        icone={null}
      />
      <CardMetrica
        titulo="Logs Auditoria"
        valor={isLoading ? '...' : data?.auditCount ?? 0}
        icone={null}
      />
    </div>
  )
}
