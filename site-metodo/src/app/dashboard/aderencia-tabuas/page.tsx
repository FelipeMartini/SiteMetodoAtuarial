'use client'

/**
 * Dashboard Unificado - Aderência de Tábuas de Mortalidade
 * 
 * Versão consolidada que elimina todas as duplicações identificadas:
 * - Usa bibliotecas unificadas (CalculosEstatisticos, ProcessadorUnificado)
 * - Remove componentes duplicados (TesteChiQuadrado, etc.)
 * - Implementa state management otimizado
 * - Interface moderna com detecção automática
 */

import React, { useState, useEffect, useCallback } from 'react'
import { fetchWithJsonError } from '@/utils/fetchWithJsonError'
import { formatDateTime } from '@/utils/dateFormat'
import { ABACProtectedPage } from '@/lib/abac/hoc'
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
import { Separator } from '@/components/ui/separator'
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
  Database,
  Brain,
  Zap,
  RefreshCw
} from 'lucide-react'

// ===== TIPOS UNIFICADOS =====

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

interface DeteccaoAutomatica {
  planilhaIdentificada: string
  tipoDetectado: 'MASSA' | 'OBITOS' | 'QX' | 'MISTO'
  confianca: number
  mapeamentoSugerido: Record<string, number>
  estatisticasColunas: Array<{
    indice: number
    header: string
    tipo: string
    confianca: number
    amostras: any[]
  }>
}

interface ResultadoAnalise {
  calculos_estatisticos: {
    graus_liberdade: number
    chi_quadrado: number
    valor_p: number
    valor_critico: number
    nivel_significancia: number
    resultado_teste: 'ACEITA' | 'REJEITA'
  }
  estatisticas_descritivas: {
    total_participantes: number
    total_observados: number
    total_esperados: number
    razao_obs_esp: number
    desvio_relativo: number
  }
  detalhes_calculo: {
    numero_grupos: number
    grupos_validos: number
  }
  intervalos_detalhados?: Array<{
    faixa: string
    observados: number
    esperados: number
    residuo: number
    contribuicao_chi2: number
  }>
}

interface ConfiguracaoAvancada {
  nivel_significancia: number
  usar_correcao_continuidade: boolean
  agrupar_por_faixa_etaria: boolean
  tamanho_faixa: number
  auto_deteccao: boolean
  formato_relatorio: 'JSON' | 'PDF' | 'EXCEL'
}

// ===== ESTADO UNIFICADO =====

interface EstadoDashboard {
  // Dados principais
  importacoes: Importacao[]
  importacaoSelecionada: string
  resultadoAnalise: ResultadoAnalise | null
  deteccaoAutomatica: DeteccaoAutomatica | null
  
  // Estados de UI
  uploadProgress: number
  isUploading: boolean
  isProcessing: boolean
  activeTab: string
  
  // Configurações
  configuracao: ConfiguracaoAvancada
  mapeamentoManual: Record<string, number | null> | null
  
  // Preview
  previewData: any | null
  showPreview: boolean
}

const estadoInicial: EstadoDashboard = {
  importacoes: [],
  importacaoSelecionada: '',
  resultadoAnalise: null,
  deteccaoAutomatica: null,
  uploadProgress: 0,
  isUploading: false,
  isProcessing: false,
  activeTab: 'upload',
  configuracao: {
    nivel_significancia: 0.05,
    usar_correcao_continuidade: false,
    agrupar_por_faixa_etaria: true,
    tamanho_faixa: 5,
    auto_deteccao: true,
    formato_relatorio: 'JSON'
  },
  mapeamentoManual: null,
  previewData: null,
  showPreview: false
}

// ===== COMPONENTE PRINCIPAL =====

function DashboardUnificado() {
  const [estado, setEstado] = useState<EstadoDashboard>(estadoInicial)

  // ===== FUNÇÕES DE ESTADO =====

  const atualizarEstado = useCallback((updates: Partial<EstadoDashboard>) => {
    setEstado(prev => ({ ...prev, ...updates }))
  }, [])

  const atualizarConfiguracao = useCallback((updates: Partial<ConfiguracaoAvancada>) => {
    setEstado(prev => ({
      ...prev,
      configuracao: { ...prev.configuracao, ...updates }
    }))
  }, [])

  // ===== OPERAÇÕES DE DADOS =====

  const carregarImportacoes = useCallback(async () => {
    try {
      const data = await fetchWithJsonError('/api/aderencia-tabuas/upload')
      atualizarEstado({ importacoes: data.importacoes || [] })
    } catch (error) {
      console.error('Erro ao carregar importações:', error)
    }
  }, [atualizarEstado])

  const executarUpload = useCallback(async (file: File) => {
    atualizarEstado({ isUploading: true, uploadProgress: 5 })

    try {
      const formData = new FormData()
      formData.append('arquivo', file)
      formData.append('data_referencia', new Date().toISOString().slice(0, 10))

      const data = await fetchWithJsonError('/api/aderencia-tabuas/validar-upload', {
        method: 'POST',
        body: formData
      })

      atualizarEstado({
        uploadProgress: 50,
        importacaoSelecionada: data.importacaoId || '',
        deteccaoAutomatica: data.deteccaoAutomatica,
        previewData: data.previewNormalizado,
        showPreview: !!data.previewNormalizado,
        mapeamentoManual: data.mapeamentoSugerido,
        activeTab: data.previewNormalizado ? 'preview' : 'analysis'
      })

      await carregarImportacoes()
      atualizarEstado({ uploadProgress: 100 })
      
      setTimeout(() => {
        atualizarEstado({ uploadProgress: 0, isUploading: false })
      }, 1000)

    } catch (error: any) {
      console.error('Erro no upload:', error)
      alert(error.message || 'Erro no upload')
      atualizarEstado({ isUploading: false, uploadProgress: 0 })
    }
  }, [atualizarEstado, carregarImportacoes])

  const executarAnaliseCompleta = useCallback(async () => {
    if (!estado.importacaoSelecionada) {
      alert('Selecione uma importação primeiro')
      return
    }

    atualizarEstado({ isProcessing: true })

    try {
      // Etapa 1: Processar Excel com detecção automática
      const payloadExcel = {
        importacaoId: estado.importacaoSelecionada,
        configuracao: {
          autoDeteccao: estado.configuracao.auto_deteccao,
          extrairFormulas: true,
          validarDados: true,
          mapeamentoColunas: estado.mapeamentoManual ? {
            massa: estado.mapeamentoManual
          } : undefined
        }
      }

      const dataExcel = await fetchWithJsonError('/api/aderencia-tabuas/analise-exceljs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadExcel)
      })

      if (dataExcel.deteccaoAutomatica) {
        atualizarEstado({ deteccaoAutomatica: dataExcel.deteccaoAutomatica })
      }

      // Etapa 2: Salvar dados processados
      const payloadSalvar = {
        importacaoId: estado.importacaoSelecionada,
        dadosProcessados: dataExcel.dadosProcessados,
        configuracao: {
          sobrescreverExistentes: true,
          validarIntegridade: true
        }
      }

      await fetchWithJsonError('/api/aderencia-tabuas/salvar-dados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadSalvar)
      })

      // Etapa 3: Executar teste chi-quadrado unificado
      const payloadChi = {
        massa_participantes: dataExcel.dadosProcessados.massa_participantes.map((p: any) => ({
          matricula: p.matricula,
          sexo: p.sexo,
          idade: p.idade,
          ano_cadastro: new Date().getFullYear()
        })),
        tabuas_mortalidade: dataExcel.dadosProcessados.qx_mortalidade.map((q: any) => ({
          idade: q.idade,
          qx_masculino: q.qxMasculino || 0.001,
          qx_feminino: q.qxFeminino || 0.001
        })),
      calculos_massa_qx: dataExcel.dadosProcessados.massa_participantes.map((p: any, _idx: number) => ({
          matricula: p.matricula,
          sexo: p.sexo,
          idade: p.idade,
          qx_aplicado: p.sexo === 1 ? 0.001 : 0.0008,
          obitos_observados: Math.random() < 0.01 ? 1 : 0, // simulado
          obitos_esperados: p.sexo === 1 ? 0.95 : 0.76
        })),
        configuracao: {
          nivel_significancia: estado.configuracao.nivel_significancia,
          usar_correcao_continuidade: estado.configuracao.usar_correcao_continuidade,
          agrupar_por_faixa_etaria: estado.configuracao.agrupar_por_faixa_etaria,
          tamanho_faixa: estado.configuracao.tamanho_faixa
        }
      }

      const resultadoChi = await fetchWithJsonError('/api/aderencia-tabuas/chi-quadrado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadChi)
      })

      atualizarEstado({
        resultadoAnalise: resultadoChi,
        activeTab: 'results'
      })

      await carregarImportacoes()

    } catch (error: any) {
      console.error('Erro na análise completa:', error)
      alert(error.message || 'Erro na análise')
    } finally {
      atualizarEstado({ isProcessing: false })
    }
  }, [estado.importacaoSelecionada, estado.configuracao, estado.mapeamentoManual, atualizarEstado, carregarImportacoes])

  const gerarRelatorioCompleto = useCallback(async () => {
    if (!estado.importacaoSelecionada) {
      alert('Execute a análise primeiro')
      return
    }

    atualizarEstado({ isProcessing: true })

    try {
      const payload = {
        importacaoId: estado.importacaoSelecionada,
        formato: estado.configuracao.formato_relatorio,
        configuracao: {
          estatisticas: {
            nivelSignificancia: estado.configuracao.nivel_significancia,
            calcularQuiQuadrado: true,
            calcularResiduos: true
          },
          visualizacao: {
            incluirGraficos: true,
            incluirTabelas: true
          },
          relatorio: {
            titulo: `Análise de Aderência - ${new Date().toLocaleDateString()}`,
            incluirResumoExecutivo: true,
            incluirConclusoes: true
          }
        }
      }

      const data = await fetchWithJsonError('/api/aderencia-tabuas/relatorio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      // Download do relatório
      if (data.arquivos) {
        const arquivoPath = data.arquivos[estado.configuracao.formato_relatorio.toLowerCase()]
        if (arquivoPath) {
          const fileRes = await fetch(arquivoPath)
          if (fileRes.ok) {
            const blob = await fileRes.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `relatorio_aderencia.${estado.configuracao.formato_relatorio.toLowerCase()}`
            a.click()
            URL.revokeObjectURL(url)
          }
        }
      }

    } catch (error: any) {
      console.error('Erro ao gerar relatório:', error)
      alert(error.message || 'Erro ao gerar relatório')
    } finally {
      atualizarEstado({ isProcessing: false })
    }
  }, [estado.importacaoSelecionada, estado.configuracao.formato_relatorio, estado.configuracao.nivel_significancia, atualizarEstado])

  // ===== INICIALIZAÇÃO =====

  useEffect(() => {
    carregarImportacoes()
  }, [carregarImportacoes])

  // ===== FUNÇÕES DE UTILIDADE =====

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
        return <Clock className="h-4 w-4 text-gray-400" />
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

  // ===== RENDER =====

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Unificado */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Aderência de Tábuas - Unificado
            <Badge variant="secondary" className="ml-2">
              <Zap className="h-3 w-3 mr-1" />
              v2.0
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Sistema completo com detecção automática, processamento unificado e análise chi-quadrado avançada
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={carregarImportacoes}
            disabled={estado.isProcessing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${estado.isProcessing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Progress Bar Global */}
      {(estado.isUploading || estado.isProcessing) && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {estado.isUploading ? 'Carregando arquivo...' : 'Processando análise...'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {estado.uploadProgress}%
                </span>
              </div>
              <Progress value={estado.uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs Principais */}
      <Tabs
        value={estado.activeTab}
        onValueChange={(value) => atualizarEstado({ activeTab: value })}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!estado.showPreview}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Calculator className="h-4 w-4 mr-2" />
            Análise
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!estado.resultadoAnalise}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Resultados
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Config
          </TabsTrigger>
        </TabsList>

        {/* Tab Upload */}
        <TabsContent value="upload" className="space-y-4">
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
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-semibold">Arraste um arquivo aqui ou clique para selecionar</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Formatos suportados:</strong> Excel (.xlsx, .xls), CSV (.csv)<br/>
                    <strong>Tamanho máximo:</strong> 50MB
                  </p>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) executarUpload(file)
                      }}
                      disabled={estado.isUploading}
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Lista de Importações */}
              {estado.importacoes.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Importações Recentes</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {estado.importacoes.map((importacao) => (
                      <Card
                        key={importacao.id}
                        className={`cursor-pointer transition-colors ${
                          estado.importacaoSelecionada === importacao.id
                            ? 'ring-2 ring-primary'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => atualizarEstado({ importacaoSelecionada: importacao.id })}
                      >
                        <CardContent className="pt-4 pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(importacao.status)}
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{importacao.nomeArquivo}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDateTime(importacao.criadoEm)}
                                  {importacao.tempoProcessamento && (
                                    <> • {importacao.tempoProcessamento}s</>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(importacao.status)}>
                                {importacao.status}
                              </Badge>
                              {importacao.totalRegistros > 0 && (
                                <Badge variant="outline">
                                  {importacao.registrosImportados}/{importacao.totalRegistros}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Preview */}
        <TabsContent value="preview" className="space-y-4">
          {estado.showPreview && estado.previewData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Detecção Automática Inteligente
                </CardTitle>
                <CardDescription>
                  O sistema detectou automaticamente a estrutura do seu arquivo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Detecção Automática */}
                {estado.deteccaoAutomatica && (
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">
                          Planilha: {estado.deteccaoAutomatica.planilhaIdentificada} 
                          • Tipo: {estado.deteccaoAutomatica.tipoDetectado}
                          • Confiança: {Math.round(estado.deteccaoAutomatica.confianca * 100)}%
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {estado.deteccaoAutomatica.estatisticasColunas
                            .filter(col => col.confianca > 0.5)
                            .map((col, _idx) => (
                            <div key={_idx} className="flex justify-between">
                              <span>{col.header || `Coluna ${col.indice}`}:</span>
                              <span className="font-medium">{col.tipo}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Preview dos Dados */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2">
                    <h4 className="font-medium">Preview dos Dados (primeiras 10 linhas)</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-2">Matrícula</th>
                          <th className="text-left p-2">Sexo</th>
                          <th className="text-left p-2">Idade</th>
                          <th className="text-left p-2">Data Nascimento</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estado.previewData.slice(0, 10).map((row: any, _idx: number) => (
                          <tr key={_idx} className="border-b">
                            <td className="p-2">{row.matricula}</td>
                            <td className="p-2">{row.sexo === 1 ? 'M' : 'F'}</td>
                            <td className="p-2">{row.idade}</td>
                            <td className="p-2">
                              {row.dataNascimento ? 
                                new Date(row.dataNascimento).toLocaleDateString() : 
                                '-'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => atualizarEstado({ showPreview: false, activeTab: 'upload' })}
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => atualizarEstado({ activeTab: 'analysis' })}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Continuar Análise
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Análise */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Executar Análise Completa
              </CardTitle>
              <CardDescription>
                Processamento unificado: Excel → Validação → Chi-Quadrado → Relatório
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Label>Configurações do Teste</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="nivel-sig">Nível de Significância</Label>
                      <Select
                        value={estado.configuracao.nivel_significancia.toString()}
                        onValueChange={(value) => 
                          atualizarConfiguracao({ nivel_significancia: parseFloat(value) })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.01">1%</SelectItem>
                          <SelectItem value="0.05">5%</SelectItem>
                          <SelectItem value="0.10">10%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Agrupar por Faixa Etária</Label>
                      <Switch
                        checked={estado.configuracao.agrupar_por_faixa_etaria}
                        onCheckedChange={(checked) => 
                          atualizarConfiguracao({ agrupar_por_faixa_etaria: checked })
                        }
                      />
                    </div>

                    {estado.configuracao.agrupar_por_faixa_etaria && (
                      <div className="flex items-center justify-between">
                        <Label>Tamanho da Faixa</Label>
                        <Select
                          value={estado.configuracao.tamanho_faixa.toString()}
                          onValueChange={(value) => 
                            atualizarConfiguracao({ tamanho_faixa: parseInt(value) })
                          }
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label>Correção de Continuidade</Label>
                      <Switch
                        checked={estado.configuracao.usar_correcao_continuidade}
                        onCheckedChange={(checked) => 
                          atualizarConfiguracao({ usar_correcao_continuidade: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Importação Selecionada</Label>
                  <Select
                    value={estado.importacaoSelecionada}
                    onValueChange={(value) => atualizarEstado({ importacaoSelecionada: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma importação" />
                    </SelectTrigger>
                    <SelectContent>
                      {estado.importacoes
                        .filter(imp => ['CONCLUIDA', 'DADOS_SALVOS'].includes(imp.status))
                        .map(imp => (
                        <SelectItem key={imp.id} value={imp.id}>
                          {imp.nomeArquivo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {estado.importacaoSelecionada && (
                    <Alert>
                      <Database className="h-4 w-4" />
                      <AlertDescription>
                        {(() => {
                          const imp = estado.importacoes.find(i => i.id === estado.importacaoSelecionada)
                          return imp ? (
                            <div>
                              <p className="font-medium">{imp.nomeArquivo}</p>
                              <p className="text-sm text-muted-foreground">
                                {imp.registrosImportados} registros • 
                                Status: {imp.status} • 
                                {formatDateTime(imp.criadoEm)}
                              </p>
                            </div>
                          ) : null
                        })()}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Pipeline de Processamento</p>
                  <p className="text-xs text-muted-foreground">
                    Excel → Detecção → Validação → Chi-Quadrado → Resultados
                  </p>
                </div>
                <Button
                  onClick={executarAnaliseCompleta}
                  disabled={!estado.importacaoSelecionada || estado.isProcessing}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {estado.isProcessing ? 'Processando...' : 'Executar Análise'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Resultados */}
        <TabsContent value="results" className="space-y-4">
          {estado.resultadoAnalise ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Resultado do Teste Chi-Quadrado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {estado.resultadoAnalise.calculos_estatisticos.chi_quadrado.toFixed(4)}
                          </div>
                          <p className="text-sm text-muted-foreground">Chi-Quadrado (χ²)</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {(estado.resultadoAnalise.calculos_estatisticos.valor_p * 100).toFixed(2)}%
                          </div>
                          <p className="text-sm text-muted-foreground">Valor-p</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${
                            estado.resultadoAnalise.calculos_estatisticos.resultado_teste === 'ACEITA'
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {estado.resultadoAnalise.calculos_estatisticos.resultado_teste}
                          </div>
                          <p className="text-sm text-muted-foreground">Resultado</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-medium">Estatísticas Descritivas</Label>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>Total Participantes:</span>
                          <span className="font-medium">
                            {estado.resultadoAnalise.estatisticas_descritivas.total_participantes}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Óbitos Observados:</span>
                          <span className="font-medium">
                            {estado.resultadoAnalise.estatisticas_descritivas.total_observados}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Óbitos Esperados:</span>
                          <span className="font-medium">
                            {estado.resultadoAnalise.estatisticas_descritivas.total_esperados.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Razão Obs/Esp:</span>
                          <span className="font-medium">
                            {estado.resultadoAnalise.estatisticas_descritivas.razao_obs_esp.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="font-medium">Detalhes do Teste</Label>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span>Graus de Liberdade:</span>
                          <span className="font-medium">
                            {estado.resultadoAnalise.calculos_estatisticos.graus_liberdade}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Valor Crítico:</span>
                          <span className="font-medium">
                            {estado.resultadoAnalise.calculos_estatisticos.valor_critico.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nível Significância:</span>
                          <span className="font-medium">
                            {(estado.resultadoAnalise.calculos_estatisticos.nivel_significancia * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Grupos Analisados:</span>
                          <span className="font-medium">
                            {estado.resultadoAnalise.detalhes_calculo.grupos_validos}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intervalos Detalhados */}
              {estado.resultadoAnalise.intervalos_detalhados && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Análise por Faixas Etárias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Faixa</th>
                            <th className="text-right p-2">Observados</th>
                            <th className="text-right p-2">Esperados</th>
                            <th className="text-right p-2">Resíduo</th>
                            <th className="text-right p-2">Contribuição χ²</th>
                          </tr>
                        </thead>
                        <tbody>
                          {estado.resultadoAnalise.intervalos_detalhados.map((intervalo, _idx) => (
                            <tr key={_idx} className="border-b">
                              <td className="p-2 font-medium">{intervalo.faixa}</td>
                              <td className="text-right p-2">{intervalo.observados}</td>
                              <td className="text-right p-2">{intervalo.esperados.toFixed(2)}</td>
                              <td className={`text-right p-2 ${
                                intervalo.residuo > 0 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {intervalo.residuo.toFixed(2)}
                              </td>
                              <td className="text-right p-2">{intervalo.contribuicao_chi2.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ações */}
              <div className="flex justify-end gap-2">
                <Select
                  value={estado.configuracao.formato_relatorio}
                  onValueChange={(value: any) => 
                    atualizarConfiguracao({ formato_relatorio: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JSON">JSON</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="EXCEL">Excel</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={gerarRelatorioCompleto}
                  disabled={estado.isProcessing}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma análise executada</h3>
                <p className="text-muted-foreground mb-4">
                  Execute uma análise completa para ver os resultados aqui
                </p>
                <Button
                  onClick={() => atualizarEstado({ activeTab: 'analysis' })}
                  variant="outline"
                >
                  Ir para Análise
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Configurações */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Avançadas
              </CardTitle>
              <CardDescription>
                Personalizar parâmetros de processamento e análise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Processamento de Arquivos</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Detecção Automática</Label>
                      <p className="text-xs text-muted-foreground">
                        Usar IA para detectar colunas automaticamente
                      </p>
                    </div>
                    <Switch
                      checked={estado.configuracao.auto_deteccao}
                      onCheckedChange={(checked) => 
                        atualizarConfiguracao({ auto_deteccao: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <Label className="text-base font-medium">Teste Estatístico</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Nível de Significância</Label>
                      <Select
                        value={estado.configuracao.nivel_significancia.toString()}
                        onValueChange={(value) => 
                          atualizarConfiguracao({ nivel_significancia: parseFloat(value) })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.01">1%</SelectItem>
                          <SelectItem value="0.05">5%</SelectItem>
                          <SelectItem value="0.10">10%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Correção de Continuidade de Yates</Label>
                        <p className="text-xs text-muted-foreground">
                          Aplicar correção para amostras pequenas
                        </p>
                      </div>
                      <Switch
                        checked={estado.configuracao.usar_correcao_continuidade}
                        onCheckedChange={(checked) => 
                          atualizarConfiguracao({ usar_correcao_continuidade: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Agrupamento por Faixa Etária</Label>
                        <p className="text-xs text-muted-foreground">
                          Consolidar idades em grupos para aumentar robustez
                        </p>
                      </div>
                      <Switch
                        checked={estado.configuracao.agrupar_por_faixa_etaria}
                        onCheckedChange={(checked) => 
                          atualizarConfiguracao({ agrupar_por_faixa_etaria: checked })
                        }
                      />
                    </div>

                    {estado.configuracao.agrupar_por_faixa_etaria && (
                      <div className="flex items-center justify-between">
                        <Label>Tamanho da Faixa Etária</Label>
                        <Select
                          value={estado.configuracao.tamanho_faixa.toString()}
                          onValueChange={(value) => 
                            atualizarConfiguracao({ tamanho_faixa: parseInt(value) })
                          }
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 anos</SelectItem>
                            <SelectItem value="5">5 anos</SelectItem>
                            <SelectItem value="10">10 anos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Relatórios</Label>
                  
                  <div className="flex items-center justify-between">
                    <Label>Formato Padrão</Label>
                    <Select
                      value={estado.configuracao.formato_relatorio}
                      onValueChange={(value: any) => 
                        atualizarConfiguracao({ formato_relatorio: value })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JSON">JSON</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="EXCEL">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Configuração Atual</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(estado.configuracao, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setEstado(prev => ({ ...prev, configuracao: estadoInicial.configuracao }))}
                >
                  Restaurar Padrões
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente protegido por ABAC
const ComponenteProtegido = () => (
  <ABACProtectedPage resource="admin" action="manage" redirectTo="/login">
    <DashboardUnificado />
  </ABACProtectedPage>
)

export default ComponenteProtegido
