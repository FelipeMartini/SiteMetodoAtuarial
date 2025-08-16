"use client"

// Refatorado para usar ABACProtectedPage (FE-2)
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ABACProtectedPage } from '@/lib/abac/hoc'

interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  timestamp: string
  details: string
  ipAddress: string
}

export default function AuditoriaPage() {
  const { data: session, status } = useSession()
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  // Simulação de carregamento (poderá ser substituída por fetch real)
  useEffect(() => {
    let mounted = true
    if (status === 'authenticated') {
      setTimeout(() => {
        if (!mounted) return
        setAuditLogs([
          {
            id: '1',
            userId: session?.user?.id || '',
            action: 'LOGIN',
            resource: 'auth',
            timestamp: new Date().toISOString(),
            details: 'Usuário fez login no sistema',
            ipAddress: '127.0.0.1'
          }
        ])
        setLoading(false)
      }, 800)
    } else if (status !== 'loading') {
      setLoading(false)
    }
    return () => { mounted = false }
  }, [status, session])

  return (
    <ABACProtectedPage object='audit_logs' action='read'>
      {status === 'loading' || loading ? (
        <div className="container mx-auto py-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : (
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Auditoria do Sistema</h1>
            <Button variant="outline">Exportar Logs</Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum log de auditoria encontrado.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{log.action}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="font-medium">{log.resource}</p>
                          <p className="text-sm text-muted-foreground">{log.details}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>IP: {log.ipAddress}</div>
                          <div>User: {log.userId}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </ABACProtectedPage>
  )
}
