"use client";

// Página inicial moderna com sistema de temas Tailwind + shadcn/ui
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    titulo: 'Consultoria Atuarial',
    descricao: 'Análise de riscos e avaliação de passivos previdenciários',
    icone: '📊',
  },
  {
    titulo: 'Relatórios Regulatórios',
    descricao: 'Atendimento às normas SUSEP, PREVIC e outros órgãos',
    icone: '📋',
  },
  {
    titulo: 'Modelagem Matemática',
    descricao: 'Desenvolvimento de modelos atuariais customizados',
    icone: '🔢',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-8 text-center">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-4">
                Método Atuarial
              </h1>
              <h2 className="text-xl text-muted-foreground max-w-2xl">
                Consultoria especializada em soluções atuariais, oferecendo excelência técnica
                e inovação para o mercado de previdência e seguros.
              </h2>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/sobre">
                <Button size="lg">
                  Conheça Nossa História
                </Button>
              </Link>
              <Link href="/contato">
                <Button variant="secondary" size="lg">
                  Solicitar Orçamento
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Nossos Serviços
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="h-full">
                <CardHeader className="text-center">
                  <div className="text-5xl mb-4">{service.icone}</div>
                  <CardTitle className="text-xl">{service.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {service.descricao}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="text-center p-8">
              <div className="flex flex-col items-center gap-6">
                <h3 className="text-2xl font-semibold text-foreground">
                  Pronto para transformar seu negócio?
                </h3>
                <p className="text-muted-foreground max-w-2xl">
                  Entre em contato conosco e descubra como nossas soluções atuariais
                  podem otimizar seus resultados e garantir conformidade regulatória.
                </p>
                <Link href="/contato">
                  <Button size="lg">
                    Fale Conosco
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
