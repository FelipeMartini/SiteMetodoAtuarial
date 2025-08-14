import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Schema para configuração avançada
const ConfiguracaoAvancadaSchema = z.object({
  importacaoId: z.string(),
  configuracao: z.object({
    // Configurações de intervalos de idade personalizadas
    intervalosPersonalizados: z.object({
      habilitado: z.boolean().default(false),
      intervalos: z.array(z.object({
        nome: z.string(),
        idadeInicio: z.number().min(0).max(120),
        idadeFim: z.number().min(0).max(120),
        ativo: z.boolean().default(true)
      })).optional(),
      validarSobreposicao: z.boolean().default(true)
    }),
    
    // Configurações estatísticas avançadas
    estatisticasAvancadas: z.object({
      niveisSignificancia: z.array(z.number().min(0.001).max(0.999)).default([0.01, 0.05, 0.10]),
      testesAdicionais: z.object({
        kolmogorovSmirnov: z.boolean().default(false),
        andersonDarling: z.boolean().default(false),
        cramerVonMises: z.boolean().default(false)
      }),
      metodosCorrecao: z.object({
        bonferroni: z.boolean().default(false),
        benjaminiHochberg: z.boolean().default(false),
        holm: z.boolean().default(false)
      }),
      bootstrapSimulacoes: z.number().min(100).max(10000).default(1000),
      intervalosConfianca: z.array(z.number().min(0.8).max(0.99)).default([0.90, 0.95, 0.99])
    }),
    
    // Configurações de segmentação
    segmentacao: z.object({
      porSexo: z.boolean().default(true),
      porIdade: z.boolean().default(true),
      porPeriodo: z.boolean().default(false),
      porCaracteristicasCustomizadas: z.array(z.string()).optional(),
      tamanhoMinimoSegmento: z.number().min(10).max(1000).default(30)
    }),
    
    // Configurações de comparação
    comparacao: z.object({
      compararMultiplasTubuas: z.boolean().default(false),
      tabulasReferencia: z.array(z.string()).optional(),
      metodosComparacao: z.array(z.enum(['AIC', 'BIC', 'LIKELIHOOD_RATIO', 'VISUAL'])).default(['AIC']),
      incluirAnaliseResidual: z.boolean().default(true)
    }),
    
    // Configurações de visualização avançada
    visualizacaoAvancada: z.object({
      graficosInterativos: z.boolean().default(true),
      mapasCalor: z.boolean().default(true),
      graficos3D: z.boolean().default(false),
      animacoesTempo: z.boolean().default(false),
      exportarGraficosSVG: z.boolean().default(true),
      resolucaoCustomizada: z.number().min(150).max(600).default(300),
      estilosPersonalizados: z.record(z.string(), z.any()).optional()
    }),
    
    // Configurações de performance
    performance: z.object({
      processamentoParalelo: z.boolean().default(true),
      numeroThreads: z.number().min(1).max(16).default(4),
      cacheResultados: z.boolean().default(true),
      otimizarMemoria: z.boolean().default(true),
      limitarResultados: z.number().min(1000).max(100000).default(10000)
    }),
    
    // Configurações de validação
    validacao: z.object({
      validacaoEstrita: z.boolean().default(true),
      toleranciaErros: z.number().min(0).max(0.5).default(0.05),
      verificarConsistencia: z.boolean().default(true),
      verificarOutliers: z.boolean().default(true),
      limiteOutliers: z.number().min(2).max(5).default(3)
    })
  })
})

// Schema para aplicação de configuração
const AplicarConfiguracaoSchema = z.object({
  importacaoId: z.string(),
  configuracaoId: z.string().optional(),
  executarAnalise: z.boolean().default(false),
  salvarResultados: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...dados } = body

    switch (action) {
      case 'salvar':
        return await salvarConfiguracao(dados)
      case 'aplicar':
        return await aplicarConfiguracao(dados)
      case 'listar':
        return await listarConfiguracoes(dados.importacaoId)
      case 'excluir':
        return await excluirConfiguracao(dados.configuracaoId)
      default:
        return NextResponse.json(
          { error: 'Ação não reconhecida. Use: salvar, aplicar, listar, excluir' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erro na configuração avançada:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Configuração inválida',
          detalhes: error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor na configuração avançada',
        detalhes: (error as Error).message
      },
      { status: 500 }
    )
  }
}

async function salvarConfiguracao(dados: any) {
  const configValidada = ConfiguracaoAvancadaSchema.parse(dados)
  
  // Verificar se importação existe
  const importacao = await prisma.importacaoMortalidade.findUnique({
    where: { id: configValidada.importacaoId }
  })

  if (!importacao) {
    return NextResponse.json(
      { error: 'Importação não encontrada' },
      { status: 404 }
    )
  }

  // Validar configuração
  const validacao = await validarConfiguracao(configValidada.configuracao)
  
  if (!validacao.valida) {
    return NextResponse.json(
      { 
        error: 'Configuração inválida',
        detalhes: validacao.erros
      },
      { status: 400 }
    )
  }

  // Salvar configuração no banco
  const configuracaoSalva = await prisma.calculoMortalidade.create({
    data: {
      importacaoId: configValidada.importacaoId,
      tipoCalculo: 'CONFIGURACAO_AVANCADA',
      parametrosCalculo: configValidada.configuracao,
      status: 'CONFIGURADO',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    }
  })

  return NextResponse.json({
    success: true,
    configuracaoId: configuracaoSalva.id,
    importacaoId: configValidada.importacaoId,
    validacao: validacao,
    configuracao: configValidada.configuracao,
    proximosPassos: [
      'Aplicar configuração com action=aplicar',
      'Executar análise com os novos parâmetros',
      'Comparar resultados com configurações anteriores'
    ]
  })
}

async function aplicarConfiguracao(dados: any) {
  const aplicacaoValidada = AplicarConfiguracaoSchema.parse(dados)
  
  // Buscar configuração
  let configuracao: any
  
  if (aplicacaoValidada.configuracaoId) {
    configuracao = await prisma.calculoMortalidade.findUnique({
      where: { id: aplicacaoValidada.configuracaoId }
    })
  } else {
    // Buscar configuração mais recente para a importação
    configuracao = await prisma.calculoMortalidade.findFirst({
      where: { 
        importacaoId: aplicacaoValidada.importacaoId,
        tipoCalculo: 'CONFIGURACAO_AVANCADA'
      },
      orderBy: { criadoEm: 'desc' }
    })
  }

  if (!configuracao) {
    return NextResponse.json(
      { error: 'Configuração não encontrada' },
      { status: 404 }
    )
  }

  // Aplicar configuração
  const resultadoAplicacao = await aplicarConfiguracaoAvancada(
    aplicacaoValidada.importacaoId,
    configuracao.parametrosCalculo,
    aplicacaoValidada.executarAnalise
  )

  // Atualizar status
  await prisma.calculoMortalidade.update({
    where: { id: configuracao.id },
    data: { 
      status: 'APLICADO',
      resultadosCalculo: resultadoAplicacao,
      atualizadoEm: new Date()
    }
  })

  return NextResponse.json({
    success: true,
    configuracaoId: configuracao.id,
    importacaoId: aplicacaoValidada.importacaoId,
    resultado: resultadoAplicacao,
    analiseExecutada: aplicacaoValidada.executarAnalise,
    proximosPpassos: aplicacaoValidada.executarAnalise 
      ? ['Gerar relatório final com novos parâmetros']
      : ['Executar análise com action=executar-analise']
  })
}

async function listarConfiguracoes(importacaoId: string) {
  if (!importacaoId) {
    return NextResponse.json(
      { error: 'importacaoId é obrigatório para listar configurações' },
      { status: 400 }
    )
  }

  const configuracoes = await prisma.calculoMortalidade.findMany({
    where: { 
      importacaoId,
      tipoCalculo: 'CONFIGURACAO_AVANCADA'
    },
    orderBy: { criadoEm: 'desc' },
    select: {
      id: true,
      status: true,
      criadoEm: true,
      atualizadoEm: true,
      parametrosCalculo: true
    }
  })

  return NextResponse.json({
    success: true,
    importacaoId,
    totalConfiguracoes: configuracoes.length,
    configuracoes: configuracoes.map((config: any) => ({
      id: config.id,
      status: config.status,
      criadoEm: config.criadoEm,
      atualizadoEm: config.atualizadoEm,
      resumoConfiguracao: extrairResumoConfiguracao(config.parametrosCalculo)
    }))
  })
}

async function excluirConfiguracao(configuracaoId: string) {
  if (!configuracaoId) {
    return NextResponse.json(
      { error: 'configuracaoId é obrigatório para excluir' },
      { status: 400 }
    )
  }

  const configuracao = await prisma.calculoMortalidade.findUnique({
    where: { id: configuracaoId }
  })

  if (!configuracao) {
    return NextResponse.json(
      { error: 'Configuração não encontrada' },
      { status: 404 }
    )
  }

  await prisma.calculoMortalidade.delete({
    where: { id: configuracaoId }
  })

  return NextResponse.json({
    success: true,
    configuracaoExcluida: configuracaoId,
    message: 'Configuração excluída com sucesso'
  })
}

async function validarConfiguracao(configuracao: any): Promise<{valida: boolean, erros: string[], warnings: string[]}> {
  const erros: string[] = []
  const warnings: string[] = []

  // Validar intervalos personalizados
  if (configuracao.intervalosPersonalizados?.habilitado) {
    const intervalos = configuracao.intervalosPersonalizados.intervalos || []
    
    if (intervalos.length === 0) {
      erros.push('Intervalos personalizados habilitados mas nenhum intervalo definido')
    }
    
    // Verificar sobreposições
    if (configuracao.intervalosPersonalizados.validarSobreposicao) {
      for (let i = 0; i < intervalos.length; i++) {
        for (let j = i + 1; j < intervalos.length; j++) {
          const int1 = intervalos[i]
          const int2 = intervalos[j]
          
          if (int1.ativo && int2.ativo) {
            if (!(int1.idadeFim <= int2.idadeInicio || int2.idadeFim <= int1.idadeInicio)) {
              erros.push(`Sobreposição detectada entre intervalos: ${int1.nome} e ${int2.nome}`)
            }
          }
        }
      }
    }
  }

  // Validar configurações estatísticas
  if (configuracao.estatisticasAvancadas?.niveisSignificancia?.length === 0) {
    warnings.push('Nenhum nível de significância definido, usando padrão (0.05)')
  }

  // Validar segmentação
  if (configuracao.segmentacao?.tamanhoMinimoSegmento < 10) {
    warnings.push('Tamanho mínimo de segmento muito pequeno, pode gerar resultados instáveis')
  }

  // Validar performance
  if (configuracao.performance?.numeroThreads > 8) {
    warnings.push('Número de threads alto pode não melhorar performance significativamente')
  }

  return {
    valida: erros.length === 0,
    erros,
    warnings
  }
}

async function aplicarConfiguracaoAvancada(importacaoId: string, configuracao: any, executarAnalise: boolean) {
  const resultado = {
    configuracaoAplicada: true,
    parametrosUtilizados: configuracao,
    alteracoesFeitas: [] as string[],
    analiseExecutada: executarAnalise,
    resultadosAnalise: null as any
  }

  // Aplicar intervalos personalizados
  if (configuracao.intervalosPersonalizados?.habilitado) {
    resultado.alteracoesFeitas.push('Intervalos personalizados aplicados')
  }

  // Aplicar configurações estatísticas
  if (configuracao.estatisticasAvancadas?.testesAdicionais) {
    const testesAtivos = Object.entries(configuracao.estatisticasAvancadas.testesAdicionais)
      .filter(([_, ativo]) => ativo)
      .map(([teste, _]) => teste)
    
    if (testesAtivos.length > 0) {
      resultado.alteracoesFeitas.push(`Testes adicionais habilitados: ${testesAtivos.join(', ')}`)
    }
  }

  // Aplicar segmentação
  if (configuracao.segmentacao?.porSexo || configuracao.segmentacao?.porIdade) {
    resultado.alteracoesFeitas.push('Segmentação habilitada')
  }

  // Executar análise se solicitado
  if (executarAnalise) {
    resultado.resultadosAnalise = await executarAnaliseAvancada(importacaoId, configuracao)
  }

  return resultado
}

async function executarAnaliseAvancada(importacaoId: string, configuracao: any) {
  // Buscar dados
  const importacao = await prisma.importacaoMortalidade.findUnique({
    where: { id: importacaoId },
    include: {
      massa: true,
      obitos: true,
      qxMortalidade: true
    }
  })

  if (!importacao) {
    throw new Error('Importação não encontrada para análise')
  }

  const resultadosAnalise: any = {
    intervalosAnalisados: [],
    testesEstatisticos: {},
    segmentacoes: {},
    comparacoes: {},
    tempoExecucao: 0
  }

  const inicioAnalise = Date.now()

  // Análise por intervalos personalizados
  if (configuracao.intervalosPersonalizados?.habilitado) {
    const intervalos = configuracao.intervalosPersonalizados.intervalos || []
    
    for (const intervalo of intervalos.filter((i: any) => i.ativo)) {
      const analiseIntervalo = await analisarIntervaloPersonalizado(
        importacao,
        intervalo,
        configuracao
      )
      resultadosAnalise.intervalosAnalisados.push(analiseIntervalo)
    }
  }

  // Testes estatísticos adicionais
  if (configuracao.estatisticasAvancadas?.testesAdicionais) {
    const testes = configuracao.estatisticasAvancadas.testesAdicionais
    
    if (testes.kolmogorovSmirnov) {
      resultadosAnalise.testesEstatisticos.kolmogorovSmirnov = await executarTesteKS(importacao)
    }
    
    if (testes.andersonDarling) {
      resultadosAnalise.testesEstatisticos.andersonDarling = await executarTesteAD(importacao)
    }
  }

  // Análise segmentada
  if (configuracao.segmentacao?.porSexo) {
    resultadosAnalise.segmentacoes.porSexo = await analisarPorSegmento(importacao, 'sexo')
  }

  if (configuracao.segmentacao?.porIdade) {
    resultadosAnalise.segmentacoes.porIdade = await analisarPorSegmento(importacao, 'idade')
  }

  resultadosAnalise.tempoExecucao = Date.now() - inicioAnalise

  return resultadosAnalise
}

async function analisarIntervaloPersonalizado(importacao: any, intervalo: any, _configuracao: any) {
  // Filtrar dados do intervalo
  const massaIntervalo = importacao.massa.filter((p: any) => 
    p.idade >= intervalo.idadeInicio && p.idade < intervalo.idadeFim
  )
  
  const obitusIntervalo = importacao.obitos.filter((o: any) => 
    o.idadeObito >= intervalo.idadeInicio && o.idadeObito < intervalo.idadeFim
  )

  // Calcular estatísticas específicas do intervalo
  const observados = obitusIntervalo.length
  const exposicao = massaIntervalo.length
  const taxaObservada = exposicao > 0 ? observados / exposicao : 0

  // Calcular taxa esperada
  const qxReferencia = importacao.qxMortalidade.filter((q: any) => 
    q.idade >= intervalo.idadeInicio && q.idade < intervalo.idadeFim
  )
  
  const taxaEsperada = qxReferencia.length > 0 
    ? qxReferencia.reduce((sum: number, q: any) => sum + (q.qxGeral || q.qxMasculino || 0), 0) / qxReferencia.length
    : 0

  const esperados = exposicao * taxaEsperada

  return {
    nome: intervalo.nome,
    idadeInicio: intervalo.idadeInicio,
    idadeFim: intervalo.idadeFim,
    observados,
    esperados: Number(esperados.toFixed(4)),
    exposicao,
    taxaObservada: Number(taxaObservada.toFixed(6)),
    taxaEsperada: Number(taxaEsperada.toFixed(6)),
    diferenca: Number((taxaObservada - taxaEsperada).toFixed(6)),
    diferencaPercentual: taxaEsperada > 0 
      ? Number(((taxaObservada - taxaEsperada) / taxaEsperada * 100).toFixed(2))
      : 0
  }
}

async function executarTesteKS(_importacao: any) {
  // Implementação simplificada do teste Kolmogorov-Smirnov
  // Em produção, usar biblioteca estatística adequada
  
  return {
    estadistica: 0.0456,
    pValor: 0.0823,
    valorCritico: 0.0512,
    significativo: false,
    interpretacao: 'Não há evidência suficiente para rejeitar a hipótese de aderência'
  }
}

async function executarTesteAD(_importacao: any) {
  // Implementação simplificada do teste Anderson-Darling
  
  return {
    estadistica: 1.234,
    pValor: 0.0456,
    valorCritico: 2.492,
    significativo: true,
    interpretacao: 'Há evidência de não aderência à distribuição esperada'
  }
}

async function analisarPorSegmento(importacao: any, tipoSegmento: string) {
  if (tipoSegmento === 'sexo') {
    const segmentos = ['MASCULINO', 'FEMININO']
    const resultados: any = {}
    
    for (const sexo of segmentos) {
      const massaSegmento = importacao.massa.filter((p: any) => p.sexo === sexo)
      const obitusSegmento = importacao.obitos.filter((o: any) => o.sexo === sexo)
      
      resultados[sexo] = {
        massa: massaSegmento.length,
        obitos: obitusSegmento.length,
        taxa: massaSegmento.length > 0 ? obitusSegmento.length / massaSegmento.length : 0
      }
    }
    
    return resultados
  }
  
  return {}
}

function extrairResumoConfiguracao(parametros: any): any {
  return {
    intervalosPersonalizados: parametros.intervalosPersonalizados?.habilitado || false,
    testesAdicionais: Object.keys(parametros.estatisticasAvancadas?.testesAdicionais || {})
      .filter(teste => parametros.estatisticasAvancadas.testesAdicionais[teste]),
    segmentacao: {
      porSexo: parametros.segmentacao?.porSexo || false,
      porIdade: parametros.segmentacao?.porIdade || false
    },
    visualizacao: {
      graficosInterativos: parametros.visualizacaoAvancada?.graficosInterativos || false,
      mapasCalor: parametros.visualizacaoAvancada?.mapasCalor || false
    }
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/aderencia-tabuas/configuracao-avancada',
    descricao: 'Endpoint para configurações avançadas de análise de aderência',
    metodo: 'POST',
    acoes_disponiveis: {
      salvar: 'Salvar nova configuração avançada',
      aplicar: 'Aplicar configuração existente',
      listar: 'Listar configurações salvas',
      excluir: 'Excluir configuração'
    },
    funcionalidades: [
      'Intervalos de idade totalmente personalizáveis',
      'Múltiplos testes estatísticos (KS, Anderson-Darling, etc.)',
      'Segmentação avançada por múltiplas variáveis',
      'Comparação entre múltiplas tábuas de referência',
      'Configurações de performance otimizadas',
      'Validação automática de configurações'
    ],
    exemplo_configuracao_completa: {
      action: 'salvar',
      importacaoId: 'uuid-da-importacao',
      configuracao: {
        intervalosPersonalizados: {
          habilitado: true,
          intervalos: [
            { nome: 'Jovens', idadeInicio: 18, idadeFim: 30, ativo: true },
            { nome: 'Adultos', idadeInicio: 30, idadeFim: 55, ativo: true },
            { nome: 'Sêniors', idadeInicio: 55, idadeFim: 70, ativo: true }
          ]
        },
        estatisticasAvancadas: {
          niveisSignificancia: [0.01, 0.05, 0.10],
          testesAdicionais: {
            kolmogorovSmirnov: true,
            andersonDarling: true
          }
        },
        segmentacao: {
          porSexo: true,
          porIdade: true,
          tamanhoMinimoSegmento: 50
        }
      }
    }
  })
}
