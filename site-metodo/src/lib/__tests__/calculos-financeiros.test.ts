/**
 * Testes unitários para Cálculos Financeiros Atuariais
 * Focado em precisão decimal e validação matemática
 */

import { 
  CalculosFinanceirosAtuariais, 
  DadosAnuidade, 
  DadosSeguro,
  RelatoriosAtuariais
} from '../atuarial/calculos-financeiros'
import { Decimal } from 'decimal.js'

// Configuração global do Decimal.js
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

describe('CalculosFinanceirosAtuariais - Precisão Matemática', () => {
  let calc: CalculosFinanceirosAtuariais

  beforeEach(() => {
    calc = new CalculosFinanceirosAtuariais()
  })

  describe('Valor Presente de Anuidade', () => {
    test('deve calcular anuidade ordinária corretamente', () => {
      const dados: DadosAnuidade = {
        valorPagamento: 1000,
        periodos: 12,
        taxaJuros: 0.01, // 1% ao mês
        tipoAnuidade: 'ordinaria'
      }

      const vp = calc.valorPresenteAnuidade(dados)

      // Fórmula: VP = PMT * [(1 - (1+i)^-n) / i]
      const i = new Decimal(0.01)
      const n = new Decimal(12)
      const pmt = new Decimal(1000)
      
      const fator = Decimal.sub(1, Decimal.add(1, i).pow(n.neg())).div(i)
      const esperado = pmt.mul(fator)

      expect(vp).toBeCloseTo(esperado.toNumber(), 6)
      expect(vp).toBeCloseTo(11255.077, 3) // Valor conhecido
    })

    test('deve calcular anuidade antecipada corretamente', () => {
      const dados: DadosAnuidade = {
        valorPagamento: 1000,
        periodos: 12,
        taxaJuros: 0.01,
        tipoAnuidade: 'antecipada'
      }

      const vpAntecipada = calc.valorPresenteAnuidade(dados)
      
      // Anuidade antecipada = anuidade ordinária * (1 + i)
      const dadosOrdinaria = { ...dados, tipoAnuidade: 'ordinaria' as const }
      const vpOrdinaria = calc.valorPresenteAnuidade(dadosOrdinaria)
      
      expect(vpAntecipada).toBeCloseTo(vpOrdinaria * 1.01, 3)
    })

    test('deve calcular anuidade diferida corretamente', () => {
      const dados: DadosAnuidade = {
        valorPagamento: 1000,
        periodos: 12,
        taxaJuros: 0.01,
        tipoAnuidade: 'diferida',
        periodoGracia: 6
      }

      const vpDiferida = calc.valorPresenteAnuidade(dados)
      
      // Anuidade diferida deve ser menor que anuidade imediata
      const dadosImediata = { ...dados, tipoAnuidade: 'ordinaria' as const }
      const vpImediata = calc.valorPresenteAnuidade(dadosImediata)
      
      expect(vpDiferida).toBeLessThan(vpImediata)
      
      // Deve ser descontada pelo período de graça
      const fatorDesconto = Math.pow(1.01, -6)
      expect(vpDiferida).toBeCloseTo(vpImediata * fatorDesconto, 3)
    })

    test('deve validar casos extremos', () => {
      // Taxa zero
      const dadosTaxaZero: DadosAnuidade = {
        valorPagamento: 1000,
        periodos: 12,
        taxaJuros: 0,
        tipoAnuidade: 'ordinaria'
      }
      
      const vpTaxaZero = calc.valorPresenteAnuidade(dadosTaxaZero)
      expect(vpTaxaZero).toBe(12000) // 12 * 1000

      // Um período
      const dadosUmPeriodo: DadosAnuidade = {
        valorPagamento: 1000,
        periodos: 1,
        taxaJuros: 0.05,
        tipoAnuidade: 'ordinaria'
      }
      
      const vpUmPeriodo = calc.valorPresenteAnuidade(dadosUmPeriodo)
      expect(vpUmPeriodo).toBeCloseTo(1000 / 1.05, 6)
    })
  })

  describe('Valor Futuro de Anuidade', () => {
    test('deve calcular valor futuro corretamente', () => {
      const dados: DadosAnuidade = {
        valorPagamento: 1000,
        periodos: 12,
        taxaJuros: 0.01,
        tipoAnuidade: 'ordinaria'
      }

      const vf = calc.valorFuturoAnuidade(dados)

      // Fórmula: VF = PMT * [((1+i)^n - 1) / i]
      const i = new Decimal(0.01)
      const n = new Decimal(12)
      const pmt = new Decimal(1000)
      
      const fator = Decimal.add(1, i).pow(n).sub(1).div(i)
      const esperado = pmt.mul(fator)

      expect(vf).toBeCloseTo(esperado.toNumber(), 6)
      expect(vf).toBeCloseTo(12682.503, 3) // Valor conhecido
    })

    test('deve seguir relação VP vs VF', () => {
      const dados: DadosAnuidade = {
        valorPagamento: 1000,
        periodos: 12,
        taxaJuros: 0.01,
        tipoAnuidade: 'ordinaria'
      }

      const vp = calc.valorPresenteAnuidade(dados)
      const vf = calc.valorFuturoAnuidade(dados)

      // Relação: VF = VP * (1+i)^n
      const fatorCapitalizacao = Math.pow(1.01, 12)
      expect(vf).toBeCloseTo(vp * fatorCapitalizacao, 3)
    })
  })

  describe('Prêmio Nivelado para Seguro', () => {
    test('deve calcular prêmio baseado em parâmetros atuariais', () => {
      const dados: DadosSeguro = {
        tipoSeguro: 'vida',
        capital: 100000,
        idade: 35,
        sexo: 'M',
        taxaJuros: 0.06,
        carregamento: 0.3,
        prazoSeguro: 20
      }

      const premio = calc.premioNivelado(dados)

      expect(premio).toBeGreaterThan(0)
      expect(premio).toBeLessThan(dados.capital * 0.1) // Máximo 10% do capital

      // Para idade jovem, prêmio deve ser relativamente baixo
      expect(premio).toBeLessThan(5000)
    })

    test('deve seguir propriedade: prêmio aumenta com idade', () => {
      const dadosBase: DadosSeguro = {
        tipoSeguro: 'vida',
        capital: 100000,
        idade: 30,
        sexo: 'M',
        taxaJuros: 0.06,
        carregamento: 0.3
      }

      const premio30 = calc.premioNivelado({ ...dadosBase, idade: 30 })
      const premio40 = calc.premioNivelado({ ...dadosBase, idade: 40 })
      const premio50 = calc.premioNivelado({ ...dadosBase, idade: 50 })
      const premio60 = calc.premioNivelado({ ...dadosBase, idade: 60 })

      expect(premio30).toBeLessThan(premio40)
      expect(premio40).toBeLessThan(premio50)
      expect(premio50).toBeLessThan(premio60)
    })

    test('deve diferir entre sexos (homens maior mortalidade)', () => {
      const dadosBase: DadosSeguro = {
        tipoSeguro: 'vida',
        capital: 100000,
        idade: 40,
        sexo: 'M',
        taxaJuros: 0.06,
        carregamento: 0.3
      }

      const premioMasculino = calc.premioNivelado({ ...dadosBase, sexo: 'M' })
      const premioFeminino = calc.premioNivelado({ ...dadosBase, sexo: 'F' })

      // Homens têm mortalidade maior, logo prêmio maior
      expect(premioMasculino).toBeGreaterThan(premioFeminino)
    })
  })

  describe('Reserva Técnica', () => {
    test('deve calcular reserva proporcional ao tempo restante', () => {
      const dados: DadosSeguro = {
        tipoSeguro: 'vida',
        capital: 100000,
        idade: 35,
        sexo: 'M',
        taxaJuros: 0.06,
        carregamento: 0.3,
        prazoSeguro: 20
      }

      const reserva5anos = calc.reservaTecnica(dados, 5)
      const reserva10anos = calc.reservaTecnica(dados, 10)
      const reserva15anos = calc.reservaTecnica(dados, 15)
      const reserva20anos = calc.reservaTecnica(dados, 20)

      // Reserva deve diminuir com o tempo (menos tempo restante)
      expect(reserva5anos).toBeGreaterThan(reserva10anos)
      expect(reserva10anos).toBeGreaterThan(reserva15anos)
      expect(reserva15anos).toBeGreaterThan(reserva20anos)
      
      // Após o prazo, reserva deve ser zero
      expect(reserva20anos).toBe(0)
    })
  })

  describe('Prêmio com Carregamento', () => {
    test('deve aplicar carregamento corretamente', () => {
      const premioLiquido = 1000
      const carregamento = 0.3 // 30%

      const premioComCarregamento = calc.premioComCarregamento(premioLiquido, carregamento)

      // Fórmula: Prêmio = Prêmio Líquido / (1 - carregamento)
      const esperado = premioLiquido / (1 - carregamento)
      expect(premioComCarregamento).toBeCloseTo(esperado, 6)
      expect(premioComCarregamento).toBeCloseTo(1428.57, 2)
    })

    test('deve usar carregamento padrão quando não especificado', () => {
      const premioLiquido = 1000
      
      const premioComCarregamentoPadrao = calc.premioComCarregamento(premioLiquido)
      const premioComCarregamento30 = calc.premioComCarregamento(premioLiquido, 0.3)

      expect(premioComCarregamentoPadrao).toBeCloseTo(premioComCarregamento30, 6)
    })
  })

  describe('Taxa Interna de Retorno (TIR)', () => {
    test('deve calcular TIR para fluxos simples', () => {
      // Investimento inicial de -1000, retorno de 1100 após 1 período
      const fluxos = [-1000, 1100]
      
      const tir = calc.calcularTIR(fluxos)
      
      expect(tir).toBeCloseTo(0.1, 3) // 10%
    })

    test('deve lidar com fluxos inválidos', () => {
      const fluxosVazio: number[] = []
      const fluxosInvalidos = [0, 1000]
      
      expect(calc.calcularTIR(fluxosVazio)).toBe(0)
      expect(calc.calcularTIR(fluxosInvalidos)).toBe(0)
    })
  })

  describe('Duração de Macaulay', () => {
    test('deve calcular duração corretamente', () => {
      // Bond simples: 100 no primeiro período, 1100 no segundo
      const fluxos = [100, 1100]
      const taxa = 0.1

      const duracao = calc.duracaoMacaulay(fluxos, taxa)

      // Duração deve estar entre 1 e 2 (períodos dos fluxos)
      expect(duracao).toBeGreaterThan(1)
      expect(duracao).toBeLessThan(2)
    })

    test('deve seguir propriedade: duração aumenta com fluxos posteriores', () => {
      const fluxosEarly = [1000, 100] // Pagamento maior no início
      const fluxosLate = [100, 1000]  // Pagamento maior no final
      const taxa = 0.05

      const duracaoEarly = calc.duracaoMacaulay(fluxosEarly, taxa)
      const duracaoLate = calc.duracaoMacaulay(fluxosLate, taxa)

      expect(duracaoLate).toBeGreaterThan(duracaoEarly)
    })
  })

  describe('Análise de Sensibilidade', () => {
    test('deve calcular sensibilidade à taxa de juros', () => {
      const dados: DadosSeguro = {
        tipoSeguro: 'vida',
        capital: 100000,
        idade: 40,
        sexo: 'M',
        taxaJuros: 0.06,
        carregamento: 0.3
      }

      const analise = calc.analiseSensibilidade(dados, 0.01)

      expect(analise).toHaveProperty('original')
      expect(analise).toHaveProperty('alta')
      expect(analise).toHaveProperty('baixa')
      expect(analise).toHaveProperty('sensibilidade')

      // Valores devem ser diferentes
      expect(analise.alta).not.toBe(analise.original)
      expect(analise.baixa).not.toBe(analise.original)
      expect(analise.alta).not.toBe(analise.baixa)

      // Sensibilidade deve ser um número
      expect(typeof analise.sensibilidade).toBe('number')
    })
  })

  describe('Equivalência Atuarial', () => {
    test('deve comparar produtos equivalentes', () => {
      const produto1: DadosSeguro = {
        tipoSeguro: 'vida',
        capital: 100000,
        idade: 40,
        sexo: 'M',
        taxaJuros: 0.06,
        carregamento: 0.3
      }

      const produto2: DadosSeguro = {
        ...produto1,
        taxaJuros: 0.065 // Taxa ligeiramente diferente
      }

      const equivalencia = calc.equivalenciaAtuarial(produto1, produto2)

      expect(equivalencia).toHaveProperty('equivalentes')
      expect(equivalencia).toHaveProperty('diferencaPercentual')
      expect(typeof equivalencia.equivalentes).toBe('boolean')
      expect(equivalencia.diferencaPercentual).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Simulação de Monte Carlo', () => {
    test('deve gerar distribuição de resultados', () => {
      const dados: DadosSeguro = {
        tipoSeguro: 'vida',
        capital: 100000,
        idade: 40,
        sexo: 'M',
        taxaJuros: 0.06,
        carregamento: 0.3
      }

      const simulacao = calc.simulacaoMonteCarlo(dados, 100)

      expect(simulacao).toHaveProperty('media')
      expect(simulacao).toHaveProperty('desvio')
      expect(simulacao).toHaveProperty('percentil95')
      expect(simulacao).toHaveProperty('percentil5')

      // Validar propriedades estatísticas
      expect(simulacao.media).toBeGreaterThan(0)
      expect(simulacao.desvio).toBeGreaterThan(0)
      expect(simulacao.percentil95).toBeGreaterThan(simulacao.percentil5)
      
      // Percentil 95 deve ser maior que a média
      expect(simulacao.percentil95).toBeGreaterThan(simulacao.media)
      expect(simulacao.media).toBeGreaterThan(simulacao.percentil5)
    })

    test('deve ter variabilidade entre execuções', () => {
      const dados: DadosSeguro = {
        tipoSeguro: 'vida',
        capital: 100000,
        idade: 40,
        sexo: 'M',
        taxaJuros: 0.06,
        carregamento: 0.3
      }

      const sim1 = calc.simulacaoMonteCarlo(dados, 50)
      const sim2 = calc.simulacaoMonteCarlo(dados, 50)

      // Resultados devem ser ligeiramente diferentes (Monte Carlo)
      expect(sim1.media).not.toBe(sim2.media)
      expect(sim1.desvio).not.toBe(sim2.desvio)
    })
  })
})

describe('RelatoriosAtuariais', () => {
  test('deve gerar relatório completo', () => {
    const dados: DadosSeguro = {
      tipoSeguro: 'vida',
      capital: 100000,
      idade: 35,
      sexo: 'F',
      taxaJuros: 0.06,
      carregamento: 0.25
    }

    const relatorio = RelatoriosAtuariais.gerarRelatorioCompleto(dados)

    // Validar estrutura completa
    expect(relatorio).toHaveProperty('resumoExecutivo')
    expect(relatorio).toHaveProperty('analiseRisco')
    expect(relatorio).toHaveProperty('projecaoFinanceira')
    expect(relatorio).toHaveProperty('recomendacoes')

    // Validar resumo executivo
    expect(relatorio.resumoExecutivo.produto).toBe('vida')
    expect(relatorio.resumoExecutivo.capital).toBe(100000)
    expect(relatorio.resumoExecutivo.idadeContratante).toBe(35)
    expect(relatorio.resumoExecutivo.taxaJuros).toBe(0.06)
    expect(relatorio.resumoExecutivo.premioNivelado).toBeGreaterThan(0)

    // Validar análise de risco
    expect(typeof relatorio.analiseRisco.sensibilidadeTaxa).toBe('number')
    expect(relatorio.analiseRisco.cenarioOtimista).toBeGreaterThan(0)
    expect(relatorio.analiseRisco.cenarioPessimista).toBeGreaterThan(0)
    expect(relatorio.analiseRisco.volatilidade).toBeGreaterThan(0)

    // Validar projeção financeira
    expect(relatorio.projecaoFinanceira.premioMedio).toBeGreaterThan(0)
    expect(relatorio.projecaoFinanceira.intervaloConfianca.superior)
      .toBeGreaterThan(relatorio.projecaoFinanceira.intervaloConfianca.inferior)

    // Validar recomendações
    expect(Array.isArray(relatorio.recomendacoes)).toBe(true)
    expect(relatorio.recomendacoes.length).toBeGreaterThan(0)
  })
})
