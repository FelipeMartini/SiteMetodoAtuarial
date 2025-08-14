'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Calculator, BarChart3, FileText, Activity } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { analisarExcel } from '@/lib/analise-excel/analisadorExcel'
import { useUIStore } from '@/lib/zustand/uiStore'
import { FormularioUploadExcel } from './componentes/FormularioUploadExcel'
import { AnalisePrevia } from './componentes/AnalisePrevia'
import { TesteChiQuadrado } from './componentes/TesteChiQuadrado'
import { VisualizacaoResultados } from './componentes/VisualizacaoResultados'
import { RelatorioAderencia } from './componentes/RelatorioAderencia'
import type { DadosAnaliseExcel } from '@/types/analise-excel'

type AbaAnalise = 'upload' | 'analise' | 'teste' | 'resultados' | 'relatorio'

interface DadosAderencia {
  massa_participantes: Array<{
    matricula: string;
    sexo: number;
    idade: number;
    ano_cadastro: number;
  }>;
  tabuas_mortalidade: Array<{
    idade: number;
    qx_masculino: number;
    qx_feminino: number;
    at2000_suav_masc: number;
    at2000_suav_fem: number;
  }>;
  calculos_massa_qx: Array<{
    matricula: string;
    ano_obito: number;
    sexo: number;
    idade: number;
    qx_aplicado: number;
    obitos_observados: number;
    obitos_esperados: number;
  }>;
  calculos_estatisticos: {
    graus_liberdade: number;
    chi_quadrado: number;
    valor_p: number;
    nivel_significancia: number;
    resultado_teste: 'ACEITA' | 'REJEITA';
  };
}

export default function AderenciaTabuasPage() {
  const [abaSelecionada, setAbaSelecionada] = useState<AbaAnalise>('upload')
  const [carregandoAnalise, setCarregandoAnalise] = useState(false)
  const [processandoTeste, setProcessandoTeste] = useState(false)
  const [dadosAderencia, setDadosAderencia] = useState<DadosAderencia | null>(null)
  
  const { toast } = useToast()
  const { dadosAnaliseExcel, setDadosAnaliseExcel } = useUIStore()

  const manipularUploadArquivo = useCallback(async (arquivo: File) => {
    setCarregandoAnalise(true)
    
    try {
      // Converte arquivo para buffer
      const arrayBuffer = await arquivo.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Analisa com ExcelJS
      const resultadoAnalise = await analisarExcel(buffer)
      setDadosAnaliseExcel(resultadoAnalise)
      
      // Processa dados específicos de mortalidade
      const dadosProcessados = await processarDadosMortalidade(resultadoAnalise)
      setDadosAderencia(dadosProcessados)
      
      toast({
        title: '✅ Arquivo carregado com sucesso!',
        description: `Arquivo "${arquivo.name}" analisado. ${resultadoAnalise.planilhas.length} planilhas encontradas.`,
      })
      
      setAbaSelecionada('analise')
      
    } catch (erro) {
      console.error('Erro ao processar arquivo:', erro)
      toast({
        title: '❌ Erro no processamento',
        description: 'Não foi possível processar o arquivo Excel. Verifique se é um arquivo válido.',
        variant: 'destructive'
      })
    } finally {
      setCarregandoAnalise(false)
    }
  }, [setDadosAnaliseExcel, toast])

  const processarDadosMortalidade = async (dados: DadosAnaliseExcel): Promise<DadosAderencia> => {
    // Extrai dados da planilha "MASSA TRABALHADA UNIFICADA"
    const planilhaMassa = dados.planilhas.find(p => p.nome === 'MASSA TRABALHADA UNIFICADA')
    const massa_participantes = planilhaMassa?.linhas.slice(1).map(linha => ({
      matricula: String(linha.celulas[0]?.valor || ''),
      sexo: Number(linha.celulas[1]?.valor || 0),
      idade: Number(linha.celulas[2]?.valor || 0),
      ano_cadastro: Number(linha.celulas[3]?.valor || 0)
    })) || []

    // Extrai dados da planilha "qx" (tábuas de mortalidade)
    const planilhaQx = dados.planilhas.find(p => p.nome === 'qx')
    const tabuas_mortalidade = planilhaQx?.linhas.slice(3).map(linha => ({
      idade: Number(linha.celulas[0]?.valor || 0),
      qx_masculino: Number(linha.celulas[1]?.valor || 0),
      qx_feminino: Number(linha.celulas[2]?.valor || 0),
      at2000_suav_masc: Number(linha.celulas[3]?.valor || 0),
      at2000_suav_fem: Number(linha.celulas[4]?.valor || 0)
    })) || []

    // Extrai dados da planilha "Calculos Massa qx"
    const planilhaCalculos = dados.planilhas.find(p => p.nome === 'Calculos Massa qx')
    const calculos_massa_qx = planilhaCalculos?.linhas.slice(1).map(linha => ({
      matricula: String(linha.celulas[0]?.valor || ''),
      ano_obito: Number(linha.celulas[1]?.valor || 0),
      sexo: Number(linha.celulas[2]?.valor || 0),
      idade: Number(linha.celulas[3]?.valor || 0),
      qx_aplicado: Number(linha.celulas[4]?.valor || 0),
      obitos_observados: Number(linha.celulas[5]?.valor || 0),
      obitos_esperados: Number(linha.celulas[6]?.valor || 0)
    })) || []

    // Dados estatísticos simulados (serão calculados posteriormente)
    const calculos_estatisticos = {
      graus_liberdade: 0,
      chi_quadrado: 0,
      valor_p: 0,
      nivel_significancia: 0.05,
      resultado_teste: 'ACEITA' as const
    }

    return {
      massa_participantes,
      tabuas_mortalidade,
      calculos_massa_qx,
      calculos_estatisticos
    }
  }

  const executarTesteChiQuadrado = async () => {
    if (!dadosAderencia) return
    
    setProcessandoTeste(true)
    try {
      // Chama API para executar teste chi-quadrado
      const response = await fetch('/api/aderencia-tabuas/chi-quadrado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAderencia)
      })
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      
      const resultado = await response.json()
      
      setDadosAderencia(prev => prev ? {
        ...prev,
        calculos_estatisticos: resultado
      } : null)
      
      toast({
        title: '✅ Teste Chi-Quadrado concluído!',
        description: `Resultado: ${resultado.resultado_teste}. Chi² = ${resultado.chi_quadrado.toFixed(4)}`,
      })
      
      setAbaSelecionada('resultados')
      
    } catch (erro) {
      console.error('Erro no teste chi-quadrado:', erro)
      toast({
        title: '❌ Erro no teste',
        description: 'Não foi possível executar o teste chi-quadrado.',
        variant: 'destructive'
      })
    } finally {
      setProcessandoTeste(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Cabeçalho */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          📊 Teste de Aderência de Tábuas de Mortalidade
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Sistema completo para análise estatística de aderência de tábuas de mortalidade usando o teste Chi-Quadrado. 
          Carregue seus dados Excel e obtenha relatórios detalhados sobre a adequação das hipóteses biométricas.
        </p>
      </div>

      {/* Cards de status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className={abaSelecionada === 'upload' ? 'border-primary' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              1. Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dadosAnaliseExcel ? '✅' : '⏳'}
            </div>
            <p className="text-xs text-muted-foreground">
              {dadosAnaliseExcel ? 'Arquivo carregado' : 'Aguardando arquivo'}
            </p>
          </CardContent>
        </Card>

        <Card className={abaSelecionada === 'analise' ? 'border-primary' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              2. Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dadosAderencia ? '✅' : '⏳'}
            </div>
            <p className="text-xs text-muted-foreground">
              {dadosAderencia ? 'Dados processados' : 'Aguardando processamento'}
            </p>
          </CardContent>
        </Card>

        <Card className={abaSelecionada === 'teste' ? 'border-primary' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              3. Teste Chi²
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(dadosAderencia?.calculos_estatisticos.chi_quadrado || 0) > 0 ? '✅' : '⏳'}
            </div>
            <p className="text-xs text-muted-foreground">
              {processandoTeste ? 'Calculando...' : 'Aguardando teste'}
            </p>
          </CardContent>
        </Card>

        <Card className={abaSelecionada === 'resultados' ? 'border-primary' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              4. Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dadosAderencia?.calculos_estatisticos.resultado_teste ? '✅' : '⏳'}
            </div>
            <p className="text-xs text-muted-foreground">
              {dadosAderencia?.calculos_estatisticos.resultado_teste || 'Aguardando teste'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interface principal */}
      <Tabs value={abaSelecionada} onValueChange={(value) => setAbaSelecionada(value as AbaAnalise)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload" disabled={carregandoAnalise}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="analise" disabled={!dadosAnaliseExcel}>
            <Activity className="h-4 w-4 mr-2" />
            Análise
          </TabsTrigger>
          <TabsTrigger value="teste" disabled={!dadosAderencia}>
            <Calculator className="h-4 w-4 mr-2" />
            Teste Chi²
          </TabsTrigger>
          <TabsTrigger value="resultados" disabled={!(dadosAderencia?.calculos_estatisticos.chi_quadrado || 0)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Resultados
          </TabsTrigger>
          <TabsTrigger value="relatorio" disabled={!dadosAderencia?.calculos_estatisticos.resultado_teste}>
            <FileText className="h-4 w-4 mr-2" />
            Relatório
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <FormularioUploadExcel 
            onUpload={manipularUploadArquivo}
            carregando={carregandoAnalise}
          />
        </TabsContent>

        <TabsContent value="analise" className="mt-6">
          {dadosAderencia && (
            <AnalisePrevia 
              dados={dadosAderencia}
              onProximo={() => setAbaSelecionada('teste')}
            />
          )}
        </TabsContent>

        <TabsContent value="teste" className="mt-6">
          {dadosAderencia && (
            <TesteChiQuadrado 
              dados={dadosAderencia}
              onExecutarTeste={executarTesteChiQuadrado}
              processando={processandoTeste}
            />
          )}
        </TabsContent>

        <TabsContent value="resultados" className="mt-6">
          {dadosAderencia && (
            <VisualizacaoResultados 
              dados={dadosAderencia}
              onGerarRelatorio={() => setAbaSelecionada('relatorio')}
            />
          )}
        </TabsContent>

        <TabsContent value="relatorio" className="mt-6">
          {dadosAderencia && (
            <RelatorioAderencia dados={dadosAderencia} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
