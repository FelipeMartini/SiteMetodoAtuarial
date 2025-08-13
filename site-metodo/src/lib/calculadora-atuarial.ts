/**
 * Calculadora Atuarial - Biblioteca para cálculos atuariais
 * Implementa funções fundamentais para seguros de vida e anuidades
 */

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
  parametros: any
  resultado: any
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
   */
  valorPresente(taxa: number, periodo: number): number {
    return Math.pow(1 + taxa, -periodo)
  }

  /**
   * Calcula Ax - Seguro de vida inteira
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
      const dx = lx * this.qx(idade)
      const vt = this.valorPresente(taxaJuros, idade - idadeInicial + 1)
      ax += (dx / 100000) * vt
      lx -= dx
    }

    return ax * valorCapital
  }

  /**
   * Calcula anuidade vitalícia
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
      const vt = this.valorPresente(taxaJuros, idade - idadeInicial)
      ax += (lx / 100000) * vt
      lx *= this.px(idade)
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
    const axAtual = this.calcularSeguroVidaInteira(idadeAtual, valorCapital, taxaJuros, idadeMaxima)
    
    let anuidadeRestante = 0
    if (idadeAtual < idadeInicial + periodoPagamento) {
      anuidadeRestante = this.calcularAnuidadeVitalicia(
        idadeAtual, 
        premioAnual, 
        taxaJuros, 
        Math.min(idadeInicial + periodoPagamento, idadeMaxima)
      )
    }

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
    idadeFinal: number,
    valorCapital: number = 100000,
    taxaJuros: number = 0.06
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
