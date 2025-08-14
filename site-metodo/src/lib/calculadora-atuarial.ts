/**
 * Calculadora Atuarial - Biblioteca para cálculos atuariais
 * Implementa funções fundamentais para seguros de vida e anuidades
 */

import { Decimal } from 'decimal.js'

// Configurar Decimal.js para máxima precisão
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

export interface TaxaMortalidade {
  idade: number
  taxa: number
}

export interface ResultadoSeguroVida {
  valorCapital: number
  premioAnual: number
  valorPresente: number
  reservaTecnica: number
}

export interface ResultadoAtuarial {
  tipo: 'seguro_vida' | 'anuidade' | 'reserva'
  parametros: Record<string, unknown>
  resultado: Record<string, unknown>
  dataCalculo: Date
}

export class CalculadoraAtuarial {
  private tabaMortalidade: Map<number, number> = new Map()

  constructor(tabelaMortalidade?: TaxaMortalidade[]) {
    if (tabelaMortalidade) {
      this.carregarTabelaMortalidade(tabelaMortalidade)
    }
  }

  /**
   * Carrega uma tabela de mortalidade
   */
  carregarTabelaMortalidade(tabela: TaxaMortalidade[]): void {
    this.tabaMortalidade.clear()
    tabela.forEach(({ idade, taxa }) => {
      this.tabaMortalidade.set(idade, taxa)
    })
  }

  /**
   * Calcula a probabilidade de morte em uma idade específica
   */
  qx(idade: number): number {
    return this.tabaMortalidade.get(idade) || 0.01 // Taxa padrão se não encontrar
  }

  /**
   * Calcula a probabilidade de sobrevivência
   */
  px(idade: number): number {
    return 1 - this.qx(idade)
  }

  /**
   * Calcula o valor presente de 1 unidade monetária
   * Usa Decimal.js para máxima precisão
   */
  valorPresente(taxa: number, periodo: number): number {
    if (periodo === 0) return 1
    if (taxa === 0) return 1
    
    // Usar Decimal.js para cálculos precisos
    const taxaDecimal = new Decimal(1 + taxa)
    const periodoDecimal = new Decimal(periodo)
    return taxaDecimal.pow(periodoDecimal.neg()).toNumber()
  }

  /**
   * Calcula Ax - Seguro de vida inteira
   * Fórmula corrigida: Ax = Σ(vt * dx / l0)
   */
  calcularSeguroVidaInteira(
    idadeInicial: number,
    valorCapital: number,
    taxaJuros: number,
    idadeMaxima: number = 120
  ): number {
    let ax = 0
    let lx = 100000 // Raiz da tabela de mortalidade

    for (let idade = idadeInicial; idade < idadeMaxima; idade++) {
      const qx = this.qx(idade)
      const dx = lx * qx
      
      // Tempo até o pagamento (meio do ano para aproximação)
      const t = idade - idadeInicial + 0.5
      const vt = this.valorPresente(taxaJuros, t)
      
      ax += (dx / 100000) * vt
      lx = lx * (1 - qx)
      
      // Parar se lx muito pequeno
      if (lx < 1) break
    }

    return ax * valorCapital
  }

  /**
   * Calcula anuidade vitalícia
   * Fórmula corrigida: ax = Σ(vt * lx / l0)
   */
  calcularAnuidadeVitalicia(
    idadeInicial: number,
    valorAno: number,
    taxaJuros: number,
    idadeMaxima: number = 120
  ): number {
    let ax = 0
    let lx = 100000

    for (let idade = idadeInicial; idade < idadeMaxima; idade++) {
      const t = idade - idadeInicial
      const vt = this.valorPresente(taxaJuros, t)
      ax += (lx / 100000) * vt
      
      // Atualizar lx para próximo ano
      const qx = this.qx(idade)
      lx = lx * (1 - qx)
      
      // Parar se lx muito pequeno
      if (lx < 1) break
    }

    return ax * valorAno
  }

  /**
   * Calcula prêmio de seguro de vida
   */
  calcularPremioSeguroVida(
    idadeInicial: number,
    valorCapital: number,
    taxaJuros: number,
    periodoPagamento: number,
    idadeMaxima: number = 120
  ): number {
    const ax = this.calcularSeguroVidaInteira(idadeInicial, 1, taxaJuros, idadeMaxima)
    const anuidade = this.calcularAnuidadeVitalicia(idadeInicial, 1, taxaJuros, Math.min(idadeInicial + periodoPagamento, idadeMaxima))
    
    return (ax * valorCapital) / anuidade
  }

  /**
   * Calcula reserva técnica
   * Fórmula: Reserva = Ax(atual) - P * ax(restante)
   * onde P é o prêmio puro (sem carregamento)
   */
  calcularReservaTecnica(
    idadeAtual: number,
    idadeInicial: number,
    valorCapital: number,
    premioAnual: number,
    taxaJuros: number,
    periodoPagamento: number,
    idadeMaxima: number = 120
  ): number {
    // Se já passou do período de pagamento, a reserva é igual ao Ax atual
    if (idadeAtual >= idadeInicial + periodoPagamento) {
      return this.calcularSeguroVidaInteira(idadeAtual, valorCapital, taxaJuros, idadeMaxima)
    }

    // Calcular o benefício futuro descontado
    const axAtual = this.calcularSeguroVidaInteira(idadeAtual, valorCapital, taxaJuros, idadeMaxima)
    
    // Calcular anuidade dos prêmios restantes
    const anosRestantes = (idadeInicial + periodoPagamento) - idadeAtual
    const anuidadeRestante = this.calcularAnuidadeVitalicia(
      idadeAtual, 
      premioAnual, 
      taxaJuros, 
      Math.min(idadeAtual + anosRestantes, idadeMaxima)
    )

    // Reserva = Benefícios futuros - Prêmios futuros
    return axAtual - anuidadeRestante
  }

  /**
   * Executa cálculo completo de seguro de vida
   */
  calcularSeguroVida(parametros: {
    idade: number
    valorCapital: number
    taxaJuros: number
    periodoPagamento: number
  }): ResultadoSeguroVida {
    const { idade, valorCapital, taxaJuros, periodoPagamento } = parametros

    const premioAnual = this.calcularPremioSeguroVida(
      idade,
      valorCapital,
      taxaJuros,
      periodoPagamento
    )

    const valorPresente = this.calcularSeguroVidaInteira(
      idade,
      valorCapital,
      taxaJuros
    )

    const reservaTecnica = this.calcularReservaTecnica(
      idade + 1,
      idade,
      valorCapital,
      premioAnual,
      taxaJuros,
      periodoPagamento
    )

    return {
      valorCapital,
      premioAnual,
      valorPresente,
      reservaTecnica
    }
  }

  /**
   * Calcula múltiplos cenários de mortalidade
   */
  analiseMortalidade(
    idadeInicial: number,
    idadeFinal: number
  ): Array<{
    idade: number
    qx: number
    px: number
    lx: number
    dx: number
    ex: number // expectativa de vida
  }> {
    const resultado = []
    let lx = 100000

    for (let idade = idadeInicial; idade <= idadeFinal; idade++) {
      const qx = this.qx(idade)
      const px = this.px(idade)
      const dx = lx * qx

      // Cálculo simplificado da expectativa de vida
      let ex = 0
      let lxTemp = lx
      for (let i = idade; i < 120; i++) {
        ex += lxTemp / lx
        lxTemp *= this.px(i)
      }

      resultado.push({
        idade,
        qx,
        px,
        lx: Math.round(lx),
        dx: Math.round(dx),
        ex: Math.round(ex * 100) / 100
      })

      lx -= dx
    }

    return resultado
  }
}

// Instância singleton para uso global
export const calculadoraAtuarial = new CalculadoraAtuarial()
