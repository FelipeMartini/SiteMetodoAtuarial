import { z } from 'zod'

const ExchangeRatesSchema = z.object({
  base: z.string(),
  date: z.string(),
  rates: z.record(z.string(), z.number()),
  timestamp: z.number().optional(),
})

export type ExchangeRates = z.infer<typeof ExchangeRatesSchema>

export interface ExchangeOptions {
  provider?: 'exchangerate-api' | 'awesomeapi'
  forceRefresh?: boolean
  timeout?: number
}

export interface ConversionResult {
  from: string
  to: string
  amount: number
  rate: number
  converted: number
  timestamp: string
}

/**
 * Serviço para cotações de moedas com múltiplos provedores - versão servidor
 */
export class ExchangeService {
  private async simpleFetch(url: string, timeout = 5000): Promise<any> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SiteMetodoAtuarial/1.0)',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return await response.json()
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Obter taxa de câmbio entre duas moedas
   */
  async getRate(from: string, to: string, options: ExchangeOptions = {}): Promise<number | null> {
    const { provider = 'exchangerate-api' } = options

    try {
      if (provider === 'exchangerate-api') {
        return await this.getRateFromExchangeRateApi(from, to)
      } else {
        return await this.getRateFromAwesomeApi(from, to)
      }
    } catch (_error) {
      console.warn(`Falha no provedor ${provider}:`, _error)

      // Fallback para o outro provedor
      try {
        const fallbackProvider = provider === 'exchangerate-api' ? 'awesomeapi' : 'exchangerate-api'
        if (fallbackProvider === 'exchangerate-api') {
          return await this.getRateFromExchangeRateApi(from, to)
        } else {
          return await this.getRateFromAwesomeApi(from, to)
        }
      } catch (fallbackError) {
        console.error('Falha em todos os provedores:', fallbackError)
        return null
      }
    }
  }

  /**
   * Converter valor entre moedas
   */
  async convert(
    amount: number,
    from: string,
    to: string,
    options: ExchangeOptions = {}
  ): Promise<ConversionResult | null> {
    const rate = await this.getRate(from, to, options)

    if (!rate) {
      return null
    }

    return {
      from,
      to,
      amount,
      rate,
      converted: amount * rate,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Obter múltiplas taxas de câmbio
   */
  async getMultipleRates(
    base: string,
    targets: string[],
    options: ExchangeOptions = {}
  ): Promise<Record<string, number | null>> {
    const results = await Promise.allSettled(
      targets.map(async target => {
        const rate = await this.getRate(base, target, options)
        return { target, rate }
      })
    )

    const rates: Record<string, number | null> = {}
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        rates[result.value.target] = result.value.rate
      }
    })

    return rates
  }

  /**
   * Obter tendências (simulado - versão simplificada)
   */
  async getTrends(currency: string, days: number = 30): Promise<any> {
    // Para uma implementação real, você precisaria de dados históricos
    // Por enquanto, retornamos dados simulados
    const currentRate = await this.getRate(currency, 'BRL')

    if (!currentRate) {
      return null
    }

    return {
      current: currentRate,
      change24h: (Math.random() - 0.5) * 0.1 * currentRate, // Variação simulada
      changePercent24h: (Math.random() - 0.5) * 5, // Percentual simulado
      high24h: currentRate * (1 + Math.random() * 0.05),
      low24h: currentRate * (1 - Math.random() * 0.05),
      volume: Math.random() * 1000000,
    }
  }

  /**
   * ExchangeRate-API
   */
  private async getRateFromExchangeRateApi(from: string, to: string): Promise<number> {
    const data = await this.simpleFetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
    const parsed = ExchangeRatesSchema.parse(data)

    if (!parsed.rates[to]) {
      throw new Error(`Taxa não encontrada para ${from} -> ${to}`)
    }

    return parsed.rates[to]
  }

  /**
   * AwesomeAPI
   */
  private async getRateFromAwesomeApi(from: string, to: string): Promise<number> {
    const pair = `${from}-${to}`
    const data = await this.simpleFetch(`https://economia.awesomeapi.com.br/json/last/${pair}`)

    const key = pair.replace('-', '')
    if (!data[key]) {
      throw new Error(`Par de moedas não encontrado: ${pair}`)
    }

    const rate = parseFloat(data[key].bid)
    if (isNaN(rate)) {
      throw new Error('Taxa inválida recebida da API')
    }

    return rate
  }

  /**
   * Obter cotações brasileiras populares
   */
  async getBrazilianRates(currencies: string[] = ['USD', 'EUR', 'ARS']): Promise<
    Array<{
      currency: string
      name: string
      buy: number
      sell: number
      variation: number
      percentChange: number
      high: number
      low: number
      timestamp: string
    }>
  > {
    const results = await Promise.allSettled(
      currencies.map(async currency => {
        try {
          const pair = `${currency}-BRL`
          const data = await this.simpleFetch(`https://economia.awesomeapi.com.br/json/last/${pair}`)
          const key = pair.replace('-', '')
          const currencyData = data[key]

          return {
            currency,
            name: currencyData.name || currency,
            buy: parseFloat(currencyData.bid),
            sell: parseFloat(currencyData.ask),
            variation: parseFloat(currencyData.varBid),
            percentChange: parseFloat(currencyData.pctChange),
            high: parseFloat(currencyData.high),
            low: parseFloat(currencyData.low),
            timestamp: currencyData.create_date,
          }
        } catch (_error) {
          console.warn(`Erro ao buscar ${currency}:`, _error)
          return null
        }
      })
    )

    return results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => (result as PromiseFulfilledResult<any>).value)
  }
}

// Instância singleton
export const exchangeService = new ExchangeService()
