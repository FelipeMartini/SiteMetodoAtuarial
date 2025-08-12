'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Shield, Edit2, Activity, Settings, Calendar } from 'lucide-react'
import { AvatarCustom } from '@/components/ui/avatar-custom'
import { getRoleTypeLabel, getRoleTypeDisplayValue } from '@/lib/abac/roleMapping'
import { UserRoleType } from '@prisma/client'

/**
 * Componente de perfil moderno do usuário
 * Exibe informações completas com design atualizado
 */
export function PerfilUsuarioModerno() {
  const { data: session } = useSession()

  if (!session?.user) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-center text-muted-foreground'>Nenhum usuário logado</p>
        </CardContent>
      </Card>
    )
  }

  const user = session.user
  const roleType = (session.user as { roleType?: UserRoleType })?.roleType || UserRoleType.USER
  const displayValue = getRoleTypeDisplayValue(roleType)

  const getRoleBadgeColor = () => {
    switch (roleType) {
      case UserRoleType.ADMIN:
        return 'destructive'
      case UserRoleType.MODERATOR:
        return 'default'
      case UserRoleType.USER:
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getRoleIcon = () => {
    switch (roleType) {
      case UserRoleType.ADMIN:
        return '👑'
      case UserRoleType.MODERATOR:
        return '🛡️'
      case UserRoleType.USER:
        return '👤'
      default:
        return '👤'
    }
  }

  const getRoleDisplayName = () => {
    return getRoleTypeLabel(roleType)
  }

  return (
    <div className='space-y-6'>
      {/* Header do Perfil */}
      <Card>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <AvatarCustom
                src={user.image}
                name={user.name || undefined}
                email={user.email || undefined}
                size='xl'
                showStatus={true}
                status='online'
              />
              <div>
                <CardTitle className='text-2xl'>{user.name || 'Usuário Anônimo'}</CardTitle>
                <CardDescription className='flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  {user.email}
                </CardDescription>
                <div className='flex items-center gap-2 mt-2'>
                  <Badge variant={getRoleBadgeColor()} className='gap-1'>
                    <span>{getRoleIcon()}</span>
                    {getRoleDisplayName()}
                  </Badge>
                  {roleType !== UserRoleType.GUEST && (
                    <div className='text-xs text-muted-foreground'>Nível {displayValue}</div>
                  )}
                </div>
              </div>
            </div>
            <Button variant='outline' size='sm'>
              <Edit2 className='h-4 w-4 mr-2' />
              Editar Perfil
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs do Perfil */}
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>
            <User className='h-4 w-4 mr-2' />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value='activity'>
            <Activity className='h-4 w-4 mr-2' />
            Atividade
          </TabsTrigger>
          <TabsTrigger value='settings'>
            <Settings className='h-4 w-4 mr-2' />
            Configurações
          </TabsTrigger>
          <TabsTrigger value='security'>
            <Shield className='h-4 w-4 mr-2' />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <User className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>Nome:</span>
                  <span className='font-medium'>{user.name || 'Não informado'}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>Email:</span>
                  <span className='font-medium'>{user.email}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>Membro desde:</span>
                  <span className='font-medium'>Janeiro 2024</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Status da Conta</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <Shield className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>Tipo:</span>
                  <Badge variant={getRoleBadgeColor()}>{getRoleDisplayName()}</Badge>
                </div>
                <div className='flex items-center gap-3'>
                  <Activity className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>Status:</span>
                  <Badge variant='default' className='bg-green-500'>
                    Ativo
                  </Badge>
                </div>
                <div className='flex items-center gap-3'>
                  <User className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>Nível de Acesso:</span>
                  <span className='font-medium'>{displayValue}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='activity' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Suas últimas ações na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center gap-4 p-3 rounded-lg bg-muted/50'>
                  <div className='h-2 w-2 rounded-full bg-green-500' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Login realizado</p>
                    <p className='text-xs text-muted-foreground'>Há 2 minutos</p>
                  </div>
                </div>
                <div className='flex items-center gap-4 p-3 rounded-lg bg-muted/50'>
                  <div className='h-2 w-2 rounded-full bg-blue-500' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Perfil atualizado</p>
                    <p className='text-xs text-muted-foreground'>Há 1 hora</p>
                  </div>
                </div>
                <div className='flex items-center gap-4 p-3 rounded-lg bg-muted/50'>
                  <div className='h-2 w-2 rounded-full bg-yellow-500' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Senha alterada</p>
                    <p className='text-xs text-muted-foreground'>Há 2 dias</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='settings' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>Configure suas preferências da conta</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Notificações por email</p>
                  <p className='text-sm text-muted-foreground'>Receber atualizações importantes</p>
                </div>
                <Button variant='outline' size='sm'>
                  Configurar
                </Button>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Tema da interface</p>
                  <p className='text-sm text-muted-foreground'>Escolha entre claro e escuro</p>
                </div>
                <Button variant='outline' size='sm'>
                  Alterar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='security' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Alterar senha</p>
                  <p className='text-sm text-muted-foreground'>Última alteração há 2 dias</p>
                </div>
                <Button variant='outline' size='sm'>
                  Alterar
                </Button>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Autenticação em duas etapas</p>
                  <p className='text-sm text-muted-foreground'>
                    Adicione uma camada extra de segurança
                  </p>
                </div>
                <Button variant='outline' size='sm'>
                  Configurar
                </Button>
              </div>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Sessões ativas</p>
                  <p className='text-sm text-muted-foreground'>Veja onde você está logado</p>
                </div>
                <Button variant='outline' size='sm'>
                  Gerenciar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PerfilUsuarioModerno
