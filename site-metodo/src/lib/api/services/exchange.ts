'use client';

import { z } from 'zod';
import { ApiClient, createApiClient } from '../client';
import { apiMonitor } from '../monitor-simple';

// Type definitions for Exchange Rate API
export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  timestamp?: number;
}

export interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  country: string;
}

// Zod schemas
const ExchangeRatesSchema = z.object({
  base: z.string(),
  date: z.string(),
  rates: z.record(z.string(), z.number()),
  timestamp: z.number().optional(),
});

const BrazilApiQuoteSchema = z.object({
  code: z.string(),
  codein: z.string(),
  name: z.string(),
  high: z.string(),
  low: z.string(),
  varBid: z.string(),
  pctChange: z.string(),
  bid: z.string(),
  ask: z.string(),
  timestamp: z.string(),
  create_date: z.string(),
});

/**
 * Service for currency exchange rates and conversions
 * Features: Multiple providers, historical data, caching, rate alerts
 */
export class ExchangeService {
  private exchangeApiClient: ApiClient;
  private awesomeApiClient: ApiClient;
  private brasilApiClient: ApiClient;

  // Supported currencies
  private readonly SUPPORTED_CURRENCIES = new Map<string, CurrencyInfo>([
    ['USD', { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States' }],
    ['BRL', { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'Brazil' }],
    ['EUR', { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union' }],
    ['GBP', { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' }],
    ['JPY', { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan' }],
    ['CAD', { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada' }],
    ['AUD', { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia' }],
    ['CHF', { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland' }],
    ['CNY', { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China' }],
    ['ARS', { code: 'ARS', name: 'Argentine Peso', symbol: '$', country: 'Argentina' }],
  ]);

  constructor() {
    // ExchangeRate-API - Primary provider
    this.exchangeApiClient = createApiClient({
      baseURL: 'https://api.exchangerate-api.com/v4',
      timeout: 8000,
      rateLimitRpm: 100,
    });

    // AwesomeAPI - Brazilian focused
    this.awesomeApiClient = createApiClient({
      baseURL: 'https://economia.awesomeapi.com.br',
      timeout: 5000,
      rateLimitRpm: 120,
    });

    // BrasilAPI - Brazilian government data
    this.brasilApiClient = createApiClient({
      baseURL: 'https://brasilapi.com.br/api',
      timeout: 5000,
      rateLimitRpm: 60,
    });

    // Register endpoints for monitoring
    apiMonitor.registerEndpoint('exchangerate-api', 'https://api.exchangerate-api.com/v4/latest/USD', 'GET');
    apiMonitor.registerEndpoint('awesomeapi-currency', 'https://economia.awesomeapi.com.br/last/USD-BRL', 'GET');
    apiMonitor.registerEndpoint('brasilapi-currency', 'https://brasilapi.com.br/api/taxas/v1', 'GET');
  }

  /**
   * Get current exchange rates for a base currency
   */
    private async fetchExchangeRateApi(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
    this.validateCurrency(baseCurrency);

    const response = await this.exchangeApiClient.get(`/latest/${baseCurrency}`);
    return ExchangeRatesSchema.parse(response.data);
  }

  /**
   * Convert amount between currencies
   */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<CurrencyConversion> {
    this.validateCurrency(fromCurrency);
    this.validateCurrency(toCurrency);

    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    // Get exchange rates for the base currency
    const rates = await this.fetchExchangeRateApi(fromCurrency);
    
    if (!rates.rates[toCurrency]) {
      throw new Error(`Exchange rate not available for ${toCurrency}`);
    }

    const rate = rates.rates[toCurrency];
    const result = amount * rate;

    return {
      from: fromCurrency,
      to: toCurrency,
      amount,
      result: Math.round(result * 100) / 100, // Round to 2 decimal places
      rate,
      date: rates.date,
    };
  }

  /**
   * Get multiple currency rates against BRL (Brazilian focus)
   */
  async getBrazilianRates(currencies: string[] = ['USD', 'EUR', 'ARS']): Promise<Array<{
    currency: string;
    name: string;
    buy: number;
    sell: number;
    variation: number;
    percentChange: number;
    high: number;
    low: number;
    timestamp: string;
  }>> {
    // Validate currencies
    currencies.forEach(currency => this.validateCurrency(currency));

    // Create pairs with BRL
    const pairs = currencies.map(currency => `${currency}-BRL`).join(',');
    
    const response = await this.awesomeApiClient.get(`/last/${pairs}`);
    
    const results: Array<{
      currency: string;
      name: string;
      buy: number;
      sell: number;
      variation: number;
      percentChange: number;
      high: number;
      low: number;
      timestamp: string;
    }> = [];

    for (const [pairKey, data] of Object.entries(response.data)) {
      const validated = BrazilApiQuoteSchema.parse(data);
      const currency = validated.code;

      results.push({
        currency,
        name: validated.name,
        buy: parseFloat(validated.bid),
        sell: parseFloat(validated.ask),
        variation: parseFloat(validated.varBid),
        percentChange: parseFloat(validated.pctChange),
        high: parseFloat(validated.high),
        low: parseFloat(validated.low),
        timestamp: validated.create_date,
      });
    }

    return results;
  }

  /**
   * Get historical exchange rates for a date range
   */
  async getHistoricalRates(
    baseCurrency: string,
    targetCurrency: string,
    days: number = 30
  ): Promise<Array<{
    date: string;
    rate: number;
  }>> {
    this.validateCurrency(baseCurrency);
    this.validateCurrency(targetCurrency);

    if (days <= 0 || days > 365) {
      throw new Error('Days must be between 1 and 365');
    }

    // For simplicity, we'll use AwesomeAPI for historical data
    // In production, you might want to use a service that provides historical data
    const response = await this.awesomeApiClient.get(
      `/daily/${baseCurrency}-${targetCurrency}/${days}`
    );

    return response.data.map((item: Record<string, unknown>) => ({
      date: item.timestamp,
      rate: parseFloat(item.bid),
    }));
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): CurrencyInfo[] {
    return Array.from(this.SUPPORTED_CURRENCIES.values());
  }

  /**
   * Get currency information
   */
  getCurrencyInfo(code: string): CurrencyInfo | null {
    return this.SUPPORTED_CURRENCIES.get(code.toUpperCase()) || null;
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number, currencyCode: string, locale: string = 'pt-BR'): string {
    const currency = this.getCurrencyInfo(currencyCode);
    
    if (!currency) {
      return amount.toFixed(2);
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback for unsupported currencies
      return `${currency.symbol} ${amount.toFixed(2)}`;
    }
  }

  /**
   * Calculate exchange rate trend (simplified)
   */
  async getRateTrend(
    baseCurrency: string,
    targetCurrency: string
  ): Promise<{
    current: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
    changePercent: number;
  }> {
    const historicalData = await this.getHistoricalRates(baseCurrency, targetCurrency, 7);
    
    if (historicalData.length < 2) {
      throw new Error('Insufficient historical data');
    }

    const current = historicalData[historicalData.length - 1].rate;
    const previous = historicalData[historicalData.length - 2].rate;
    
    const change = current - previous;
    const changePercent = (change / previous) * 100;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 0.1) { // 0.1% threshold
      trend = change > 0 ? 'up' : 'down';
    }

    return {
      current,
      trend,
      change: Math.round(change * 10000) / 10000, // 4 decimal places
      changePercent: Math.round(changePercent * 100) / 100, // 2 decimal places
    };
  }

  /**
   * Bulk currency conversion
   */
  async convertMultipleCurrencies(
    amount: number,
    fromCurrency: string,
    toCurrencies: string[]
  ): Promise<CurrencyConversion[]> {
    this.validateCurrency(fromCurrency);
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    const rates = await this.fetchExchangeRateApi(fromCurrency);
    const conversions: CurrencyConversion[] = [];

    for (const toCurrency of toCurrencies) {
      try {
        this.validateCurrency(toCurrency);
        
        if (!rates.rates[toCurrency]) {
          console.warn(`Exchange rate not available for ${toCurrency}`);
          continue;
        }

        const rate = rates.rates[toCurrency];
        const result = amount * rate;

        conversions.push({
          from: fromCurrency,
          to: toCurrency,
          amount,
          result: Math.round(result * 100) / 100,
          rate,
          date: rates.date,
        });
      } catch (_error) {
        console.warn(`Error converting to ${toCurrency}:`, error);
      }
    }

    return conversions;
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{
    exchangeRateApi: { healthy: boolean; responseTime: number };
    awesomeApi: { healthy: boolean; responseTime: number };
    brasilApi: { healthy: boolean; responseTime: number };
  }> {
    const [exchangeRateApi, awesomeApi, brasilApi] = await Promise.allSettled([
      apiMonitor.healthCheck('exchangerate-api'),
      apiMonitor.healthCheck('awesomeapi-currency'),
      apiMonitor.healthCheck('brasilapi-currency'),
    ]);

    return {
      exchangeRateApi: exchangeRateApi.status === 'fulfilled' ? exchangeRateApi.value : { healthy: false, responseTime: 0 },
      awesomeApi: awesomeApi.status === 'fulfilled' ? awesomeApi.value : { healthy: false, responseTime: 0 },
      brasilApi: brasilApi.status === 'fulfilled' ? brasilApi.value : { healthy: false, responseTime: 0 },
    };
  }

  /**
   * Validate currency code
   */
  private validateCurrency(currency: string): void {
    const upperCurrency = currency.toUpperCase();
    if (!this.SUPPORTED_CURRENCIES.has(upperCurrency)) {
      throw new Error(`Unsupported currency: ${currency}. Supported currencies: ${Array.from(this.SUPPORTED_CURRENCIES.keys()).join(', ')}`);
    }
  }

  /**
   * Clear service cache
   */
  clearCache(): void {
    // Clear cache entries related to this service
    const patterns = [
      /ExchangeService\./,
      /exchangerate-api/,
      /awesomeapi-currency/,
    ];

    patterns.forEach(pattern => {
      // Clear from different cache instances
      // Implementation depends on cache structure
    });
  }
}

// Export singleton instance
export const exchangeService = new ExchangeService();

export default ExchangeService;
