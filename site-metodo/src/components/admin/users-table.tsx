'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AvatarCustom } from '@/components/ui/avatar-custom'
import { 
  Search, 
  MoreHorizontal, 
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Shield
} from 'lucide-react'

interface Usuario {
  id: string
  name?: string | null
  email: string
  image?: string | null
  role: string[]
  accessLevel: number
  isActive: boolean
  lastLogin?: Date | null
  createdAt: Date
}

/**
 * Tabela moderna de gerenciamento de usuários para admin
 * Inclui busca, filtros e ações em massa
 */
export function AdminUsersTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')

  // Dados mockados - em produção viriam de API
  const usuarios: Usuario[] = [
    {
      id: '1',
      name: 'Felipe Martini',
      email: 'felipemartinii@gmail.com',
      image: null,
      role: ['admin'],
      accessLevel: 100,
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'João Silva',
      email: 'joao@example.com',
      image: null,
      role: ['user'],
      accessLevel: 0,
      isActive: true,
      lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
      createdAt: new Date('2024-02-10')
    },
    {
      id: '3',
      name: 'Maria Santos',
      email: 'maria@example.com',
      image: null,
      role: ['moderator'],
      accessLevel: 50,
      isActive: false,
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
      createdAt: new Date('2024-03-05')
    }
  ]

  const getRoleBadgeColor = (role: string[]) => {
    const primaryRole = role[0]?.toUpperCase()
    switch(primaryRole) {
      case 'ADMIN': return 'destructive'
      case 'MODERATOR': return 'default'
      case 'PREMIUM': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary'
  }

  const formatLastLogin = (lastLogin?: Date | null) => {
    if (!lastLogin) return 'Nunca'
    
    const now = new Date()
    const diff = now.getTime() - lastLogin.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    return `${days}d atrás`
  }

  const filteredUsers = usuarios.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role.includes(filterRole)
    return matchesSearch && matchesRole
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gerenciar Usuários
            </CardTitle>
            <CardDescription>
              Visualize e gerencie todos os usuários do sistema
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </div>
        
        {/* Filtros e Busca */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm bg-background"
          >
            <option value="all">Todas as funções</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderador</option>
            <option value="user">Usuário</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Usuário</th>
                  <th className="text-left p-4 font-medium">Função</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Último Acesso</th>
                  <th className="text-left p-4 font-medium">Nível</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/25 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <AvatarCustom
                          src={user.image}
                          name={user.name || undefined}
                          email={user.email}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium">
                            {user.name || 'Sem nome'}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getRoleBadgeColor(user.role)}>
                        {user.role[0]?.toUpperCase() || 'USER'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeColor(user.isActive)}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm">
                        {user.accessLevel}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          )}
        </div>
        
        {/* Paginação */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredUsers.length} de {usuarios.length} usuários
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
