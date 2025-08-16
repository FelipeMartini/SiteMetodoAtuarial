import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { structuredLogger } from '@/lib/logger'

// Página inicial unificada de observabilidade (esqueleto inicial)
export default async function ObservabilidadePage() {
  await structuredLogger.info('ObservabilidadePage accessed')
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Central de Observabilidade</CardTitle>
          <CardDescription>Visão unificada de sistema, auditoria, performance, email e segurança</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sistema">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="sistema">Sistema</TabsTrigger>
              <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            </TabsList>
            <TabsContent value="sistema" className="space-y-4">
              <p className="text-sm text-muted-foreground">Logs de sistema (em construção)</p>
            </TabsContent>
            <TabsContent value="auditoria" className="space-y-4">
              <p className="text-sm text-muted-foreground">Logs de auditoria (em construção)</p>
            </TabsContent>
            <TabsContent value="performance" className="space-y-4">
              <p className="text-sm text-muted-foreground">Métricas e performance (em construção)</p>
            </TabsContent>
            <TabsContent value="email" className="space-y-4">
              <p className="text-sm text-muted-foreground">Envios de email (em construção)</p>
            </TabsContent>
            <TabsContent value="seguranca" className="space-y-4">
              <p className="text-sm text-muted-foreground">Eventos de segurança (em construção)</p>
            </TabsContent>
            <TabsContent value="notificacoes" className="space-y-4">
              <p className="text-sm text-muted-foreground">Notificações (em construção)</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
