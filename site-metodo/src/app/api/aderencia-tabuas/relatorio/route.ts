import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'
// import { createCanvas } from 'canvas'
// import Chart from 'chart.js/auto'

// Schema para configuração do relatório
const RelatorioConfigSchema = z.object({
  importacaoId: z.string(),
  formato: z.enum(['JSON', 'PDF', 'EXCEL', 'TODOS']).default('JSON'),
  configuracao: z.object({
    // Configurações de intervalos de idade
    intervalosIdade: z.object({
      tipo: z.enum(['5_5', '10_10', '3_3', 'CUSTOMIZADO']).default('5_5'),
      intervaloCustomizado: z.number().optional(),
      idadeInicial: z.number().min(0).max(100).default(0),
      idadeFinal: z.number().min(0).max(120).default(100)
    }),
    
    // Configurações estatísticas
    estatisticas: z.object({
      nivelSignificancia: z.number().min(0.01).max(0.99).default(0.05),
      calcularQuiQuadrado: z.boolean().default(true),
      calcularResiduos: z.boolean().default(true),
      calcularZScore: z.boolean().default(true)
    }),
    
    // Configurações de visualização
    visualizacao: z.object({
      incluirGraficos: z.boolean().default(true),
      incluirTabelas: z.boolean().default(true),
      incluirEstatisticas: z.boolean().default(true),
      incluirDetalhesCalculos: z.boolean().default(true),
      formatoGraficos: z.enum(['PNG', 'SVG']).default('PNG'),
      resolucaoGraficos: z.number().default(300)
    }),
    
    // Configurações do relatório
    relatorio: z.object({
      titulo: z.string().default('Relatório de Aderência de Tábuas de Mortalidade'),
      autor: z.string().optional(),
      incluirResumoExecutivo: z.boolean().default(true),
      incluirMetodologia: z.boolean().default(true),
      incluirConclusoes: z.boolean().default(true),
      incluirAnexos: z.boolean().default(false)
    })
  })
})

interface DadosAnalise {
  massa: any[]
  obitos: any[]
  qxReferencia: any[]
  estatisticas: any
}

interface CalculoAderencia {
  intervalosIdade: Array<{
    idadeInicio: number
    idadeFim: number
    observados: number
    esperados: number
    residuo: number
    residuoPadronizado: number
    zScore: number
  }>
  quiQuadrado: {
    valor: number
    grausLiberdade: number
    pValor: number
    valorCritico: number
    significativo: boolean
  }
  estatisticasGerais: {
    totalObservados: number
    totalEsperados: number
    diferencaAbsoluta: number
    diferencaPercentual: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const config = RelatorioConfigSchema.parse(body)

    // Buscar dados da importação
    const importacao = await prisma.importacaoMortalidade.findUnique({
      where: { id: config.importacaoId },
      include: {
        massa: true,
        obitos: true,
        qxMortalidade: true
      }
    })

    if (!importacao) {
      return NextResponse.json(
        { error: 'Importação não encontrada' },
        { status: 404 }
      )
    }

    // Carregar dados para análise
    const dadosAnalise: DadosAnalise = {
      massa: importacao.massa || [],
      obitos: importacao.obitos || [],
      qxReferencia: importacao.qxMortalidade || [],
      estatisticas: importacao.logImportacao || {}
    }

    // Realizar cálculos de aderência
    const calculosAderencia = await calcularAderencia(dadosAnalise, config.configuracao)

    // Gerar visualizações se solicitado
    let graficos: string[] = []
    if (config.configuracao.visualizacao.incluirGraficos) {
      graficos = await gerarGraficos(calculosAderencia, config.configuracao.visualizacao)
    }

    // Preparar dados do relatório
    const dadosRelatorio = {
      metadados: {
        titulo: config.configuracao.relatorio.titulo,
        autor: config.configuracao.relatorio.autor,
        dataGeracao: new Date(),
        importacaoId: config.importacaoId,
        configuracao: config.configuracao
      },
      resumoExecutivo: config.configuracao.relatorio.incluirResumoExecutivo 
        ? gerarResumoExecutivo(calculosAderencia)
        : null,
      dadosOriginais: {
        totalParticipantes: dadosAnalise.massa.length,
        totalObitos: dadosAnalise.obitos.length,
        periodoAnalise: obterPeriodoAnalise(dadosAnalise.obitos),
        distribuicaoIdades: calcularDistribuicaoIdades(dadosAnalise.massa)
      },
      analiseAderencia: calculosAderencia,
      graficos: graficos,
      metodologia: config.configuracao.relatorio.incluirMetodologia 
        ? gerarSecaoMetodologia(config.configuracao)
        : null,
      conclusoes: config.configuracao.relatorio.incluirConclusoes 
        ? gerarConclusoes(calculosAderencia)
        : null
    }

    // Salvar relatório no banco
    const relatorioSalvo = await prisma.relatorioAderencia.create({
      data: {
        titulo: config.configuracao.relatorio.titulo,
        importacaoId: config.importacaoId,
        configuracaoRelatorio: config.configuracao,
        dadosRelatorio: dadosRelatorio,
        estatisticasCalculadas: calculosAderencia,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      }
    })

    // Gerar arquivos conforme formato solicitado
    const arquivosGerados: { [key: string]: string } = {}

    if (config.formato === 'JSON' || config.formato === 'TODOS') {
      const caminhoJSON = await salvarRelatorioJSON(dadosRelatorio, relatorioSalvo.id)
      arquivosGerados.json = caminhoJSON
    }

    if (config.formato === 'PDF' || config.formato === 'TODOS') {
      const caminhoPDF = await gerarRelatorioPDF(dadosRelatorio, relatorioSalvo.id)
      arquivosGerados.pdf = caminhoPDF
    }

    if (config.formato === 'EXCEL' || config.formato === 'TODOS') {
      const caminhoExcel = await gerarRelatorioExcel(dadosRelatorio, relatorioSalvo.id)
      arquivosGerados.excel = caminhoExcel
    }

    return NextResponse.json({
      success: true,
      relatorioId: relatorioSalvo.id,
      importacaoId: config.importacaoId,
      resumo: {
        analiseRealizada: true,
        aderenciaSignificativa: calculosAderencia.quiQuadrado.significativo,
        pValor: calculosAderencia.quiQuadrado.pValor,
        totalIntervalos: calculosAderencia.intervalosIdade.length,
        diferencaPercentual: calculosAderencia.estatisticasGerais.diferencaPercentual
      },
      arquivos: arquivosGerados,
      proximosPAsssos: [
        'Análise detalhada dos resíduos por intervalo',
        'Comparação com outras tábuas de referência',
        'Análise de sensibilidade dos parâmetros'
      ]
    })

  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Configuração de relatório inválida',
          detalhes: error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor ao gerar relatório',
        detalhes: (error as Error).message
      },
      { status: 500 }
    )
  }
}

async function calcularAderencia(dados: DadosAnalise, config: any): Promise<CalculoAderencia> {
  /**
   * Realiza os cálculos de aderência da tábua de mortalidade
   */
  
  // Determinar intervalos de idade
  const intervalos = determinarIntervalosIdade(config.intervalosIdade)
  
  // Calcular estatísticas por intervalo
  const intervalosCalculados = []
  let somaQuiQuadrado = 0
  
  for (const intervalo of intervalos) {
    const { idadeInicio, idadeFim } = intervalo
    
    // Contar óbitos observados no intervalo
    const obituosIntervalo = dados.obitos.filter(o => 
      o.idadeObito >= idadeInicio && o.idadeObito < idadeFim
    )
    const observados = obituosIntervalo.length
    
    // Calcular exposição (pessoas no intervalo)
    const exposicao = dados.massa.filter(p => 
      p.idade >= idadeInicio && p.idade < idadeFim
    ).length
    
    // Calcular óbitos esperados usando qx de referência
    const qxMedio = calcularQxMedioIntervalo(dados.qxReferencia, idadeInicio, idadeFim)
    const esperados = exposicao * qxMedio
    
    // Calcular estatísticas do intervalo
    const residuo = observados - esperados
    const residuoPadronizado = esperados > 0 ? residuo / Math.sqrt(esperados) : 0
    const zScore = esperados > 0 ? residuo / Math.sqrt(esperados * (1 - qxMedio)) : 0
    
    // Contribuição ao qui-quadrado
    if (esperados > 0) {
      somaQuiQuadrado += (residuo * residuo) / esperados
    }
    
    intervalosCalculados.push({
      idadeInicio,
      idadeFim,
      observados,
      esperados: Number(esperados.toFixed(4)),
      residuo: Number(residuo.toFixed(4)),
      residuoPadronizado: Number(residuoPadronizado.toFixed(4)),
      zScore: Number(zScore.toFixed(4)),
      exposicao,
      qxMedio: Number(qxMedio.toFixed(6))
    })
  }
  
  // Calcular estatísticas do teste qui-quadrado
  const grausLiberdade = intervalosCalculados.filter(i => i.esperados > 0).length - 1
  const pValor = calcularPValorQuiQuadrado(somaQuiQuadrado, grausLiberdade)
  const valorCritico = obterValorCriticoQuiQuadrado(grausLiberdade, config.estatisticas.nivelSignificancia)
  const significativo = somaQuiQuadrado > valorCritico
  
  // Calcular estatísticas gerais
  const totalObservados = intervalosCalculados.reduce((sum, i) => sum + i.observados, 0)
  const totalEsperados = intervalosCalculados.reduce((sum, i) => sum + i.esperados, 0)
  const diferencaAbsoluta = Math.abs(totalObservados - totalEsperados)
  const diferencaPercentual = totalEsperados > 0 ? (diferencaAbsoluta / totalEsperados) * 100 : 0
  
  return {
    intervalosIdade: intervalosCalculados,
    quiQuadrado: {
      valor: Number(somaQuiQuadrado.toFixed(4)),
      grausLiberdade,
      pValor: Number(pValor.toFixed(6)),
      valorCritico: Number(valorCritico.toFixed(4)),
      significativo
    },
    estatisticasGerais: {
      totalObservados,
      totalEsperados: Number(totalEsperados.toFixed(2)),
      diferencaAbsoluta: Number(diferencaAbsoluta.toFixed(2)),
      diferencaPercentual: Number(diferencaPercentual.toFixed(2))
    }
  }
}

function determinarIntervalosIdade(config: any): Array<{idadeInicio: number, idadeFim: number}> {
  /**
   * Determina os intervalos de idade baseado na configuração
   */
  const intervalos = []
  let intervalo: number
  
  switch (config.tipo) {
    case '5_5':
      intervalo = 5
      break
    case '10_10':
      intervalo = 10
      break
    case '3_3':
      intervalo = 3
      break
    case 'CUSTOMIZADO':
      intervalo = config.intervaloCustomizado || 5
      break
    default:
      intervalo = 5
  }
  
  for (let idade = config.idadeInicial; idade < config.idadeFinal; idade += intervalo) {
    intervalos.push({
      idadeInicio: idade,
      idadeFim: Math.min(idade + intervalo, config.idadeFinal)
    })
  }
  
  return intervalos
}

function calcularQxMedioIntervalo(qxReferencia: any[], idadeInicio: number, idadeFim: number): number {
  /**
   * Calcula qx médio para um intervalo de idades
   */
  const qxIntervalo = qxReferencia.filter(q => 
    q.idade >= idadeInicio && q.idade < idadeFim
  )
  
  if (qxIntervalo.length === 0) return 0
  
  // Média ponderada ou simples dos qx no intervalo
  const somaQx = qxIntervalo.reduce((sum, q) => 
    sum + (q.qxGeral || q.qxMasculino || q.qxFeminino || 0), 0
  )
  
  return somaQx / qxIntervalo.length
}

function calcularPValorQuiQuadrado(quiQuadrado: number, grausLiberdade: number): number {
  /**
   * Calcula p-valor aproximado para o teste qui-quadrado
   * Implementação simplificada - em produção usar biblioteca estatística
   */
  // Implementação aproximada usando distribuição qui-quadrado
  // Para implementação completa, usar biblioteca como jStat
  
  if (grausLiberdade <= 0) return 1
  if (quiQuadrado <= 0) return 1
  
  // Aproximação simples - em produção usar método mais preciso
  const limite = grausLiberdade + 2 * Math.sqrt(2 * grausLiberdade)
  return quiQuadrado > limite ? 0.01 : 0.5
}

function obterValorCriticoQuiQuadrado(grausLiberdade: number, nivelSignificancia: number): number {
  /**
   * Obtém valor crítico da distribuição qui-quadrado
   * Tabela simplificada - em produção usar biblioteca estatística
   */
  const tabela: { [key: number]: { [key: number]: number } } = {
    1: { 0.05: 3.841, 0.01: 6.635 },
    2: { 0.05: 5.991, 0.01: 9.210 },
    3: { 0.05: 7.815, 0.01: 11.345 },
    4: { 0.05: 9.488, 0.01: 13.277 },
    5: { 0.05: 11.070, 0.01: 15.086 },
    10: { 0.05: 18.307, 0.01: 23.209 },
    15: { 0.05: 24.996, 0.01: 30.578 },
    20: { 0.05: 31.410, 0.01: 37.566 }
  }
  
  const nivelChave = nivelSignificancia <= 0.01 ? 0.01 : 0.05
  
  if (tabela[grausLiberdade]) {
    return tabela[grausLiberdade][nivelChave]
  }
  
  // Aproximação para graus de liberdade não tabelados
  return grausLiberdade + 2 * Math.sqrt(2 * grausLiberdade)
}

async function gerarGraficos(calculosAderencia: CalculoAderencia, _configViz: any): Promise<string[]> {
  /**
   * Gera gráficos da análise de aderência
   */
  const graficos: string[] = []
  
  try {
    // Criar diretório para gráficos
    const dirGraficos = join(process.cwd(), 'uploads', 'mortalidade', 'graficos')
    await mkdir(dirGraficos, { recursive: true })
    
    // Gráfico 1: Observados vs Esperados por intervalo
    const grafico1 = await gerarGraficoObservadosEsperados(calculosAderencia, dirGraficos)
    graficos.push(grafico1)
    
    // Gráfico 2: Resíduos padronizados
    const grafico2 = await gerarGraficoResiduos(calculosAderencia, dirGraficos)
    graficos.push(grafico2)
    
    // Gráfico 3: Distribuição qui-quadrado
    const grafico3 = await gerarGraficoQuiQuadrado(calculosAderencia, dirGraficos)
    graficos.push(grafico3)
    
  } catch (error) {
    console.error('Erro ao gerar gráficos:', error)
  }
  
  return graficos
}

async function gerarGraficoObservadosEsperados(calculos: CalculoAderencia, dirBase: string): Promise<string> {
  // Implementação simplificada do gráfico
  // Em produção, usar Chart.js ou biblioteca similar
  const caminhoArquivo = join(dirBase, `observados_esperados_${Date.now()}.json`)
  
  const dadosGrafico = {
    tipo: 'observados_esperados',
    dados: calculos.intervalosIdade.map(i => ({
      intervalo: `${i.idadeInicio}-${i.idadeFim}`,
      observados: i.observados,
      esperados: i.esperados
    })),
    configuracao: {
      titulo: 'Óbitos Observados vs Esperados por Intervalo de Idade',
      eixoX: 'Intervalo de Idade',
      eixoY: 'Número de Óbitos'
    }
  }
  
  await writeFile(caminhoArquivo, JSON.stringify(dadosGrafico, null, 2))
  return caminhoArquivo
}

async function gerarGraficoResiduos(calculos: CalculoAderencia, dirBase: string): Promise<string> {
  const caminhoArquivo = join(dirBase, `residuos_${Date.now()}.json`)
  
  const dadosGrafico = {
    tipo: 'residuos_padronizados',
    dados: calculos.intervalosIdade.map(i => ({
      intervalo: `${i.idadeInicio}-${i.idadeFim}`,
      residuoPadronizado: i.residuoPadronizado,
      zScore: i.zScore
    })),
    configuracao: {
      titulo: 'Resíduos Padronizados por Intervalo de Idade',
      eixoX: 'Intervalo de Idade',
      eixoY: 'Resíduo Padronizado',
      linhasReferencia: [-2, 0, 2]
    }
  }
  
  await writeFile(caminhoArquivo, JSON.stringify(dadosGrafico, null, 2))
  return caminhoArquivo
}

async function gerarGraficoQuiQuadrado(calculos: CalculoAderencia, dirBase: string): Promise<string> {
  const caminhoArquivo = join(dirBase, `qui_quadrado_${Date.now()}.json`)
  
  const dadosGrafico = {
    tipo: 'qui_quadrado',
    dados: {
      valorCalculado: calculos.quiQuadrado.valor,
      valorCritico: calculos.quiQuadrado.valorCritico,
      grausLiberdade: calculos.quiQuadrado.grausLiberdade,
      pValor: calculos.quiQuadrado.pValor,
      significativo: calculos.quiQuadrado.significativo
    },
    configuracao: {
      titulo: 'Teste de Aderência Qui-Quadrado',
      descricao: 'Distribuição qui-quadrado com valores calculado e crítico'
    }
  }
  
  await writeFile(caminhoArquivo, JSON.stringify(dadosGrafico, null, 2))
  return caminhoArquivo
}

function gerarResumoExecutivo(calculos: CalculoAderencia): any {
  /**
   * Gera resumo executivo da análise
   */
  return {
    conclusaoPrincipal: calculos.quiQuadrado.significativo 
      ? 'A análise indica diferença SIGNIFICATIVA entre os óbitos observados e esperados'
      : 'A análise indica boa ADERÊNCIA entre os óbitos observados e esperados',
    
    estatisticasChave: {
      pValor: calculos.quiQuadrado.pValor,
      interpretacao: calculos.quiQuadrado.pValor < 0.05 
        ? 'Rejeitamos a hipótese de aderência (p < 0.05)'
        : 'Não rejeitamos a hipótese de aderência (p ≥ 0.05)',
      diferencaPercentual: calculos.estatisticasGerais.diferencaPercentual,
      avaliacaoDiferenca: calculos.estatisticasGerais.diferencaPercentual < 5 
        ? 'Diferença pequena (< 5%)'
        : calculos.estatisticasGerais.diferencaPercentual < 10 
        ? 'Diferença moderada (5-10%)'
        : 'Diferença significativa (> 10%)'
    },
    
    recomendacoes: gerarRecomendacoes(calculos),
    
    proximosPassos: [
      'Analisar resíduos por intervalo de idade',
      'Verificar adequação da tábua de referência',
      'Considerar ajustes nos dados ou metodologia'
    ]
  }
}

function gerarRecomendacoes(calculos: CalculoAderencia): string[] {
  const recomendacoes = []
  
  if (calculos.quiQuadrado.significativo) {
    recomendacoes.push('Investigar causas da não aderência')
    recomendacoes.push('Considerar segmentação por sexo ou outras variáveis')
    recomendacoes.push('Avaliar adequação da tábua de referência')
  } else {
    recomendacoes.push('Tábua apresenta boa aderência aos dados observados')
    recomendacoes.push('Pode ser utilizada para projeções atuariais')
  }
  
  // Analisar resíduos extremos
  const residuosExtremos = calculos.intervalosIdade.filter(i => Math.abs(i.zScore) > 2)
  if (residuosExtremos.length > 0) {
    recomendacoes.push(`Investigar ${residuosExtremos.length} intervalos com resíduos extremos`)
  }
  
  return recomendacoes
}

function gerarSecaoMetodologia(config: any): any {
  /**
   * Gera seção de metodologia do relatório
   */
  return {
    testeUtilizado: 'Teste Qui-Quadrado de Aderência',
    hipoteses: {
      h0: 'Os óbitos observados seguem a distribuição da tábua de referência',
      h1: 'Os óbitos observados NÃO seguem a distribuição da tábua de referência'
    },
    parametros: {
      nivelSignificancia: config.estatisticas.nivelSignificancia,
      intervalosIdade: config.intervalosIdade,
      metodoAgrupamento: `Intervalos de ${config.intervalosIdade.tipo.replace('_', ' em ')}`
    },
    formula: 'χ² = Σ [(Observado - Esperado)² / Esperado]',
    interpretacao: 'Se χ² > valor crítico, rejeitamos H0 (não há aderência)'
  }
}

function gerarConclusoes(calculos: CalculoAderencia): any {
  /**
   * Gera seção de conclusões
   */
  return {
    resultado: calculos.quiQuadrado.significativo ? 'NÃO ADERÊNCIA' : 'ADERÊNCIA',
    fundamentacao: [
      `Valor qui-quadrado calculado: ${calculos.quiQuadrado.valor}`,
      `Valor crítico: ${calculos.quiQuadrado.valorCritico}`,
      `P-valor: ${calculos.quiQuadrado.pValor}`,
      `Diferença percentual total: ${calculos.estatisticasGerais.diferencaPercentual}%`
    ],
    implicacoesPraticas: calculos.quiQuadrado.significativo 
      ? [
          'A tábua de referência pode não ser adequada para esta população',
          'Considerar ajustes ou buscar tábua mais apropriada',
          'Investigar fatores específicos da população analisada'
        ]
      : [
          'A tábua de referência é adequada para esta população',
          'Pode ser utilizada com confiança em projeções atuariais',
          'Monitorar periodicamente para verificar manutenção da aderência'
        ]
  }
}

function obterPeriodoAnalise(obitos: any[]): any {
  if (obitos.length === 0) return null
  
  const datas = obitos.map(o => new Date(o.dataObito)).sort()
  return {
    inicio: datas[0].toISOString().split('T')[0],
    fim: datas[datas.length - 1].toISOString().split('T')[0],
    totalDias: Math.ceil((datas[datas.length - 1].getTime() - datas[0].getTime()) / (1000 * 60 * 60 * 24))
  }
}

function calcularDistribuicaoIdades(massa: any[]): any {
  const distribuicao: { [key: string]: number } = {}
  
  massa.forEach(p => {
    const faixa = Math.floor(p.idade / 10) * 10
    const chave = `${faixa}-${faixa + 9}`
    distribuicao[chave] = (distribuicao[chave] || 0) + 1
  })
  
  return distribuicao
}

async function salvarRelatorioJSON(dadosRelatorio: any, relatorioId: string): Promise<string> {
  const dirRelatorios = join(process.cwd(), 'uploads', 'mortalidade', 'relatorios')
  await mkdir(dirRelatorios, { recursive: true })
  
  const caminhoArquivo = join(dirRelatorios, `relatorio_${relatorioId}.json`)
  await writeFile(caminhoArquivo, JSON.stringify(dadosRelatorio, null, 2))
  
  return caminhoArquivo
}

async function gerarRelatorioPDF(dadosRelatorio: any, relatorioId: string): Promise<string> {
  const dirRelatorios = join(process.cwd(), 'uploads', 'mortalidade', 'relatorios')
  await mkdir(dirRelatorios, { recursive: true })
  
  const caminhoArquivo = join(dirRelatorios, `relatorio_${relatorioId}.pdf`)
  
  // Criar documento PDF
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const fs = await import('fs')
  const stream = fs.createWriteStream(caminhoArquivo)
  doc.pipe(stream)
  
  // Cabeçalho
  doc.fontSize(20).text(dadosRelatorio.metadados.titulo, { align: 'center' })
  doc.moveDown()
  
  if (dadosRelatorio.metadados.autor) {
    doc.fontSize(12).text(`Autor: ${dadosRelatorio.metadados.autor}`)
  }
  doc.text(`Data de Geração: ${new Date(dadosRelatorio.metadados.dataGeracao).toLocaleDateString('pt-BR')}`)
  doc.moveDown()
  
  // Resumo Executivo
  if (dadosRelatorio.resumoExecutivo) {
    doc.fontSize(16).text('Resumo Executivo', { underline: true })
    doc.fontSize(12).text(dadosRelatorio.resumoExecutivo.conclusaoPrincipal)
    doc.moveDown()
    
    doc.text(`P-valor: ${dadosRelatorio.resumoExecutivo.estatisticasChave.pValor}`)
    doc.text(`Interpretação: ${dadosRelatorio.resumoExecutivo.estatisticasChave.interpretacao}`)
    doc.text(`Diferença Percentual: ${dadosRelatorio.resumoExecutivo.estatisticasChave.diferencaPercentual}%`)
    doc.moveDown()
  }
  
  // Dados da Análise
  doc.fontSize(16).text('Resultados da Análise de Aderência', { underline: true })
  const analise = dadosRelatorio.analiseAderencia
  
  doc.fontSize(12).text(`Teste Qui-Quadrado: ${analise.quiQuadrado.valor}`)
  doc.text(`Graus de Liberdade: ${analise.quiQuadrado.grausLiberdade}`)
  doc.text(`P-valor: ${analise.quiQuadrado.pValor}`)
  doc.text(`Valor Crítico: ${analise.quiQuadrado.valorCritico}`)
  doc.text(`Significativo: ${analise.quiQuadrado.significativo ? 'SIM' : 'NÃO'}`)
  doc.moveDown()
  
  // Estatísticas Gerais
  doc.text(`Total Observados: ${analise.estatisticasGerais.totalObservados}`)
  doc.text(`Total Esperados: ${analise.estatisticasGerais.totalEsperados}`)
  doc.text(`Diferença Percentual: ${analise.estatisticasGerais.diferencaPercentual}%`)
  doc.moveDown()
  
  // Tabela de Intervalos (simplificada)
  doc.fontSize(14).text('Detalhamento por Intervalo de Idade', { underline: true })
  doc.fontSize(10)
  
  analise.intervalosIdade.forEach((intervalo: any) => {
    doc.text(`${intervalo.idadeInicio}-${intervalo.idadeFim}: Obs=${intervalo.observados}, Esp=${intervalo.esperados}, Res=${intervalo.residuoPadronizado}`)
  })
  
  // Finalizar documento
  doc.end()
  
  return new Promise<string>((resolve) => {
    stream.on('finish', () => resolve(caminhoArquivo))
  })
}

async function gerarRelatorioExcel(dadosRelatorio: any, relatorioId: string): Promise<string> {
  const dirRelatorios = join(process.cwd(), 'uploads', 'mortalidade', 'relatorios')
  await mkdir(dirRelatorios, { recursive: true })
  
  const caminhoArquivo = join(dirRelatorios, `relatorio_${relatorioId}.xlsx`)
  
  // Criar workbook com ExcelJS
  const workbook = new ExcelJS.Workbook()
  
  // Aba 1: Resumo
  const wsResumo = workbook.addWorksheet('Resumo')
  const dadosResumo = [
    ['RELATÓRIO DE ADERÊNCIA DE TÁBUAS DE MORTALIDADE'],
    [''],
    ['Data de Geração', new Date(dadosRelatorio.metadados.dataGeracao).toLocaleDateString('pt-BR')],
    ['Importação ID', dadosRelatorio.metadados.importacaoId],
    [''],
    ['RESULTADOS PRINCIPAIS'],
    ['Qui-Quadrado', dadosRelatorio.analiseAderencia.quiQuadrado.valor],
    ['P-valor', dadosRelatorio.analiseAderencia.quiQuadrado.pValor],
    ['Significativo', dadosRelatorio.analiseAderencia.quiQuadrado.significativo ? 'SIM' : 'NÃO'],
    ['Diferença %', dadosRelatorio.analiseAderencia.estatisticasGerais.diferencaPercentual]
  ]
  
  // Adicionar dados ao worksheet
  dadosResumo.forEach((row, _index) => {
    wsResumo.addRow(row)
  })
  
  // Aba 2: Detalhamento por Intervalo
  const wsIntervalos = workbook.addWorksheet('Intervalos')
  const cabecalhos = ['Idade Início', 'Idade Fim', 'Observados', 'Esperados', 'Resíduo', 'Resíduo Padrão', 'Z-Score']
  wsIntervalos.addRow(cabecalhos)
  
  dadosRelatorio.analiseAderencia.intervalosIdade.forEach((intervalo: any) => {
    wsIntervalos.addRow([
      intervalo.idadeInicio,
      intervalo.idadeFim,
      intervalo.observados,
      intervalo.esperados,
      intervalo.residuo,
      intervalo.residuoPadronizado,
      intervalo.zScore
    ])
  })
  
  // Aba 3: Dados Originais
  if (dadosRelatorio.dadosOriginais) {
    const wsDados = workbook.addWorksheet('Dados Originais')
    const dadosOriginais = [
      ['DADOS ORIGINAIS'],
      [''],
      ['Total Participantes', dadosRelatorio.dadosOriginais.totalParticipantes],
      ['Total Óbitos', dadosRelatorio.dadosOriginais.totalObitos],
      [''],
      ['DISTRIBUIÇÃO POR IDADE']
    ]
    
    dadosOriginais.forEach((row) => {
      wsDados.addRow(row)
    })
    
    Object.entries(dadosRelatorio.dadosOriginais.distribuicaoIdades || {}).forEach(([faixa, count]) => {
      wsDados.addRow([faixa, count as number])
    })
  }
  
  // Salvar arquivo com ExcelJS
  await workbook.xlsx.writeFile(caminhoArquivo)
  
  return caminhoArquivo
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/aderencia-tabuas/relatorio',
    descricao: 'Endpoint para gerar relatórios completos de aderência com exports PDF/Excel',
    metodo: 'POST',
    funcionalidades: [
      'Cálculos de aderência qui-quadrado',
      'Configuração de intervalos de idade (5-5, 10-10, 3-3, customizado)',
      'Análise estatística completa com resíduos e z-scores',
      'Geração de gráficos automática',
      'Export para PDF, Excel e JSON',
      'Resumo executivo e conclusões automáticas'
    ],
    exemplo_configuracao: {
      importacaoId: 'uuid-da-importacao',
      formato: 'TODOS',
      configuracao: {
        intervalosIdade: {
          tipo: '5_5',
          idadeInicial: 20,
          idadeFinal: 80
        },
        estatisticas: {
          nivelSignificancia: 0.05,
          calcularQuiQuadrado: true,
          calcularResiduos: true
        },
        visualizacao: {
          incluirGraficos: true,
          incluirTabelas: true
        },
        relatorio: {
          titulo: 'Análise de Aderência - Plano XYZ',
          incluirResumoExecutivo: true,
          incluirConclusoes: true
        }
      }
    }
  })
}
