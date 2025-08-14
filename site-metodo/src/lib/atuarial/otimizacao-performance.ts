import { performance } from 'perf_hooks'
import { 
  CalculadoraAtuarial, 
  DadosAtuariais,
  TABELA_MORTALIDADE_AT2000 
} from '../atuarial/calculadora'
import { 
  ValidadorTabelasMortalidade,
  TABELA_MORTALIDADE_BR_EMS 
} from '../atuarial/validacao-cruzada'

/**
 * Interface para resultados de benchmark
 */
export interface ResultadoBenchmark {
  operacao: string
  tempoExecucao: number // em milissegundos
  iteracoes: number
  tempoMedio: number
  tempoMaximo: number
  tempoMinimo: number
  throughput: number // operações por segundo
}

/**
 * Interface para relatório de performance
 */
export interface RelatorioPerformance {
  dataExecucao: Date
  ambiente: {
    nodejs: string
    plataforma: string
    arquitetura: string
  }
  benchmarks: ResultadoBenchmark[]
  resumo: {
    operacaoMaisRapida: string
    operacaoMaisLenta: string
    throughputTotal: number
    recomendacoes: string[]
  }
}

/**
 * Classe para otimização e benchmark de performance
 */
export class OtimizadorPerformance {
  private calculadora: CalculadoraAtuarial
  
  constructor() {
    this.calculadora = new CalculadoraAtuarial()
  }

  /**
   * Executa benchmark de uma operação específica
   */
  private executarBenchmark(
    operacao: string,
    funcao: () => void,
    iteracoes: number = 1000
  ): ResultadoBenchmark {
    const tempos: number[] = []
    
    // Warm-up
    for (let i = 0; i < 10; i++) {
      funcao()
    }
    
    // Benchmark real
    for (let i = 0; i < iteracoes; i++) {
      const inicio = performance.now()
      funcao()
      const fim = performance.now()
      tempos.push(fim - inicio)
    }
    
    const tempoTotal = tempos.reduce((a, b) => a + b, 0)
    const tempoMedio = tempoTotal / iteracoes
    const tempoMaximo = Math.max(...tempos)
    const tempoMinimo = Math.min(...tempos)
    const throughput = 1000 / tempoMedio // ops/segundo
    
    return {
      operacao,
      tempoExecucao: tempoTotal,
      iteracoes,
      tempoMedio,
      tempoMaximo,
      tempoMinimo,
      throughput
    }
  }

  /**
   * Benchmark de cálculo de probabilidade de sobrevivência
   */
  public benchmarkProbabilidadeSobrevivencia(): ResultadoBenchmark {
    const dados = { idade: 40, sexo: 'M' as const, anos: 10 }
    
    return this.executarBenchmark(
      'Probabilidade de Sobrevivência (10 anos)',
      () => this.calculadora.calcularProbabilidadeSobrevivencia(dados.idade, dados.sexo, dados.anos),
      1000
    )
  }

  /**
   * Benchmark de cálculo de seguro vida inteira
   */
  public benchmarkSeguroVidaInteira(): ResultadoBenchmark {
    const dados: DadosAtuariais = {
      idade: 35,
      sexo: 'F',
      capital: 100000,
      taxaJuros: 0.06
    }
    
    return this.executarBenchmark(
      'Seguro Vida Inteira',
      () => this.calculadora.calcularPremioUnicoVida(dados),
      500
    )
  }

  /**
   * Benchmark de cálculo de anuidade vitalícia
   */
  public benchmarkAnuidadeVitalicia(): ResultadoBenchmark {
    const dados: DadosAtuariais = {
      idade: 65,
      sexo: 'M',
      capital: 500000,
      taxaJuros: 0.04
    }
    
    return this.executarBenchmark(
      'Anuidade Vitalícia',
      () => this.calculadora.calcularRendaVitalicia(dados),
      500
    )
  }

  /**
   * Benchmark de cálculo de expectativa de vida
   */
  public benchmarkExpectativaVida(): ResultadoBenchmark {
    return this.executarBenchmark(
      'Expectativa de Vida',
      () => this.calculadora.calcularExpectativaVida(45, 'F'),
      1000
    )
  }

  /**
   * Benchmark de validação cruzada
   */
  public benchmarkValidacaoCruzada(): ResultadoBenchmark {
    return this.executarBenchmark(
      'Validação Cruzada de Tabelas',
      () => ValidadorTabelasMortalidade.compararTabelas(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        'AT-2000',
        'BR-EMS'
      ),
      100 // Menos iterações por ser operação mais pesada
    )
  }

  /**
   * Benchmark de cálculo completo
   */
  public benchmarkCalculoCompleto(): ResultadoBenchmark {
    const dados: DadosAtuariais = {
      idade: 50,
      sexo: 'M',
      capital: 200000,
      taxaJuros: 0.05
    }
    
    return this.executarBenchmark(
      'Cálculo Completo Atuarial',
      () => this.calculadora.calcularCompleto(dados),
      200
    )
  }

  /**
   * Benchmark de interpolação de qx
   */
  public benchmarkInterpolacao(): ResultadoBenchmark {
    return this.executarBenchmark(
      'Interpolação de qx',
      () => {
        // Testa interpolação para idades não tabuladas
        for (let idade = 20.5; idade < 95; idade += 0.5) {
          (this.calculadora as any).obterQx(idade, 'M')
        }
      },
      200
    )
  }

  /**
   * Executa suite completa de benchmarks
   */
  public executarSuiteCompleta(): RelatorioPerformance {
    console.log('🚀 Iniciando suite de benchmarks de performance...')
    
    const benchmarks: ResultadoBenchmark[] = []
    
    console.log('📊 Executando benchmark: Probabilidade de Sobrevivência...')
    benchmarks.push(this.benchmarkProbabilidadeSobrevivencia())
    
    console.log('📊 Executando benchmark: Seguro Vida Inteira...')
    benchmarks.push(this.benchmarkSeguroVidaInteira())
    
    console.log('📊 Executando benchmark: Anuidade Vitalícia...')
    benchmarks.push(this.benchmarkAnuidadeVitalicia())
    
    console.log('📊 Executando benchmark: Expectativa de Vida...')
    benchmarks.push(this.benchmarkExpectativaVida())
    
    console.log('📊 Executando benchmark: Validação Cruzada...')
    benchmarks.push(this.benchmarkValidacaoCruzada())
    
    console.log('📊 Executando benchmark: Cálculo Completo...')
    benchmarks.push(this.benchmarkCalculoCompleto())
    
    console.log('📊 Executando benchmark: Interpolação...')
    benchmarks.push(this.benchmarkInterpolacao())
    
    // Análise dos resultados
    const throughputTotal = benchmarks.reduce((acc, b) => acc + b.throughput, 0)
    const operacaoMaisRapida = benchmarks.reduce((prev, curr) => 
      curr.throughput > prev.throughput ? curr : prev
    ).operacao
    const operacaoMaisLenta = benchmarks.reduce((prev, curr) => 
      curr.throughput < prev.throughput ? curr : prev
    ).operacao
    
    const recomendacoes = this.gerarRecomendacoes(benchmarks)
    
    return {
      dataExecucao: new Date(),
      ambiente: {
        nodejs: process.version,
        plataforma: process.platform,
        arquitetura: process.arch
      },
      benchmarks,
      resumo: {
        operacaoMaisRapida,
        operacaoMaisLenta,
        throughputTotal,
        recomendacoes
      }
    }
  }

  /**
   * Gera recomendações baseadas nos resultados
   */
  private gerarRecomendacoes(benchmarks: ResultadoBenchmark[]): string[] {
    const recomendacoes: string[] = []
    
    benchmarks.forEach(benchmark => {
      if (benchmark.throughput < 100) { // Menos de 100 ops/segundo
        recomendacoes.push(
          `⚠️ ${benchmark.operacao}: Performance baixa (${benchmark.throughput.toFixed(1)} ops/s). Considere otimização.`
        )
      }
      
      if (benchmark.tempoMaximo > benchmark.tempoMedio * 5) {
        recomendacoes.push(
          `📊 ${benchmark.operacao}: Alta variabilidade detectada. Considere cache ou memoização.`
        )
      }
      
      if (benchmark.throughput > 1000) {
        recomendacoes.push(
          `✅ ${benchmark.operacao}: Performance excelente (${benchmark.throughput.toFixed(1)} ops/s).`
        )
      }
    })
    
    // Recomendações gerais
    const mediaGeral = benchmarks.reduce((acc, b) => acc + b.throughput, 0) / benchmarks.length
    
    if (mediaGeral < 200) {
      recomendacoes.push('🔧 Performance geral baixa. Considere implementar cache de resultados.')
    }
    
    if (mediaGeral > 500) {
      recomendacoes.push('🎯 Performance geral excelente. Sistema otimizado adequadamente.')
    }
    
    return recomendacoes
  }

  /**
   * Gera relatório formatado
   */
  public gerarRelatorioFormatado(relatorio: RelatorioPerformance): string {
    let texto = `# 📊 Relatório de Performance - Cálculos Atuariais\n\n`
    texto += `**Data:** ${relatorio.dataExecucao.toLocaleString('pt-BR')}\n`
    texto += `**Ambiente:** Node.js ${relatorio.ambiente.nodejs} (${relatorio.ambiente.plataforma}/${relatorio.ambiente.arquitetura})\n\n`
    
    texto += `## 🚀 Resultados dos Benchmarks\n\n`
    texto += `| Operação | Throughput (ops/s) | Tempo Médio (ms) | Min/Max (ms) |\n`
    texto += `|----------|-------------------|------------------|---------------|\n`
    
    relatorio.benchmarks.forEach(benchmark => {
      texto += `| ${benchmark.operacao} | ${benchmark.throughput.toFixed(1)} | ${benchmark.tempoMedio.toFixed(3)} | ${benchmark.tempoMinimo.toFixed(3)}/${benchmark.tempoMaximo.toFixed(3)} |\n`
    })
    
    texto += `\n## 📈 Resumo Executivo\n\n`
    texto += `- **Operação Mais Rápida:** ${relatorio.resumo.operacaoMaisRapida}\n`
    texto += `- **Operação Mais Lenta:** ${relatorio.resumo.operacaoMaisLenta}\n`
    texto += `- **Throughput Total:** ${relatorio.resumo.throughputTotal.toFixed(1)} ops/s\n\n`
    
    texto += `## 💡 Recomendações\n\n`
    relatorio.resumo.recomendacoes.forEach(rec => {
      texto += `- ${rec}\n`
    })
    
    texto += `\n## 🔧 Detalhes Técnicos\n\n`
    relatorio.benchmarks.forEach(benchmark => {
      texto += `### ${benchmark.operacao}\n`
      texto += `- **Iterações:** ${benchmark.iteracoes.toLocaleString()}\n`
      texto += `- **Tempo Total:** ${benchmark.tempoExecucao.toFixed(2)}ms\n`
      texto += `- **Tempo Médio:** ${benchmark.tempoMedio.toFixed(3)}ms\n`
      texto += `- **Desvio:** ${((benchmark.tempoMaximo - benchmark.tempoMinimo) / benchmark.tempoMedio * 100).toFixed(1)}%\n`
      texto += `- **Throughput:** ${benchmark.throughput.toFixed(1)} operações/segundo\n\n`
    })
    
    return texto
  }
}

/**
 * Cache para otimização de cálculos repetitivos
 */
export class CacheCalculosAtuariais {
  private static cache = new Map<string, any>()
  private static maxSize = 1000
  
  /**
   * Gera chave de cache
   */
  private static gerarChave(operacao: string, parametros: any): string {
    return `${operacao}:${JSON.stringify(parametros)}`
  }
  
  /**
   * Obtém valor do cache
   */
  public static obter<T>(operacao: string, parametros: any): T | undefined {
    const chave = this.gerarChave(operacao, parametros)
    return this.cache.get(chave)
  }
  
  /**
   * Armazena valor no cache
   */
  public static armazenar<T>(operacao: string, parametros: any, valor: T): void {
    const chave = this.gerarChave(operacao, parametros)
    
    // Limita tamanho do cache
    if (this.cache.size >= this.maxSize) {
      const iterator = this.cache.keys()
      const primeiraChave = iterator.next().value
      if (primeiraChave) {
        this.cache.delete(primeiraChave)
      }
    }
    
    this.cache.set(chave, valor)
  }
  
  /**
   * Limpa cache
   */
  public static limpar(): void {
    this.cache.clear()
  }
  
  /**
   * Obtém estatísticas do cache
   */
  public static estatisticas() {
    return {
      tamanho: this.cache.size,
      tamanhoMaximo: this.maxSize,
      utilizacao: (this.cache.size / this.maxSize * 100).toFixed(1) + '%'
    }
  }
}

/**
 * Decorator para cache automático
 */
export function cacheable(operacao: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value
    
    descriptor.value = function (...args: any[]) {
      // Tenta obter do cache
      const cached = CacheCalculosAtuariais.obter(operacao, args)
      if (cached !== undefined) {
        return cached
      }
      
      // Executa cálculo
      const resultado = method.apply(this, args)
      
      // Armazena no cache
      CacheCalculosAtuariais.armazenar(operacao, args, resultado)
      
      return resultado
    }
    
    return descriptor
  }
}
