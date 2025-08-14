/**
 * Testes unitários para a Calculadora Atuarial Moderna
 * Validação matemática rigorosa com Decimal.js
 */

import { 
  CalculadoraAtuarial, 
  DadosAtuariais, 
  TABELA_MORTALIDADE_AT2000,
  formatarMoeda,
  formatarPercentual
} from '../atuarial/calculadora'
import { Decimal } from 'decimal.js'

// Configuração global do Decimal.js para testes
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

describe('CalculadoraAtuarial Moderna - Validação Matemática', () => {
  let calculadora: CalculadoraAtuarial

  beforeEach(() => {
    calculadora = new CalculadoraAtuarial()
  })

  describe('Configuração da Tabela de Mortalidade AT-2000', () => {
    test('deve ter dados básicos da tabela AT-2000', () => {
      expect(TABELA_MORTALIDADE_AT2000[30]).toBeDefined()
      expect(TABELA_MORTALIDADE_AT2000[30].qx_m).toBeGreaterThan(0)
      expect(TABELA_MORTALIDADE_AT2000[30].qx_f).toBeGreaterThan(0)
      
      // Mortalidade masculina deve ser maior que feminina
      expect(TABELA_MORTALIDADE_AT2000[30].qx_m)
        .toBeGreaterThan(TABELA_MORTALIDADE_AT2000[30].qx_f)
    })

    test('deve seguir propriedade: qx aumenta com idade', () => {
      const idades = [30, 40, 50, 60, 70]
      
      for (let i = 1; i < idades.length; i++) {
        const idadeAnterior = idades[i - 1]
        const idadeAtual = idades[i]
        
        // Mortalidade deve aumentar com idade (ambos os sexos)
        expect(TABELA_MORTALIDADE_AT2000[idadeAtual].qx_m)
          .toBeGreaterThan(TABELA_MORTALIDADE_AT2000[idadeAnterior].qx_m)
        expect(TABELA_MORTALIDADE_AT2000[idadeAtual].qx_f)
          .toBeGreaterThan(TABELA_MORTALIDADE_AT2000[idadeAnterior].qx_f)
      }
    })

    test('deve ter valores de qx válidos (0 < qx < 1)', () => {
      Object.values(TABELA_MORTALIDADE_AT2000).forEach(({ qx_m, qx_f }) => {
        expect(qx_m).toBeGreaterThan(0)
        expect(qx_m).toBeLessThan(1)
        expect(qx_f).toBeGreaterThan(0)
        expect(qx_f).toBeLessThan(1)
      })
    })
  })

  describe('Probabilidade de Sobrevivência', () => {
    test('deve calcular probabilidade corretamente para 1 ano', () => {
      const prob = calculadora.calcularProbabilidadeSobrevivencia(30, 'M', 1)
      const qx = TABELA_MORTALIDADE_AT2000[30].qx_m
      const esperado = 1 - qx

      expect(prob).toBeCloseTo(esperado, 8)
    })

    test('deve calcular probabilidade para múltiplos anos', () => {
      const prob5anos = calculadora.calcularProbabilidadeSobrevivencia(30, 'M', 5)
      
      // Probabilidade de sobreviver 5 anos = produto das probabilidades anuais
      let probEsperada = 1.0
      for (let i = 0; i < 5; i++) {
        const idade = 30 + i
        if (TABELA_MORTALIDADE_AT2000[idade]) {
          probEsperada *= (1 - TABELA_MORTALIDADE_AT2000[idade].qx_m)
        }
      }

      expect(prob5anos).toBeCloseTo(probEsperada, 6)
    })

    test('deve seguir propriedade: probabilidade diminui com tempo', () => {
      const prob1 = calculadora.calcularProbabilidadeSobrevivencia(40, 'F', 1)
      const prob5 = calculadora.calcularProbabilidadeSobrevivencia(40, 'F', 5)
      const prob10 = calculadora.calcularProbabilidadeSobrevivencia(40, 'F', 10)

      expect(prob1).toBeGreaterThan(prob5)
      expect(prob5).toBeGreaterThan(prob10)
      
      // Todas devem estar entre 0 e 1
      expect(prob1).toBeLessThanOrEqual(1)
      expect(prob5).toBeLessThanOrEqual(1)
      expect(prob10).toBeLessThanOrEqual(1)
    })

    test('deve diferenciar entre sexos', () => {
      const probMasc = calculadora.calcularProbabilidadeSobrevivencia(50, 'M', 10)
      const probFem = calculadora.calcularProbabilidadeSobrevivencia(50, 'F', 10)

      // Mulheres têm maior probabilidade de sobrevivência
      expect(probFem).toBeGreaterThan(probMasc)
    })
  })

  describe('Expectativa de Vida', () => {
    test('deve calcular expectativa para idades conhecidas', () => {
      const expectativa30M = calculadora.calcularExpectativaVida(30, 'M')
      const expectativa30F = calculadora.calcularExpectativaVida(30, 'F')

      // Expectativas devem ser razoáveis (entre 20 e 60 anos)
      expect(expectativa30M).toBeGreaterThan(20)
      expect(expectativa30M).toBeLessThan(60)
      expect(expectativa30F).toBeGreaterThan(20)
      expect(expectativa30F).toBeLessThan(60)

      // Mulheres têm maior expectativa de vida
      expect(expectativa30F).toBeGreaterThan(expectativa30M)
    })

    test('deve seguir propriedade: expectativa diminui com idade', () => {
      const exp30 = calculadora.calcularExpectativaVida(30, 'M')
      const exp50 = calculadora.calcularExpectativaVida(50, 'M')
      const exp70 = calculadora.calcularExpectativaVida(70, 'M')

      expect(exp30).toBeGreaterThan(exp50)
      expect(exp50).toBeGreaterThan(exp70)
    })

    test('deve convergir para valores finitos', () => {
      const expectativa = calculadora.calcularExpectativaVida(90, 'F')
      
      // Mesmo em idades avançadas, deve ter expectativa finita
      expect(expectativa).toBeGreaterThan(0)
      expect(expectativa).toBeLessThan(20) // Máximo razoável para 90 anos
      expect(Number.isFinite(expectativa)).toBe(true)
    })
  })

  describe('Prêmio Único para Seguro de Vida', () => {
    test('deve calcular prêmio usando precisão decimal', () => {
      const dados: DadosAtuariais = {
        idade: 35,
        sexo: 'M',
        capital: 100000,
        taxaJuros: 0.06
      }

      const premio = calculadora.calcularPremioUnicoVida(dados)

      // Prêmio deve ser positivo e menor que capital
      expect(premio).toBeGreaterThan(0)
      expect(premio).toBeLessThan(dados.capital)
      
      // Para idade jovem, prêmio deve ser relativamente baixo
      expect(premio).toBeLessThan(dados.capital * 0.3)
    })

    test('deve seguir propriedade: prêmio aumenta com idade', () => {
      const dadosBase: DadosAtuariais = {
        idade: 30,
        sexo: 'M',
        capital: 100000,
        taxaJuros: 0.06
      }

      const premio30 = calculadora.calcularPremioUnicoVida({ ...dadosBase, idade: 30 })
      const premio40 = calculadora.calcularPremioUnicoVida({ ...dadosBase, idade: 40 })
      const premio50 = calculadora.calcularPremioUnicoVida({ ...dadosBase, idade: 50 })
      const premio60 = calculadora.calcularPremioUnicoVida({ ...dadosBase, idade: 60 })

      expect(premio30).toBeLessThan(premio40)
      expect(premio40).toBeLessThan(premio50)
      expect(premio50).toBeLessThan(premio60)
    })

    test('deve seguir propriedade: prêmio diminui com taxa maior', () => {
      const dadosBase: DadosAtuariais = {
        idade: 40,
        sexo: 'F',
        capital: 100000,
        taxaJuros: 0.03
      }

      const premio3pct = calculadora.calcularPremioUnicoVida({ ...dadosBase, taxaJuros: 0.03 })
      const premio6pct = calculadora.calcularPremioUnicoVida({ ...dadosBase, taxaJuros: 0.06 })
      const premio9pct = calculadora.calcularPremioUnicoVida({ ...dadosBase, taxaJuros: 0.09 })

      expect(premio3pct).toBeGreaterThan(premio6pct)
      expect(premio6pct).toBeGreaterThan(premio9pct)
    })

    test('deve diferenciar entre sexos', () => {
      const dados: DadosAtuariais = {
        idade: 45,
        sexo: 'M',
        capital: 100000,
        taxaJuros: 0.06
      }

      const premioMasc = calculadora.calcularPremioUnicoVida({ ...dados, sexo: 'M' })
      const premioFem = calculadora.calcularPremioUnicoVida({ ...dados, sexo: 'F' })

      // Homens têm mortalidade maior, logo prêmio maior
      expect(premioMasc).toBeGreaterThan(premioFem)
    })
  })

  describe('Renda Vitalícia', () => {
    test('deve calcular valor presente da renda', () => {
      const dados: DadosAtuariais = {
        idade: 65,
        sexo: 'M',
        capital: 1000, // R$ 1.000 por ano
        taxaJuros: 0.06
      }

      const valorPresente = calculadora.calcularRendaVitalicia(dados)

      // VP deve ser positivo e razoável
      expect(valorPresente).toBeGreaterThan(0)
      expect(valorPresente).toBeGreaterThan(dados.capital) // Mais que 1 ano
      expect(valorPresente).toBeLessThan(dados.capital * 25) // Menos que 25 anos
    })

    test('deve seguir propriedade: VP diminui com idade', () => {
      const dadosBase: DadosAtuariais = {
        idade: 60,
        sexo: 'F',
        capital: 12000,
        taxaJuros: 0.05
      }

      const vp60 = calculadora.calcularRendaVitalicia({ ...dadosBase, idade: 60 })
      const vp65 = calculadora.calcularRendaVitalicia({ ...dadosBase, idade: 65 })
      const vp70 = calculadora.calcularRendaVitalicia({ ...dadosBase, idade: 70 })

      // VP deve diminuir com idade (menor expectativa de vida)
      expect(vp60).toBeGreaterThan(vp65)
      expect(vp65).toBeGreaterThan(vp70)
    })

    test('deve seguir propriedade: VP aumenta com taxa menor', () => {
      const dados: DadosAtuariais = {
        idade: 60,
        sexo: 'M',
        capital: 10000,
        taxaJuros: 0.03
      }

      const vp3pct = calculadora.calcularRendaVitalicia({ ...dados, taxaJuros: 0.03 })
      const vp6pct = calculadora.calcularRendaVitalicia({ ...dados, taxaJuros: 0.06 })
      const vp9pct = calculadora.calcularRendaVitalicia({ ...dados, taxaJuros: 0.09 })

      expect(vp3pct).toBeGreaterThan(vp6pct)
      expect(vp6pct).toBeGreaterThan(vp9pct)
    })
  })

  describe('Reserva Matemática', () => {
    test('deve calcular reserva para diferentes períodos', () => {
      const dados: DadosAtuariais = {
        idade: 40,
        sexo: 'M',
        capital: 100000,
        taxaJuros: 0.06
      }

      const reserva0 = calculadora.calcularReservaMatemática(dados, 0)
      const reserva5 = calculadora.calcularReservaMatemática(dados, 5)
      const reserva10 = calculadora.calcularReservaMatemática(dados, 10)

      // Reserva deve aumentar com o tempo (se não há pagamentos)
      expect(reserva5).toBeGreaterThan(reserva0)
      expect(reserva10).toBeGreaterThan(reserva5)

      // Todas devem ser positivas
      expect(reserva0).toBeGreaterThan(0)
      expect(reserva5).toBeGreaterThan(0)
      expect(reserva10).toBeGreaterThan(0)
    })
  })

  describe('Cálculo Completo', () => {
    test('deve retornar resultado estruturado', () => {
      const dados: DadosAtuariais = {
        idade: 35,
        sexo: 'F',
        capital: 150000,
        taxaJuros: 0.055,
        prazo: 20
      }

      const resultado = calculadora.calcularCompleto(dados)

      // Validar estrutura
      expect(resultado).toHaveProperty('premio')
      expect(resultado).toHaveProperty('reserva')
      expect(resultado).toHaveProperty('valorPresente')
      expect(resultado).toHaveProperty('probabilidadeSobrevivencia')
      expect(resultado).toHaveProperty('expectativaVida')
      expect(resultado).toHaveProperty('detalhes')

      // Validar valores
      expect(resultado.premio).toBeGreaterThan(0)
      expect(resultado.reserva).toBeGreaterThan(0)
      expect(resultado.valorPresente).toBeGreaterThan(0)
      expect(resultado.probabilidadeSobrevivencia).toBeGreaterThan(0)
      expect(resultado.probabilidadeSobrevivencia).toBeLessThanOrEqual(1)
      expect(resultado.expectativaVida).toBeGreaterThan(0)

      // Validar detalhes
      expect(resultado.detalhes.metodologia).toBe('AT-2000 com juros compostos')
      expect(resultado.detalhes.tabelaMortalidade).toBe('AT-2000 (SUSEP)')
      expect(resultado.detalhes.dataCalculo).toBeInstanceOf(Date)
      expect(resultado.detalhes.parametros).toEqual(dados)
    })

    test('deve manter consistência entre cálculos', () => {
      const dados: DadosAtuariais = {
        idade: 45,
        sexo: 'M',
        capital: 200000,
        taxaJuros: 0.07
      }

      const resultado1 = calculadora.calcularCompleto(dados)
      const resultado2 = calculadora.calcularCompleto(dados)

      // Resultados devem ser idênticos para mesmas entradas
      expect(resultado1.premio).toBe(resultado2.premio)
      expect(resultado1.reserva).toBe(resultado2.reserva)
      expect(resultado1.valorPresente).toBe(resultado2.valorPresente)
      expect(resultado1.probabilidadeSobrevivencia).toBe(resultado2.probabilidadeSobrevivencia)
      expect(resultado1.expectativaVida).toBe(resultado2.expectativaVida)
    })
  })

  describe('Validação de Entradas Extremas', () => {
    test('deve lidar com idades extremas', () => {
      const dadosJovem: DadosAtuariais = {
        idade: 18,
        sexo: 'M',
        capital: 100000,
        taxaJuros: 0.06
      }

      const dadosIdoso: DadosAtuariais = {
        idade: 95,
        sexo: 'F',
        capital: 100000,
        taxaJuros: 0.06
      }

      expect(() => calculadora.calcularCompleto(dadosJovem)).not.toThrow()
      expect(() => calculadora.calcularCompleto(dadosIdoso)).not.toThrow()

      const resultadoJovem = calculadora.calcularCompleto(dadosJovem)
      const resultadoIdoso = calculadora.calcularCompleto(dadosIdoso)

      // Jovem deve ter prêmio menor e expectativa maior
      expect(resultadoJovem.premio).toBeLessThan(resultadoIdoso.premio)
      expect(resultadoJovem.expectativaVida).toBeGreaterThan(resultadoIdoso.expectativaVida)
    })

    test('deve lidar com taxas extremas', () => {
      const dados: DadosAtuariais = {
        idade: 40,
        sexo: 'M',
        capital: 100000,
        taxaJuros: 0.0001 // Taxa muito baixa
      }

      expect(() => calculadora.calcularCompleto(dados)).not.toThrow()

      const resultado = calculadora.calcularCompleto(dados)
      expect(resultado.premio).toBeGreaterThan(0)
      expect(Number.isFinite(resultado.premio)).toBe(true)
    })

    test('deve lidar com capitais extremos', () => {
      const dadosAlto: DadosAtuariais = {
        idade: 30,
        sexo: 'F',
        capital: 10000000, // 10 milhões
        taxaJuros: 0.06
      }

      const dadosBaixo: DadosAtuariais = {
        idade: 30,
        sexo: 'F',
        capital: 1000, // Mil reais
        taxaJuros: 0.06
      }

      expect(() => calculadora.calcularCompleto(dadosAlto)).not.toThrow()
      expect(() => calculadora.calcularCompleto(dadosBaixo)).not.toThrow()

      const resultadoAlto = calculadora.calcularCompleto(dadosAlto)
      const resultadoBaixo = calculadora.calcularCompleto(dadosBaixo)

      // Prêmio deve ser proporcional ao capital
      const proporcao = resultadoAlto.premio / resultadoBaixo.premio
      const proporcaoCapital = dadosAlto.capital / dadosBaixo.capital
      expect(proporcao).toBeCloseTo(proporcaoCapital, 0)
    })
  })
})

describe('Funções Utilitárias', () => {
  describe('formatarMoeda', () => {
    test('deve formatar valores monetários corretamente', () => {
      expect(formatarMoeda(1234.56)).toBe('R$ 1.234,56')
      expect(formatarMoeda(0)).toBe('R$ 0,00')
      expect(formatarMoeda(1000000)).toBe('R$ 1.000.000,00')
    })

    test('deve lidar com valores negativos', () => {
      expect(formatarMoeda(-1234.56)).toBe('-R$ 1.234,56')
    })

    test('deve lidar com valores extremos', () => {
      expect(formatarMoeda(0.01)).toBe('R$ 0,01')
      expect(formatarMoeda(999999999.99)).toContain('R$')
    })
  })

  describe('formatarPercentual', () => {
    test('deve formatar percentuais corretamente', () => {
      expect(formatarPercentual(0.1234)).toBe('12,34%')
      expect(formatarPercentual(0)).toBe('0,00%')
      expect(formatarPercentual(1)).toBe('100,00%')
    })

    test('deve manter precisão adequada', () => {
      expect(formatarPercentual(0.123456)).toBe('12,3456%')
      expect(formatarPercentual(0.001)).toBe('0,10%')
    })

    test('deve lidar com valores extremos', () => {
      expect(formatarPercentual(10)).toBe('1.000,00%')
      expect(formatarPercentual(-0.1)).toBe('-10,00%')
    })
  })
})
