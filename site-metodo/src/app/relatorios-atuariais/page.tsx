'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FileText, BarChart3, Download, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'
import { RelatoriosAtuariais, DadosSeguro, RelatorioCompleto } from '@/lib/atuarial/calculos-financeiros'

export default function RelatoriosAtuariaisPage() {
  const [dadosSeguro, setDadosSeguro] = useState<DadosSeguro>({
    tipoSeguro: 'vida',
    capital: 100000,
    idade: 35,
    sexo: 'M',
    taxaJuros: 0.06,
    carregamento: 0.3
  })

  const [relatorio, setRelatorio] = useState<RelatorioCompleto | null>(null)
  const [loading, setLoading] = useState(false)

  const gerarRelatorio = async () => {
    setLoading(true)
    try {
      const relatorioCompleto = RelatoriosAtuariais.gerarRelatorioCompleto(dadosSeguro)
      setRelatorio(relatorioCompleto)
      toast.success('Relatório gerado com sucesso!')
    } catch (error) {
      toast.error('Erro ao gerar relatório: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const exportarRelatorio = () => {
    if (!relatorio) return

    const dadosExportacao = {
      data: new Date().toLocaleDateString('pt-BR'),
      ...relatorio
    }

    const blob = new Blob([JSON.stringify(dadosExportacao, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-atuarial-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Relatório exportado com sucesso!')
  }

  const obterClassificacaoRisco = (sensibilidade: number): { nivel: string; cor: string; icon: React.ReactElement } => {
    const absValue = Math.abs(sensibilidade)
    
    if (absValue < 0.1) {
      return {
        nivel: 'Baixo',
        cor: 'bg-green-500',
        icon: <CheckCircle className="w-4 h-4" />
      }
    } else if (absValue < 0.3) {
      return {
        nivel: 'Moderado',
        cor: 'bg-yellow-500',
        icon: <AlertTriangle className="w-4 h-4" />
      }
    } else {
      return {
        nivel: 'Alto',
        cor: 'bg-red-500',
        icon: <AlertTriangle className="w-4 h-4" />
      }
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Relatórios Atuariais
        </h1>
        <p className="text-gray-600">
          Análise completa de produtos de seguros e previdência
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuração do Produto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Configuração do Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tipoSeguro">Tipo de Seguro</Label>
                        <Select value={dadosSeguro.tipoSeguro} onValueChange={(value) => 
            setDadosSeguro(prev => ({ ...prev, tipoSeguro: value as DadosSeguro['tipoSeguro'] }))
          }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vida">Seguro de Vida</SelectItem>
                  <SelectItem value="acidentes">Acidentes Pessoais</SelectItem>
                  <SelectItem value="temporario">Temporário</SelectItem>
                  <SelectItem value="dotal">Dotal</SelectItem>
                  <SelectItem value="misto">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capital">Capital (R$)</Label>
                <Input
                  type="number"
                  value={dadosSeguro.capital}
                  onChange={(e) => setDadosSeguro(prev => ({ ...prev, capital: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  type="number"
                  min="18"
                  max="80"
                  value={dadosSeguro.idade}
                  onChange={(e) => setDadosSeguro(prev => ({ ...prev, idade: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={dadosSeguro.sexo} onValueChange={(value) => 
                  setDadosSeguro(prev => ({ ...prev, sexo: value as 'M' | 'F' }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="taxaJuros">Taxa (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={dadosSeguro.taxaJuros * 100}
                  onChange={(e) => setDadosSeguro(prev => ({ ...prev, taxaJuros: Number(e.target.value) / 100 }))}
                />
              </div>
            </div>

            <Button 
              onClick={gerarRelatorio}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </CardContent>
        </Card>

        {/* Relatório Gerado */}
        <div className="lg:col-span-2">
          {relatorio ? (
            <Tabs defaultValue="resumo" className="space-y-4">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="resumo">Resumo Executivo</TabsTrigger>
                  <TabsTrigger value="risco">Análise de Risco</TabsTrigger>
                  <TabsTrigger value="projecao">Projeção Financeira</TabsTrigger>
                  <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
                </TabsList>
                
                <Button onClick={exportarRelatorio} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <TabsContent value="resumo">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Resumo Executivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-600">Produto</Label>
                          <p className="font-semibold capitalize">{relatorio.resumoExecutivo.produto as string}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Capital Segurado</Label>
                          <p className="font-semibold">
                            R$ {(relatorio.resumoExecutivo.capital as number).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Idade do Contratante</Label>
                          <p className="font-semibold">{relatorio.resumoExecutivo.idadeContratante as number} anos</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm text-gray-600">Prêmio Nivelado</Label>
                          <p className="text-2xl font-bold text-blue-600">
                            R$ {(relatorio.resumoExecutivo.premioNivelado as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Taxa de Juros</Label>
                          <p className="font-semibold">
                            {((relatorio.resumoExecutivo.taxaJuros as number) * 100).toFixed(2)}% a.a.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risco">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Análise de Risco
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Classificação de Risco */}
                      <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Classificação de Risco</Label>
                        {(() => {
                          const classificacao = obterClassificacaoRisco(relatorio.analiseRisco.sensibilidadeTaxa as number)
                          return (
                            <Badge variant="outline" className={`${classificacao.cor} text-white`}>
                              {classificacao.icon}
                              <span className="ml-2">Risco {classificacao.nivel}</span>
                            </Badge>
                          )
                        })()}
                      </div>

                      {/* Sensibilidade à Taxa */}
                      <div>
                        <Label className="text-sm text-gray-600">Sensibilidade à Taxa de Juros</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <Progress 
                            value={Math.abs((relatorio.analiseRisco.sensibilidadeTaxa as number) * 100)} 
                            className="flex-1"
                          />
                          <span className="font-semibold">
                            {((relatorio.analiseRisco.sensibilidadeTaxa as number) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      {/* Cenários */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">Cenário Otimista</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            R$ {(relatorio.analiseRisco.cenarioOtimista as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className="p-4 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-800">Cenário Pessimista</span>
                          </div>
                          <p className="text-2xl font-bold text-red-600">
                            R$ {(relatorio.analiseRisco.cenarioPessimista as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>

                      {/* Volatilidade */}
                      <div>
                        <Label className="text-sm text-gray-600">Volatilidade (Desvio Padrão)</Label>
                        <p className="text-xl font-semibold">
                          R$ {(relatorio.analiseRisco.volatilidade as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projecao">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Projeção Financeira
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <Label className="text-sm text-gray-600">Prêmio Médio Projetado</Label>
                        <p className="text-3xl font-bold text-blue-600">
                          R$ {(relatorio.projecaoFinanceira.premioMedio as number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600 mb-4 block">Intervalo de Confiança (95%)</Label>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Limite Inferior (5º Percentil)</span>
                            <span className="font-semibold">
                              R$ {relatorio.projecaoFinanceira.intervaloConfianca.inferior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          
                          <Progress 
                            value={50} 
                            className="h-6 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200"
                          />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Limite Superior (95º Percentil)</span>
                            <span className="font-semibold">
                              R$ {relatorio.projecaoFinanceira.intervaloConfianca.superior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Interpretação</h4>
                        <p className="text-sm text-blue-800">
                          Com 95% de confiança, o prêmio deve variar entre R$ {relatorio.projecaoFinanceira.intervaloConfianca.inferior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} e R$ {relatorio.projecaoFinanceira.intervaloConfianca.superior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, considerando variações nas condições econômicas.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recomendacoes">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Recomendações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatorio.recomendacoes.map((recomendacao, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{recomendacao}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">⚠️ Aviso Importante</h4>
                      <p className="text-sm text-yellow-800">
                        Este relatório é baseado em modelos matemáticos e deve ser complementado com análise de mercado e regulamentações vigentes da SUSEP.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Nenhum relatório gerado
                </h3>
                <p className="text-muted-foreground">
                  Configure os parâmetros do produto e clique em &quot;Gerar Relatório&quot; para começar
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
