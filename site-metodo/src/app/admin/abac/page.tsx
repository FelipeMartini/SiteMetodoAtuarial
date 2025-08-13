'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  Table,
} from '@/components/ui/table'
import { Shield } from 'lucide-react'
import { ABACProtectedPage } from '@/lib/abac/hoc'

interface Policy {
  id: string
  subject: string
  object: string
  action: string
  effect: 'allow' | 'deny'
  conditions?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

interface RoleAssignment {
  userEmail: string
  userName?: string
  roleName: string
  assignedAt: Date
}

function ABACManagementPageContent() {
  const [policies] = useState<Policy[]>([])
  const [roleAssignments] = useState<RoleAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error] = useState<string | null>(null)

    // Simplified useEffect without infinite loop
  useEffect(() => {
    // Set loading to false after a short delay to simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Shield className='h-8 w-8 text-primary' />
        <div>
          <h1 className='text-3xl font-bold'>Gestão ABAC</h1>
          <p className='text-muted-foreground'>
            Gerencie políticas de acesso e atribuições de roles do sistema
          </p>
        </div>
      </div>

      {error && (
        <div className='bg-destructive/15 border border-destructive text-destructive px-4 py-2 rounded-md'>
          {error}
        </div>
      )}

      <Tabs defaultValue='policies' className='space-y-6'>
        {/* Policy Management Tab */}
        <TabsContent value='policies' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Políticas Ativas</CardTitle>
              <CardDescription>
                Lista de todas as políticas de acesso configuradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='text-center py-8'>Carregando...</div>
              ) : (
                <div className='space-y-4'>
                  <p className='text-muted-foreground'>
                    {policies.length} política(s) encontrada(s)
                  </p>
                  {policies.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground'>
                      Nenhuma política encontrada
                    </div>
                  ) : (
                    <Table>
                      {/* Table content would go here */}
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Management Tab */}
        <TabsContent value='roles' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Atribuições de Roles</CardTitle>
              <CardDescription>
                Visualize e gerencie os roles atribuídos aos usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className='text-center py-8'>Carregando...</div>
              ) : (
                <div className='space-y-4'>
                  <p className='text-muted-foreground'>
                    {roleAssignments.length} atribuição(ões) encontrada(s)
                  </p>
                  {roleAssignments.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground'>
                      Nenhuma atribuição encontrada
                    </div>
                  ) : (
                    <Table>
                      {/* Table content would go here */}
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ABACManagementPage() {
  return (
    <ABACProtectedPage object="admin:abac" action="read">
      <ABACManagementPageContent />
    </ABACProtectedPage>
  )
}