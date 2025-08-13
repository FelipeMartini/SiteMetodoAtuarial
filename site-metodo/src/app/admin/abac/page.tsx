'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Trash2, Edit, Shield, Users, Settings, Key } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
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
  const [policies, setPolicies] = useState<Policy[]>([])
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchCount, setFetchCount] = useState(0)
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const { toast } = useToast()

  // Policy form state
  const [newPolicy, setNewPolicy] = useState({
    subject: '',
    object: '',
    action: 'read',
    effect: 'allow' as 'allow' | 'deny',
    conditions: '',
    description: '',
  })

  // Role assignment form state
  const [newRoleAssignment, setNewRoleAssignment] = useState({
    userEmail: '',
    roleName: '',
  })

  const loadPolicies = useCallback(async () => {
    try {
      const response = await fetch('/api/abac/policies')
      const data = await response.json()
      if (data.success) {
        setPolicies(data.data)
      } else {
        setError('Falha ao carregar políticas')
        toast({
          title: 'Erro',
          description: 'Falha ao carregar políticas',
          variant: 'destructive',
        })
      }
    } catch (_error) {
      setError('Erro ao conectar com o servidor')
      console.error('Error loading policies:', String(_error))
      toast({
        title: 'Erro',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      })
    } finally {
      setFetchCount(prev => prev + 1)
    }
  }, [toast])

  const loadRoleAssignments = useCallback(async () => {
    try {
      const response = await fetch('/api/abac/roles')
      const data = await response.json()
      if (data.success) {
        setRoleAssignments(data.data)
      } else {
        setError('Falha ao carregar roles')
        toast({
          title: 'Erro',
          description: 'Falha ao carregar roles',
          variant: 'destructive',
        })
      }
    } catch (_error) {
      setError('Erro ao conectar com o servidor')
      console.error('Error loading roles:', String(_error))
      toast({
        title: 'Erro',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      })
    } finally {
      setFetchCount(prev => prev + 1)
    }
  }, [toast])

  useEffect(() => {
    setLoading(true)
    setError(null)
    setFetchCount(0)
    Promise.all([loadPolicies(), loadRoleAssignments()])
      .catch(() => {})
  }, [loadPolicies, loadRoleAssignments])

  useEffect(() => {
    if (fetchCount >= 2) {
      setLoading(false)
    }
  }, [fetchCount])

  const addPolicy = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/abac/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPolicy),
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Sucesso',
          description: 'Política adicionada com sucesso',
        })
        setIsAddPolicyOpen(false)
        setNewPolicy({
          subject: '',
          object: '',
          action: 'read',
          effect: 'allow',
          conditions: '',
          description: '',
        })
        loadPolicies()
      } else {
        toast({
          title: 'Erro',
          description: data.error || 'Falha ao adicionar política',
          variant: 'destructive',
        })
      }
    } catch (_error) {
      console.error('Error adding policy:', String(_error))
      toast({
        title: 'Erro',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  const removePolicy = async (policy: Policy) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/abac/policies/${policy.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Sucesso',
          description: 'Política removida com sucesso',
        })
        loadPolicies()
      } else {
        toast({
          title: 'Erro',
          description: data.error || 'Falha ao remover política',
          variant: 'destructive',
        })
      }
    } catch (_error) {
      console.error('Error removing policy:', String(_error))
      toast({
        title: 'Erro',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  const addRoleAssignment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/abac/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoleAssignment),
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Sucesso',
          description: 'Role atribuído com sucesso',
        })
        setIsAddRoleOpen(false)
        setNewRoleAssignment({
          userEmail: '',
          roleName: '',
        })
        loadRoleAssignments()
      } else {
        toast({
          title: 'Erro',
          description: data.error || 'Falha ao atribuir role',
          variant: 'destructive',
        })
      }
    } catch (_error) {
      console.error('Error adding role assignment:', String(_error))
      toast({
        title: 'Erro',
        description: 'Erro ao conectar com o servidor',
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Gestão ABAC</h1>
          <p className='text-muted-foreground'>
            Sistema de controle de acesso baseado em atributos
          </p>
        </div>
        <Badge variant='outline' className='flex items-center gap-2'>
          <Shield className='w-4 h-4' />
          Sistema Ativo
        </Badge>
      </div>

      {error && (
        <div className='mb-4 p-4 rounded bg-destructive text-destructive-foreground'>
          <strong>Erro:</strong> {error}
        </div>
      )}

      <Tabs defaultValue='policies' className='w-full'>
        {/* ...existing code... */}
        <TabsContent value='policies' className='space-y-6'>
          {/* ...existing code... */}
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
                <Table>
                  {/* ...existing code... */}
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* ...existing code... */}
        <TabsContent value='roles' className='space-y-6'>
          {/* ...existing code... */}
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
                <Table>
                  {/* ...existing code... */}
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* ...existing code... */}
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


