"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  FileSpreadsheet,
  TrendingUp,
  ShieldCheck,
  Users,
  Building,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3
} from 'lucide-react';

/**
 * Página inicial moderna com design inspirado no fuse-react
 * Sistema completo de temas e componentes customizados
 */

const services = [
  {
    id: 'consultoria',
    titulo: 'Consultoria Atuarial',
    descricao: 'Análise de riscos e avaliação de passivos previdenciários com metodologias avançadas',
    icon: Calculator,
    badge: 'Especialidade',
    features: ['Avaliação de Passivos', 'Análise de Riscos', 'Projeções Atuariais'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'relatorios',
    titulo: 'Relatórios Regulatórios',
    descricao: 'Atendimento às normas SUSEP, PREVIC e outros órgãos reguladores',
    icon: FileSpreadsheet,
    badge: 'Compliance',
    features: ['Relatórios SUSEP', 'Relatórios PREVIC', 'Auditoria'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'modelagem',
    titulo: 'Modelagem Matemática',
    descricao: 'Desenvolvimento de modelos atuariais customizados e inovadores',
    icon: BarChart3,
    badge: 'Inovação',
    features: ['Modelos Customizados', 'Machine Learning', 'Simulações Monte Carlo'],
    color: 'from-purple-500 to-purple-600'
  },
];

const stats = [
  { label: 'Projetos Concluídos', value: '500+', icon: Award },
  { label: 'Clientes Satisfeitos', value: '150+', icon: Users },
  { label: 'Anos de Experiência', value: '15+', icon: TrendingUp },
  { label: 'Certificações', value: '25+', icon: ShieldCheck },
];

const testimonials = [
  {
    company: "Empresa de Previdência A",
    feedback: "Excelência técnica e agilidade na entrega dos relatórios. Superaram nossas expectativas.",
    rating: 5,
    author: "João Silva",
    position: "Diretor Atuarial"
  },
  {
    company: "Seguradora B",
    feedback: "Modelagem precisa que otimizou nossos resultados. Recomendamos fortemente.",
    rating: 5,
    author: "Maria Santos",
    position: "Gerente de Riscos"
  },
  {
    company: "Fundo de Pensão C",
    feedback: "Consultoria estratégica que transformou nossa gestão de riscos e compliance.",
    rating: 5,
    author: "Carlos Oliveira",
    position: "Superintendente"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="flex flex-col items-center gap-8 text-center max-w-5xl mx-auto">
            {/* Badge de destaque */}
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-fade-in">
              <Award className="h-4 w-4 mr-2" />
              Líder em Consultoria Atuarial - 15+ anos de experiência
            </Badge>

            {/* Headlines principais */}
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-gradient">Método Atuarial</span>
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light max-w-4xl leading-relaxed">
                Transformando complexidade atuarial em clareza estratégica
                <br />
                <span className="text-primary font-medium">para o futuro da previdência</span>
              </h2>
            </div>

            {/* Features em destaque */}
            <div className="flex flex-wrap gap-3 justify-center animate-fade-in">
              <Badge variant="outline" className="px-3 py-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Metodologias Avançadas
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Resultados Precisos
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Compliance Total
              </Badge>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-slide-up">
              <Link href="/contato">
                <Button size="lg" variant="default" className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} variant="ghost" className="text-center p-6">
                <CardContent className="space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos Serviços <span className="text-gradient">Especializados</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Soluções atuariais completas com tecnologia de ponta e expertise comprovada
            </p>
          </div>

          <Tabs defaultValue="consultoria" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-12 h-12">
              <TabsTrigger value="consultoria" className="text-sm font-medium">
                Consultoria
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="text-sm font-medium">
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="modelagem" className="text-sm font-medium">
                Modelagem
              </TabsTrigger>
            </TabsList>

            {services.map((service) => (
              <TabsContent key={service.id} value={service.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <Card variant="elevated" hover="lift" className="h-full">
                    <CardHeader className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}>
                          <service.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-2xl">{service.titulo}</CardTitle>
                            <Badge variant="secondary">{service.badge}</Badge>
                          </div>
                          <CardDescription className="text-base leading-relaxed">
                            {service.descricao}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Principais serviços:</h4>
                        <ul className="space-y-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" className="w-full mt-6">
                          Saiba mais sobre {service.titulo}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ilustração visual */}
                  <div className="relative">
                    <div className={`aspect-square bg-gradient-to-br ${service.color} rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                      <service.icon className="h-32 w-32 text-white/80 relative z-10" />
                      <div className="absolute -top-10 -right-10 h-32 w-32 bg-white/10 rounded-full" />
                      <div className="absolute -bottom-10 -left-10 h-24 w-24 bg-white/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O Que Nossos <span className="text-gradient">Clientes</span> Dizem
            </h2>
            <p className="text-xl text-muted-foreground">
              Confiança construída através de resultados excepcionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="elevated" hover="lift" className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.company}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground italic leading-relaxed">
                    &quot;{testimonial.feedback}&quot;
                  </p>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card variant="gradient" className="max-w-4xl mx-auto text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
            <CardHeader className="relative z-10 pb-8">
              <CardTitle className="text-3xl md:text-4xl mb-4 text-white">
                Pronto para Revolucionar Sua Gestão Atuarial?
              </CardTitle>
              <CardDescription className="text-lg text-white/90 leading-relaxed">
                Junte-se a mais de 150 empresas que confiam em nossas soluções para transformar
                complexidade em clareza e dados em decisões estratégicas.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contato">
                  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-semibold">
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/servicos">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary">
                    Ver Todos os Serviços
                  </Button>
                </Link>
              </div>

              <div className="pt-6 border-t border-white/20">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                  <span className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Consultoria gratuita
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Atendimento especializado
                  </span>
                  <span className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Qualidade certificada
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
