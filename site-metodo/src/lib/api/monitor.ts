'use client';

import { StructuredLogger } from '../logger';
import { ApiCache } from './cache';

export interface ApiMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  totalResponseTime: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  lastRequestTime: number;
  errorRate: number;
  uptime: number;
  circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

export interface ApiEndpoint {
  name: string;
  url: string;
  method: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  metrics: ApiMetrics;
  errors: Array<{
    timestamp: number;
    error: string;
    status?: number;
  }>;
}

export interface MonitoringConfig {
  checkInterval: number; // milliseconds
  maxErrors: number; // for circuit breaker
  errorWindowMs: number; // error window for circuit breaker
  healthCheckTimeout: number;
  alertThresholds: {
    errorRate: number; // percentage
    responseTime: number; // milliseconds
    downtime: number; // milliseconds
  };
}

/**
 * API monitoring system with circuit breaker pattern
 * Features: Health checks, metrics collection, alerting, circuit breaker
 */
export class ApiMonitor {
  private endpoints: Map<string, ApiEndpoint> = new Map();
  private logger: StructuredLogger;
  private config: MonitoringConfig;
  private checkIntervalId: NodeJS.Timeout | null = null;
  private alertsEnabled: boolean = true;
  private cache: ApiCache;

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      checkInterval: 30000, // 30 seconds
      maxErrors: 5,
      errorWindowMs: 60000, // 1 minute
      healthCheckTimeout: 5000,
      alertThresholds: {
        errorRate: 10, // 10%
        responseTime: 5000, // 5 seconds
        downtime: 60000, // 1 minute
      },
      ...config,
    };

    this.logger = new StructuredLogger('ApiMonitor');
    this.cache = new ApiCache({ ttl: 60, max: 100 }); // Short cache for health checks

    this.startMonitoring();
  }

  /**
   * Register an API endpoint for monitoring
   */
  registerEndpoint(name: string, url: string, method: string = 'GET'): void {
    const endpoint: ApiEndpoint = {
      name,
      url,
      method,
      status: 'healthy',
      lastCheck: 0,
      metrics: this.createEmptyMetrics(),
      errors: [],
    };

    this.endpoints.set(name, endpoint);
    
    this.logger.info({
      name,
      url,
      method,
    }, 'API endpoint registered for monitoring');
  }

  /**
   * Unregister an API endpoint
   */
  unregisterEndpoint(name: string): boolean {
    const removed = this.endpoints.delete(name);
    if (removed) {
      this.logger.info({ name }, 'API endpoint unregistered');
    }
    return removed;
  }

  /**
   * Record API request metrics
   */
  recordRequest(
    endpointName: string,
    responseTime: number,
    success: boolean,
    errorDetails?: string,
    statusCode?: number
  ): void {
    const endpoint = this.endpoints.get(endpointName);
    if (!endpoint) {
      this.logger.warn({ endpointName }, 'Attempted to record metrics for unregistered endpoint');
      return;
    }

    const now = Date.now();
    const metrics = endpoint.metrics;

    // Update basic counters
    metrics.requestCount++;
    metrics.lastRequestTime = now;

    if (success) {
      metrics.successCount++;
    } else {
      metrics.errorCount++;
      
      // Add error to history
      endpoint.errors.push({
        timestamp: now,
        error: errorDetails || 'Unknown error',
        status: statusCode,
      });

      // Keep only recent errors
      endpoint.errors = endpoint.errors.filter(
        error => now - error.timestamp < this.config.errorWindowMs
      );
    }

    // Update response time metrics
    metrics.totalResponseTime += responseTime;
    metrics.averageResponseTime = metrics.totalResponseTime / metrics.requestCount;
    metrics.minResponseTime = Math.min(metrics.minResponseTime || responseTime, responseTime);
    metrics.maxResponseTime = Math.max(metrics.maxResponseTime, responseTime);

    // Calculate error rate
    metrics.errorRate = (metrics.errorCount / metrics.requestCount) * 100;

    // Update circuit breaker state
    this.updateCircuitBreakerState(endpoint);

    // Update endpoint status
    this.updateEndpointStatus(endpoint);

    // Check for alerts
    this.checkAlerts(endpoint);

    this.logger.debug({
      endpointName,
      responseTime,
      success,
      errorRate: metrics.errorRate,
      circuitBreakerState: metrics.circuitBreakerState,
    }, 'API request metrics recorded');
  }

  /**
   * Perform health check on an endpoint
   */
  async healthCheck(endpointName: string): Promise<{
    healthy: boolean;
    responseTime: number;
    error?: string;
  }> {
    const endpoint = this.endpoints.get(endpointName);
    if (!endpoint) {
      throw new Error(`Endpoint ${endpointName} not registered`);
    }

    const startTime = Date.now();
    
    try {
      // Use cache for recent health checks
      const cacheKey = `health_${endpointName}`;
      const cached = this.cache.get<{ healthy: boolean; responseTime: number }>(cacheKey);
      
      if (cached) {
        return cached;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.healthCheckTimeout);

      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        signal: controller.signal,
        headers: {
          'User-Agent': 'MetodoAtuarial-HealthCheck/1.0',
        },
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      const healthy = response.ok;

      const result = { healthy, responseTime };
      
      // Cache result for 30 seconds
      this.cache.set(cacheKey, result, 30);

      // Record metrics
      this.recordRequest(endpointName, responseTime, healthy, 
        healthy ? undefined : `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );

      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Record failed health check
      this.recordRequest(endpointName, responseTime, false, errorMessage);

      return {
        healthy: false,
        responseTime,
        error: errorMessage,
      };
    }
  }

  /**
   * Get metrics for a specific endpoint
   */
  getEndpointMetrics(name: string): ApiEndpoint | null {
    return this.endpoints.get(name) || null;
  }

  /**
   * Get metrics for all endpoints
   */
  getAllMetrics(): ApiEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  /**
   * Get aggregated system metrics
   */
  getSystemMetrics(): {
    totalEndpoints: number;
    healthyEndpoints: number;
    degradedEndpoints: number;
    unhealthyEndpoints: number;
    totalRequests: number;
    totalErrors: number;
    averageResponseTime: number;
    systemErrorRate: number;
  } {
    const endpoints = Array.from(this.endpoints.values());
    
    const totalRequests = endpoints.reduce((sum, ep) => sum + ep.metrics.requestCount, 0);
    const totalErrors = endpoints.reduce((sum, ep) => sum + ep.metrics.errorCount, 0);
    const totalResponseTime = endpoints.reduce((sum, ep) => sum + ep.metrics.totalResponseTime, 0);

    return {
      totalEndpoints: endpoints.length,
      healthyEndpoints: endpoints.filter(ep => ep.status === 'healthy').length,
      degradedEndpoints: endpoints.filter(ep => ep.status === 'degraded').length,
      unhealthyEndpoints: endpoints.filter(ep => ep.status === 'unhealthy').length,
      totalRequests,
      totalErrors,
      averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      systemErrorRate: totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0,
    };
  }

  /**
   * Reset metrics for an endpoint
   */
  resetMetrics(endpointName: string): boolean {
    const endpoint = this.endpoints.get(endpointName);
    if (!endpoint) return false;

    endpoint.metrics = this.createEmptyMetrics();
    endpoint.errors = [];
    endpoint.status = 'healthy';

    this.logger.info({ endpointName }, 'Endpoint metrics reset');
    return true;
  }

  /**
   * Enable or disable alerting
   */
  setAlertsEnabled(enabled: boolean): void {
    this.alertsEnabled = enabled;
    this.logger.info({ enabled }, 'Alerting status changed');
  }

  /**
   * Start monitoring (health checks)
   */
  private startMonitoring(): void {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
    }

    this.checkIntervalId = setInterval(async () => {
      for (const [name] of this.endpoints) {
        try {
          await this.healthCheck(name);
        } catch (error) {
          this.logger.error({
            endpointName: name,
            error: error instanceof Error ? error.message : 'Unknown error',
          }, 'Health check failed');
        }
      }
    }, this.config.checkInterval);

    this.logger.info({
      interval: this.config.checkInterval,
    }, 'API monitoring started');
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }

    this.logger.info('API monitoring stopped');
  }

  private createEmptyMetrics(): ApiMetrics {
    return {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      averageResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      lastRequestTime: 0,
      errorRate: 0,
      uptime: 100,
      circuitBreakerState: 'CLOSED',
    };
  }

  private updateCircuitBreakerState(endpoint: ApiEndpoint): void {
    const metrics = endpoint.metrics;
    const recentErrors = endpoint.errors.filter(
      error => Date.now() - error.timestamp < this.config.errorWindowMs
    ).length;

    switch (metrics.circuitBreakerState) {
      case 'CLOSED':
        if (recentErrors >= this.config.maxErrors) {
          metrics.circuitBreakerState = 'OPEN';
          this.logger.warn({
            endpointName: endpoint.name,
            recentErrors,
            maxErrors: this.config.maxErrors,
          }, 'Circuit breaker opened');
        }
        break;

      case 'OPEN':
        // Stay open for the error window duration
        const oldestError = endpoint.errors[0];
        if (oldestError && Date.now() - oldestError.timestamp > this.config.errorWindowMs) {
          metrics.circuitBreakerState = 'HALF_OPEN';
          this.logger.info({
            endpointName: endpoint.name,
          }, 'Circuit breaker half-opened');
        }
        break;

      case 'HALF_OPEN':
        if (recentErrors > 0) {
          metrics.circuitBreakerState = 'OPEN';
          this.logger.warn({
            endpointName: endpoint.name,
          }, 'Circuit breaker re-opened');
        } else if (metrics.requestCount > 0 && recentErrors === 0) {
          metrics.circuitBreakerState = 'CLOSED';
          this.logger.info({
            endpointName: endpoint.name,
          }, 'Circuit breaker closed');
        }
        break;
    }
  }

  private updateEndpointStatus(endpoint: ApiEndpoint): void {
    const metrics = endpoint.metrics;
    
    if (metrics.circuitBreakerState === 'OPEN') {
      endpoint.status = 'unhealthy';
    } else if (
      metrics.errorRate > this.config.alertThresholds.errorRate ||
      metrics.averageResponseTime > this.config.alertThresholds.responseTime
    ) {
      endpoint.status = 'degraded';
    } else {
      endpoint.status = 'healthy';
    }

    // Calculate uptime
    const totalRequests = metrics.requestCount;
    if (totalRequests > 0) {
      metrics.uptime = ((totalRequests - metrics.errorCount) / totalRequests) * 100;
    }
  }

  private checkAlerts(endpoint: ApiEndpoint): void {
    if (!this.alertsEnabled) return;

    const metrics = endpoint.metrics;
    const alerts: string[] = [];

    // Error rate alert
    if (metrics.errorRate > this.config.alertThresholds.errorRate) {
      alerts.push(`High error rate: ${metrics.errorRate.toFixed(2)}%`);
    }

    // Response time alert
    if (metrics.averageResponseTime > this.config.alertThresholds.responseTime) {
      alerts.push(`High response time: ${metrics.averageResponseTime.toFixed(0)}ms`);
    }

    // Circuit breaker alert
    if (metrics.circuitBreakerState === 'OPEN') {
      alerts.push('Circuit breaker is open');
    }

    if (alerts.length > 0) {
      this.logger.warn({
        endpointName: endpoint.name,
        alerts,
        metrics: {
          errorRate: metrics.errorRate,
          averageResponseTime: metrics.averageResponseTime,
          circuitBreakerState: metrics.circuitBreakerState,
        },
      }, 'API endpoint alerts triggered');
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopMonitoring();
    this.endpoints.clear();
    this.cache.clear();
  }
}

// Global monitor instance
export const apiMonitor = new ApiMonitor();

// Monitor decorator for API methods
export function monitored(endpointName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      
      try {
        const result = await originalMethod.apply(this, args);
        const responseTime = Date.now() - startTime;
        
        apiMonitor.recordRequest(endpointName, responseTime, true);
        
        return result;
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        apiMonitor.recordRequest(endpointName, responseTime, false, errorMessage);
        
        throw error;
      }
    };

    return descriptor;
  };
}

export default ApiMonitor;
