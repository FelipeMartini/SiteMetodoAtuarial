'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatsCard } from '@/components/admin/stats-card'
import { 
  Shield, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Users, 
  Key, 
  Lock,
  Check,
  X,
  AlertTriangle
} from 'lucide-react'
import { AdminLayout } from '@/components/admin-layout'

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
  const [_error, _setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data for demonstration
    const mockPolicies: Policy[] = [
      {
        id: '1',
        subject: 'admin@example.com',
        object: 'admin:dashboard',
        action: 'read',
        effect: 'allow',
        description: 'Administradores podem visualizar o dashboard',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        subject: 'user:*',
        object: 'profile',
        action: 'update',
        effect: 'allow',
        conditions: 'user.id == resource.owner_id',
        description: 'Usuários podem editar seus próprios perfis',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        subject: 'role:guest',
        object: 'admin:*',
        action: '*',
        effect: 'deny',
        description: 'Convidados não podem acessar área administrativa',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      },
    ]

    const mockRoleAssignments: RoleAssignment[] = [
      {
        userEmail: 'admin@example.com',
        userName: 'Administrador',
        roleName: 'administrator',
        assignedAt: new Date('2024-01-01'),
      },
      {
        userEmail: 'user@example.com',
        userName: 'Usuário Padrão',
        roleName: 'user',
        assignedAt: new Date('2024-01-02'),
      },
    ]

    const timer = setTimeout(() => {
      setPolicies(mockPolicies)
      setRoleAssignments(mockRoleAssignments)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredPolicies = policies.filter(
    policy =>
      policy.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRoles = roleAssignments.filter(
    role =>
      role.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalPolicies: policies.length,
    allowPolicies: policies.filter(p => p.effect === 'allow').length,
    denyPolicies: policies.filter(p => p.effect === 'deny').length,
    totalRoles: roleAssignments.length,
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Shield className='h-8 w-8 text-primary' />
            <div>
              <h1 className='text-3xl font-bold'>Gestão ABAC</h1>
              <p className='text-muted-foreground'>
                Gerencie políticas de acesso e atribuições de roles do sistema
              </p>
            </div>
          </div>
          <Button>
            <Plus className='h-4 w-4 mr-2' />
            Nova Política
          </Button>
        </div>

        {/* Error Message */}
        {_error && (
          <div className='bg-destructive/15 border border-destructive text-destructive px-4 py-2 rounded-md flex items-center gap-2'>
            <AlertTriangle className='h-4 w-4' />
            {_error}
          </div>
        )}

        {/* Stats Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatsCard
            title='Total de Políticas'
            value={stats.totalPolicies}
            description='Políticas configuradas'
            icon={Shield}
          />
          <StatsCard
            title='Políticas Allow'
            value={stats.allowPolicies}
            description='Permissões concedidas'
            icon={Check}
            className='border-green-200 dark:border-green-800'
          />
          <StatsCard
            title='Políticas Deny'
            value={stats.denyPolicies}
            description='Permissões negadas'
            icon={X}
            className='border-red-200 dark:border-red-800'
          />
          <StatsCard
            title='Usuários com Roles'
            value={stats.totalRoles}
            description='Atribuições ativas'
            icon={Users}
          />
        </div>

        {/* Search */}
        <div className='flex items-center space-x-2'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Buscar políticas ou roles...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue='policies' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='policies'>
              Políticas ({filteredPolicies.length})
            </TabsTrigger>
            <TabsTrigger value='roles'>
              Atribuições de Roles ({filteredRoles.length})
            </TabsTrigger>
            <TabsTrigger value='permissions'>
              Testes de Permissão
            </TabsTrigger>
          </TabsList>

          {/* Policies Tab */}
          <TabsContent value='policies' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Políticas de Acesso</CardTitle>
                <CardDescription>
                  Configure regras de acesso baseadas em atributos (ABAC)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className='text-center py-8'>
                    <div className='text-muted-foreground'>Carregando políticas...</div>
                  </div>
                ) : (
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sujeito</TableHead>
                          <TableHead>Objeto</TableHead>
                          <TableHead>Ação</TableHead>
                          <TableHead>Efeito</TableHead>
                          <TableHead>Condições</TableHead>
                          <TableHead>Criado em</TableHead>
                          <TableHead className='w-[50px]'></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPolicies.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className='h-24 text-center'>
                              <div className='text-muted-foreground'>
                                {searchTerm ? 'Nenhuma política encontrada para o termo buscado' : 'Nenhuma política configurada'}
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredPolicies.map((policy) => (
                            <TableRow key={policy.id}>
                              <TableCell className='font-medium'>{policy.subject}</TableCell>
                              <TableCell>{policy.object}</TableCell>
                              <TableCell>{policy.action}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={policy.effect === 'allow' ? 'default' : 'destructive'}
                                  className='flex w-fit items-center gap-1'
                                >
                                  {policy.effect === 'allow' ? (
                                    <Check className='h-3 w-3' />
                                  ) : (
                                    <X className='h-3 w-3' />
                                  )}
                                  {policy.effect}
                                </Badge>
                              </TableCell>
                              <TableCell className='max-w-[200px] truncate'>
                                {policy.conditions || '-'}
                              </TableCell>
                              <TableCell>
                                {policy.createdAt.toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='h-8 w-8 p-0'>
                                      <MoreHorizontal className='h-4 w-4' />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='end'>
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                    <DropdownMenuItem className='text-destructive'>
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value='roles' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Atribuições de Roles</CardTitle>
                <CardDescription>
                  Gerencie roles atribuídos aos usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className='text-center py-8'>
                    <div className='text-muted-foreground'>Carregando atribuições...</div>
                  </div>
                ) : (
                  <div className='rounded-md border'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Atribuído em</TableHead>
                          <TableHead className='w-[50px]'></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRoles.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className='h-24 text-center'>
                              <div className='text-muted-foreground'>
                                {searchTerm ? 'Nenhuma atribuição encontrada para o termo buscado' : 'Nenhuma atribuição de role configurada'}
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRoles.map((role, index) => (
                            <TableRow key={index}>
                              <TableCell className='font-medium'>
                                {role.userName || 'N/A'}
                              </TableCell>
                              <TableCell>{role.userEmail}</TableCell>
                              <TableCell>
                                <Badge variant='outline' className='flex w-fit items-center gap-1'>
                                  <Key className='h-3 w-3' />
                                  {role.roleName}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {role.assignedAt.toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='h-8 w-8 p-0'>
                                      <MoreHorizontal className='h-4 w-4' />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='end'>
                                    <DropdownMenuItem>Alterar Role</DropdownMenuItem>
                                    <DropdownMenuItem className='text-destructive'>
                                      Remover Atribuição
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Test Tab */}
          <TabsContent value='permissions' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Teste de Permissões</CardTitle>
                <CardDescription>
                  Teste se um usuário tem permissão para realizar uma ação específica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-3'>
                    <div>
                      <label className='text-sm font-medium'>Sujeito (usuário/role)</label>
                      <Input placeholder='user@example.com' />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Objeto (recurso)</label>
                      <Input placeholder='admin:dashboard' />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Ação</label>
                      <Input placeholder='read' />
                    </div>
                  </div>
                  <Button>
                    <Lock className='h-4 w-4 mr-2' />
                    Testar Permissão
                  </Button>
                  <div className='p-4 bg-muted rounded-md'>
                    <p className='text-sm text-muted-foreground'>
                      O resultado do teste aparecerá aqui
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

export default function ABACManagementPage() {
  return <ABACManagementPageContent />
}
