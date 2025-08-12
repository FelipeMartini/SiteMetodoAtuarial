import { z } from 'zod'
import { createApiClient } from '../client'

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
 * Serviço para cotações de moedas com múltiplos provedores
 */
export class ExchangeService {
  private exchangeRateClient = createApiClient({
    baseURL: 'https://api.exchangerate-api.com/v4',
    timeout: 5000,
    rateLimitRpm: 1500, // Free tier: 1500 requests/month
  })

  private awesomeApiClient = createApiClient({
    baseURL: 'https://economia.awesomeapi.com.br/json',
    timeout: 5000,
    rateLimitRpm: 300,
  })

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
    const response = await this.exchangeRateClient.get(`/latest/${from}`)
    const data = ExchangeRatesSchema.parse(response.data)

    if (!data.rates[to]) {
      throw new Error(`Taxa não encontrada para ${from} -> ${to}`)
    }

    return data.rates[to]
  }

  /**
   * AwesomeAPI
   */
  private async getRateFromAwesomeApi(from: string, to: string): Promise<number> {
    const pair = `${from}-${to}`
    const response = await this.awesomeApiClient.get(`/last/${pair}`)

    const key = pair.replace('-', '')
    if (!response.data[key]) {
      throw new Error(`Par de moedas não encontrado: ${pair}`)
    }

    const rate = parseFloat(response.data[key].bid)
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
          const response = await this.awesomeApiClient.get(`/last/${pair}`)
          const key = pair.replace('-', '')
          const data = response.data[key]

          return {
            currency,
            name: data.name || currency,
            buy: parseFloat(data.bid),
            sell: parseFloat(data.ask),
            variation: parseFloat(data.varBid),
            percentChange: parseFloat(data.pctChange),
            high: parseFloat(data.high),
            low: parseFloat(data.low),
            timestamp: data.create_date,
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
