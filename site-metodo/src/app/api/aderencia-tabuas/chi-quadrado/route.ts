import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { agruparPorFaixaEtaria, consolidarGruposBaixaExpectancia } from '@/utils/aderenciaAgrupamento'

// Implementação numérica básica para CDF de Chi-Quadrado usando gamma incompleta regularizada
// Referências:
// - Wikipedia Chi-squared distribution
// - Numerical Recipes (série para P(a,x) e fração contínua para Q(a,x))

function gammaln(z: number): number {
  // Lanczos approximation
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ]
  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - gammaln(1 - z)
  }
  z -= 1
  let x = 0.99999999999980993
  for (let i = 0; i < p.length; i++) {
    x += p[i] / (z + i + 1)
  }
  const t = z + p.length - 0.5
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
}

function lowerGammaSeries(s: number, x: number): number {
  // Série para P(s,x) quando x < s+1
  let sum = 1 / s
  let term = sum
  let n = 1
  while (n < 1000) {
    term *= x / (s + n)
    sum += term
    if (term < sum * 1e-12) break
    n++
  }
  return sum * Math.exp(-x + s * Math.log(x) - gammaln(s))
}

function upperGammaContinuedFraction(s: number, x: number): number {
  // Fração contínua para Q(s,x) quando x >= s+1
  const EPS = 1e-12
  let a0 = 1
  let a1 = x
  let b0 = 0
  let b1 = 1
  let fac = 1 / a1
  let g = fac
  let n = 1
  while (n < 1000) {
    const an = n
    const ana = an - s
    a0 = (a1 + a0 * ana)
    b0 = (b1 + b0 * ana)
    const anf = an * fac
    a1 = x * a0 + anf * a1
    b1 = x * b0 + anf * b1
    if (a1 !== 0) {
      fac = 1 / a1
      const gold = g
      g = b1 * fac
      if (Math.abs((g - gold) / g) < EPS) break
    }
    n++
  }
  return Math.exp(-x + s * Math.log(x) - gammaln(s)) * g
}

function regularizedGammaLower(s: number, x: number): number {
  if (x <= 0) return 0
  if (x < s + 1) return lowerGammaSeries(s, x)
  return 1 - upperGammaContinuedFraction(s, x)
}

function chiSquareCDF(x: number, k: number): number {
  if (x < 0) return 0
  return regularizedGammaLower(k / 2, x / 2)
}

// Schema para validação dos dados de entrada
const ChiQuadradoRequestSchema = z.object({
  massa_participantes: z.array(z.object({
    matricula: z.string(),
    sexo: z.number().min(1).max(2), // 1 = masculino, 2 = feminino
    idade: z.number().min(0).max(120),
    ano_cadastro: z.number()
  })),
  tabuas_mortalidade: z.array(z.object({
    idade: z.number().min(0).max(120),
    qx_masculino: z.number().min(0).max(1),
    qx_feminino: z.number().min(0).max(1),
    at2000_suav_masc: z.number().min(0).max(1).optional(),
    at2000_suav_fem: z.number().min(0).max(1).optional()
  })),
  calculos_massa_qx: z.array(z.object({
    matricula: z.string(),
    ano_obito: z.number().optional(),
    sexo: z.number().min(1).max(2),
    idade: z.number().min(0).max(120),
    qx_aplicado: z.number().min(0).max(1),
    obitos_observados: z.number().min(0),
    obitos_esperados: z.number().min(0)
  })),
  configuracao: z.object({
    nivel_significancia: z.number().min(0.001).max(0.5).default(0.05),
    usar_correcao_continuidade: z.boolean().default(false),
    agrupar_por_faixa_etaria: z.boolean().default(false),
    tamanho_faixa: z.number().min(1).max(10).default(5)
  }).optional()
})

type ChiQuadradoRequest = z.infer<typeof ChiQuadradoRequestSchema>

// Função para calcular o valor crítico do chi-quadrado
function calcularValorCritico(grausLiberdade: number, nivelSignificancia: number): number {
  // Implementação simplificada usando tabela de valores críticos
  // Em uma implementação real, usaria biblioteca estatística
  const tabelaCritica: Record<number, Record<number, number>> = {
    1: { 0.05: 3.841, 0.01: 6.635 },
    2: { 0.05: 5.991, 0.01: 9.210 },
    3: { 0.05: 7.815, 0.01: 11.345 },
    4: { 0.05: 9.488, 0.01: 13.277 },
    5: { 0.05: 11.070, 0.01: 15.086 },
    10: { 0.05: 18.307, 0.01: 23.209 },
    15: { 0.05: 24.996, 0.01: 30.578 },
    20: { 0.05: 31.410, 0.01: 37.566 },
    25: { 0.05: 37.652, 0.01: 44.314 },
    30: { 0.05: 43.773, 0.01: 50.892 }
  }

  const nivelKey = nivelSignificancia === 0.01 ? 0.01 : 0.05
  
  // Encontra o valor mais próximo na tabela
  const grausDisponiveis = Object.keys(tabelaCritica).map(Number).sort((a, b) => a - b)
  let grauMaisProximo = grausDisponiveis[0]
  
  for (const grau of grausDisponiveis) {
    if (Math.abs(grau - grausLiberdade) < Math.abs(grauMaisProximo - grausLiberdade)) {
      grauMaisProximo = grau
    }
  }
  
  return tabelaCritica[grauMaisProximo][nivelKey] || 3.841
}

// Função para calcular o valor-p exato (cauda superior) via CDF
function calcularValorP(chiQuadrado: number, grausLiberdade: number): number {
  if (grausLiberdade <= 0) return 1
  const cdf = chiSquareCDF(chiQuadrado, grausLiberdade)
  const pUpper = Math.max(0, Math.min(1, 1 - cdf))
  return pUpper
}

// Função principal para calcular chi-quadrado
function calcularChiQuadrado(dados: ChiQuadradoRequest) {
  const config = dados.configuracao || {
    nivel_significancia: 0.05,
    usar_correcao_continuidade: false,
    agrupar_por_faixa_etaria: false,
    tamanho_faixa: 5
  }

  let dadosProcessados = [...dados.calculos_massa_qx]

  // Agrupamento por faixa etária se solicitado (util centralizado) + consolidação E<5
  if (config.agrupar_por_faixa_etaria) {
    const gruposBase = agruparPorFaixaEtaria(dados.calculos_massa_qx, config.tamanho_faixa!)
    const gruposConsolidados = consolidarGruposBaixaExpectancia(gruposBase, 5)
    dadosProcessados = gruposConsolidados.map((g, idx) => ({
      matricula: `GRUPO_${idx}`,
      ano_obito: 0,
      sexo: 1,
      idade: g.idadeInicio,
      qx_aplicado: g.participantes ? g.esperados / g.participantes : 0,
      obitos_observados: g.observados,
      obitos_esperados: g.esperados
    }))
  }

  // Cálculo do chi-quadrado
  let chiQuadrado = 0
  let grausLiberdade = 0

  for (const item of dadosProcessados) {
    if (item.obitos_esperados > 0) {
      const diferenca = item.obitos_observados - item.obitos_esperados
      let contribuicao = (diferenca * diferenca) / item.obitos_esperados

      // Correção de continuidade de Yates se solicitada
      if (config.usar_correcao_continuidade) {
        const diferencaCorrigida = Math.abs(diferenca) - 0.5
        contribuicao = (diferencaCorrigida * diferencaCorrigida) / item.obitos_esperados
      }

      chiQuadrado += contribuicao
      grausLiberdade += 1
    }
  }

  // Ajuste dos graus de liberdade (geralmente k-1 onde k é o número de categorias)
  grausLiberdade = Math.max(1, grausLiberdade - 1)

  const valorP = calcularValorP(chiQuadrado, grausLiberdade)
  const valorCritico = calcularValorCritico(grausLiberdade, config.nivel_significancia!)
  const resultadoTeste = valorP < config.nivel_significancia! ? 'REJEITA' : 'ACEITA'

  // Estatísticas adicionais
  const totalObservados = dados.calculos_massa_qx.reduce((acc, item) => acc + item.obitos_observados, 0)
  const totalEsperados = dados.calculos_massa_qx.reduce((acc, item) => acc + item.obitos_esperados, 0)
  const razaoObsEsp = totalObservados / totalEsperados

  return {
    calculos_estatisticos: {
      graus_liberdade: grausLiberdade,
      chi_quadrado: parseFloat(chiQuadrado.toFixed(4)),
  valor_p: parseFloat(valorP.toFixed(6)),
      valor_critico: parseFloat(valorCritico.toFixed(4)),
      nivel_significancia: config.nivel_significancia!,
      resultado_teste: resultadoTeste as 'ACEITA' | 'REJEITA'
    },
    estatisticas_descritivas: {
      total_participantes: dados.massa_participantes.length,
      total_observados: totalObservados,
      total_esperados: parseFloat(totalEsperados.toFixed(2)),
      razao_obs_esp: parseFloat(razaoObsEsp.toFixed(4)),
      desvio_relativo: parseFloat(((razaoObsEsp - 1) * 100).toFixed(2))
    },
    detalhes_calculo: {
      numero_grupos: dadosProcessados.length,
      grupos_validos: dadosProcessados.filter(item => item.obitos_esperados > 0).length,
      configuracao_usada: config
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação dos dados de entrada
    const dadosValidados = ChiQuadradoRequestSchema.parse(body)
    
    // Validações adicionais de negócio
    if (dadosValidados.massa_participantes.length === 0) {
      return NextResponse.json(
        { error: 'Massa de participantes não pode estar vazia' },
        { status: 400 }
      )
    }

    if (dadosValidados.tabuas_mortalidade.length === 0) {
      return NextResponse.json(
        { error: 'Tábuas de mortalidade não podem estar vazias' },
        { status: 400 }
      )
    }

    if (dadosValidados.calculos_massa_qx.length === 0) {
      return NextResponse.json(
        { error: 'Dados de cálculo da massa não podem estar vazios' },
        { status: 400 }
      )
    }

    // Verificação de consistência entre dados
    const matriculasParticipantes = new Set(dadosValidados.massa_participantes.map(p => p.matricula))
    const matriculasCalculos = new Set(dadosValidados.calculos_massa_qx.map(c => c.matricula))
    
    const matriculasInconsistentes = [...matriculasCalculos].filter(m => !matriculasParticipantes.has(m))
    if (matriculasInconsistentes.length > 0) {
      return NextResponse.json(
        { 
          error: 'Inconsistência entre dados de participantes e cálculos',
          detalhes: `Matrículas em cálculos mas não em participantes: ${matriculasInconsistentes.slice(0, 5).join(', ')}${matriculasInconsistentes.length > 5 ? '...' : ''}`
        },
        { status: 400 }
      )
    }

    // Execução do cálculo chi-quadrado
    const resultado = calcularChiQuadrado(dadosValidados)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...resultado
    })

  } catch (error) {
    console.error('Erro no cálculo chi-quadrado:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados de entrada inválidos',
          detalhes: (error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('; ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor ao calcular chi-quadrado' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/aderencia-tabuas/chi-quadrado',
    descricao: 'Endpoint para cálculo do teste chi-quadrado de aderência de tábuas de mortalidade',
    metodo: 'POST',
    exemplo_request: {
      massa_participantes: [
        {
          matricula: '12345',
          sexo: 1,
          idade: 45,
          ano_cadastro: 2020
        }
      ],
      tabuas_mortalidade: [
        {
          idade: 45,
          qx_masculino: 0.001234,
          qx_feminino: 0.000987,
          at2000_suav_masc: 0.001150,
          at2000_suav_fem: 0.000890
        }
      ],
      calculos_massa_qx: [
        {
          matricula: '12345',
          sexo: 1,
          idade: 45,
          qx_aplicado: 0.001234,
          obitos_observados: 1,
          obitos_esperados: 0.98
        }
      ],
      configuracao: {
        nivel_significancia: 0.05,
        usar_correcao_continuidade: false,
        agrupar_por_faixa_etaria: true,
        tamanho_faixa: 5
      }
    }
  })
}
