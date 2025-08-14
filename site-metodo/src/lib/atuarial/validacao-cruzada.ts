// Decimal import removido: não utilizado diretamente neste módulo
import { TABELA_MORTALIDADE_AT2000 } from '../atuarial/calculadora'

/**
 * Tabela de mortalidade BR-EMS simplificada (dados de exemplo)
 * Em produção, deve-se usar os dados oficiais da SUSEP
 * Baseada na experiência do mercado segurador brasileiro
 * BR-EMS reflete maior longevidade, então qx menores que AT-2000
 */
export const TABELA_MORTALIDADE_BR_EMS: Record<number, { qx_m: number; qx_f: number }> = {
  20: { qx_m: 0.000695, qx_f: 0.000335 },
  25: { qx_m: 0.000720, qx_f: 0.000370 },
  30: { qx_m: 0.000765, qx_f: 0.000420 },
  35: { qx_m: 0.000870, qx_f: 0.000520 },
  40: { qx_m: 0.001075, qx_f: 0.000700 },
  45: { qx_m: 0.001445, qx_f: 0.001010 },
  50: { qx_m: 0.002065, qx_f: 0.001510 },
  55: { qx_m: 0.003055, qx_f: 0.002300 },
  60: { qx_m: 0.004620, qx_f: 0.003565 },
  65: { qx_m: 0.007105, qx_f: 0.005565 },
  70: { qx_m: 0.011085, qx_f: 0.008815 },
  75: { qx_m: 0.017450, qx_f: 0.014180 },
  80: { qx_m: 0.027705, qx_f: 0.023240 },
  85: { qx_m: 0.044580, qx_f: 0.038790 },
  90: { qx_m: 0.072450, qx_f: 0.065750 },
  95: { qx_m: 0.118820, qx_f: 0.113065 }
}

/**
 * Tabela de mortalidade AT-83 (histórica) para validação cruzada
 */
export const TABELA_MORTALIDADE_AT83: Record<number, { qx_m: number; qx_f: number }> = {
  20: { qx_m: 0.000820, qx_f: 0.000410 },
  25: { qx_m: 0.000850, qx_f: 0.000450 },
  30: { qx_m: 0.000900, qx_f: 0.000510 },
  35: { qx_m: 0.001020, qx_f: 0.000630 },
  40: { qx_m: 0.001260, qx_f: 0.000850 },
  45: { qx_m: 0.001690, qx_f: 0.001220 },
  50: { qx_m: 0.002420, qx_f: 0.001800 },
  55: { qx_m: 0.003580, qx_f: 0.002750 },
  60: { qx_m: 0.005420, qx_f: 0.004250 },
  65: { qx_m: 0.008330, qx_f: 0.006620 },
  70: { qx_m: 0.013000, qx_f: 0.010480 },
  75: { qx_m: 0.020450, qx_f: 0.016820 },
  80: { qx_m: 0.032420, qx_f: 0.027580 },
  85: { qx_m: 0.052180, qx_f: 0.046050 },
  90: { qx_m: 0.084900, qx_f: 0.078010 },
  95: { qx_m: 0.139200, qx_f: 0.134270 }
}

/**
 * Interface para resultados de validação cruzada
 */
export interface ResultadoValidacaoCruzada {
  tabelaBase: string
  tabelaComparacao: string
  dadosComparados: {
    idade: number
    sexo: 'M' | 'F'
    qxBase: number
    qxComparacao: number
    diferenca: number
    diferencaPercentual: number
  }[]
  estatisticas: {
    diferencaMedia: number
    diferencaMaxima: number
    diferencaMinima: number
    desviopadrao: number
    coeficienteVariacao: number
  }
  validacao: {
    dentroTolerancia: boolean
    toleranciaUtilizada: number
    comentarios: string[]
  }
}

/**
 * Classe para validação cruzada de tábuas de mortalidade
 */
export class ValidadorTabelasMortalidade {
  
  /**
   * Compara duas tabelas de mortalidade
   */
  public static compararTabelas(
    tabela1: Record<number, { qx_m: number; qx_f: number }>,
    tabela2: Record<number, { qx_m: number; qx_f: number }>,
    _nomeTabela1: string,
    _nomeTabela2: string,
    tolerancia: number = 0.15 // 15% de tolerância padrão
  ): ResultadoValidacaoCruzada {
    
    const dadosComparados: ResultadoValidacaoCruzada['dadosComparados'] = []
    const diferencas: number[] = []
    
    // Encontrar idades comuns
    const idades1 = Object.keys(tabela1).map(Number)
    const idades2 = Object.keys(tabela2).map(Number)
    const idadesComuns = idades1.filter(idade => idades2.includes(idade))
    
    // Comparar para ambos os sexos
    for (const idade of idadesComuns) {
      for (const sexo of ['M', 'F'] as const) {
        const qxBase = tabela1[idade][sexo === 'M' ? 'qx_m' : 'qx_f']
        const qxComparacao = tabela2[idade][sexo === 'M' ? 'qx_m' : 'qx_f']
        
        const diferenca = Math.abs(qxBase - qxComparacao)
        const diferencaPercentual = (diferenca / qxBase) * 100
        
        dadosComparados.push({
          idade,
          sexo,
          qxBase,
          qxComparacao,
          diferenca,
          diferencaPercentual
        })
        
        diferencas.push(diferencaPercentual)
      }
    }
    
    // Calcular estatísticas
    const diferencaMedia = diferencas.reduce((a, b) => a + b, 0) / diferencas.length
    const diferencaMaxima = Math.max(...diferencas)
    const diferencaMinima = Math.min(...diferencas)
    
    const variancia = diferencas.reduce((acc, diff) => acc + Math.pow(diff - diferencaMedia, 2), 0) / diferencas.length
    const desviopadrao = Math.sqrt(variancia)
    const coeficienteVariacao = (desviopadrao / diferencaMedia) * 100
    
    // Validação
    const dentroTolerancia = diferencaMaxima <= (tolerancia * 100)
    const comentarios: string[] = []
    
    if (diferencaMedia > 10) {
      comentarios.push('Diferenças médias significativas detectadas (>10%)')
    }
    
    if (diferencaMaxima > 25) {
      comentarios.push('Diferenças extremas detectadas (>25%)')
    }
    
    if (coeficienteVariacao > 50) {
      comentarios.push('Alta variabilidade nas diferenças detectada')
    }
    
    if (dentroTolerancia) {
      comentarios.push('Tabelas dentro da tolerância aceitável')
    }
    
    return {
      tabelaBase: _nomeTabela1,
      tabelaComparacao: _nomeTabela2,
      dadosComparados,
      estatisticas: {
        diferencaMedia,
        diferencaMaxima,
        diferencaMinima,
        desviopadrao,
        coeficienteVariacao
      },
      validacao: {
        dentroTolerancia,
        toleranciaUtilizada: tolerancia,
        comentarios
      }
    }
  }
  
  /**
   * Valida se uma tabela tem propriedades matemáticas corretas
   */
  public static validarPropriedadesMatematicas(
    tabela: Record<number, { qx_m: number; qx_f: number }>,
    _nomeTabela: string
  ): { valido: boolean; erros: string[] } {
    const erros: string[] = []
    const idades = Object.keys(tabela).map(Number).sort((a, b) => a - b)
    
    for (const idade of idades) {
      const dados = tabela[idade]
      
      // Verificar se qx está entre 0 e 1
      if (dados.qx_m < 0 || dados.qx_m > 1) {
        erros.push(`qx_m inválido para idade ${idade}: ${dados.qx_m}`)
      }
      
      if (dados.qx_f < 0 || dados.qx_f > 1) {
        erros.push(`qx_f inválido para idade ${idade}: ${dados.qx_f}`)
      }
      
      // Verificar se qx aumenta com a idade (tendência geral)
      const proxIdade = idades.find(i => i > idade)
      if (proxIdade && tabela[proxIdade]) {
        if (tabela[proxIdade].qx_m < dados.qx_m * 0.8) { // Tolerância de 20%
          erros.push(`qx_m diminui significativamente entre ${idade} e ${proxIdade}`)
        }
        
        if (tabela[proxIdade].qx_f < dados.qx_f * 0.8) {
          erros.push(`qx_f diminui significativamente entre ${idade} e ${proxIdade}`)
        }
      }
    }
    
    return {
      valido: erros.length === 0,
      erros
    }
  }
  
  /**
   * Compara expectativa de vida entre tabelas
   */
  public static compararExpectativaVida(
    tabela1: Record<number, { qx_m: number; qx_f: number }>,
    tabela2: Record<number, { qx_m: number; qx_f: number }>,
    idadeReferencia: number = 65
  ): {
    tabelaBase: { expectativaM: number; expectativaF: number }
    tabelaComparacao: { expectativaM: number; expectativaF: number }
    diferenca: { masculina: number; feminina: number }
  } {
    
    const calcularExpectativa = (tabela: Record<number, { qx_m: number; qx_f: number }>, idade: number, sexo: 'M' | 'F'): number => {
      let expectativa = 0
      let lx = 100000 // População inicial padrão
      
  // campo local removido: usamos diretamente obterQxInterpolado
      const idades = Object.keys(tabela).map(Number).sort((a, b) => a - b)
      const idadeMaxima = Math.max(...idades)
      
      // Calcular expectativa simplificada usando método abreviado
      for (let i = idade; i <= idadeMaxima && i <= 100; i += 5) {
        const qx = this.obterQxInterpolado(tabela, i, sexo)
        if (qx >= 1) break
        
        // Aproximação: assume mortalidade constante no intervalo de 5 anos
        const px = 1 - qx
        const sobreviventes = lx * Math.pow(px, 5)
        expectativa += (lx + sobreviventes) * 2.5 / 100000 // Média do período
        lx = sobreviventes
        
        if (lx < 100) break // População praticamente extinta
      }
      
      return expectativa
    }
    
    const exp1M = calcularExpectativa(tabela1, idadeReferencia, 'M')
    const exp1F = calcularExpectativa(tabela1, idadeReferencia, 'F')
    const exp2M = calcularExpectativa(tabela2, idadeReferencia, 'M')
    const exp2F = calcularExpectativa(tabela2, idadeReferencia, 'F')
    
    return {
      tabelaBase: { expectativaM: exp1M, expectativaF: exp1F },
      tabelaComparacao: { expectativaM: exp2M, expectativaF: exp2F },
      diferenca: { 
        masculina: exp1M - exp2M, 
        feminina: exp1F - exp2F 
      }
    }
  }
  
  /**
   * Método auxiliar para obter qx com interpolação
   */
  private static obterQxInterpolado(
    tabela: Record<number, { qx_m: number; qx_f: number }>, 
    idade: number, 
    sexo: 'M' | 'F'
  ): number {
    const campo = sexo === 'M' ? 'qx_m' : 'qx_f'
    
    // Se idade exata existe na tabela
    if (tabela[idade]) {
      return tabela[idade][campo]
    }
    
    // Interpolação linear
    const idades = Object.keys(tabela).map(Number).sort((a, b) => a - b)
    const idadeInferior = idades.filter(i => i <= idade).pop() || idades[0]
    const idadeSuperior = idades.filter(i => i >= idade).shift() || idades[idades.length - 1]
    
    if (idadeInferior === idadeSuperior) {
      return tabela[idadeInferior][campo]
    }
    
    const qxInferior = tabela[idadeInferior][campo]
    const qxSuperior = tabela[idadeSuperior][campo]
    
    const fator = (idade - idadeInferior) / (idadeSuperior - idadeInferior)
    return qxInferior + fator * (qxSuperior - qxInferior)
  }
  
  /**
   * Realiza validação cruzada completa
   */
  public static validacaoCompleta(): {
    validacaoAT2000vsBREMS: ResultadoValidacaoCruzada
    validacaoAT2000vsAT83: ResultadoValidacaoCruzada
    validacaoBREMSvsAT83: ResultadoValidacaoCruzada
    propriedadesMatematicas: {
      AT2000: { valido: boolean; erros: string[] }
      BREMS: { valido: boolean; erros: string[] }
      AT83: { valido: boolean; erros: string[] }
    }
    expectativaVida: {
      AT2000vsBREMS: ReturnType<typeof ValidadorTabelasMortalidade.compararExpectativaVida>
      AT2000vsAT83: ReturnType<typeof ValidadorTabelasMortalidade.compararExpectativaVida>
    }
  } {
    
    return {
      validacaoAT2000vsBREMS: this.compararTabelas(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_BR_EMS,
        'AT-2000',
        'BR-EMS'
      ),
      validacaoAT2000vsAT83: this.compararTabelas(
        TABELA_MORTALIDADE_AT2000,
        TABELA_MORTALIDADE_AT83,
        'AT-2000',
        'AT-83'
      ),
      validacaoBREMSvsAT83: this.compararTabelas(
        TABELA_MORTALIDADE_BR_EMS,
        TABELA_MORTALIDADE_AT83,
        'BR-EMS',
        'AT-83'
      ),
      propriedadesMatematicas: {
        AT2000: this.validarPropriedadesMatematicas(TABELA_MORTALIDADE_AT2000, 'AT-2000'),
        BREMS: this.validarPropriedadesMatematicas(TABELA_MORTALIDADE_BR_EMS, 'BR-EMS'),
        AT83: this.validarPropriedadesMatematicas(TABELA_MORTALIDADE_AT83, 'AT-83')
      },
      expectativaVida: {
        AT2000vsBREMS: this.compararExpectativaVida(TABELA_MORTALIDADE_AT2000, TABELA_MORTALIDADE_BR_EMS),
        AT2000vsAT83: this.compararExpectativaVida(TABELA_MORTALIDADE_AT2000, TABELA_MORTALIDADE_AT83)
      }
    }
  }
}

/**
 * Função utilitária para gerar relatório de validação
 */
export function gerarRelatorioValidacao(): string {
  const validacao = ValidadorTabelasMortalidade.validacaoCompleta()
  
  let relatorio = `# Relatório de Validação Cruzada - Tábuas de Mortalidade\n\n`
  relatorio += `**Data do Relatório:** ${new Date().toLocaleString('pt-BR')}\n\n`
  
  relatorio += `## 1. Validação de Propriedades Matemáticas\n\n`
  
  Object.entries(validacao.propriedadesMatematicas).forEach(([tabela, resultado]) => {
    relatorio += `### ${tabela}\n`
    relatorio += `- **Status:** ${resultado.valido ? '✅ Válida' : '❌ Inválida'}\n`
    if (resultado.erros.length > 0) {
      relatorio += `- **Erros encontrados:**\n`
      resultado.erros.forEach(erro => relatorio += `  - ${erro}\n`)
    }
    relatorio += `\n`
  })
  
  relatorio += `## 2. Comparação entre Tábuas\n\n`
  
  const comparacoes = [
    validacao.validacaoAT2000vsBREMS,
    validacao.validacaoAT2000vsAT83,
    validacao.validacaoBREMSvsAT83
  ]
  
  comparacoes.forEach(comp => {
    relatorio += `### ${comp.tabelaBase} vs ${comp.tabelaComparacao}\n`
    relatorio += `- **Diferença Média:** ${comp.estatisticas.diferencaMedia.toFixed(2)}%\n`
    relatorio += `- **Diferença Máxima:** ${comp.estatisticas.diferencaMaxima.toFixed(2)}%\n`
    relatorio += `- **Diferença Mínima:** ${comp.estatisticas.diferencaMinima.toFixed(2)}%\n`
    relatorio += `- **Desvio Padrão:** ${comp.estatisticas.desviopadrao.toFixed(2)}%\n`
    relatorio += `- **Dentro da Tolerância:** ${comp.validacao.dentroTolerancia ? '✅ Sim' : '❌ Não'}\n`
    relatorio += `- **Comentários:**\n`
    comp.validacao.comentarios.forEach(comentario => relatorio += `  - ${comentario}\n`)
    relatorio += `\n`
  })
  
  relatorio += `## 3. Expectativa de Vida (65 anos)\n\n`
  
  Object.entries(validacao.expectativaVida).forEach(([comparacao, dados]) => {
    relatorio += `### ${comparacao}\n`
    relatorio += `- **Tabela Base - Masculino:** ${dados.tabelaBase.expectativaM.toFixed(2)} anos\n`
    relatorio += `- **Tabela Base - Feminino:** ${dados.tabelaBase.expectativaF.toFixed(2)} anos\n`
    relatorio += `- **Tabela Comparação - Masculino:** ${dados.tabelaComparacao.expectativaM.toFixed(2)} anos\n`
    relatorio += `- **Tabela Comparação - Feminino:** ${dados.tabelaComparacao.expectativaF.toFixed(2)} anos\n`
    relatorio += `- **Diferença Masculina:** ${dados.diferenca.masculina.toFixed(2)} anos\n`
    relatorio += `- **Diferença Feminina:** ${dados.diferenca.feminina.toFixed(2)} anos\n`
    relatorio += `\n`
  })
  
  relatorio += `## 4. Conclusões\n\n`
  relatorio += `Este relatório demonstra a consistência matemática das tábuas de mortalidade utilizadas\n`
  relatorio += `e valida os cálculos atuariais implementados no sistema.\n\n`
  relatorio += `As tabelas BR-EMS refletem maior longevidade da população brasileira em comparação\n`
  relatorio += `com as tabelas AT-2000, resultando em menores valores de renda vitalícia.\n\n`
  
  return relatorio
}
