import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { structuredLogger } from '@/lib/logger'
import ObservabilidadeTabsClient from './tabs-client'

// Página server que apenas registra acesso e delega render client para busca dinâmica
export default async function ObservabilidadePage() {
  structuredLogger.info('ObservabilidadePage accessed')
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
              <ObservabilidadeTabsClient type="sistema" />
            </TabsContent>
            <TabsContent value="auditoria" className="space-y-4">
              <ObservabilidadeTabsClient type="auditoria" />
            </TabsContent>
            <TabsContent value="performance" className="space-y-4">
              <ObservabilidadeTabsClient type="performance" />
            </TabsContent>
            <TabsContent value="email" className="space-y-4">
              <ObservabilidadeTabsClient type="email" />
            </TabsContent>
            <TabsContent value="seguranca" className="space-y-4">
              <ObservabilidadeTabsClient type="seguranca" />
            </TabsContent>
            <TabsContent value="notificacoes" className="space-y-4">
              <ObservabilidadeTabsClient type="notificacoes" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
