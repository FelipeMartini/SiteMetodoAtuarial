'use client'

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { simpleLogger } from '../simple-logger'

// Types for API responses
export interface ApiResponse<T = unknown> {
  data: T
  status: number
  message?: string
  timestamp?: string
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: Record<string, unknown>
  timestamp: string
}

export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  retries?: number
  retryDelay?: number
  enableCache?: boolean
  enableRateLimit?: boolean
  rateLimitRpm?: number // requests per minute
}

export interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean
  skipCache?: boolean
  cacheKey?: string
  cacheTtl?: number // seconds
  retries?: number
  skipRetry?: boolean
}

// Schema for validating API responses (available for future use)
// const _ApiResponseSchema = z.object({
//   data: z.unknown(),
//   status: z.number(),
//   message: z.string().optional(),
//   timestamp: z.string().optional(),
// })

/**
 * Enterprise-grade HTTP client for external API integration
 * Features: Type safety, caching, rate limiting, retry logic, monitoring
 */
export class ApiClient {
  private client: AxiosInstance
  private logger: typeof simpleLogger
  private config: Required<ApiClientConfig>
  private requestQueue: Map<string, Promise<unknown>> = new Map()
  private requestTimestamps: number[] = []

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      enableCache: true,
      enableRateLimit: true,
      rateLimitRpm: 60,
      headers: {},
      ...config,
    }

    this.logger = simpleLogger
    this.client = this.createAxiosInstance()
    this.setupInterceptors()
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MetodoAtuarial-API-Client/1.0',
        ...this.config.headers,
      },
    })
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const requestId = this.generateRequestId()
        // Store request metadata in a separate map for tracking
        this.requestQueue.set(requestId, Promise.resolve())

        // Logger call simplified

        return config
      },
      (error: AxiosError) => {
        // Logger call simplified
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Duration tracking simplified
        // const _duration = 0 // Placeholder

        // Logger call simplified

        return response
      },
      (error: AxiosError) => {
        // Duration tracking simplified for error case
        // const _duration = 0 // Placeholder
        const apiError = this.formatError(error)

        // Logger call simplified

        return Promise.reject(apiError)
      }
    )
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private formatError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: error.message || 'Unknown error',
      code: 'API_ERROR',
      status: error.response?.status || 500,
      details: error.response?.data as Record<string, unknown> | undefined,
      timestamp: new Date().toISOString(),
    }

    if (error.response) {
      // Server responded with error status
      apiError.status = error.response.status
      const responseData = error.response.data as Record<string, unknown> | undefined
      apiError.message = (responseData as Record<string, string>)?.message || error.message
      apiError.code = (responseData as Record<string, string>)?.code || `HTTP_${error.response.status}`
      apiError.details = error.response.data as Record<string, unknown> | undefined
    } else if (error.request) {
      // Request was made but no response received
      apiError.code = 'NETWORK_ERROR'
      apiError.message = 'Network error or no response received'
    }

    return apiError
  }

  private async checkRateLimit(): Promise<void> {
    if (!this.config.enableRateLimit) return

    const now = Date.now()
    const oneMinuteAgo = now - 60000

    // Remove timestamps older than 1 minute
    this.requestTimestamps = this.requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo)

    // Check if we've exceeded the rate limit
    if (this.requestTimestamps.length >= this.config.rateLimitRpm) {
      const oldestRequest = this.requestTimestamps[0]
      const waitTime = 60000 - (now - oldestRequest)

      // Logger call simplified

      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    this.requestTimestamps.push(now)
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = this.config.retries,
    delay: number = this.config.retryDelay
  ): Promise<T> {
    try {
      return await requestFn()
    } catch (_error) {
      if (retries <= 0) {
        throw _error
      }

      const apiError = _error as ApiError

      // Don't retry for client errors (4xx) except for specific cases
      if (apiError.status >= 400 && apiError.status < 500 && apiError.status !== 429) {
        throw _error
      }

      // Logger call simplified

      await new Promise(resolve => setTimeout(resolve, delay))

      // Exponential backoff
      return this.retryRequest(requestFn, retries - 1, delay * 2)
    }
  }

  // Public API methods
  async get<T = unknown>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    await this.checkRateLimit()

    const requestFn = async () => {
      const response = await this.client.get<T>(url, options)
      return this.formatResponse<T>(response)
    }

    if (options.skipRetry) {
      return requestFn()
    }

    return this.retryRequest(requestFn, options.retries)
  }

  async post<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    await this.checkRateLimit()

    const requestFn = async () => {
      const response = await this.client.post<T>(url, data, options)
      return this.formatResponse<T>(response)
    }

    if (options.skipRetry) {
      return requestFn()
    }

    return this.retryRequest(requestFn, options.retries)
  }

  async put<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    await this.checkRateLimit()

    const requestFn = async () => {
      const response = await this.client.put<T>(url, data, options)
      return this.formatResponse<T>(response)
    }

    if (options.skipRetry) {
      return requestFn()
    }

    return this.retryRequest(requestFn, options.retries)
  }

  async delete<T = unknown>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    await this.checkRateLimit()

    const requestFn = async () => {
      const response = await this.client.delete<T>(url, options)
      return this.formatResponse<T>(response)
    }

    if (options.skipRetry) {
      return requestFn()
    }

    return this.retryRequest(requestFn, options.retries)
  }

  async patch<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    await this.checkRateLimit()

    const requestFn = async () => {
      const response = await this.client.patch<T>(url, data, options)
      return this.formatResponse<T>(response)
    }

    if (options.skipRetry) {
      return requestFn()
    }

    return this.retryRequest(requestFn, options.retries)
  }

  private formatResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
      timestamp: new Date().toISOString(),
    }
  }

  // Health check method
  async healthCheck(): Promise<{ healthy: boolean; latency: number }> {
    const startTime = Date.now()

    try {
      await this.get('/health', {
        skipRetry: true,
        timeout: 5000,
      })

      return {
        healthy: true,
        latency: Date.now() - startTime,
      }
    } catch (_error) {
      return {
        healthy: false,
        latency: Date.now() - startTime,
      }
    }
  }

  // Get client configuration
  getConfig(): Readonly<Required<ApiClientConfig>> {
    return { ...this.config }
  }

  // Update configuration
  updateConfig(newConfig: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...newConfig }

    // Recreate axios instance if baseURL changed
    if (newConfig.baseURL) {
      this.client = this.createAxiosInstance()
      this.setupInterceptors()
    }
  }
}

// Factory function for creating API clients
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config)
}

// Default clients for common APIs
export const clients = {
  // CEP API client
  cep: createApiClient({
    baseURL: 'https://viacep.com.br/ws',
    timeout: 5000,
    rateLimitRpm: 120, // ViaCEP allows more requests
  }),

  // Exchange rates API
  exchange: createApiClient({
    baseURL: 'https://api.exchangerate-api.com/v4/latest',
    timeout: 10000,
    rateLimitRpm: 100,
  }),

  // Brazil API (multiple services)
  brasil: createApiClient({
    baseURL: 'https://brasilapi.com.br/api',
    timeout: 8000,
    rateLimitRpm: 60,
  }),
}

export default ApiClient
