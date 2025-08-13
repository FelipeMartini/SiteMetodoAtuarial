'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUpDown, MoreHorizontal, Shield, User, UserCheck, UserX } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface Usuario {
  id: string
  name: string
  email: string
  image?: string
  accessLevel: number
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

const getAccessLevelBadge = (level: number) => {
  if (level >= 100) {
    return <Badge variant='destructive' className='flex items-center gap-1'>
      <Shield className='h-3 w-3' />
      Admin
    </Badge>
  }
  if (level >= 50) {
    return <Badge variant='default' className='flex items-center gap-1'>
      <UserCheck className='h-3 w-3' />
      Moderador
    </Badge>
  }
  return <Badge variant='secondary' className='flex items-center gap-1'>
    <User className='h-3 w-3' />
    Usuário
  </Badge>
}

export const columns: ColumnDef<Usuario>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Selecionar todos'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Selecionar linha'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-8 px-2'
        >
          Usuário
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className='flex items-center space-x-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.image} />
            <AvatarFallback>
              {user.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium'>{user.name}</span>
            <span className='text-sm text-muted-foreground'>{user.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'accessLevel',
    header: 'Nível de Acesso',
    cell: ({ row }) => {
      const level = row.getValue('accessLevel') as number
      return getAccessLevelBadge(level)
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return isActive ? (
        <Badge variant='default' className='flex w-fit items-center gap-1'>
          <UserCheck className='h-3 w-3' />
          Ativo
        </Badge>
      ) : (
        <Badge variant='secondary' className='flex w-fit items-center gap-1'>
          <UserX className='h-3 w-3' />
          Inativo
        </Badge>
      )
    },
  },
  {
    accessorKey: 'lastLogin',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-8 px-2'
        >
          Último Login
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const lastLogin = row.getValue('lastLogin') as string
      if (!lastLogin) return <span className='text-muted-foreground'>Nunca</span>
      
      return (
        <span className='text-sm'>
          {formatDistanceToNow(new Date(lastLogin), {
            addSuffix: true,
            locale: ptBR,
          })}
        </span>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-8 px-2'
        >
          Criado em
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string
      return (
        <span className='text-sm'>
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: ptBR,
          })}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Abrir menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copiar ID do usuário
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar usuário</DropdownMenuItem>
            <DropdownMenuItem>Resetar senha</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-destructive'>
              {user.isActive ? 'Desativar' : 'Ativar'} usuário
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
