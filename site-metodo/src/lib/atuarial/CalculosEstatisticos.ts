/**
 * Biblioteca Unificada de Cálculos Estatísticos Atuariais
 * 
 * Consolida todos os cálculos chi-quadrado, testes de aderência e estatísticas
 * atuariais em uma única biblioteca otimizada e reutilizável.
 * 
 * Substitui as duplicações encontradas em:
 * - /api/aderencia-tabuas/chi-quadrado/route.ts
 * - relatorio/route.ts (função calcularAderencia)
 * - componentes TesteChiQuadrado
 * - dashboard lógicas de teste
 */

import { agruparPorFaixaEtaria, consolidarGruposBaixaExpectancia, type GrupoFaixaEtaria } from '@/utils/aderenciaAgrupamento'

// ===== TIPOS UNIFICADOS =====

export interface DadosMortalidade {
  massa_participantes: Array<{
    matricula: string
    sexo: number // 1 = masculino, 2 = feminino
    idade: number
    ano_cadastro: number
    dataNascimento?: Date
    anoIngressao?: number
  }>
  tabuas_mortalidade: Array<{
    idade: number
    qx_masculino: number
    qx_feminino: number
    at2000_suav_masc?: number
    at2000_suav_fem?: number
  }>
  calculos_massa_qx: Array<{
    matricula: string
    ano_obito?: number
    sexo: number
    idade: number
    qx_aplicado: number
    obitos_observados: number
    obitos_esperados: number
  }>
}

export interface ConfiguracaoTeste {
  nivel_significancia: number
  usar_correcao_continuidade: boolean
  agrupar_por_faixa_etaria: boolean
  tamanho_faixa: number
}

export interface ResultadoChiQuadrado {
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
    configuracao_usada: ConfiguracaoTeste
  }
  intervalos_detalhados?: Array<{
    faixa: string
    idadeInicio: number
    idadeFim: number
    observados: number
    esperados: number
    residuo: number
    residuoPadronizado: number
    contribuicao_chi2: number
  }>
}

// ===== IMPLEMENTAÇÃO CHI-QUADRADO NUMÉRICA =====

/**
 * Aproximação de Lanczos para ln(Γ(z))
 */
function gammaln(z: number): number {
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

/**
 * Série para P(s,x) quando x < s+1 (gamma incompleta inferior)
 */
function lowerGammaSeries(s: number, x: number): number {
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

/**
 * Fração contínua para Q(s,x) quando x >= s+1 (gamma incompleta superior)
 */
function upperGammaContinuedFraction(s: number, x: number): number {
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

/**
 * Gamma incompleta regularizada P(s,x) = γ(s,x)/Γ(s)
 */
function regularizedGammaLower(s: number, x: number): number {
  if (x <= 0) return 0
  if (x < s + 1) return lowerGammaSeries(s, x)
  return 1 - upperGammaContinuedFraction(s, x)
}

/**
 * CDF da distribuição chi-quadrado
 */
function chiSquareCDF(x: number, k: number): number {
  if (x < 0) return 0
  return regularizedGammaLower(k / 2, x / 2)
}

/**
 * Valor-p (cauda superior) para chi-quadrado
 */
function calcularValorP(chiQuadrado: number, grausLiberdade: number): number {
  if (grausLiberdade <= 0) return 1
  const cdf = chiSquareCDF(chiQuadrado, grausLiberdade)
  return Math.max(0, Math.min(1, 1 - cdf))
}

/**
 * Tabela de valores críticos chi-quadrado (implementação simplificada)
 */
function calcularValorCritico(grausLiberdade: number, nivelSignificancia: number): number {
  const tabelaCritica: Record<number, Record<number, number>> = {
    1: { 0.05: 3.841, 0.01: 6.635, 0.10: 2.706 },
    2: { 0.05: 5.991, 0.01: 9.210, 0.10: 4.605 },
    3: { 0.05: 7.815, 0.01: 11.345, 0.10: 6.251 },
    4: { 0.05: 9.488, 0.01: 13.277, 0.10: 7.779 },
    5: { 0.05: 11.070, 0.01: 15.086, 0.10: 9.236 },
    10: { 0.05: 18.307, 0.01: 23.209, 0.10: 15.987 },
    15: { 0.05: 24.996, 0.01: 30.578, 0.10: 22.307 },
    20: { 0.05: 31.410, 0.01: 37.566, 0.10: 28.412 },
    25: { 0.05: 37.652, 0.01: 44.314, 0.10: 34.382 },
    30: { 0.05: 43.773, 0.01: 50.892, 0.10: 40.256 }
  }

  const nivelKey = nivelSignificancia <= 0.01 ? 0.01 : 
                   nivelSignificancia <= 0.05 ? 0.05 : 0.10
  
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

// ===== FUNÇÃO PRINCIPAL UNIFICADA =====

/**
 * Executa teste chi-quadrado completo de aderência de tábuas de mortalidade
 * 
 * Função unificada que substitui todas as implementações duplicadas no sistema
 */
export async function executarTesteAderencia(
  dados: DadosMortalidade, 
  configuracao: ConfiguracaoTeste
): Promise<ResultadoChiQuadrado> {
  
  let dadosProcessados = [...dados.calculos_massa_qx]

  // Agrupamento por faixa etária se solicitado
  if (configuracao.agrupar_por_faixa_etaria) {
    const gruposBase = agruparPorFaixaEtaria(dados.calculos_massa_qx, configuracao.tamanho_faixa)
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
  const intervalosDetalhados: any[] = []

  for (const item of dadosProcessados) {
    if (item.obitos_esperados > 0) {
      const diferenca = item.obitos_observados - item.obitos_esperados
      let contribuicao = (diferenca * diferenca) / item.obitos_esperados

      // Correção de continuidade de Yates se solicitada
      if (configuracao.usar_correcao_continuidade) {
        const diferencaCorrigida = Math.abs(diferenca) - 0.5
        contribuicao = (diferencaCorrigida * diferencaCorrigida) / item.obitos_esperados
      }

      chiQuadrado += contribuicao
      grausLiberdade += 1

      // Calcular estatísticas detalhadas para relatórios
      const residuo = diferenca
      const residuoPadronizado = Math.sqrt(contribuicao) * (diferenca > 0 ? 1 : -1)
      
      if (configuracao.agrupar_por_faixa_etaria) {
        intervalosDetalhados.push({
          faixa: `${item.idade}-${item.idade + configuracao.tamanho_faixa - 1}`,
          idadeInicio: item.idade,
          idadeFim: item.idade + configuracao.tamanho_faixa - 1,
          observados: item.obitos_observados,
          esperados: parseFloat(item.obitos_esperados.toFixed(4)),
          residuo: parseFloat(residuo.toFixed(4)),
          residuoPadronizado: parseFloat(residuoPadronizado.toFixed(4)),
          contribuicao_chi2: parseFloat(contribuicao.toFixed(6))
        })
      }
    }
  }

  // Ajuste dos graus de liberdade
  grausLiberdade = Math.max(1, grausLiberdade - 1)

  // Cálculos finais
  const valorP = calcularValorP(chiQuadrado, grausLiberdade)
  const valorCritico = calcularValorCritico(grausLiberdade, configuracao.nivel_significancia)
  const resultadoTeste = valorP < configuracao.nivel_significancia ? 'REJEITA' : 'ACEITA'

  // Estatísticas descritivas
  const totalObservados = dados.calculos_massa_qx.reduce((acc, item) => acc + item.obitos_observados, 0)
  const totalEsperados = dados.calculos_massa_qx.reduce((acc, item) => acc + item.obitos_esperados, 0)
  const razaoObsEsp = totalObservados / (totalEsperados || 1)

  return {
    calculos_estatisticos: {
      graus_liberdade: grausLiberdade,
      chi_quadrado: parseFloat(chiQuadrado.toFixed(4)),
      valor_p: parseFloat(valorP.toFixed(6)),
      valor_critico: parseFloat(valorCritico.toFixed(4)),
      nivel_significancia: configuracao.nivel_significancia,
      resultado_teste: resultadoTeste
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
      configuracao_usada: configuracao
    },
    intervalos_detalhados: intervalosDetalhados
  }
}

// ===== FUNÇÕES AUXILIARES EXPORTADAS =====

/**
 * Valida consistência entre massa de participantes e cálculos
 */
export function validarConsistenciaDados(dados: DadosMortalidade): { valido: boolean; erros: string[] } {
  const erros: string[] = []

  if (dados.massa_participantes.length === 0) {
    erros.push('Massa de participantes não pode estar vazia')
  }

  if (dados.tabuas_mortalidade.length === 0) {
    erros.push('Tábuas de mortalidade não podem estar vazias')
  }

  if (dados.calculos_massa_qx.length === 0) {
    erros.push('Dados de cálculo da massa não podem estar vazios')
  }

  // Verificação de consistência entre dados
  const matriculasParticipantes = new Set(dados.massa_participantes.map(p => p.matricula))
  const matriculasCalculos = new Set(dados.calculos_massa_qx.map(c => c.matricula))
  
  const matriculasInconsistentes = [...matriculasCalculos].filter(m => !matriculasParticipantes.has(m))
  if (matriculasInconsistentes.length > 0) {
    erros.push(`Inconsistência entre dados: ${matriculasInconsistentes.slice(0, 5).join(', ')}${matriculasInconsistentes.length > 5 ? '...' : ''}`)
  }

  return {
    valido: erros.length === 0,
    erros
  }
}

/**
 * Cache simples para resultados de cálculos pesados
 */
const cacheCalculos = new Map<string, ResultadoChiQuadrado>()

export function obterTesteComCache(dados: DadosMortalidade, config: ConfiguracaoTeste): Promise<ResultadoChiQuadrado> {
  const chave = JSON.stringify({ dados: dados.calculos_massa_qx, config })
  
  if (cacheCalculos.has(chave)) {
    return Promise.resolve(cacheCalculos.get(chave)!)
  }
  
  return executarTesteAderencia(dados, config).then(resultado => {
    cacheCalculos.set(chave, resultado)
    return resultado
  })
}

/**
 * Limpa o cache de cálculos
 */
export function limparCache(): void {
  cacheCalculos.clear()
}
