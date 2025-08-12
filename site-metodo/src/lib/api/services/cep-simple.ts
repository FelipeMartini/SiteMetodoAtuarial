import { z } from 'zod'

const CepDataSchema = z.object({
  cep: z.string(),
  logradouro: z.string(),
  complemento: z.string().optional(),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string(),
  ibge: z.string().optional(),
  gia: z.string().optional(),
  ddd: z.string().optional(),
  siafi: z.string().optional(),
})

export type CepData = z.infer<typeof CepDataSchema>

export interface CepLookupOptions {
  provider?: 'viacep' | 'brasilapi' | 'awesomeapi'
  forceRefresh?: boolean
  timeout?: number
}

/**
 * Serviço para consulta de CEP com múltiplos provedores - versão servidor
 */
export class CepService {
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
   * Busca CEP em múltiplos provedores com fallback
   */
  async lookup(cep: string, options: CepLookupOptions = {}): Promise<CepData | null> {
    if (!this.isValidCep(cep)) {
      throw new Error('CEP inválido')
    }

    const { provider, forceRefresh = false } = options

    // Se um provedor específico foi solicitado
    if (provider) {
      return await this.lookupFromProvider(cep, provider)
    }

    // Tentar todos os provedores em ordem de preferência
    const providers = ['lookupViaCep', 'lookupBrasilApi', 'lookupAwesomeApi'] as const

    for (const providerMethod of providers) {
      try {
        const result = await this[providerMethod](cep)
        if (result) {
          return result
        }
      } catch {
        console.warn(`Falha no provedor ${providerMethod}:`)
        continue
      }
    }

    return null
  }

  /**
   * Busca de múltiplos CEPs
   */
  async bulkLookup(ceps: string[], options: CepLookupOptions = {}): Promise<Array<CepData | null>> {
    const results = await Promise.allSettled(ceps.map(cep => this.lookup(cep, options)))

    return results.map(result => (result.status === 'fulfilled' ? result.value : null))
  }

  /**
   * Validação de CEP
   */
  isValidCep(cep: string): boolean {
    return /^\d{5}-?\d{3}$/.test(cep)
  }

  /**
   * Busca em provedor específico
   */
  private async lookupFromProvider(
    cep: string,
    provider: 'viacep' | 'brasilapi' | 'awesomeapi'
  ): Promise<CepData | null> {
    switch (provider) {
      case 'viacep':
        return this.lookupViaCep(cep)
      case 'brasilapi':
        return this.lookupBrasilApi(cep)
      case 'awesomeapi':
        return this.lookupAwesomeApi(cep)
      default:
        throw new Error(`Provedor desconhecido: ${provider}`)
    }
  }

  /**
   * ViaCEP (Correios)
   */
  private async lookupViaCep(cep: string): Promise<CepData> {
    const data = await this.simpleFetch(`https://viacep.com.br/ws/${cep}/json/`)

    if (data.erro) {
      throw new Error('CEP não encontrado')
    }

    return CepDataSchema.parse({
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
      ibge: data.ibge,
      gia: data.gia,
      ddd: data.ddd,
      siafi: data.siafi,
    })
  }

  /**
   * BrasilAPI
   */
  private async lookupBrasilApi(cep: string): Promise<CepData> {
    const data = await this.simpleFetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)

    return CepDataSchema.parse({
      cep: data.cep,
      logradouro: data.street,
      complemento: '',
      bairro: data.neighborhood,
      localidade: data.city,
      uf: data.state,
      ibge: data.location?.coordinates?.latitude?.toString(),
      ddd: '',
      siafi: '',
    })
  }

  /**
   * AwesomeAPI
   */
  private async lookupAwesomeApi(cep: string): Promise<CepData> {
    const data = await this.simpleFetch(`https://cep.awesomeapi.com.br/json/${cep}`)

    if (data.status === 400) {
      throw new Error('CEP não encontrado')
    }

    return CepDataSchema.parse({
      cep: data.cep,
      logradouro: data.address,
      complemento: '',
      bairro: data.district,
      localidade: data.city,
      uf: data.state,
      ibge: data.city_ibge,
      ddd: data.ddd,
      siafi: '',
    })
  }

  /**
   * Busca por localização (apenas ViaCEP suporta)
   */
  async searchByLocation(uf: string, city: string, street?: string): Promise<CepData[]> {
    try {
      const url = street ? `/${uf}/${city}/${street}/json/` : `/${uf}/${city}/json/`

      const data = await this.simpleFetch(`https://viacep.com.br/ws${url}`)

      if (!Array.isArray(data)) {
        return []
      }

      return data
        .filter((item: Record<string, unknown>) => !item.erro)
        .map((item: Record<string, unknown>) =>
          CepDataSchema.parse({
            cep: item.cep,
            logradouro: item.logradouro,
            complemento: item.complemento,
            bairro: item.bairro,
            localidade: item.localidade,
            uf: item.uf,
            ibge: item.ibge,
            gia: item.gia,
            ddd: item.ddd,
            siafi: item.siafi,
          })
        )
    } catch {
      console.error('Erro na busca por localização:', "Unknown error")
      return []
    }
  }
}

// Instância singleton
export const cepService = new CepService()
