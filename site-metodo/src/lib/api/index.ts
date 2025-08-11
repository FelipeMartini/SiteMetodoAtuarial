'use client';

// Core API infrastructure
export { 
  ApiClient, 
  createApiClient, 
  clients,
  type ApiResponse,
  type ApiError,
  type ApiClientConfig,
  type RequestOptions,
} from './client';

export { 
  ApiCache,
  apiCache,
  cached,
  type CacheOptions,
  type CacheEntry,
  type CacheStats,
} from './cache';

export { 
  SimpleApiMonitor as ApiMonitor,
  apiMonitor,
  type EndpointMetrics as ApiMetrics,
  type EndpointMetrics as ApiEndpoint,
  type SystemMetrics,
  type HealthCheckResult,
} from './monitor-simple';

// Import para export default
import { ApiClient } from './client';
import { ApiCache } from './cache';
import { SimpleApiMonitor } from './monitor-simple';
import { cepService } from './services/cep';
import { exchangeService } from './services/exchange';
// Import apiMonitor to use in monitored function
import { apiMonitor } from './monitor-simple';
import { apiCache } from './cache';

// Compatibility function for monitored decorator
export function monitored(name: string) {
  return function(target: Record<string, unknown>, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function(...args: Record<string, unknown>[]) {
      const start = Date.now();
      try {
        const result = await original.apply(this, args);
        apiMonitor.recordRequest(name, Date.now() - start, true);
        return result;
      } catch (error) {
        apiMonitor.recordRequest(name, Date.now() - start, false, (error as Error).message);
        throw error;
      }
    };
    return descriptor;
  };
}

// API Services
export {
  CepService,
  cepService,
  type CepError,
} from './services/cep';export { 
  ExchangeService,
  exchangeService,
  type ExchangeRates,
  type CurrencyConversion,
  type CurrencyInfo,
} from './services/exchange';

// Utility functions and constants
export const API_CONSTANTS = {
  DEFAULT_TIMEOUT: 10000,
  DEFAULT_RETRIES: 3,
  DEFAULT_CACHE_TTL: 300, // 5 minutes
  MAX_RATE_LIMIT_RPM: 60,
  CIRCUIT_BREAKER_THRESHOLD: 5,
} as const;

// Common API patterns and helpers
export class ApiHelpers {
  /**
   * Create a standardized error response
   */
  static createErrorResponse(message: string, status: number = 500, code?: string) {
    return {
      error: true,
      message,
      status,
      code,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a standardized success response
   */
  static createSuccessResponse<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate required environment variables for API integrations
   */
  static validateEnvironment(requiredVars: string[]): void {
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  /**
   * Create a delay function for rate limiting
   */
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry a function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (i === retries) {
          throw lastError;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
        await this.delay(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Format bytes to human readable string
   */
  static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Generate a unique request ID
   */
  static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean and validate URL
   */
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extract domain from URL
   */
  static extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Check if code is running in browser
   */
  static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Check if code is running on server
   */
  static isServer(): boolean {
    return typeof window === 'undefined';
  }
}

// Health check utility for all registered APIs
export class ApiHealthChecker {
  /**
   * Perform health checks on all registered APIs
   */
  static async checkAllApis(): Promise<{
    healthy: number;
    unhealthy: number;
    total: number;
    details: Array<{
      name: string;
      status: 'healthy' | 'unhealthy';
      responseTime: number;
      error?: string;
    }>;
  }> {
    const endpoints = apiMonitor.getAllMetrics();
    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const result = await apiMonitor.healthCheck(endpoint.name);
        return {
          name: endpoint.name,
          status: result.healthy ? 'healthy' as const : 'unhealthy' as const,
          responseTime: result.responseTime,
          error: result.error,
        };
      })
    );

    const details = results.map(result => 
      result.status === 'fulfilled' ? result.value : {
        name: 'unknown',
        status: 'unhealthy' as const,
        responseTime: 0,
        error: 'Health check failed',
      }
    );

    const healthy = details.filter(d => d.status === 'healthy').length;
    const unhealthy = details.length - healthy;

    return {
      healthy,
      unhealthy,
      total: details.length,
      details,
    };
  }

  /**
   * Get system-wide API statistics
   */
  static getSystemStats() {
    const systemMetrics = apiMonitor.getSystemMetrics();
    const cacheStats = apiCache.normal.getStats();

    return {
      apis: systemMetrics,
      cache: cacheStats,
      timestamp: new Date().toISOString(),
    };
  }
}

// Initialize default monitoring endpoints
if (typeof window !== 'undefined') {
  // Only register in browser environment
  try {
    // Register common Brazilian APIs for monitoring
    apiMonitor.registerEndpoint('viacep', 'https://viacep.com.br/ws/01001000/json/', 'GET');
    apiMonitor.registerEndpoint('brasilapi', 'https://brasilapi.com.br/api/cep/v1/01001000', 'GET');
    apiMonitor.registerEndpoint('exchangerate', 'https://api.exchangerate-api.com/v4/latest/USD', 'GET');
    
    console.log('✅ API monitoring endpoints registered successfully');
  } catch (error) {
    console.warn('⚠️ Failed to register API monitoring endpoints:', error);
  }
}

// Export default configuration for common scenarios
export const DEFAULT_CONFIGS = {
  // Fast APIs (< 2s response time expected)
  FAST_API: {
    timeout: 2000,
    retries: 1,
    rateLimitRpm: 120,
    enableCache: true,
  },

  // Standard APIs (< 10s response time expected)
  STANDARD_API: {
    timeout: 10000,
    retries: 3,
    rateLimitRpm: 60,
    enableCache: true,
  },

  // Slow APIs (< 30s response time expected)
  SLOW_API: {
    timeout: 30000,
    retries: 2,
    rateLimitRpm: 30,
    enableCache: true,
  },

  // Critical APIs (government, banks, etc.)
  CRITICAL_API: {
    timeout: 15000,
    retries: 5,
    rateLimitRpm: 30,
    enableCache: true,
    enableRateLimit: true,
  },
} as const;

const apiExports = {
  ApiClient,
  ApiCache,
  ApiMonitor: SimpleApiMonitor,
  ApiHelpers,
  ApiHealthChecker,
  cepService,
  exchangeService,
  apiMonitor,
  apiCache,
};

export default apiExports;
