"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const services = [
  {
    titulo: 'Consultoria Atuarial',
    descricao: 'Análise de riscos e avaliação de passivos previdenciários com metodologias avançadas',
    icone: '📊',
    badge: 'Especialidade',
    features: ['Avaliação de Passivos', 'Análise de Riscos', 'Projeções Atuariais']
  },
  {
    titulo: 'Relatórios Regulatórios',
    descricao: 'Atendimento às normas SUSEP, PREVIC e outros órgãos reguladores',
    icone: '📋',
    badge: 'Compliance',
    features: ['Relatórios SUSEP', 'Relatórios PREVIC', 'Auditoria']
  },
  {
    titulo: 'Modelagem Matemática',
    descricao: 'Desenvolvimento de modelos atuariais customizados e inovadores',
    icone: '🔢',
    badge: 'Inovação',
    features: ['Modelos Customizados', 'Machine Learning', 'Simulações Monte Carlo']
  },
];

const testimonials = [
  {
    company: "Empresa de Previdência A",
    feedback: "Excelência técnica e agilidade na entrega dos relatórios.",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    company: "Seguradora B",
    feedback: "Modelagem precisa que otimizou nossos resultados.",
    rating: "⭐⭐⭐⭐⭐"
  },
  {
    company: "Fundo de Pensão C",
    feedback: "Consultoria estratégica que transformou nossa gestão de riscos.",
    rating: "⭐⭐⭐⭐⭐"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section with Modern Design */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-col items-center gap-8 text-center max-w-4xl mx-auto">
            {/* Alert Badge */}
            <Alert className="w-fit">
              <AlertDescription className="flex items-center gap-2">
                🚀 <span className="font-medium">Líder em Consultoria Atuarial</span> - Mais de 100 projetos entregues
              </AlertDescription>
            </Alert>

            {/* Main Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Método Atuarial
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light max-w-3xl">
                Transformando dados em insights estratégicos para o futuro da previdência
              </h2>
            </div>

            {/* Features Highlights */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="text-sm">✨ Metodologias Avançadas</Badge>
              <Badge variant="secondary" className="text-sm">🎯 Resultados Precisos</Badge>
              <Badge variant="secondary" className="text-sm">⚡ Entrega Rápida</Badge>
              <Badge variant="secondary" className="text-sm">🔒 Compliance Total</Badge>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contato">
                <Button size="lg" className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Solicitar Orçamento
                  <span className="ml-2">→</span>
                </Button>
              </Link>
              <Link href="/sobre">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                  Conheça Nossa História
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Tabs */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos Serviços Especializados
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Soluções atuariais completas com tecnologia de ponta e expertise comprovada
            </p>
          </div>

          <Tabs defaultValue="consultoria" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="consultoria">Consultoria</TabsTrigger>
              <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              <TabsTrigger value="modelagem">Modelagem</TabsTrigger>
            </TabsList>

            {services.map((service, index) => (
              <TabsContent key={index} value={index === 0 ? "consultoria" : index === 1 ? "relatorios" : "modelagem"}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{service.icone}</span>
                        <Badge variant="outline">{service.badge}</Badge>
                      </div>
                      <CardTitle className="text-2xl">{service.titulo}</CardTitle>
                      <CardDescription className="text-lg">
                        {service.descricao}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                      <div className="text-8xl opacity-50">{service.icone}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-muted-foreground">
              Confiança construída através de resultados excepcionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{testimonial.company}</CardTitle>
                    <span className="text-sm">{testimonial.rating}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "{testimonial.feedback}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto text-center">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Pronto para Revolucionar Sua Gestão Atuarial?
              </CardTitle>
              <CardDescription className="text-lg">
                Junte-se a mais de 100 empresas que confiam em nossas soluções para transformar
                complexidade em clareza e dados em decisões estratégicas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contato">
                  <Button size="lg" className="px-8 py-6 text-lg">
                    Começar Agora
                    <span className="ml-2">🚀</span>
                  </Button>
                </Link>
                <Link href="/servicos">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                    Ver Todos os Serviços
                  </Button>
                </Link>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  💼 Consultoria gratuita para novos clientes | 📞 Atendimento especializado | 🏆 Qualidade certificada
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
