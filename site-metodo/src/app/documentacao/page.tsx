"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Book, 
  Code, 
  Download, 
  ExternalLink, 
  FileText, 
  Search,
  BookOpen,
  Lightbulb,
  Cpu,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function DocumentacaoPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const documentacoes = [
    {
      categoria: "API Reference",
      icon: <Code className="w-5 h-5" />,
      itens: [
        {
          titulo: "API de Cálculos Atuariais",
          descricao: "Endpoints para cálculos de reservas, provisões e avaliações atuariais",
          nivel: "Intermediário",
          formato: "REST API",
          link: "#api-calculos"
        },
        {
          titulo: "API de Autenticação",
          descricao: "Sistema de autenticação e autorização baseado em tokens JWT",
          nivel: "Básico",
          formato: "REST API",
          link: "#api-auth"
        },
        {
          titulo: "API de Relatórios",
          descricao: "Geração e download de relatórios atuariais em diversos formatos",
          nivel: "Avançado",
          formato: "REST API",
          link: "#api-relatorios"
        }
      ]
    },
    {
      categoria: "Guias de Integração",
      icon: <BookOpen className="w-5 h-5" />,
      itens: [
        {
          titulo: "Integração com ERP",
          descricao: "Como integrar nossa plataforma com sistemas ERP existentes",
          nivel: "Avançado",
          formato: "Tutorial",
          link: "#guia-erp"
        },
        {
          titulo: "SDK JavaScript",
          descricao: "Biblioteca JavaScript para facilitar a integração web",
          nivel: "Intermediário",
          formato: "SDK",
          link: "#sdk-js"
        },
        {
          titulo: "Webhook Events",
          descricao: "Sistema de notificações em tempo real para eventos importantes",
          nivel: "Intermediário",
          formato: "Webhook",
          link: "#webhooks"
        }
      ]
    },
    {
      categoria: "Metodologias",
      icon: <Lightbulb className="w-5 h-5" />,
      itens: [
        {
          titulo: "Metodologia de Avaliação",
          descricao: "Fundamentos teóricos das metodologias atuariais utilizadas",
          nivel: "Avançado",
          formato: "Documento",
          link: "#metodologia-avaliacao"
        },
        {
          titulo: "Modelos Estatísticos",
          descricao: "Documentação dos modelos estatísticos e suas aplicações",
          nivel: "Avançado",
          formato: "Documento",
          link: "#modelos-estatisticos"
        },
        {
          titulo: "Padrões de Qualidade",
          descricao: "Padrões e boas práticas adotadas em nossos processos",
          nivel: "Básico",
          formato: "Documento",
          link: "#padroes-qualidade"
        }
      ]
    },
    {
      categoria: "Exemplos Práticos",
      icon: <Cpu className="w-5 h-5" />,
      itens: [
        {
          titulo: "Casos de Uso Reais",
          descricao: "Exemplos práticos de implementação em diferentes cenários",
          nivel: "Intermediário",
          formato: "Exemplos",
          link: "#casos-uso"
        },
        {
          titulo: "Templates de Código",
          descricao: "Modelos de código prontos para diferentes linguagens",
          nivel: "Básico",
          formato: "Templates",
          link: "#templates"
        },
        {
          titulo: "Playground Interativo",
          descricao: "Ambiente de testes para experimentar nossa API",
          nivel: "Básico",
          formato: "Interativo",
          link: "#playground"
        }
      ]
    }
  ];

  const recursosDownload = [
    {
      titulo: "Manual do Usuário",
      descricao: "Guia completo para utilização da plataforma",
      formato: "PDF",
      tamanho: "2.5 MB",
      versao: "v3.2"
    },
    {
      titulo: "SDK Python",
      descricao: "Biblioteca Python para integração",
      formato: "ZIP",
      tamanho: "1.2 MB",
      versao: "v1.4.2"
    },
    {
      titulo: "Postman Collection",
      descricao: "Coleção de endpoints para testes",
      formato: "JSON",
      tamanho: "256 KB",
      versao: "v2.0"
    },
    {
      titulo: "Documentação Técnica",
      descricao: "Especificações técnicas completas",
      formato: "PDF",
      tamanho: "5.8 MB",
      versao: "v2.1"
    }
  ];

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Básico': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Avançado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredDocumentacoes = documentacoes.map(categoria => ({
    ...categoria,
    itens: categoria.itens.filter(item =>
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(categoria => categoria.itens.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Documentação Técnica
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Guias completos, APIs, metodologias e recursos para desenvolvedores 
            e profissionais que utilizam nossas soluções atuariais.
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar na documentação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="documentacao" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documentacao">Documentação</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="suporte">Suporte</TabsTrigger>
          </TabsList>

          {/* Tab: Documentação */}
          <TabsContent value="documentacao" className="space-y-8">
            {filteredDocumentacoes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum documento encontrado para "{searchTerm}"
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredDocumentacoes.map((categoria, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-6">
                    {categoria.icon}
                    <h2 className="text-2xl font-bold text-foreground">{categoria.categoria}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {categoria.itens.map((item, itemIndex) => (
                      <Card key={itemIndex} className="group hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {item.titulo}
                            </CardTitle>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {item.descricao}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={`text-xs ${getNivelColor(item.nivel)}`}>
                              {item.nivel}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {item.formato}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="w-full" asChild>
                            <Link href={item.link}>
                              Ver Documentação
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Tab: Downloads */}
          <TabsContent value="downloads" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recursosDownload.map((recurso, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{recurso.titulo}</CardTitle>
                      </div>
                      <Badge variant="outline">{recurso.versao}</Badge>
                    </div>
                    <CardDescription>{recurso.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Formato: {recurso.formato}</span>
                        <span>Tamanho: {recurso.tamanho}</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Seção de Licenças */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Licenças e Termos
                </CardTitle>
                <CardDescription>
                  Informações sobre licenciamento e termos de uso dos recursos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Todos os recursos disponibilizados nesta seção estão sujeitos aos nossos 
                  termos de uso e políticas de licenciamento. Antes de fazer o download, 
                  certifique-se de ler e aceitar as condições.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/termos-uso">Ver Termos de Uso</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/politica-privacidade">Política de Privacidade</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Suporte */}
          <TabsContent value="suporte" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    FAQ - Perguntas Frequentes
                  </CardTitle>
                  <CardDescription>
                    Respostas para as dúvidas mais comuns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Como obter uma chave de API?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Acesse sua área cliente e navegue até "Configurações > API Keys" 
                        para gerar uma nova chave de autenticação.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Qual o limite de requisições?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        O limite padrão é de 1000 requisições por hora. Limites maiores 
                        estão disponíveis nos planos premium.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Como relatar um bug?
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Use nossa página de contato ou envie um email para 
                        suporte@metodoatuarial.com.br com detalhes do problema.
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Ver FAQ Completo
                  </Button>
                </CardContent>
              </Card>

              {/* Suporte Técnico */}
              <Card>
                <CardHeader>
                  <CardTitle>Suporte Técnico</CardTitle>
                  <CardDescription>
                    Entre em contato com nossa equipe especializada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-sm text-muted-foreground">
                        suporte@metodoatuarial.com.br
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Horário de Atendimento</h4>
                      <p className="text-sm text-muted-foreground">
                        Segunda a sexta: 9h às 18h<br />
                        Sábado: 9h às 12h
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">SLA de Resposta</h4>
                      <p className="text-sm text-muted-foreground">
                        • Crítico: 2 horas<br />
                        • Alto: 4 horas<br />
                        • Médio: 8 horas<br />
                        • Baixo: 24 horas
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href="/contato">
                      Abrir Ticket de Suporte
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Status da API */}
            <Card>
              <CardHeader>
                <CardTitle>Status dos Serviços</CardTitle>
                <CardDescription>
                  Monitoramento em tempo real da disponibilidade dos nossos serviços
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">API Principal</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Operacional
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Sistema de Relatórios</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Operacional
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Serviço de Backup</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      Manutenção
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    Ver Página de Status Completa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
