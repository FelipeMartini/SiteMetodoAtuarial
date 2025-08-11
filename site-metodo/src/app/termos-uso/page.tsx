"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TermosUsoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Termos de Uso
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="outline">Última atualização: Janeiro 2025</Badge>
            <Badge variant="secondary">Versão 1.0</Badge>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Estes termos de uso regem o uso do site e serviços do Método Atuarial.
            Ao utilizar nossos serviços, você concorda com estes termos.
          </p>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* 1. Aceitação dos Termos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">1. Aceitação dos Termos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e usar o site do Método Atuarial (&quot;Site&quot;), você aceita e concorda 
                em ficar vinculado aos termos e condições deste Acordo. Se você não concordar 
                com todos os termos e condições deste acordo, então você não pode acessar o 
                Site ou usar qualquer serviço.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Estes termos se aplicam a todos os visitantes, usuários e outras pessoas que 
                acessam ou usam o serviço.
              </p>
            </CardContent>
          </Card>

          {/* 2. Descrição do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">2. Descrição do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                O Método Atuarial oferece serviços de consultoria atuarial, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Avaliações atuariais para fundos de pensão</li>
                <li>Consultoria em previdência complementar</li>
                <li>Análises de risco e sustentabilidade</li>
                <li>Relatórios técnicos especializados</li>
                <li>Plataforma online para cálculos atuariais</li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. Uso da Plataforma */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">3. Uso da Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Ao usar nossa plataforma, você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Usar o serviço apenas para finalidades legais e autorizadas</li>
                <li>Não violar nenhuma lei local, estadual, nacional ou internacional</li>
                <li>Não transmitir material que seja abusivo, ofensivo ou inadequado</li>
                <li>Não interferir com a segurança do serviço</li>
                <li>Não usar o serviço para spam ou atividades não solicitadas</li>
              </ul>
            </CardContent>
          </Card>

          {/* 4. Contas de Usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">4. Contas de Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Para acessar certas funcionalidades, você deve criar uma conta. Você é responsável por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Manter a confidencialidade de sua senha</li>
                <li>Todas as atividades que ocorrem em sua conta</li>
                <li>Notificar imediatamente sobre uso não autorizado</li>
                <li>Fornecer informações precisas e atualizadas</li>
              </ul>
            </CardContent>
          </Card>

          {/* 5. Propriedade Intelectual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">5. Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                O serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão 
                propriedade exclusiva do Método Atuarial e seus licenciadores. O serviço é 
                protegido por direitos autorais, marcas registradas e outras leis.
              </p>
            </CardContent>
          </Card>

          {/* 6. Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">6. Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Sua privacidade é importante para nós. Consulte nossa 
                <a href="/politica-privacidade" className="text-primary hover:underline mx-1">
                  Política de Privacidade
                </a>
                para informações sobre como coletamos, usamos e protegemos suas informações.
              </p>
            </CardContent>
          </Card>

          {/* 7. Limitação de Responsabilidade */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">7. Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Em nenhum caso o Método Atuarial, nem seus diretores, funcionários, parceiros, 
                agentes, fornecedores ou afiliados, serão responsáveis por danos indiretos, 
                incidentais, especiais, consequentes ou punitivos, incluindo sem limitação, 
                perda de lucros, dados, uso, goodwill ou outras perdas intangíveis.
              </p>
            </CardContent>
          </Card>

          {/* 8. Modificações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">8. Modificações dos Termos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Reservamos o direito, a nosso exclusivo critério, de modificar ou substituir 
                estes Termos a qualquer momento. Se uma revisão for material, tentaremos 
                fornecer pelo menos 30 dias de aviso antes de quaisquer novos termos entrarem 
                em vigor.
              </p>
            </CardContent>
          </Card>

          {/* 9. Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">9. Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco 
                através da nossa 
                <a href="/contato" className="text-primary hover:underline mx-1">
                  página de contato
                </a>
                ou pelo email: contato@metodoatuarial.com.br
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
