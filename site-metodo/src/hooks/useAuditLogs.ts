// use client
import { useQuery } from '@tanstack/react-query'

interface AuditLog {
  id: string
  action: string
  target?: string | null
  createdAt: string
  user?: { id: string; email?: string | null; name?: string | null }
}

export function useAuditLogs(limit = 10) {
  return useQuery({
    queryKey: ['audit-logs', limit],
    queryFn: async () => {
      const res = await fetch('/api/admin/metrics')
      if (!res.ok) throw new Error('Falha ao carregar métricas/auditoria')
      const json = (await res.json()) as { lastAudit: AuditLog[] }
      return json.lastAudit.slice(0, limit)
    },
    refetchInterval: 60000,
  })
}
