'use client'
// Página de criação de conta utilizando componente de formulário moderno
import React from 'react'
import Link from 'next/link'
import SocialLoginBox from '@/components/SocialLoginBox'
import { FormularioCriarConta } from '@/components/auth/FormularioCriarConta'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function CriarContaPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4'>
      <div className='w-full max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
          {/* Seção do formulário tradicional */}
          <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-xl'>
            <CardHeader className='text-center space-y-4 pb-6'>
              <CardTitle className='text-2xl font-bold text-gray-900'>Criar Nova Conta</CardTitle>
              <CardDescription className='text-gray-600 text-base leading-relaxed'>
                Preencha os dados abaixo para criar sua conta pessoal
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-6'>
              <FormularioCriarConta />

              <div className='text-center pt-4'>
                <p className='text-sm text-gray-600'>
                  Já tem uma conta?{' '}
                  <Link
                    href='/login'
                    className='font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 underline'
                  >
                    Faça login aqui
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seção do login social */}
          <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-xl'>
            <CardHeader className='text-center space-y-4 pb-6'>
              <CardTitle className='text-2xl font-bold text-gray-900'>Login Social</CardTitle>
              <CardDescription className='text-gray-600 text-base leading-relaxed'>
                Conecte-se rapidamente usando sua conta favorita
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SocialLoginBox
                showTitle={false}
                className='bg-transparent border-0 shadow-none p-0'
              />

              <Separator className='my-6' />

              <div className='text-center'>
                <p className='text-xs text-gray-500 leading-relaxed'>
                  Ao criar uma conta, você concorda com nossos{' '}
                  <Link href='/termos' className='text-blue-600 hover:text-blue-700 underline'>
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link href='/privacidade' className='text-blue-600 hover:text-blue-700 underline'>
                    Política de Privacidade
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rodapé informativo */}
        <div className='text-center mt-8'>
          <p className='text-sm text-gray-500'>
            Tendo problemas?{' '}
            <Link href='/contato' className='text-blue-600 hover:text-blue-700 underline'>
              Entre em contato conosco
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
