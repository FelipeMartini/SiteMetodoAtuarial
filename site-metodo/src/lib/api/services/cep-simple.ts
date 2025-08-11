import { z } from 'zod';
import { createApiClient } from '../client';

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
});

export type CepData = z.infer<typeof CepDataSchema>;

export interface CepLookupOptions {
  provider?: 'viacep' | 'brasilapi' | 'awesomeapi';
  forceRefresh?: boolean;
  timeout?: number;
}

/**
 * Serviço para consulta de CEP com múltiplos provedores
 */
export class CepService {
  private viaCepClient = createApiClient({
    baseURL: 'https://viacep.com.br/ws',
    timeout: 5000,
    rateLimitRpm: 300,
  });

  private brasilApiClient = createApiClient({
    baseURL: 'https://brasilapi.com.br/api/cep/v1',
    timeout: 5000,
    rateLimitRpm: 300,
  });

  private awesomeApiClient = createApiClient({
    baseURL: 'https://cep.awesomeapi.com.br/json',
    timeout: 5000,
    rateLimitRpm: 200,
  });

  /**
   * Busca CEP em múltiplos provedores com fallback
   */
  async lookup(cep: string, options: CepLookupOptions = {}): Promise<CepData | null> {
    if (!this.isValidCep(cep)) {
      throw new Error('CEP inválido');
    }

    const { provider, forceRefresh = false } = options;

    // Se um provedor específico foi solicitado
    if (provider) {
      return await this.lookupFromProvider(cep, provider);
    }

    // Tentar todos os provedores em ordem de preferência
    const providers = ['lookupViaCep', 'lookupBrasilApi', 'lookupAwesomeApi'] as const;
    
    for (const providerMethod of providers) {
      try {
        const result = await this[providerMethod](cep);
        if (result) {
          return result;
        }
      } catch (error) {
        console.warn(`Falha no provedor ${providerMethod}:`, error);
        continue;
      }
    }

    return null;
  }

  /**
   * Busca de múltiplos CEPs
   */
  async bulkLookup(ceps: string[], options: CepLookupOptions = {}): Promise<Array<CepData | null>> {
    const results = await Promise.allSettled(
      ceps.map(cep => this.lookup(cep, options))
    );

    return results.map(result => 
      result.status === 'fulfilled' ? result.value : null
    );
  }

  /**
   * Validação de CEP
   */
  isValidCep(cep: string): boolean {
    return /^\d{5}-?\d{3}$/.test(cep);
  }

  /**
   * Busca em provedor específico
   */
  private async lookupFromProvider(cep: string, provider: 'viacep' | 'brasilapi' | 'awesomeapi'): Promise<CepData | null> {
    switch (provider) {
      case 'viacep':
        return this.lookupViaCep(cep);
      case 'brasilapi':
        return this.lookupBrasilApi(cep);
      case 'awesomeapi':
        return this.lookupAwesomeApi(cep);
      default:
        throw new Error(`Provedor desconhecido: ${provider}`);
    }
  }

  /**
   * ViaCEP (Correios)
   */
  private async lookupViaCep(cep: string): Promise<CepData> {
    const response = await this.viaCepClient.get(`/${cep}/json/`);
    
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return CepDataSchema.parse({
      cep: response.data.cep,
      logradouro: response.data.logradouro,
      complemento: response.data.complemento,
      bairro: response.data.bairro,
      localidade: response.data.localidade,
      uf: response.data.uf,
      ibge: response.data.ibge,
      gia: response.data.gia,
      ddd: response.data.ddd,
      siafi: response.data.siafi,
    });
  }

  /**
   * BrasilAPI
   */
  private async lookupBrasilApi(cep: string): Promise<CepData> {
    const response = await this.brasilApiClient.get(`/${cep}`);
    
    return CepDataSchema.parse({
      cep: response.data.cep,
      logradouro: response.data.street,
      complemento: '',
      bairro: response.data.neighborhood,
      localidade: response.data.city,
      uf: response.data.state,
      ibge: response.data.location?.coordinates?.latitude?.toString(),
      ddd: '',
      siafi: '',
    });
  }

  /**
   * AwesomeAPI
   */
  private async lookupAwesomeApi(cep: string): Promise<CepData> {
    const response = await this.awesomeApiClient.get(`/${cep}`);
    
    if (response.data.status === 400) {
      throw new Error('CEP não encontrado');
    }

    return CepDataSchema.parse({
      cep: response.data.cep,
      logradouro: response.data.address,
      complemento: '',
      bairro: response.data.district,
      localidade: response.data.city,
      uf: response.data.state,
      ibge: response.data.city_ibge,
      ddd: response.data.ddd,
      siafi: '',
    });
  }

  /**
   * Busca por localização (apenas ViaCEP suporta)
   */
  async searchByLocation(uf: string, city: string, street?: string): Promise<CepData[]> {
    try {
      const url = street 
        ? `/${uf}/${city}/${street}/json/`
        : `/${uf}/${city}/json/`;
      
      const response = await this.viaCepClient.get(url);
      
      if (!Array.isArray(response.data)) {
        return [];
      }

      return response.data
        .filter((item: Record<string, unknown>) => !item.erro)
        .map((item: Record<string, unknown>) => CepDataSchema.parse({
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
        }));
    } catch (error) {
      console.error('Erro na busca por localização:', error);
      return [];
    }
  }
}

// Instância singleton
export const cepService = new CepService();
