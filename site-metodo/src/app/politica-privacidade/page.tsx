"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Política de Privacidade
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="outline">Última atualização: Janeiro 2025</Badge>
            <Badge variant="secondary">LGPD Compliance</Badge>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Esta política descreve como coletamos, usamos e protegemos suas informações pessoais 
            em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>
        </div>

        {/* Alert LGPD */}
        <div className="max-w-4xl mx-auto mb-8">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Esta política está em conformidade com a Lei Geral de Proteção de Dados Pessoais 
              (Lei nº 13.709/2018 - LGPD) e estabelece as diretrizes sobre tratamento de dados pessoais.
            </AlertDescription>
          </Alert>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* 1. Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">1. Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Controlador de Dados:</strong> Método Atuarial Ltda.<br />
                <strong>CNPJ:</strong> [Número do CNPJ]<br />
                <strong>Endereço:</strong> [Endereço completo]<br />
                <strong>Email:</strong> privacidade@metodoatuarial.com.br<br />
                <strong>DPO (Encarregado):</strong> [Nome do responsável]
              </p>
            </CardContent>
          </Card>

          {/* 2. Dados Coletados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">2. Dados Pessoais Coletados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Coletamos os seguintes tipos de dados pessoais:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">2.1 Dados de Identificação</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Nome completo</li>
                    <li>E-mail</li>
                    <li>Telefone</li>
                    <li>CPF/CNPJ</li>
                    <li>Endereço</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">2.2 Dados de Navegação</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Endereço IP</li>
                    <li>Cookies e tecnologias similares</li>
                    <li>Páginas visitadas</li>
                    <li>Tempo de navegação</li>
                    <li>Dispositivo e navegador utilizados</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">2.3 Dados Profissionais</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Empresa/Instituição</li>
                    <li>Cargo/Função</li>
                    <li>Área de atuação</li>
                    <li>Informações técnicas relevantes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Finalidades */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">3. Finalidades do Tratamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos seus dados pessoais para as seguintes finalidades:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Prestação de serviços:</strong> Fornecer consultoria atuarial e acesso à plataforma</li>
                <li><strong>Comunicação:</strong> Responder dúvidas, enviar atualizações e informações relevantes</li>
                <li><strong>Melhorias:</strong> Aprimorar nossos serviços e experiência do usuário</li>
                <li><strong>Segurança:</strong> Proteger contra fraudes e acessos não autorizados</li>
                <li><strong>Cumprimento legal:</strong> Atender obrigações regulamentares e fiscais</li>
                <li><strong>Marketing:</strong> Enviar informações sobre novos serviços (mediante consentimento)</li>
              </ul>
            </CardContent>
          </Card>

          {/* 4. Base Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">4. Base Legal do Tratamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                O tratamento de seus dados pessoais está fundamentado nas seguintes bases legais da LGPD:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Execução de contrato (Art. 7º, V):</strong> Para prestação dos serviços contratados</li>
                <li><strong>Legítimo interesse (Art. 7º, IX):</strong> Para melhorias e segurança do serviço</li>
                <li><strong>Consentimento (Art. 7º, I):</strong> Para comunicações de marketing</li>
                <li><strong>Cumprimento de obrigação legal (Art. 7º, II):</strong> Para atender exigências regulamentares</li>
              </ul>
            </CardContent>
          </Card>

          {/* 5. Compartilhamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">5. Compartilhamento de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Podemos compartilhar seus dados pessoais nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Prestadores de serviços:</strong> Empresas que nos auxiliam na prestação dos serviços</li>
                <li><strong>Autoridades:</strong> Quando exigido por lei ou autoridades competentes</li>
                <li><strong>Parceiros de negócio:</strong> Mediante seu consentimento explícito</li>
                <li><strong>Sucessão empresarial:</strong> Em caso de fusão, aquisição ou reorganização</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Importante:</strong> Não vendemos, alugamos ou comercializamos seus dados pessoais 
                para terceiros para fins de marketing sem seu consentimento explícito.
              </p>
            </CardContent>
          </Card>

          {/* 6. Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">6. Segurança dos Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backup regular e seguro dos dados</li>
                <li>Treinamento regular da equipe</li>
                <li>Auditorias periódicas de segurança</li>
              </ul>
            </CardContent>
          </Card>

          {/* 7. Retenção */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">7. Retenção de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Manteremos seus dados pessoais pelo tempo necessário para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Dados contratuais:</strong> Durante a vigência do contrato + 5 anos</li>
                <li><strong>Dados fiscais:</strong> Conforme exigências legais (tipicamente 5 anos)</li>
                <li><strong>Dados de marketing:</strong> Até a retirada do consentimento</li>
                <li><strong>Dados de navegação:</strong> Até 12 meses</li>
              </ul>
            </CardContent>
          </Card>

          {/* 8. Seus Direitos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">8. Seus Direitos (LGPD)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Você possui os seguintes direitos em relação aos seus dados pessoais:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li><strong>Anonimização ou eliminação:</strong> Eliminar dados desnecessários ou excessivos</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Eliminação:</strong> Eliminar dados tratados com base no consentimento</li>
                <li><strong>Revogação do consentimento:</strong> Retirar consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento em certas circunstâncias</li>
              </ul>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Para exercer seus direitos:</strong> Entre em contato através do email 
                  privacidade@metodoatuarial.com.br ou através da nossa página de contato. 
                  Responderemos em até 15 dias úteis.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 9. Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">9. Cookies e Tecnologias Similares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Essenciais:</strong> Garantir o funcionamento básico do site</li>
                <li><strong>Funcionais:</strong> Lembrar suas preferências e configurações</li>
                <li><strong>Analíticos:</strong> Entender como você usa nosso site</li>
                <li><strong>Marketing:</strong> Personalizar anúncios (mediante consentimento)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </CardContent>
          </Card>

          {/* 10. Alterações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">10. Alterações desta Política</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Esta política pode ser atualizada periodicamente. Quando houver alterações 
                significativas, notificaremos você através de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Email para o endereço cadastrado</li>
                <li>Aviso destacado em nosso site</li>
                <li>Comunicação através da plataforma</li>
              </ul>
            </CardContent>
          </Card>

          {/* 11. Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">11. Canal de Comunicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Para dúvidas sobre esta política ou exercício de direitos:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacidade@metodoatuarial.com.br</p>
                <p><strong>Telefone:</strong> [Telefone de contato]</p>
                <p><strong>Endereço:</strong> [Endereço completo]</p>
                <p><strong>Horário de atendimento:</strong> Segunda a sexta, das 9h às 18h</p>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Você também pode registrar reclamações junto à Autoridade Nacional de 
                  Proteção de Dados (ANPD) através do site: 
                  <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" 
                     className="text-primary hover:underline ml-1">
                    www.gov.br/anpd
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
