'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  ShieldCheck, 
  QrCode, 
  Key, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react'
import Image from 'next/image'

interface MfaStatus {
  totpEnabled: boolean
  emailEnabled: boolean
  smsEnabled: boolean
  lastUsedAt?: string
  recentActivity: Array<{
    id: string
    method: string
    success: boolean
    timestamp: string
    ipAddress?: string
  }>
  statistics: {
    successfulLogins: number
    failedLogins: number
  }
}

export default function MfaConfiguracao() {
  const [mfaStatus, setMfaStatus] = useState<MfaStatus | null>(null)
  const [qrCode, setQrCode] = useState('')
  const [manualKey, setManualKey] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    fetchMfaStatus()
  }, [])

  const fetchMfaStatus = async () => {
    try {
      const response = await fetch('/api/admin/mfa/status')
      if (response.ok) {
        const data = await response.json()
        setMfaStatus(data)
      } else {
        setError('Erro ao carregar status do MFA')
      }
    } catch (err) {
      setError('Erro ao carregar status do MFA')
    }
  }

  const generateTotp = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/mfa/totp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setQrCode(data.qrCode)
        setManualKey(data.manualEntryKey)
        setShowSetup(true)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao gerar TOTP')
      }
    } catch (err) {
      setError('Erro ao gerar TOTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyTotp = async () => {
    if (!token) {
      setError('Por favor, insira o código de verificação')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/mfa/totp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.verified) {
          setSuccess('TOTP configurado com sucesso!')
          setShowSetup(false)
          setQrCode('')
          setToken('')
          fetchMfaStatus() // Recarregar status
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Código inválido')
      }
    } catch (err) {
      setError('Erro ao verificar código')
    } finally {
      setLoading(false)
    }
  }

  const disableMfa = async () => {
    if (!token || !password) {
      setError('Por favor, insira o código TOTP e sua senha')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/mfa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })

      if (response.ok) {
        setSuccess('MFA desabilitado com sucesso!')
        setToken('')
        setPassword('')
        fetchMfaStatus() // Recarregar status
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao desabilitar MFA')
      }
    } catch (err) {
      setError('Erro ao desabilitar MFA')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Autenticação Multifator (MFA)</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">Status & Configuração</TabsTrigger>
          <TabsTrigger value="setup">Configurar TOTP</TabsTrigger>
          <TabsTrigger value="logs">Logs de Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TOTP (Authenticator)</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {mfaStatus?.totpEnabled ? (
                    <Badge className="bg-green-100 text-green-800">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Habilitado
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      Desabilitado
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estatísticas</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mfaStatus?.statistics.successfulLogins || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Logins bem-sucedidos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Último Uso</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {mfaStatus?.lastUsedAt 
                    ? formatDate(mfaStatus.lastUsedAt)
                    : 'Nunca usado'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!mfaStatus?.totpEnabled ? (
              <Button onClick={generateTotp} disabled={loading}>
                <QrCode className="h-4 w-4 mr-2" />
                Configurar TOTP
              </Button>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Para desabilitar o MFA, você precisará inserir um código TOTP válido e sua senha.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Código TOTP"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-32"
                  />
                  <Input
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button 
                    onClick={disableMfa} 
                    disabled={loading}
                    variant="destructive"
                  >
                    Desabilitar MFA
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          {showSetup && qrCode ? (
            <Card>
              <CardHeader>
                <CardTitle>Configurar Authenticator App</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="mb-4">
                    <Image
                      src={qrCode}
                      alt="QR Code TOTP"
                      width={200}
                      height={200}
                      className="mx-auto border rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Escaneie este QR Code com seu app authenticator (Google Authenticator, Authy, etc.)
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-xs font-semibold">Chave manual:</p>
                    <code className="text-sm break-all">{manualKey}</code>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Código de verificação:
                    </label>
                    <Input
                      type="text"
                      placeholder="Digite o código de 6 dígitos"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  
                  <Button onClick={verifyTotp} disabled={loading || !token}>
                    {loading ? 'Verificando...' : 'Verificar e Ativar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Configurar TOTP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  O TOTP (Time-based One-Time Password) adiciona uma camada extra de segurança 
                  à sua conta usando um app authenticator.
                </p>
                <Button onClick={generateTotp} disabled={loading}>
                  <QrCode className="h-4 w-4 mr-2" />
                  {loading ? 'Gerando...' : 'Gerar QR Code'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente do MFA</CardTitle>
            </CardHeader>
            <CardContent>
              {mfaStatus?.recentActivity && mfaStatus.recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {mfaStatus.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        {activity.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {activity.method.toUpperCase()} - {activity.success ? 'Sucesso' : 'Falha'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.timestamp)} • IP: {activity.ipAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
