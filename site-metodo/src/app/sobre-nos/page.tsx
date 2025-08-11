"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Award, Target, Eye, Heart, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function SobreNosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4">Sobre o Método Atuarial</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Transformando o futuro da
            <span className="text-primary block">Ciência Atuarial</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Há mais de uma década construindo soluções inovadoras para o mercado de previdência 
            e seguros, combinando expertise técnica com tecnologia de ponta.
          </p>
        </div>

        {/* Nossa História */}
        <div className="mb-20">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Nossa História</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Fundada em 2010, o Método Atuarial nasceu da visão de democratizar o acesso 
                    a soluções atuariais de alta qualidade. Começamos como uma pequena consultoria 
                    especializada e evoluímos para uma empresa de referência no mercado brasileiro.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Ao longo dos anos, desenvolvemos metodologias próprias e ferramentas tecnológicas 
                    que revolucionaram a forma como nossos clientes gerenciam seus riscos atuariais.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary">15+ anos experiência</Badge>
                    <Badge variant="secondary">500+ projetos</Badge>
                    <Badge variant="secondary">100+ clientes</Badge>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full flex items-center justify-center">
                      <Briefcase className="w-32 h-32 text-primary/80" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missão, Visão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Fornecer soluções atuariais inovadoras e acessíveis, promovendo a sustentabilidade 
                e transparência dos sistemas previdenciários e de seguros no Brasil.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Visão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Ser a principal referência em consultoria atuarial no Brasil, reconhecida pela 
                excelência técnica, inovação e compromisso com o sucesso de nossos clientes.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-left">
                <li>• <strong>Excelência:</strong> Qualidade em cada entrega</li>
                <li>• <strong>Inovação:</strong> Tecnologia a serviço do cliente</li>
                <li>• <strong>Transparência:</strong> Comunicação clara e honesta</li>
                <li>• <strong>Ética:</strong> Integridade em todas as relações</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Nossos Números */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos Números
            </h2>
            <p className="text-xl text-muted-foreground">
              Resultados que demonstram nossa experiência e compromisso
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">15+</div>
              <p className="text-muted-foreground">Anos de Experiência</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Projetos Realizados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100+</div>
              <p className="text-muted-foreground">Clientes Atendidos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">R$ 10B+</div>
              <p className="text-muted-foreground">Patrimônio Gerenciado</p>
            </div>
          </div>
        </div>

        {/* Nossa Equipe */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Profissionais altamente qualificados e certificados nas principais 
              instituições do país
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Membro da equipe 1 */}
            <Card className="text-center group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary/80" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Dr. João Silva</h3>
                <p className="text-primary font-medium mb-3">Diretor Executivo e Atuário Sênior</p>
                <p className="text-sm text-muted-foreground mb-4">
                  PhD em Ciências Atuariais, MIBA, com mais de 20 anos de experiência 
                  em previdência complementar.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">MIBA</Badge>
                  <Badge variant="outline" className="text-xs">CFA</Badge>
                  <Badge variant="outline" className="text-xs">PhD</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Membro da equipe 2 */}
            <Card className="text-center group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary/80" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Dra. Maria Santos</h3>
                <p className="text-primary font-medium mb-3">Diretora Técnica</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Mestrado em Estatística, especialista em modelagem de riscos 
                  e desenvolvimento de sistemas.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">MSc</Badge>
                  <Badge variant="outline" className="text-xs">SUSEP</Badge>
                  <Badge variant="outline" className="text-xs">PREVIC</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Membro da equipe 3 */}
            <Card className="text-center group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary/80" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Carlos Oliveira</h3>
                <p className="text-primary font-medium mb-3">Coordenador de Projetos</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Atuário formado pela UFRJ, especialista em avaliações atuariais 
                  e gestão de fundos de pensão.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-xs">Atuário</Badge>
                  <Badge variant="outline" className="text-xs">UFRJ</Badge>
                  <Badge variant="outline" className="text-xs">ABRAPP</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Certificações e Reconhecimentos */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Certificações e Reconhecimentos
            </h2>
            <p className="text-xl text-muted-foreground">
              Nosso compromisso com a excelência é reconhecido pelas principais 
              instituições do mercado
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">SUSEP</h3>
              <p className="text-sm text-muted-foreground">Registro de Atuário</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">PREVIC</h3>
              <p className="text-sm text-muted-foreground">Credenciamento</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">IBA</h3>
              <p className="text-sm text-muted-foreground">Membro Institucional</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">ISO 27001</h3>
              <p className="text-sm text-muted-foreground">Segurança da Informação</p>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Pronto para começar?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Entre em contato conosco e descubra como podemos ajudar sua organização 
                a alcançar novos patamares de excelência atuarial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contato">
                  <Button size="lg" className="min-w-[200px]">
                    Fale Conosco
                  </Button>
                </Link>
                <Link href="/servicos">
                  <Button variant="outline" size="lg" className="min-w-[200px]">
                    Nossos Serviços
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
