'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Upload, 
  FileSpreadsheet, 
  BarChart3, 
  Settings, 
  Download, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  TrendingUp,
  Calculator,
  FileText,
  Database
} from 'lucide-react'

interface Importacao {
  id: string
  nomeArquivo: string
  status: 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDA' | 'ERRO' | 'DADOS_SALVOS'
  totalRegistros: number
  registrosImportados: number
  registrosErro: number
  criadoEm: string
  concluidaEm?: string
  tempoProcessamento?: number
}

interface AnaliseAderencia {
  quiQuadrado: {
    valor: number
    pValor: number
    significativo: boolean
  }
  estatisticasGerais: {
    totalObservados: number
    totalEsperados: number
    diferencaPercentual: number
  }
}

export default function DashboardAderenciaTabuas() {
  const [importacoes, setImportacoes] = useState<Importacao[]>([])
  const [importacaoSelecionada, setImportacaoSelecionada] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [analiseResults, setAnaliseResults] = useState<AnaliseAderencia | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Configurações avançadas
  const [configuracao, setConfiguracao] = useState({
    intervalosIdade: {
      tipo: '5_5' as '5_5' | '10_10' | '3_3' | 'CUSTOMIZADO',
      intervaloCustomizado: 5,
      idadeInicial: 20,
      idadeFinal: 80
    },
    estatisticas: {
      nivelSignificancia: 0.05,
      calcularQuiQuadrado: true,
      calcularResiduos: true,
      calcularZScore: true
    },
    visualizacao: {
      incluirGraficos: true,
      incluirTabelas: true,
      incluirEstatisticas: true
    },
    relatorio: {
      titulo: 'Análise de Aderência de Tábuas de Mortalidade',
      autor: '',
      incluirResumoExecutivo: true,
      incluirConclusoes: true
    }
  })

  // Carregar importações na inicialização
  useEffect(() => {
    carregarImportacoes()
  }, [])

  const carregarImportacoes = async () => {
    try {
      const res = await fetch('/api/aderencia-tabuas/upload')
      if (!res.ok) throw new Error(`Falha ao listar importações: ${res.status}`)
      const data = await res.json()
      // API retorna { importacoes, estatisticas }
      setImportacoes(data.importacoes || [])
    } catch (error) {
      console.error('Erro ao carregar importações:', error)
      // fallback: manter lista atual
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(5)

    try {
      const formData = new FormData()
      formData.append('arquivo', file)
      formData.append('config', JSON.stringify({
        tipoImportacao: 'COMPLETO',
        sobrescreverExistentes: false,
        validarDados: true
      }))

      const res = await fetch('/api/aderencia-tabuas/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Upload falhou: ${res.status}`)
      }

      const data = await res.json()
      // Atualiza lista e seleciona importacao
      await carregarImportacoes()
      if (data.importacaoId) setImportacaoSelecionada(data.importacaoId)

      // Opcional: iniciar análise automática pela rota ExcelJS
      if (data.importacaoId) {
        setUploadProgress(60)
        try {
          const analiseRes = await fetch('/api/aderencia-tabuas/analise-exceljs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ importacaoId: data.importacaoId, configuracao: { mapeamentoColunas: {} } })
          })

          if (analiseRes.ok) {
            const analiseData = await analiseRes.json()
            // Se retornou dados processados, atualiza ui
            if (analiseData.dadosProcessados) {
              setAnaliseResults(prev => prev) // manter
            }
          } else {
            console.warn('Análise ExcelJS retornou erro', analiseRes.status)
          }
        } catch (err) {
          console.error('Erro ao iniciar análise ExcelJS:', err)
        }
      }

    } catch (error) {
      console.error('Erro no upload:', error)
      alert((error as Error).message)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      await carregarImportacoes()
    }
  }

  const executarAnalise = async () => {
    if (!importacaoSelecionada) {
      alert('Selecione uma importação primeiro')
      return
    }

    setLoading(true)

    try {
      const payload = {
        importacaoId: importacaoSelecionada,
        configuracao: {
          planilhaMassa: undefined,
          planilhaObitos: undefined,
          planilhaQx: undefined,
          extrairFormulas: true,
          validarDados: true
        }
      }

      const res = await fetch('/api/aderencia-tabuas/analise-exceljs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Análise falhou: ${res.status}`)
      }

      const data = await res.json()
      // a API retorna dadosProcessados e proximoPasso
      if (data.dadosProcessados) {
        // extrair estatísticas básicas para exibir
        const resumo = data.dadosProcessados.metadados || {}
        const resultadoSimulado: AnaliseAderencia = {
          quiQuadrado: {
            valor: resumo.quiQuadrado?.valor || 0,
            pValor: resumo.quiQuadrado?.pValor || 1,
            significativo: !!(resumo.quiQuadrado?.significativo)
          },
          estatisticasGerais: {
            totalObservados: resumo.obitos || 0,
            totalEsperados: resumo.esperados || 0,
            diferencaPercentual: resumo.diferencaPercentual || 0
          }
        }

        setAnaliseResults(resultadoSimulado)
      } else if (data.resultado) {
        // caso venha do analise-python
        const resultado = data.resultado
        setAnaliseResults({
          quiQuadrado: { valor: resultado.calculos_estatisticos?.chi_quadrado || 0, pValor: resultado.calculos_estatisticos?.valor_p || 1, significativo: resultado.calculos_estatisticos?.resultado_teste === 'REJEITA' },
          estatisticasGerais: { totalObservados: resultado.estatisticas_descritivas?.total_observados || 0, totalEsperados: resultado.estatisticas_descritivas?.total_esperados || 0, diferencaPercentual: resultado.estatisticas_descritivas?.razao_obs_esp || 0 }
        })
      }

      // refresh importacoes
      await carregarImportacoes()

    } catch (error) {
      console.error('Erro na análise:', error)
      alert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const gerarRelatorio = async (formato: 'PDF' | 'EXCEL' | 'JSON') => {
    if (!importacaoSelecionada) {
      alert('Selecione uma importação primeiro')
      return
    }

    setLoading(true)

    try {
      const payload = { importacaoId: importacaoSelecionada, formato, configuracao }
      const res = await fetch('/api/aderencia-tabuas/relatorio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Falha ao gerar relatório: ${res.status}`)
      }

      const data = await res.json()
      // Se o backend retornou caminho do arquivo, tentar baixar
      const arquivoPath = data?.arquivos && (data.arquivos.excel || data.arquivos.pdf || data.arquivos.json)
      if (arquivoPath) {
        // Arquivo salvo no servidor — buscar via fetch
        const fileRes = await fetch(arquivoPath)
        if (fileRes.ok) {
          const blob = await fileRes.blob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          const ext = formato.toLowerCase()
          a.download = `relatorio_aderencia.${ext}`
          a.click()
          URL.revokeObjectURL(url)
        } else {
          console.warn('Não foi possível baixar o arquivo gerado diretamente do servidor')
        }
      } else {
        // Fallback: baixar mensagem JSON
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `relatorio_aderencia.json`
        a.click()
        URL.revokeObjectURL(url)
      }

    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      alert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONCLUIDA':
      case 'DADOS_SALVOS':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PROCESSANDO':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'ERRO':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCLUIDA':
      case 'DADOS_SALVOS':
        return 'bg-green-100 text-green-800'
      case 'PROCESSANDO':
        return 'bg-blue-100 text-blue-800'
      case 'ERRO':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análise de Aderência de Tábuas de Mortalidade</h1>
          <p className="text-muted-foreground">
            Sistema completo para análise de aderência com chi-quadrado, intervalos configuráveis e relatórios PDF/Excel
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Versão 1.0 - Produção
        </Badge>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="dados" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Dados
          </TabsTrigger>
          <TabsTrigger value="configuracao" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="analise" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Análise
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Aba Upload */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload de Arquivos
              </CardTitle>
              <CardDescription>
                Faça upload de arquivos Excel (.xlsx, .xls) ou CSV com dados de massa, óbitos e tábuas de mortalidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                  <Input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="max-w-sm mx-auto"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fazendo upload...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Formatos suportados:</strong> Excel (.xlsx, .xls), CSV (.csv)<br/>
                  <strong>Tamanho máximo:</strong> 50MB<br/>
                  <strong>Estrutura esperada:</strong> Planilhas com massa de participantes, óbitos registrados e qx de mortalidade
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Dados */}
        <TabsContent value="dados" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Importações Realizadas
              </CardTitle>
              <CardDescription>
                Histórico de arquivos importados e status do processamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importacoes.map((importacao) => (
                  <div
                    key={importacao.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      importacaoSelecionada === importacao.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setImportacaoSelecionada(importacao.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(importacao.status)}
                        <div>
                          <p className="font-medium">{importacao.nomeArquivo}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(importacao.criadoEm).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p><strong>{importacao.registrosImportados}</strong> registros</p>
                          {importacao.registrosErro > 0 && (
                            <p className="text-red-600">{importacao.registrosErro} erros</p>
                          )}
                        </div>
                        <Badge className={getStatusColor(importacao.status)}>
                          {importacao.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                {importacoes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4" />
                    <p>Nenhuma importação encontrada</p>
                    <p className="text-sm">Faça upload de um arquivo para começar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Configuração */}
        <TabsContent value="configuracao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Análise
              </CardTitle>
              <CardDescription>
                Configure intervalos de idade, níveis de significância e parâmetros da análise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configuração de Intervalos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Intervalos de Idade</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo-intervalo">Tipo de Agrupamento</Label>
                    <Select
                      value={configuracao.intervalosIdade.tipo}
                      onValueChange={(value: any) => 
                        setConfiguracao(prev => ({
                          ...prev,
                          intervalosIdade: { ...prev.intervalosIdade, tipo: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3_3">3 em 3 anos (20-23, 23-26, ...)</SelectItem>
                        <SelectItem value="5_5">5 em 5 anos (20-25, 25-30, ...)</SelectItem>
                        <SelectItem value="10_10">10 em 10 anos (20-30, 30-40, ...)</SelectItem>
                        <SelectItem value="CUSTOMIZADO">Intervalo personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {configuracao.intervalosIdade.tipo === 'CUSTOMIZADO' && (
                    <div>
                      <Label htmlFor="intervalo-customizado">Intervalo (anos)</Label>
                      <Input
                        id="intervalo-customizado"
                        type="number"
                        min="1"
                        max="20"
                        value={configuracao.intervalosIdade.intervaloCustomizado}
                        onChange={(e) => 
                          setConfiguracao(prev => ({
                            ...prev,
                            intervalosIdade: { 
                              ...prev.intervalosIdade, 
                              intervaloCustomizado: parseInt(e.target.value) || 5 
                            }
                          }))
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="idade-inicial">Idade Inicial</Label>
                    <Input
                      id="idade-inicial"
                      type="number"
                      min="0"
                      max="100"
                      value={configuracao.intervalosIdade.idadeInicial}
                      onChange={(e) => 
                        setConfiguracao(prev => ({
                          ...prev,
                          intervalosIdade: { 
                            ...prev.intervalosIdade, 
                            idadeInicial: parseInt(e.target.value) || 0 
                          }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="idade-final">Idade Final</Label>
                    <Input
                      id="idade-final"
                      type="number"
                      min="0"
                      max="120"
                      value={configuracao.intervalosIdade.idadeFinal}
                      onChange={(e) => 
                        setConfiguracao(prev => ({
                          ...prev,
                          intervalosIdade: { 
                            ...prev.intervalosIdade, 
                            idadeFinal: parseInt(e.target.value) || 100 
                          }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Configuração Estatística */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Parâmetros Estatísticos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nivel-significancia">Nível de Significância</Label>
                    <Select
                      value={configuracao.estatisticas.nivelSignificancia.toString()}
                      onValueChange={(value) => 
                        setConfiguracao(prev => ({
                          ...prev,
                          estatisticas: { 
                            ...prev.estatisticas, 
                            nivelSignificancia: parseFloat(value) 
                          }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.01">1% (α = 0.01)</SelectItem>
                        <SelectItem value="0.05">5% (α = 0.05)</SelectItem>
                        <SelectItem value="0.10">10% (α = 0.10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="calcular-qui-quadrado"
                      checked={configuracao.estatisticas.calcularQuiQuadrado}
                      onCheckedChange={(checked) =>
                        setConfiguracao(prev => ({
                          ...prev,
                          estatisticas: { ...prev.estatisticas, calcularQuiQuadrado: checked }
                        }))
                      }
                    />
                    <Label htmlFor="calcular-qui-quadrado">Calcular Teste Qui-Quadrado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="calcular-residuos"
                      checked={configuracao.estatisticas.calcularResiduos}
                      onCheckedChange={(checked) =>
                        setConfiguracao(prev => ({
                          ...prev,
                          estatisticas: { ...prev.estatisticas, calcularResiduos: checked }
                        }))
                      }
                    />
                    <Label htmlFor="calcular-residuos">Calcular Resíduos Padronizados</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="calcular-zscore"
                      checked={configuracao.estatisticas.calcularZScore}
                      onCheckedChange={(checked) =>
                        setConfiguracao(prev => ({
                          ...prev,
                          estatisticas: { ...prev.estatisticas, calcularZScore: checked }
                        }))
                      }
                    />
                    <Label htmlFor="calcular-zscore">Calcular Z-Score</Label>
                  </div>
                </div>
              </div>

              {/* Configuração do Relatório */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configurações do Relatório</h3>
                <div>
                  <Label htmlFor="titulo-relatorio">Título do Relatório</Label>
                  <Input
                    id="titulo-relatorio"
                    value={configuracao.relatorio.titulo}
                    onChange={(e) => 
                      setConfiguracao(prev => ({
                        ...prev,
                        relatorio: { ...prev.relatorio, titulo: e.target.value }
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="autor-relatorio">Autor (Opcional)</Label>
                  <Input
                    id="autor-relatorio"
                    value={configuracao.relatorio.autor}
                    onChange={(e) => 
                      setConfiguracao(prev => ({
                        ...prev,
                        relatorio: { ...prev.relatorio, autor: e.target.value }
                      }))
                    }
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="incluir-graficos"
                      checked={configuracao.visualizacao.incluirGraficos}
                      onCheckedChange={(checked) =>
                        setConfiguracao(prev => ({
                          ...prev,
                          visualizacao: { ...prev.visualizacao, incluirGraficos: checked }
                        }))
                      }
                    />
                    <Label htmlFor="incluir-graficos">Incluir Gráficos</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="incluir-resumo"
                      checked={configuracao.relatorio.incluirResumoExecutivo}
                      onCheckedChange={(checked) =>
                        setConfiguracao(prev => ({
                          ...prev,
                          relatorio: { ...prev.relatorio, incluirResumoExecutivo: checked }
                        }))
                      }
                    />
                    <Label htmlFor="incluir-resumo">Incluir Resumo Executivo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="incluir-conclusoes"
                      checked={configuracao.relatorio.incluirConclusoes}
                      onCheckedChange={(checked) =>
                        setConfiguracao(prev => ({
                          ...prev,
                          relatorio: { ...prev.relatorio, incluirConclusoes: checked }
                        }))
                      }
                    />
                    <Label htmlFor="incluir-conclusoes">Incluir Conclusões</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Análise */}
        <TabsContent value="analise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Executar Análise de Aderência
              </CardTitle>
              <CardDescription>
                Execute a análise qui-quadrado com as configurações definidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!importacaoSelecionada ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Selecione uma importação na aba &quot;Dados&quot; antes de executar a análise
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Configuração Atual</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Intervalos:</strong> {configuracao.intervalosIdade.tipo.replace('_', ' em ')} anos</p>
                      <p><strong>Idades:</strong> {configuracao.intervalosIdade.idadeInicial} a {configuracao.intervalosIdade.idadeFinal} anos</p>
                      <p><strong>Significância:</strong> α = {configuracao.estatisticas.nivelSignificancia}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={executarAnalise} 
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Executando Análise...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Executar Análise de Aderência
                      </>
                    )}
                  </Button>

                  {analiseResults && (
                    <div className="space-y-4 mt-6">
                      <h4 className="text-lg font-medium">Resultados da Análise</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                              <p className="text-2xl font-bold">{analiseResults.quiQuadrado.valor.toFixed(4)}</p>
                              <p className="text-sm text-muted-foreground">Chi-Quadrado</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                              <p className="text-2xl font-bold">{analiseResults.quiQuadrado.pValor.toFixed(6)}</p>
                              <p className="text-sm text-muted-foreground">P-valor</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <CheckCircle className={`h-8 w-8 mx-auto mb-2 ${analiseResults.quiQuadrado.significativo ? 'text-red-600' : 'text-green-600'}`} />
                              <p className="text-2xl font-bold">
                                {analiseResults.quiQuadrado.significativo ? 'NÃO' : 'SIM'}
                              </p>
                              <p className="text-sm text-muted-foreground">Aderência</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Alert className={analiseResults.quiQuadrado.significativo ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Interpretação:</strong> {analiseResults.quiQuadrado.significativo 
                            ? 'A análise indica diferença SIGNIFICATIVA entre os óbitos observados e esperados. A tábua pode não ser adequada para esta população.'
                            : 'A análise indica boa ADERÊNCIA entre os óbitos observados e esperados. A tábua é adequada para esta população.'
                          }
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Total Observados:</strong> {analiseResults.estatisticasGerais.totalObservados}</p>
                          <p><strong>Total Esperados:</strong> {analiseResults.estatisticasGerais.totalEsperados.toFixed(2)}</p>
                        </div>
                        <div>
                          <p><strong>Diferença Percentual:</strong> {analiseResults.estatisticasGerais.diferencaPercentual.toFixed(2)}%</p>
                          <p><strong>Nível de Significância:</strong> {(configuracao.estatisticas.nivelSignificancia * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Relatórios */}
        <TabsContent value="relatorios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gerar Relatórios
              </CardTitle>
              <CardDescription>
                Exporte os resultados da análise em PDF, Excel ou JSON
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!analiseResults ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Execute uma análise primeiro para poder gerar relatórios
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => gerarRelatorio('PDF')}
                      disabled={loading}
                      className="h-24 flex flex-col items-center justify-center space-y-2"
                    >
                      <FileText className="h-8 w-8" />
                      <span>Relatório PDF</span>
                      <span className="text-xs text-muted-foreground">Documento completo</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => gerarRelatorio('EXCEL')}
                      disabled={loading}
                      className="h-24 flex flex-col items-center justify-center space-y-2"
                    >
                      <FileSpreadsheet className="h-8 w-8" />
                      <span>Planilha Excel</span>
                      <span className="text-xs text-muted-foreground">Dados para análise</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => gerarRelatorio('JSON')}
                      disabled={loading}
                      className="h-24 flex flex-col items-center justify-center space-y-2"
                    >
                      <Download className="h-8 w-8" />
                      <span>Dados JSON</span>
                      <span className="text-xs text-muted-foreground">Formato estruturado</span>
                    </Button>
                  </div>

                  {loading && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Gerando relatório... Isso pode levar alguns segundos.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Conteúdo dos Relatórios</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Resumo executivo com interpretação dos resultados</li>
                      <li>• Detalhamento completo por intervalo de idade</li>
                      <li>• Gráficos de observados vs esperados e resíduos</li>
                      <li>• Metodologia estatística utilizada</li>
                      <li>• Conclusões e recomendações práticas</li>
                      <li>• Dados originais e parâmetros de configuração</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
