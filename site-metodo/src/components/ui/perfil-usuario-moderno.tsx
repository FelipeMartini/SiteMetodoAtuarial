'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Briefcase, 
  Shield,
  Calendar,
  Clock,
  Save,
  Loader2
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  department?: string
  location?: string
  jobTitle?: string
  image?: string
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface ABACContext {
  permissions: string[]
  department?: string
  location?: string
  jobTitle?: string
}

export default function PerfilUsuarioModerno() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [abacContext, setAbacContext] = useState<ABACContext | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    location: '',
    jobTitle: ''
  })

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile()
      fetchABACContext()
    }
  }, [session])

  const fetchUserProfile = async () => {
    if (!session?.user?.email) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/usuarios/${session.user.email}`)
      if (response.ok) {
        const userData = await response.json()
        setProfile(userData)
        setFormData({
          name: userData.name || '',
          department: userData.department || '',
          location: userData.location || '',
          jobTitle: userData.jobTitle || ''
        })
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchABACContext = async () => {
    try {
      const response = await fetch('/api/abac/context')
      if (response.ok) {
        const context = await response.json()
        setAbacContext(context)
      }
    } catch (error) {
      console.error('Erro ao buscar contexto ABAC:', error)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/usuarios/${profile.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          department: formData.department,
          location: formData.location,
          jobTitle: formData.jobTitle
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setProfile(updatedUser)
        setIsEditing(false)
        
        // Atualizar sessão se necessário
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            department: formData.department,
            location: formData.location,
            jobTitle: formData.jobTitle
          }
        })

        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso"
        })

        // Recarregar contexto ABAC
        await fetchABACContext()
      } else {
        throw new Error('Erro ao atualizar perfil')
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Nunca'
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground">Perfil não encontrado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.image || ''} alt={profile.name} />
              <AvatarFallback className="text-lg">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <p className="text-muted-foreground flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2" />
                {profile.email}
              </p>
              {profile.jobTitle && (
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {profile.jobTitle}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                size="sm"
              >
                {isEditing ? "Cancelar" : "Editar Perfil"}
              </Button>
              {isEditing && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size="sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{profile.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="department">Departamento</Label>
              {isEditing ? (
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Ex: Financeiro, TI, Atuarial"
                />
              ) : (
                <p className="text-sm text-muted-foreground flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  {profile.department || 'Não informado'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Localização</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: São Paulo, Rio de Janeiro"
                />
              ) : (
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {profile.location || 'Não informado'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="jobTitle">Cargo</Label>
              {isEditing ? (
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="Ex: Analista, Gerente, Diretor"
                />
              ) : (
                <p className="text-sm text-muted-foreground flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {profile.jobTitle || 'Não informado'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contexto ABAC */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Permissões ABAC
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {abacContext ? (
              <>
                <div>
                  <Label>Permissões Ativas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {abacContext.permissions.length > 0 ? (
                      abacContext.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">Nenhuma permissão específica</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Depto: {abacContext.department || 'Não definido'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Local: {abacContext.location || 'Não definido'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Cargo: {abacContext.jobTitle || 'Não definido'}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Carregando contexto de permissões...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Informações da Conta */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Último Login</Label>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(profile.lastLoginAt)}
                </p>
              </div>
              <div>
                <Label>Conta Criada</Label>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(profile.createdAt)}
                </p>
              </div>
              <div>
                <Label>Última Atualização</Label>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(profile.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
