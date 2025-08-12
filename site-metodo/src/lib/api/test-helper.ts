import { cepService } from '@/lib/api/services/cep-simple'
import { exchangeService } from '@/lib/api/services/exchange-simple'
import { apiMonitor } from '@/lib/api/monitor-simple'
import { apiCache } from '@/lib/api/cache-simple'

// Types for test results
interface BulkTestResult {
  success: boolean;
  total?: number;
  found?: number;
  results?: unknown[];
  error?: string;
}

/**
 * Utilitário para testar a infraestrutura de APIs externas
 */
export class ApiTestHelper {
  /**
   * Testa o serviço de CEP com múltiplos provedores
   */
  static async testCepService() {
    console.log('🧪 Testando serviço de CEP...')

    const testCeps = ['01310-100', '04038-001', '20040-020']
    const providers = ['viacep', 'brasilapi', 'awesomeapi'] as const

    const results = {
      individual: [] as unknown[],
      bulk: null as BulkTestResult | null,
      validation: [] as unknown[],
    }

    // Teste individual por provedor
    for (const cep of testCeps) {
      for (const provider of providers) {
        try {
          console.log(`  📍 Testando CEP ${cep} com ${provider}...`)
          const result = await cepService.lookup(cep.replace('-', ''), { provider })

          results.individual.push({
            cep,
            provider,
            success: !!result,
            data: result,
          })

          if (result) {
            console.log(`    ✅ ${provider}: ${result.logradouro}, ${result.localidade}`)
          } else {
            console.log(`    ❌ ${provider}: Falhou`)
          }
        } catch (_error) {
          console.log(`    💥 ${provider}: Erro - ${_error}`)
          results.individual.push({
            cep,
            provider,
            success: false,
            error: _error instanceof Error ? _error.message : 'Unknown error',
          })
        }
      }
    }

    // Teste bulk
    try {
      console.log('  📦 Testando busca em lote...')
      const bulkResults = await cepService.bulkLookup(testCeps.map(cep => cep.replace('-', '')))

      results.bulk = {
        success: true,
        total: testCeps.length,
        found: bulkResults.filter(r => r !== null).length,
        results: bulkResults,
      }

      console.log(`    ✅ Bulk: ${results.bulk.found}/${results.bulk.total} encontrados`)
    } catch (_error) {
      console.log(`    💥 Bulk: ${_error}`)
      results.bulk = {
        success: false,
        error: _error instanceof Error ? _error.message : 'Unknown error',
      }
    }

    // Teste de validação
    const testValidation = ['01310-100', '01310100', '123', 'invalid', '00000-000']
    for (const cep of testValidation) {
      const isValid = cepService.isValidCep(cep)
      results.validation.push({
        cep,
        valid: isValid,
      })
      console.log(`  🔍 Validação ${cep}: ${isValid ? '✅' : '❌'}`)
    }

    return results
  }

  /**
   * Testa o serviço de câmbio
   */
  static async testExchangeService() {
    console.log('🧪 Testando serviço de câmbio...')

    const testPairs = [
      { from: 'USD', to: 'BRL' },
      { from: 'EUR', to: 'BRL' },
      { from: 'BRL', to: 'USD' },
    ]

    const providers = ['exchangerate-api', 'awesomeapi'] as const

    const results = {
      rates: [] as unknown[],
      conversions: [] as unknown[],
      trends: [] as unknown[],
    }

    // Teste de taxas por provedor
    for (const pair of testPairs) {
      for (const provider of providers) {
        try {
          console.log(`  💱 Testando ${pair.from}→${pair.to} com ${provider}...`)
          const rate = await exchangeService.getRate(pair.from, pair.to, { provider })

          results.rates.push({
            ...pair,
            provider,
            success: !!rate,
            rate,
          })

          if (rate) {
            console.log(`    ✅ ${provider}: 1 ${pair.from} = ${rate} ${pair.to}`)
          } else {
            console.log(`    ❌ ${provider}: Falhou`)
          }
        } catch (_error) {
          console.log(`    💥 ${provider}: ${_error}`)
          results.rates.push({
            ...pair,
            provider,
            success: false,
            error: _error instanceof Error ? _error.message : 'Unknown error',
          })
        }
      }
    }

    // Teste de conversões
    const testConversions = [
      { amount: 100, from: 'USD', to: 'BRL' },
      { amount: 50, from: 'EUR', to: 'BRL' },
    ]

    for (const conversion of testConversions) {
      try {
        console.log(
          `  🔄 Convertendo ${conversion.amount} ${conversion.from} → ${conversion.to}...`
        )
        const result = await exchangeService.convert(
          conversion.amount,
          conversion.from,
          conversion.to
        )

        results.conversions.push({
          ...conversion,
          success: !!result,
          result,
        })

        if (result) {
          console.log(
            `    ✅ ${conversion.amount} ${conversion.from} = ${result.converted} ${conversion.to}`
          )
        } else {
          console.log(`    ❌ Conversão falhou`)
        }
      } catch (_error) {
        console.log(`    💥 Conversão: ${_error}`)
        results.conversions.push({
          ...conversion,
          success: false,
          error: _error instanceof Error ? _error.message : 'Unknown error',
        })
      }
    }

    // Teste de tendências
    try {
      console.log('  📈 Testando tendências USD/BRL...')
      const trends = await exchangeService.getTrends('USD')

      results.trends.push({
        currency: 'USD',
        days: 7,
        success: !!trends,
        trends,
      })

      if (trends) {
        console.log(`    ✅ Tendências: ${Object.keys(trends).length} métricas`)
      } else {
        console.log(`    ❌ Tendências: Falhou`)
      }
    } catch (_error) {
      console.log(`    💥 Tendências: ${_error}`)
      results.trends.push({
        currency: 'USD',
        days: 7,
        success: false,
        error: _error instanceof Error ? _error.message : 'Unknown error',
      })
    }

    return results
  }

  /**
   * Testa o sistema de monitoramento
   */
  static async testMonitoring() {
    console.log('🧪 Testando sistema de monitoramento...')

    const results = {
      registration: [] as unknown[],
      healthChecks: [] as unknown[],
      metrics: null as unknown,
      cache: null as unknown,
    }

    // Registrar endpoints de teste
    const testEndpoints = [
      { name: 'test-api-1', url: 'https://jsonplaceholder.typicode.com/posts/1', method: 'GET' },
      { name: 'test-api-2', url: 'https://httpbin.org/delay/1', method: 'GET' },
    ]

    for (const endpoint of testEndpoints) {
      try {
        console.log(`  📋 Registrando endpoint ${endpoint.name}...`)
        apiMonitor.registerEndpoint(endpoint.name, endpoint.url, endpoint.method)

        results.registration.push({
          ...endpoint,
          success: true,
        })

        console.log(`    ✅ Endpoint ${endpoint.name} registrado`)
      } catch (_error) {
        console.log(`    💥 Registro: ${_error}`)
        results.registration.push({
          ...endpoint,
          success: false,
          error: _error instanceof Error ? _error.message : 'Unknown error',
        })
      }
    }

    // Fazer health checks
    for (const endpoint of testEndpoints) {
      try {
        console.log(`  🏥 Health check ${endpoint.name}...`)
        const healthResult = await apiMonitor.healthCheck(endpoint.name)

        results.healthChecks.push({
          name: endpoint.name,
          success: true,
          result: healthResult,
        })

        console.log(
          `    ${healthResult.healthy ? '✅' : '❌'} ${endpoint.name}: ${healthResult.responseTime}ms`
        )
      } catch (_error) {
        console.log(`    💥 Health check: ${_error}`)
        results.healthChecks.push({
          name: endpoint.name,
          success: false,
          error: _error instanceof Error ? _error.message : 'Unknown error',
        })
      }
    }

    // Verificar métricas do sistema
    try {
      console.log('  📊 Coletando métricas do sistema...')
      const systemMetrics = apiMonitor.getSystemMetrics()
      const allMetrics = apiMonitor.getAllMetrics()

      results.metrics = {
        success: true,
        system: systemMetrics,
        endpoints: allMetrics,
      }

      console.log(`    ✅ Métricas: ${allMetrics.length} endpoints monitorados`)
    } catch (_error) {
      console.log(`    💥 Métricas: ${_error}`)
      results.metrics = {
        success: false,
        error: _error instanceof Error ? _error.message : 'Unknown error',
      }
    }

    // Verificar cache
    try {
      console.log('  🗄️ Testando sistema de cache...')

      // Teste básico de cache
      apiCache.normal.set('test-key', { test: 'data' }, 60)
      const cached = apiCache.normal.get('test-key')

      const stats = {
        normal: apiCache.normal.getStats(),
        fast: apiCache.fast.getStats(),
        persistent: apiCache.persistent.getStats(),
      }

      results.cache = {
        success: true,
        testResult: cached,
        stats,
      }

      console.log(`    ✅ Cache funcionando: ${cached ? 'dados recuperados' : 'falhou'}`)
    } catch (_error) {
      console.log(`    💥 Cache: ${_error}`)
      results.cache = {
        success: false,
        error: _error instanceof Error ? _error.message : 'Unknown error',
      }
    }

    return results
  }

  /**
   * Executa todos os testes de forma sequencial
   */
  static async runAllTests() {
    console.log('🚀 Iniciando testes completos da infraestrutura de APIs...\n')

    const startTime = Date.now()

    const results = {
      cep: null as unknown,
      exchange: null as unknown,
      monitoring: null as unknown,
      summary: {
        duration: 0,
        totalTests: 0,
        successfulTests: 0,
        failedTests: 0,
      },
    }

    try {
      // Teste CEP
      results.cep = await this.testCepService()
      console.log('')

      // Teste Exchange
      results.exchange = await this.testExchangeService()
      console.log('')

      // Teste Monitoring
      results.monitoring = await this.testMonitoring()
      console.log('')
    } catch (_error) {
      console.error('💥 Erro durante os testes:', String(_error))
    }

    // Calcular resumo
    const endTime = Date.now()
    results.summary.duration = endTime - startTime

    // Contar sucessos e falhas
    const countResults = (obj: Record<string, unknown>): { success: number; failed: number } => {
      let success = 0
      let failed = 0

      const traverse = (item: Record<string, unknown>) => {
        if (Array.isArray(item)) {
          item.forEach((subItem) => traverse(subItem as Record<string, unknown>))
        } else if (item && typeof item === 'object') {
          if ('success' in item) {
            if (item.success) success++
            else failed++
          } else {
            Object.values(item).forEach((value) => traverse(value as Record<string, unknown>))
          }
        }
      }

      traverse(obj)
      return { success, failed }
    }

    const counts = countResults(results)
    results.summary.successfulTests = counts.success
    results.summary.failedTests = counts.failed
    results.summary.totalTests = counts.success + counts.failed

    console.log('📋 RESUMO DOS TESTES:')
    console.log(`   ⏱️  Duração: ${results.summary.duration}ms`)
    console.log(`   ✅ Sucessos: ${results.summary.successfulTests}`)
    console.log(`   ❌ Falhas: ${results.summary.failedTests}`)
    console.log(`   📊 Total: ${results.summary.totalTests}`)
    console.log(
      `   📈 Taxa de sucesso: ${((results.summary.successfulTests / results.summary.totalTests) * 100).toFixed(1)}%`
    )

    return results
  }
}
