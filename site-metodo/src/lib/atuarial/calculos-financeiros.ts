import { Finance } from 'financejs'
import { Decimal } from 'decimal.js'

/**
 * Interface para cálculos de anuidades
 */
export interface DadosAnuidade {
  valorPagamento: number
  periodos: number
  taxaJuros: number
  tipoAnuidade: 'ordinaria' | 'antecipada' | 'diferida'
  periodoGracia?: number
}

/**
 * Interface para cálculos de seguros
 */
export interface DadosSeguro {
  tipoSeguro: 'vida' | 'acidentes' | 'temporario' | 'dotal' | 'misto'
  capital: number
  idade: number
  sexo: 'M' | 'F'
  prazoSeguro?: number
  premio?: number
  taxaJuros: number
  carregamento?: number
}

/**
 * Classe para cálculos financeiros atuariais avançados
 */
export class CalculosFinanceirosAtuariais {
  private finance: Finance

  constructor() {
    this.finance = new Finance()
  }

  /**
   * Calcula valor presente de anuidade
   */
  public valorPresenteAnuidade(dados: DadosAnuidade): number {
    const { valorPagamento, periodos, taxaJuros, tipoAnuidade, periodoGracia = 0 } = dados
    
    let vp = new Decimal(0)
    const v = new Decimal(1).div(Decimal.add(1, taxaJuros))
    
    const inicioAnuidade = tipoAnuidade === 'diferida' ? periodoGracia : 0
    const ajusteAntecipada = tipoAnuidade === 'antecipada' ? 0 : 1
    
    for (let t = 0; t < periodos; t++) {
      const periodo = inicioAnuidade + t + ajusteAntecipada
      const valorDescontado = new Decimal(valorPagamento).mul(v.pow(periodo))
      vp = vp.add(valorDescontado)
    }
    
    return vp.toNumber()
  }

  /**
   * Calcula valor futuro de anuidade
   */
  public valorFuturoAnuidade(dados: DadosAnuidade): number {
    const { valorPagamento, periodos, taxaJuros } = dados
    
    // Usando a fórmula: VF = PMT * [((1+i)^n - 1) / i]
    const i = new Decimal(taxaJuros)
    const n = new Decimal(periodos)
    const pmt = new Decimal(valorPagamento)
    
    const fator = Decimal.add(1, i).pow(n).sub(1).div(i)
    return pmt.mul(fator).toNumber()
  }

  /**
   * Calcula prêmio nivelado para seguro
   */
  public premioNivelado(dados: DadosSeguro): number {
    const { capital, idade, sexo, prazoSeguro = 1, taxaJuros } = dados
    
    // Simplificação: usar finance.js para cálculo base
    // Em produção, deve usar tabelas atuariais específicas
    const valorPresente = this.finance.PV(taxaJuros * 100, capital, prazoSeguro)
    
    // Ajuste atuarial básico baseado em idade e sexo
    const fatorIdade = this.calcularFatorIdade(idade)
    const fatorSexo = sexo === 'M' ? 1.1 : 0.9 // Homens têm mortalidade maior
    
    return Math.abs(valorPresente) * fatorIdade * fatorSexo
  }

  /**
   * Calcula reserva técnica
   */
  public reservaTecnica(dados: DadosSeguro, tempoDecorrido: number): number {
    const { capital, taxaJuros, prazoSeguro = 1 } = dados
    
    const periodoRestante = (prazoSeguro || 1) - tempoDecorrido
    if (periodoRestante <= 0) return 0
    
    return this.finance.PV(taxaJuros * 100, capital, periodoRestante)
  }

  /**
   * Calcula prêmio com carregamento
   */
  public premioComCarregamento(premioLiquido: number, carregamento: number = 0.3): number {
    return premioLiquido / (1 - carregamento)
  }

  /**
   * Calcula Taxa Interna de Retorno (TIR) para produtos atuariais
   */
  public calcularTIR(fluxosCaixa: number[]): number {
    try {
      return this.finance.IRR(...fluxosCaixa)
    } catch {
      return 0
    }
  }

  /**
   * Calcula Valor Presente Líquido (VPL)
   */
  public calcularVPL(taxa: number, investimentoInicial: number, fluxosCaixa: number[]): number {
    return this.finance.NPV(taxa, investimentoInicial, ...fluxosCaixa)
  }

  /**
   * Calcula duração de Macaulay
   */
  public duracaoMacaulay(fluxosCaixa: number[], taxaDesconto: number): number {
    let somaFluxosDescontados = new Decimal(0)
    let somaPonderada = new Decimal(0)
    const v = new Decimal(1).div(Decimal.add(1, taxaDesconto))
    
    fluxosCaixa.forEach((fluxo, periodo) => {
      const fluxoDescontado = new Decimal(fluxo).mul(v.pow(periodo + 1))
      somaFluxosDescontados = somaFluxosDescontados.add(fluxoDescontado)
      somaPonderada = somaPonderada.add(fluxoDescontado.mul(periodo + 1))
    })
    
    return somaPonderada.div(somaFluxosDescontados).toNumber()
  }

  /**
   * Análise de sensibilidade da taxa de juros
   */
  public analiseSensibilidade(
    dados: DadosSeguro,
    variacaoTaxa: number = 0.01
  ): { original: number; alta: number; baixa: number; sensibilidade: number } {
    const premioOriginal = this.premioNivelado(dados)
    
    const dadosAlta = { ...dados, taxaJuros: dados.taxaJuros + variacaoTaxa }
    const premioAlta = this.premioNivelado(dadosAlta)
    
    const dadosBaixa = { ...dados, taxaJuros: dados.taxaJuros - variacaoTaxa }
    const premioBaixa = this.premioNivelado(dadosBaixa)
    
    const sensibilidade = ((premioAlta - premioBaixa) / (2 * variacaoTaxa)) / premioOriginal
    
    return {
      original: premioOriginal,
      alta: premioAlta,
      baixa: premioBaixa,
      sensibilidade
    }
  }

  /**
   * Calcula equivalência atuarial entre produtos
   */
  public equivalenciaAtuarial(
    produto1: DadosSeguro,
    produto2: DadosSeguro
  ): { equivalentes: boolean; diferencaPercentual: number } {
    const premio1 = this.premioNivelado(produto1)
    const premio2 = this.premioNivelado(produto2)
    
    const diferencaPercentual = Math.abs((premio1 - premio2) / premio1) * 100
    const equivalentes = diferencaPercentual < 5 // Tolerância de 5%
    
    return { equivalentes, diferencaPercentual }
  }

  /**
   * Simulação de Monte Carlo para projeções
   */
  public simulacaoMonteCarlo(
    dados: DadosSeguro,
    numeroSimulacoes: number = 1000
  ): { media: number; desvio: number; percentil95: number; percentil5: number } {
    const resultados: number[] = []
    
    for (let i = 0; i < numeroSimulacoes; i++) {
      // Variação aleatória na taxa de juros (±2%)
      const variacao = (Math.random() - 0.5) * 0.04
      const dadosSimulacao = {
        ...dados,
        taxaJuros: dados.taxaJuros + variacao
      }
      
      resultados.push(this.premioNivelado(dadosSimulacao))
    }
    
    resultados.sort((a, b) => a - b)
    
    const media = resultados.reduce((sum, val) => sum + val, 0) / numeroSimulacoes
    const variancia = resultados.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / numeroSimulacoes
    const desvio = Math.sqrt(variancia)
    
    const percentil5 = resultados[Math.floor(numeroSimulacoes * 0.05)]
    const percentil95 = resultados[Math.floor(numeroSimulacoes * 0.95)]
    
    return { media, desvio, percentil95, percentil5 }
  }

  /**
   * Fator de ajuste baseado na idade
   */
  private calcularFatorIdade(idade: number): number {
    if (idade < 25) return 0.8
    if (idade < 35) return 0.9
    if (idade < 45) return 1.0
    if (idade < 55) return 1.2
    if (idade < 65) return 1.5
    return 2.0
  }
}

/**
 * Funções utilitárias para relatórios atuariais
 */
export class RelatoriosAtuariais {
  /**
   * Gera relatório completo de análise atuarial
   */
  public static gerarRelatorioCompleto(dados: DadosSeguro): {
    resumoExecutivo: Record<string, unknown>
    analiseRisco: Record<string, unknown>
    projecaoFinanceira: Record<string, unknown>
    recomendacoes: string[]
  } {
    const calc = new CalculosFinanceirosAtuariais()
    
    const premioNivelado = calc.premioNivelado(dados)
    const sensibilidade = calc.analiseSensibilidade(dados)
    const monteCarlo = calc.simulacaoMonteCarlo(dados)
    
    return {
      resumoExecutivo: {
        produto: dados.tipoSeguro,
        capital: dados.capital,
        premioNivelado,
        idadeContratante: dados.idade,
        taxaJuros: dados.taxaJuros
      },
      analiseRisco: {
        sensibilidadeTaxa: sensibilidade.sensibilidade,
        cenarioOtimista: sensibilidade.baixa,
        cenarioPessimista: sensibilidade.alta,
        volatilidade: monteCarlo.desvio
      },
      projecaoFinanceira: {
        premioMedio: monteCarlo.media,
        intervaloConfianca: {
          inferior: monteCarlo.percentil5,
          superior: monteCarlo.percentil95
        }
      },
      recomendacoes: [
        `Prêmio recomendado: R$ ${premioNivelado.toFixed(2)}`,
        `Sensibilidade à taxa: ${(sensibilidade.sensibilidade * 100).toFixed(2)}%`,
        'Revisar anualmente conforme mudanças na taxa Selic',
        'Considerar produto adequado para o perfil etário'
      ]
    }
  }
}

/**
 * Instância singleton dos cálculos financeiros
 */
export const calculosFinanceiros = new CalculosFinanceirosAtuariais()
