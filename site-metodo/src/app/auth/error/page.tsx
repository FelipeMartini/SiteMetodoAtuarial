'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, ArrowLeft, Mail, RefreshCw } from 'lucide-react'
import Link from 'next/link'

/**
 * Componente interno para usar o useSearchParams
 */
function AuthErrorContent() {
  const searchParams = useSearchParams()
  const _error = searchParams?.get('error') || null

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'OAuthAccountNotLinked':
        return {
          title: 'Conta já existente',
          description:
            'Já existe uma conta com este email. Para maior segurança, por favor faça login com sua senha ou solicite a recuperação de senha.',
          suggestion: 'Você pode fazer login com suas credenciais ou solicitar uma nova senha.',
        }
      case 'Configuration':
        return {
          title: 'Erro de configuração',
          description: 'Houve um problema na configuração do provedor de autenticação.',
          suggestion: 'Tente novamente em alguns minutos ou entre em contato com o suporte.',
        }
      case 'AccessDenied':
        return {
          title: 'Acesso negado',
          description: 'Você negou permissão para acessar suas informações.',
          suggestion:
            'Para fazer login, é necessário permitir o acesso às informações básicas do seu perfil.',
        }
      case 'Verification':
        return {
          title: 'Verificação necessária',
          description: 'Não foi possível verificar sua identidade.',
          suggestion: 'Verifique sua conta de email ou tente novamente.',
        }
      case 'MissingCSRF':
        return {
          title: 'Problema de segurança',
          description: 'Houve um problema de segurança durante o login.',
          suggestion: 'Tente fazer login novamente.',
        }
      default:
        return {
          title: 'Erro de autenticação',
          description: 'Ocorreu um erro inesperado durante o processo de autenticação.',
          suggestion: 'Tente novamente ou entre em contato com o suporte.',
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className='w-full max-w-md'>
      <Card className='border-0 shadow-xl bg-white/80 backdrop-blur-sm'>
        <CardHeader className='text-center space-y-4'>
          <div className='mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center'>
            <AlertTriangle className='w-8 h-8 text-orange-600' />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>{errorInfo.title}</CardTitle>
          <CardDescription className='text-gray-600 text-base'>
            {errorInfo.description}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <Alert className='border-orange-200 bg-orange-50'>
            <AlertTriangle className='h-4 w-4 text-orange-600' />
            <AlertDescription className='text-orange-800'>{errorInfo.suggestion}</AlertDescription>
          </Alert>

          {error === 'OAuthAccountNotLinked' && (
            <div className='space-y-3'>
              <Button asChild className='w-full' variant='default'>
                <Link href='/login' className='flex items-center gap-2'>
                  <Mail className='w-4 h-4' />
                  Fazer login com email e senha
                </Link>
              </Button>

              <Button asChild className='w-full' variant='outline'>
                <Link href='/recuperar-senha' className='flex items-center gap-2'>
                  <RefreshCw className='w-4 h-4' />
                  Recuperar senha
                </Link>
              </Button>
            </div>
          )}

          <div className='flex flex-col gap-3'>
            <Button
              asChild
              className='w-full'
              variant={error === 'OAuthAccountNotLinked' ? 'outline' : 'default'}
            >
              <Link href='/login' className='flex items-center gap-2'>
                <ArrowLeft className='w-4 h-4' />
                Voltar ao login
              </Link>
            </Button>

            <Button asChild className='w-full' variant='ghost'>
              <Link href='/'>Ir para página inicial</Link>
            </Button>
          </div>

          {error && (
            <div className='text-center'>
              <p className='text-xs text-gray-500'>Código do erro: {error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Página de erro de autenticação OAuth
 * Lida com diversos tipos de erro do Auth.js v5
 */
export default function AuthErrorPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4'>
      <Suspense
        fallback={
          <div className='w-full max-w-md'>
            <Card className='border-0 shadow-xl bg-white/80 backdrop-blur-sm'>
              <CardContent className='flex items-center justify-center p-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              </CardContent>
            </Card>
          </div>
        }
      >
        <AuthErrorContent />
      </Suspense>
    </div>
  )
}
