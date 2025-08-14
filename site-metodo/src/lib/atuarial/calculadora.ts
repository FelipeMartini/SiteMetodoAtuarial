import { Decimal } from 'decimal.js'

/**
 * Configuração global para precisão decimal
 */
Decimal.set({
  precision: 28,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21,
  minE: -9e15,
  maxE: 9e15,
  crypto: false,
  modulo: Decimal.ROUND_DOWN,
  defaults: true
})

/**
 * Interface para dados atuariais básicos
 */
export interface DadosAtuariais {
  idade: number
  sexo: 'M' | 'F'
  capital: number
  prazo?: number
  taxaJuros: number
  tipoRenda?: 'vitalicia' | 'temporaria' | 'diferida'
  periodoCarencia?: number
}

/**
 * Interface para resultado de cálculos atuariais
 */
export interface ResultadoAtuarial {
  premio: number
  reserva: number
  valorPresente: number
  probabilidadeSobrevivencia: number
  expectativaVida: number
  valorFuturo?: number
  detalhes: {
    metodologia: string
    tabelaMortalidade: string
    dataCalculo: Date
    parametros: Record<string, unknown>
  }
}

/**
 * Tabela de mortalidade simplificada (AT-2000 básica)
 * Em produção, deve-se usar tabelas oficiais da SUSEP
 */
export const TABELA_MORTALIDADE_AT2000: Record<number, { qx_m: number; qx_f: number }> = {
  20: { qx_m: 0.000741, qx_f: 0.000357 },
  25: { qx_m: 0.000767, qx_f: 0.000393 },
  30: { qx_m: 0.000814, qx_f: 0.000446 },
  35: { qx_m: 0.000923, qx_f: 0.000551 },
  40: { qx_m: 0.001139, qx_f: 0.000743 },
  45: { qx_m: 0.001530, qx_f: 0.001072 },
  50: { qx_m: 0.002187, qx_f: 0.001600 },
  55: { qx_m: 0.003234, qx_f: 0.002438 },
  60: { qx_m: 0.004892, qx_f: 0.003772 },
  65: { qx_m: 0.007523, qx_f: 0.005887 },
  70: { qx_m: 0.011732, qx_f: 0.009330 },
  75: { qx_m: 0.018473, qx_f: 0.015012 },
  80: { qx_m: 0.029324, qx_f: 0.024611 },
  85: { qx_m: 0.047153, qx_f: 0.041054 },
  90: { qx_m: 0.076652, qx_f: 0.069581 },
  95: { qx_m: 0.125717, qx_f: 0.119754 }
}

/**
 * Classe principal para cálculos atuariais
 */
export class CalculadoraAtuarial {
  private tabela: Record<number, { qx_m: number; qx_f: number }>

  constructor(tabelaMortalidade = TABELA_MORTALIDADE_AT2000) {
    this.tabela = tabelaMortalidade
  }

  /**
   * Calcula a probabilidade de sobrevivência
   */
  public calcularProbabilidadeSobrevivencia(
    idade: number,
    sexo: 'M' | 'F',
    anos: number
  ): number {
    let prob = 1.0
    
    for (let i = 0; i < anos; i++) {
      const idadeAtual = idade + i
      const qx = this.obterQx(idadeAtual, sexo)
      prob *= (1 - qx)
    }
    
    return prob
  }

  /**
   * Calcula expectativa de vida
   */
  public calcularExpectativaVida(idade: number, sexo: 'M' | 'F'): number {
    let expectativa = 0
    let prob = 1.0
    
    for (let i = 0; i < 100; i++) {
      const idadeAtual = idade + i
      const qx = this.obterQx(idadeAtual, sexo)
      expectativa += prob
      prob *= (1 - qx)
      
      if (prob < 0.00001) break
    }
    
    return expectativa
  }

  /**
   * Calcula prêmio único para seguro de vida
   */
  public calcularPremioUnicoVida(dados: DadosAtuariais): number {
    const { idade, sexo, capital, taxaJuros } = dados
    const v = 1 / (1 + taxaJuros)
    
    let premio = new Decimal(0)
    let prob = new Decimal(1)
    
    for (let t = 0; t < 100; t++) {
      const idadeAtual = idade + t
      const qx = this.obterQx(idadeAtual, sexo)
      
      const beneficio = prob.mul(qx).mul(Math.pow(v, t + 1)).mul(capital)
      premio = premio.add(beneficio)
      
      prob = prob.mul(1 - qx)
      
      if (prob.lt(0.00001)) break
    }
    
    return premio.toNumber()
  }

  /**
   * Calcula prêmio para renda vitalícia
   */
  public calcularRendaVitalicia(dados: DadosAtuariais): number {
    const { idade, sexo, capital, taxaJuros } = dados
    const v = 1 / (1 + taxaJuros)
    
    let valorPresente = new Decimal(0)
    let prob = new Decimal(1)
    
    for (let t = 0; t < 100; t++) {
      const idadeAtual = idade + t
      const qx = this.obterQx(idadeAtual, sexo)
      
      const pagamento = prob.mul(Math.pow(v, t)).mul(capital)
      valorPresente = valorPresente.add(pagamento)
      
      prob = prob.mul(1 - qx)
      
      if (prob.lt(0.00001)) break
    }
    
    return valorPresente.toNumber()
  }

  /**
   * Calcula reserva matemática
   */
  public calcularReservaMatemática(
    dados: DadosAtuariais,
    anosPassados: number
  ): number {
    const idadeAtual = dados.idade + anosPassados
    const dadosAtualizados = {
      ...dados,
      idade: idadeAtual
    }
    
    return this.calcularPremioUnicoVida(dadosAtualizados)
  }

  /**
   * Obtém qx da tabela de mortalidade com interpolação
   */
  private obterQx(idade: number, sexo: 'M' | 'F'): number {
    const campo = sexo === 'M' ? 'qx_m' : 'qx_f'
    
    // Se idade exata existe na tabela
    if (this.tabela[idade]) {
      return this.tabela[idade][campo]
    }
    
    // Interpolação linear para idades intermediárias
    const idades = Object.keys(this.tabela).map(Number).sort((a, b) => a - b)
    
    // Validação de limites
    const idadeMinima = idades[0]
    const idadeMaxima = idades[idades.length - 1]
    
    // Se idade está fora dos limites, usa valores extremos
    if (idade <= idadeMinima) {
      return this.tabela[idadeMinima][campo]
    }
    if (idade >= idadeMaxima) {
      return this.tabela[idadeMaxima][campo]
    }
    
    // Encontra idades para interpolação
    let idadeInferior = idadeMinima
    let idadeSuperior = idadeMaxima
    
    for (const idadeTabela of idades) {
      if (idadeTabela <= idade && idadeTabela > idadeInferior) {
        idadeInferior = idadeTabela
      }
      if (idadeTabela >= idade && idadeTabela < idadeSuperior) {
        idadeSuperior = idadeTabela
      }
    }
    
    // Validação adicional
    if (!this.tabela[idadeInferior] || !this.tabela[idadeSuperior]) {
      // Fallback para idade mais próxima
      const idadeMaisProxima = idades.reduce((prev, curr) => 
        Math.abs(curr - idade) < Math.abs(prev - idade) ? curr : prev
      )
      return this.tabela[idadeMaisProxima][campo]
    }
    
    if (idadeInferior === idadeSuperior) {
      return this.tabela[idadeInferior][campo]
    }
    
    const qxInferior = this.tabela[idadeInferior][campo]
    const qxSuperior = this.tabela[idadeSuperior][campo]
    
    const fator = (idade - idadeInferior) / (idadeSuperior - idadeInferior)
    return qxInferior + fator * (qxSuperior - qxInferior)
  }

  /**
   * Realiza cálculo completo atuarial
   */
  public calcularCompleto(dados: DadosAtuariais): ResultadoAtuarial {
    const premio = this.calcularPremioUnicoVida(dados)
    const reserva = this.calcularReservaMatemática(dados, 0)
    const valorPresente = this.calcularRendaVitalicia(dados)
    const probabilidadeSobrevivencia = this.calcularProbabilidadeSobrevivencia(
      dados.idade, 
      dados.sexo, 
      dados.prazo || 1
    )
    const expectativaVida = this.calcularExpectativaVida(dados.idade, dados.sexo)

    return {
      premio,
      reserva,
      valorPresente,
      probabilidadeSobrevivencia,
      expectativaVida,
      detalhes: {
        metodologia: 'AT-2000 com juros compostos',
        tabelaMortalidade: 'AT-2000 (SUSEP)',
        dataCalculo: new Date(),
        parametros: dados as unknown as Record<string, unknown>
      }
    }
  }
}

/**
 * Instância singleton da calculadora
 */
export const calculadoraAtuarial = new CalculadoraAtuarial()

/**
 * Função utilitária para formatação de valores monetários
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

/**
 * Função utilitária para formatação de percentuais
 */
export function formatarPercentual(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(valor)
}
