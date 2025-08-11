'use client'
import Link from 'next/link'

import React from 'react'
import Image from 'next/image'
// import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SobrePage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-16'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
            Sobre o Método Atuarial
          </h1>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Consultoria especializada em soluções atuariais com excelência técnica e inovação para o
            mercado de previdência e seguros.
          </p>
        </div>

        {/* Grid de Informações */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>🎯 Nossa Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Fornecer soluções atuariais de alta qualidade, contribuindo para a sustentabilidade
                e transparência do sistema previdenciário brasileiro.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>👁️ Nossa Visão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                Ser referência nacional em consultoria atuarial, reconhecida pela inovação, precisão
                técnica e compromisso com nossos clientes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>⭐ Nossos Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='text-muted-foreground space-y-1'>
                <li>• Excelência técnica</li>
                <li>• Transparência</li>
                <li>• Inovação</li>
                <li>• Responsabilidade</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Seção da Equipe */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-center text-foreground mb-8'>Nossa Equipe</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <Card>
              <CardContent className='p-6'>
                <div className='flex flex-col items-center text-center'>
                  <div className='w-32 h-32 bg-muted rounded-full mb-4 flex items-center justify-center'>
                    <span className='text-4xl'>👨‍💼</span>
                  </div>
                  <h3 className='text-xl font-semibold text-foreground mb-2'>Equipe Técnica</h3>
                  <p className='text-muted-foreground'>
                    Profissionais especializados em ciências atuariais com ampla experiência no
                    mercado previdenciário.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-6'>
                <div className='flex flex-col items-center text-center'>
                  <div className='w-32 h-32 bg-muted rounded-full mb-4 flex items-center justify-center'>
                    <span className='text-4xl'>🎓</span>
                  </div>
                  <h3 className='text-xl font-semibold text-foreground mb-2'>Formação Acadêmica</h3>
                  <p className='text-muted-foreground'>
                    Formação sólida em matemática, estatística e economia, com especializações em
                    atuária e gestão de riscos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seção de Ambiente de Trabalho */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-center text-foreground mb-8'>
            Nosso Ambiente de Trabalho
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map(num => (
              <Card key={num} className='overflow-hidden'>
                <div className='aspect-video bg-muted flex items-center justify-center'>
                  <Image
                    src={`/office-${num === 4 ? 'team' : num}.png`}
                    alt={`Ambiente de trabalho ${num}`}
                    width={300}
                    height={200}
                    className='object-cover w-full h-full'
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                      const next = e.currentTarget.nextElementSibling as HTMLElement | null
                      if (next) next.style.display = 'flex'
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <Card className='text-center'>
          <CardHeader>
            <CardTitle className='text-2xl'>Vamos trabalhar juntos?</CardTitle>
            <CardDescription>
              Entre em contato para conhecer nossas soluções atuariais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href='/contato'
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            >
              Solicitar Orçamento
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
