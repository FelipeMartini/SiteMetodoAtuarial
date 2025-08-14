import { 
  ValidadorTabelasMortalidade, 
  TABELA_MORTALIDADE_BR_EMS, 
  TABELA_MORTALIDADE_AT83,
  gerarRelatorioValidacao
} from '../atuarial/validacao-cruzada'
import { TABELA_MORTALIDADE_AT2000 } from '../atuarial/calculadora'

describe('Validação Cruzada de Tábuas de Mortalidade', () => {
  
  describe('Validação de Propriedades Matemáticas', () => {
    test('tabela AT-2000 deve ter propriedades válidas', () => {
      const resultado = ValidadorTabelasMortalidade.validarPropriedadesMatematicas(
        TABELA_MORTALIDADE_AT2000, 
        'AT-2000'
      )
      
      expect(resultado.valido).toBe(true)
      expect(resultado.erros).toHaveLength(0)
    })
    
    test('tabela BR-EMS deve ter propriedades válidas', () => {
      const resultado = ValidadorTabelasMortalidade.validarPropriedadesMatematicas(
        TABELA_MORTALIDADE_BR_EMS, 
        'BR-EMS'
      )
      
      expect(resultado.valido).toBe(true)
      expect(resultado.erros).toHaveLength(0)
    })
    
    test('tabela AT-83 deve ter propriedades válidas', () => {
      const resultado = ValidadorTabelasMortalidade.validarPropriedadesMatematicas(
        TABELA_MORTALIDADE_AT83, 
        'AT-83'
      )
      
      expect(resultado.valido).toBe(true)
      expect(resultado.erros).toHaveLength(0)
    })
    
    test('deve detectar propriedades inválidas em tabela malformada', () => {
      const tabelaInvalida = {
        30: { qx_m: -0.001, qx_f: 0.0005 }, // qx negativo
        35: { qx_m: 0.001, qx_f: 1.5 }, // qx > 1
        40: { qx_m: 0.0005, qx_f: 0.001 } // qx diminui
      }
      
      const resultado = ValidadorTabelasMortalidade.validarPropriedadesMatematicas(
        tabelaInvalida, 
        'Tabela Inválida'
      )
      
      expect(resultado.valido).toBe(false)
      expect(resultado.erros.length).toBeGreaterThan(0)
    })
  })
  
  describe('Comparação entre Tabelas', () => {
    test('deve comparar AT-2000 vs BR-EMS', () => {
      const resultado = ValidadorTabelasMortalidade.compararTabelas(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        'AT-2000',
        'BR-EMS'
      )
      
      expect(resultado.tabelaBase).toBe('AT-2000')
      expect(resultado.tabelaComparacao).toBe('BR-EMS')
      expect(resultado.dadosComparados.length).toBeGreaterThan(0)
      expect(resultado.estatisticas.diferencaMedia).toBeGreaterThan(0)
      expect(resultado.estatisticas.diferencaMaxima).toBeGreaterThan(resultado.estatisticas.diferencaMinima)
    })
    
    test('deve comparar AT-2000 vs AT-83', () => {
      const resultado = ValidadorTabelasMortalidade.compararTabelas(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_AT83,
        'AT-2000',
        'AT-83'
      )
      
      expect(resultado.tabelaBase).toBe('AT-2000')
      expect(resultado.tabelaComparacao).toBe('AT-83')
      expect(resultado.dadosComparados.length).toBeGreaterThan(0)
      
      // AT-83 e AT-2000 devem ser relativamente próximas (mesma família)
      expect(resultado.estatisticas.diferencaMedia).toBeLessThan(20) // Menos de 20% de diferença média
    })
    
    test('deve identificar diferenças dentro da tolerância', () => {
      const resultado = ValidadorTabelasMortalidade.compararTabelas(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_AT2000, // Comparando com ela mesma
        'AT-2000',
        'AT-2000 (cópia)',
        0.01 // 1% de tolerância
      )
      
      expect(resultado.validacao.dentroTolerancia).toBe(true)
      expect(resultado.estatisticas.diferencaMedia).toBe(0)
      expect(resultado.estatisticas.diferencaMaxima).toBe(0)
    })
    
    test('deve calcular estatísticas corretamente', () => {
      const resultado = ValidadorTabelasMortalidade.compararTabelas(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        'AT-2000',
        'BR-EMS'
      )
      
      expect(resultado.estatisticas.diferencaMedia).toBeGreaterThan(0)
      expect(resultado.estatisticas.desviopadrao).toBeGreaterThan(0)
      expect(resultado.estatisticas.coeficienteVariacao).toBeGreaterThan(0)
      expect(resultado.validacao.comentarios.length).toBeGreaterThan(0)
    })
  })
  
  describe('Expectativa de Vida', () => {
    test('deve calcular expectativa de vida corretamente', () => {
      const resultado = ValidadorTabelasMortalidade.compararExpectativaVida(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        65
      )
      
      // Expectativas devem ser positivas
      expect(resultado.tabelaBase.expectativaM).toBeGreaterThan(0)
      expect(resultado.tabelaBase.expectativaF).toBeGreaterThan(0)
      expect(resultado.tabelaComparacao.expectativaM).toBeGreaterThan(0)
      expect(resultado.tabelaComparacao.expectativaF).toBeGreaterThan(0)
      
      // Mulheres devem ter expectativa maior que homens
      expect(resultado.tabelaBase.expectativaF).toBeGreaterThan(resultado.tabelaBase.expectativaM)
      expect(resultado.tabelaComparacao.expectativaF).toBeGreaterThan(resultado.tabelaComparacao.expectativaM)
    })
    
    test('BR-EMS deve ter expectativa maior que AT-2000 (maior longevidade)', () => {
      const resultado = ValidadorTabelasMortalidade.compararExpectativaVida(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        65
      )
      
      // BR-EMS reflete maior longevidade da população brasileira
      expect(resultado.diferenca.masculina).toBeLessThan(0) // AT-2000 menor que BR-EMS
      expect(resultado.diferenca.feminina).toBeLessThan(0)  // AT-2000 menor que BR-EMS
    })
    
    test('expectativa deve diminuir com idade maior', () => {
      const resultado65 = ValidadorTabelasMortalidade.compararExpectativaVida(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        65
      )
      
      const resultado75 = ValidadorTabelasMortalidade.compararExpectativaVida(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        75
      )
      
      expect(resultado75.tabelaBase.expectativaM).toBeLessThan(resultado65.tabelaBase.expectativaM)
      expect(resultado75.tabelaBase.expectativaF).toBeLessThan(resultado65.tabelaBase.expectativaF)
    })
  })
  
  describe('Validação Completa', () => {
    test('deve executar validação completa sem erros', () => {
      const resultado = ValidadorTabelasMortalidade.validacaoCompleta()
      
      expect(resultado.validacaoAT2000vsBREMS).toBeDefined()
      expect(resultado.validacaoAT2000vsAT83).toBeDefined()
      expect(resultado.validacaoBREMSvsAT83).toBeDefined()
      expect(resultado.propriedadesMatematicas).toBeDefined()
      expect(resultado.expectativaVida).toBeDefined()
      
      // Todas as tabelas devem ter propriedades válidas
      expect(resultado.propriedadesMatematicas.AT2000.valido).toBe(true)
      expect(resultado.propriedadesMatematicas.BREMS.valido).toBe(true)
      expect(resultado.propriedadesMatematicas.AT83.valido).toBe(true)
    })
    
    test('deve gerar relatório de validação', () => {
      const relatorio = gerarRelatorioValidacao()
      
      expect(relatorio).toContain('Relatório de Validação Cruzada')
      expect(relatorio).toContain('AT-2000')
      expect(relatorio).toContain('BR-EMS')
      expect(relatorio).toContain('AT-83')
      expect(relatorio).toContain('Expectativa de Vida')
      expect(relatorio).toContain('Conclusões')
      
      // Deve ser um relatório substantivo
      expect(relatorio.length).toBeGreaterThan(1000)
    })
  })
  
  describe('Validação de Consistência Atuarial', () => {
    test('deve validar coerência entre qx de homens e mulheres', () => {
      const tabelas = [TABELA_MORTALIDADE_AT2000, TABELA_MORTALIDADE_BR_EMS, TABELA_MORTALIDADE_AT83]
      
      tabelas.forEach(tabela => {
        Object.entries(tabela).forEach(([idade, dados]) => {
          // Mulheres geralmente têm menor mortalidade que homens
          // (nem sempre, mas é uma tendência geral)
          if (dados.qx_f > dados.qx_m * 1.5) {
            // Se diferença for muito grande, pode haver erro
            console.warn(`Possível inconsistência na idade ${idade}: qx_f=${dados.qx_f}, qx_m=${dados.qx_m}`)
          }
        })
      })
    })
    
    test('deve validar progressão suave dos qx', () => {
      const idades = Object.keys(TABELA_MORTALIDADE_AT2000).map(Number).sort((a, b) => a - b)
      
      for (let i = 0; i < idades.length - 1; i++) {
        const idadeAtual = idades[i]
        const proximaIdade = idades[i + 1]
        
        const qxAtualM = TABELA_MORTALIDADE_AT2000[idadeAtual].qx_m
        const qxProximoM = TABELA_MORTALIDADE_AT2000[proximaIdade].qx_m
        
        // Verificar se não há saltos muito grandes
        const multiplicador = qxProximoM / qxAtualM
        expect(multiplicador).toBeLessThan(3) // Não deve triplicar de uma idade para outra
        expect(multiplicador).toBeGreaterThan(0.5) // Não deve cair pela metade
      }
    })
  })
  
  describe('Testes de Performance', () => {
    test('validação completa deve executar em tempo razoável', () => {
      const inicio = Date.now()
      
      ValidadorTabelasMortalidade.validacaoCompleta()
      
      const tempo = Date.now() - inicio
      expect(tempo).toBeLessThan(1000) // Menos de 1 segundo
    })
    
    test('geração de relatório deve ser eficiente', () => {
      const inicio = Date.now()
      
      const relatorio = gerarRelatorioValidacao()
      
      const tempo = Date.now() - inicio
      expect(tempo).toBeLessThan(500) // Menos de 0.5 segundos
      expect(relatorio.length).toBeGreaterThan(0)
    })
  })
  
  describe('Validação com Dados Reais', () => {
    test('deve validar contra padrões conhecidos da indústria', () => {
      // Testa conhecimentos atuariais específicos
      
      // 1. BR-EMS deve ter qx geralmente maiores que AT-2000 (maior longevidade)
      const comparacao = ValidadorTabelasMortalidade.compararTabelas(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        'AT-2000',
        'BR-EMS'
      )
      
      // Deve haver diferenças consistentes
      expect(comparacao.estatisticas.diferencaMedia).toBeGreaterThan(1) // Pelo menos 1% de diferença média
      expect(comparacao.estatisticas.diferencaMedia).toBeLessThan(50) // Mas não excessiva
    })
    
    test('deve validar expectativas de vida consistentes com literatura atuarial', () => {
      const expectativa65 = ValidadorTabelasMortalidade.compararExpectativaVida(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        65
      )
      
      // Expectativas razoáveis para população brasileira aos 65 anos
      expect(expectativa65.tabelaBase.expectativaM).toBeGreaterThan(10) // Pelo menos 10 anos
      expect(expectativa65.tabelaBase.expectativaM).toBeLessThan(30)     // Não mais que 30 anos
      expect(expectativa65.tabelaBase.expectativaF).toBeGreaterThan(12) // Mulheres vivem mais
      expect(expectativa65.tabelaBase.expectativaF).toBeLessThan(35)
    })
  })
})
