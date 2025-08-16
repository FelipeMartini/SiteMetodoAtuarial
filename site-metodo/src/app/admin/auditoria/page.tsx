'use client'

import { useEffect, useState } from 'react'
import { checkClientPermission } from '@/lib/abac/client'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    const checkPermissions = async () => {
      if (!session?.user?.email) {
        if (mounted) {
          setHasPermission(false)
          setLoading(false)
        }
        return
      }

      try {
        const allowed = await checkClientPermission(session.user.email, 'audit_logs', 'read')
        if (mounted) {
          setHasPermission(allowed)
          if (allowed) {
            // Simular carregamento de logs de auditoria
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
            }, 1000)
          } else {
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Erro ao verificar permissões:', error)
        if (mounted) {
          setHasPermission(false)
          setLoading(false)
        }
      }
    }

    if (status !== 'loading') {
      checkPermissions()
    }

    return () => {
      mounted = false
    }
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="text-center py-8">
            <p>Você precisa estar logado para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (hasPermission === false) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="text-center py-8">
            <p>Você não tem permissão para acessar os logs de auditoria.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Auditoria do Sistema</h1>
        <Button variant="outline">
          Exportar Logs
        </Button>
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
  )
}
