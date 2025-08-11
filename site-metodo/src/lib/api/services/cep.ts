'use client'

import { z } from 'zod'
import { ApiClient, createApiClient } from '../client'
import { apiMonitor } from '../monitor-simple'

// Type definitions for CEP API
export interface CepData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export interface CepError {
  erro: boolean
  message?: string
}

// Zod schemas for validation
const CepSchema = z.object({
  cep: z.string(),
  logradouro: z.string(),
  complemento: z.string().optional().default(''),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string().length(2),
  ibge: z.string().optional().default(''),
  gia: z.string().optional().default(''),
  ddd: z.string().optional().default(''),
  siafi: z.string().optional().default(''),
})

const CepErrorSchema = z.object({
  erro: z.boolean(),
  message: z.string().optional(),
})

/**
 * Service for CEP (Brazilian postal code) lookup
 * Features: Multiple providers, validation, caching, fallback
 */
export class CepService {
  private viaCepClient: ApiClient
  private brasilApiClient: ApiClient
  private awesomeApiClient: ApiClient

  constructor() {
    // ViaCEP - Primary provider
    this.viaCepClient = createApiClient({
      baseURL: 'https://viacep.com.br/ws',
      timeout: 5000,
      rateLimitRpm: 120,
    })

    // BrasilAPI - Secondary provider
    this.brasilApiClient = createApiClient({
      baseURL: 'https://brasilapi.com.br/api',
      timeout: 5000,
      rateLimitRpm: 60,
    })

    // AwesomeAPI - Tertiary provider
    this.awesomeApiClient = createApiClient({
      baseURL: 'https://cep.awesomeapi.com.br',
      timeout: 5000,
      rateLimitRpm: 100,
    })

    // Register endpoints for monitoring
    apiMonitor.registerEndpoint('viacep', 'https://viacep.com.br/ws', 'GET')
    apiMonitor.registerEndpoint('brasilapi-cep', 'https://brasilapi.com.br/api/cep/v1', 'GET')
    apiMonitor.registerEndpoint('awesomeapi-cep', 'https://cep.awesomeapi.com.br/json', 'GET')
  }

  /**
   * Validate CEP format
   */
  private validateCepFormat(cep: string): boolean {
    const cleanCep = cep.replace(/\D/g, '')
    return cleanCep.length === 8 && /^\d{8}$/.test(cleanCep)
  }

  /**
   * Clean and format CEP
   */
  private formatCep(cep: string): string {
    return cep.replace(/\D/g, '')
  }

  /**
   * Lookup CEP using ViaCEP (primary provider)
   */
  private async lookupViaCep(cep: string): Promise<CepData> {
    const response = await this.viaCepClient.get(`/${cep}/json/`)

    if (response.data.erro) {
      throw new Error('CEP não encontrado')
    }

    return CepSchema.parse(response.data)
  }

  /**
   * Lookup CEP using BrasilAPI (secondary provider)
   */
  private async lookupBrasilApi(cep: string): Promise<CepData> {
    const response = await this.brasilApiClient.get(`/cep/v1/${cep}`)

    // Convert BrasilAPI format to standard format
    const data = {
      cep: response.data.cep,
      logradouro: response.data.street || '',
      complemento: '',
      bairro: response.data.district || '',
      localidade: response.data.city || '',
      uf: response.data.state || '',
      ibge: response.data.city_ibge || '',
      gia: '',
      ddd: '',
      siafi: '',
    }

    return CepSchema.parse(data)
  }

  /**
   * Lookup CEP using AwesomeAPI (tertiary provider)
   */
  private async lookupAwesomeApi(cep: string): Promise<CepData> {
    const response = await this.awesomeApiClient.get(`/json/${cep}`)

    if (response.data.status === 400) {
      throw new Error('CEP não encontrado')
    }

    // Convert AwesomeAPI format to standard format
    const data = {
      cep: response.data.cep,
      logradouro: response.data.address || '',
      complemento: '',
      bairro: response.data.district || '',
      localidade: response.data.city || '',
      uf: response.data.state || '',
      ibge: response.data.city_ibge || '',
      gia: '',
      ddd: response.data.ddd || '',
      siafi: '',
    }

    return CepSchema.parse(data)
  }

  /**
   * Main CEP lookup method with fallback providers
   */
  async lookupCep(cep: string): Promise<CepData> {
    if (!this.validateCepFormat(cep)) {
      throw new Error('CEP deve conter exatamente 8 dígitos')
    }

    const cleanCep = this.formatCep(cep)
    const providers = [
      { name: 'ViaCEP', method: () => this.lookupViaCep(cleanCep) },
      { name: 'BrasilAPI', method: () => this.lookupBrasilApi(cleanCep) },
      { name: 'AwesomeAPI', method: () => this.lookupAwesomeApi(cleanCep) },
    ]

    let lastError: Error | null = null

    for (const provider of providers) {
      try {
        const result = await provider.method()

        // Format the result CEP with mask
        result.cep = this.addCepMask(result.cep)

        return result
      } catch (_error) {
        lastError = error instanceof Error ? error : new Error('Erro desconhecido')
        console.warn(`Falha ao consultar ${provider.name}:`, lastError.message)
        continue
      }
    }

    throw lastError || new Error('Falha em todos os provedores de CEP')
  }

  /**
   * Bulk CEP lookup (with rate limiting)
   */
  async lookupMultipleCeps(ceps: string[]): Promise<
    Array<{
      cep: string
      data?: CepData
      error?: string
    }>
  > {
    const results: Array<{
      cep: string
      data?: CepData
      error?: string
    }> = []

    // Process in batches to respect rate limits
    const batchSize = 5

    for (let i = 0; i < ceps.length; i += batchSize) {
      const batch = ceps.slice(i, i + batchSize)

      const batchPromises = batch.map(async cep => {
        try {
          const data = await this.lookupCep(cep)
          return { cep, data }
        } catch (_error) {
          return {
            cep,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Wait between batches to respect rate limits
      if (i + batchSize < ceps.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return results
  }

  /**
   * Search for addresses by city and state
   */
  async searchAddresses(uf: string, city: string, street?: string): Promise<CepData[]> {
    if (uf.length !== 2) {
      throw new Error('UF deve conter exatamente 2 caracteres')
    }

    if (city.length < 3) {
      throw new Error('Nome da cidade deve conter pelo menos 3 caracteres')
    }

    let url = `/${uf}/${encodeURIComponent(city)}`

    if (street && street.length >= 3) {
      url += `/${encodeURIComponent(street)}`
    }

    url += '/json/'

    const response = await this.viaCepClient.get(url)

    if (!Array.isArray(response.data) || response.data.length === 0) {
      throw new Error('Nenhum endereço encontrado')
    }

    // Validate and format all results
    return response.data.map((item: Record<string, unknown>) => {
      const validated = CepSchema.parse(item)
      validated.cep = this.addCepMask(validated.cep)
      return validated
    })
  }

  /**
   * Add mask to CEP (12345678 -> 12345-678)
   */
  private addCepMask(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length === 8) {
      return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`
    }
    return cep
  }

  /**
   * Remove mask from CEP (12345-678 -> 12345678)
   */
  static removeCepMask(cep: string): string {
    return cep.replace(/\D/g, '')
  }

  /**
   * Validate if CEP exists (lightweight check)
   */
  async validateCep(cep: string): Promise<boolean> {
    try {
      await this.lookupCep(cep)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get cached CEP data if available
   */
  getCachedCep(cep: string): CepData | null {
    const cleanCep = this.formatCep(cep)
    const cacheKey = `CepService.lookupViaCep.${cleanCep}`
    return apiCache.normal.get(cacheKey)
  }

  /**
   * Clear CEP cache
   */
  clearCache(): void {
    apiCache.normal.invalidatePattern(/CepService\./)
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{
    viaCep: { healthy: boolean; responseTime: number }
    brasilApi: { healthy: boolean; responseTime: number }
    awesomeApi: { healthy: boolean; responseTime: number }
  }> {
    const [viaCep, brasilApi, awesomeApi] = await Promise.allSettled([
      apiMonitor.healthCheck('viacep'),
      apiMonitor.healthCheck('brasilapi-cep'),
      apiMonitor.healthCheck('awesomeapi-cep'),
    ])

    return {
      viaCep: viaCep.status === 'fulfilled' ? viaCep.value : { healthy: false, responseTime: 0 },
      brasilApi:
        brasilApi.status === 'fulfilled' ? brasilApi.value : { healthy: false, responseTime: 0 },
      awesomeApi:
        awesomeApi.status === 'fulfilled' ? awesomeApi.value : { healthy: false, responseTime: 0 },
    }
  }
}

// Export singleton instance
export const cepService = new CepService()

export default CepService
