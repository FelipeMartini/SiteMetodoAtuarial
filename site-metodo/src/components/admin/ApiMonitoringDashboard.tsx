'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  TrendingUp,
  TrendingDown,
  Zap,
  Globe,
  Shield,
  Database
} from 'lucide-react';
import { apiMonitor, EndpointMetrics as ApiEndpoint } from '@/lib/api/monitor-simple';
import { apiCache } from '@/lib/api/cache';
import { cepService } from '@/lib/api/services/cep';

interface MonitoringStats {
  endpoints: ApiEndpoint[];
  systemMetrics: {
    totalEndpoints: number;
    healthyEndpoints: number;
    degradedEndpoints: number;
    unhealthyEndpoints: number;
    totalRequests: number;
    totalErrors: number;
    averageResponseTime: number;
    systemErrorRate: number;
  };
  cacheStats: {
    hits: number;
    misses: number;
    sets: number;
    deletes: number;
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: number;
  };
}

const ApiMonitoringDashboard: React.FC = () => {
  const [stats, setStats] = useState<MonitoringStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadStats = async () => {
    try {
      const endpoints = apiMonitor.getAllMetrics();
      const systemMetrics = apiMonitor.getSystemMetrics();
      const cacheStats = apiCache.normal.getStats();

      // Adaptamos os dados para o formato esperado
      const adaptedSystemMetrics = {
        totalEndpoints: endpoints.length,
        healthyEndpoints: endpoints.filter(e => e.healthy).length,
        degradedEndpoints: endpoints.filter(e => e.errorRate > 0.1 && e.errorRate < 0.5).length,
        unhealthyEndpoints: endpoints.filter(e => !e.healthy).length,
        totalRequests: systemMetrics.totalRequests,
        totalErrors: systemMetrics.totalErrors,
        averageResponseTime: systemMetrics.averageResponseTime,
        systemErrorRate: systemMetrics.totalRequests > 0 ? systemMetrics.totalErrors / systemMetrics.totalRequests : 0,
      };

      setStats({
        endpoints,
        systemMetrics: adaptedSystemMetrics,
        cacheStats,
      });
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadStats, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLoading(true);
    loadStats();
  };

  const handleClearCache = () => {
    apiCache.normal.clear();
    apiCache.fast.clear();
    apiCache.persistent.clear();
    loadStats();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'unhealthy': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCircuitBreakerBadge = (state: string) => {
    const variants = {
      'CLOSED': 'default',
      'OPEN': 'destructive',
      'HALF_OPEN': 'secondary',
    } as const;

    return (
      <Badge variant={variants[state as keyof typeof variants] || 'default'}>
        {state}
      </Badge>
    );
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando estatísticas...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Não foi possível carregar as estatísticas de monitoramento.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoramento de APIs</h1>
          <p className="text-muted-foreground">
            Últimos dados: {lastUpdate.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-pulse' : ''}`} />
            Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de APIs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemMetrics.totalEndpoints}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.systemMetrics.healthyEndpoints} saudáveis, {' '}
              {stats.systemMetrics.degradedEndpoints} degradadas, {' '}
              {stats.systemMetrics.unhealthyEndpoints} com falha
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Erro</CardTitle>
            {stats.systemMetrics.systemErrorRate > 10 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.systemMetrics.systemErrorRate.toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.systemMetrics.totalErrors} de {stats.systemMetrics.totalRequests} requests
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.systemMetrics.averageResponseTime)}ms
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Tempo médio de resposta
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cacheStats.hitRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.cacheStats.hits} hits, {stats.cacheStats.misses} misses
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cache Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Estatísticas do Cache
          </CardTitle>
          <CardDescription>
            Performance e utilização do sistema de cache
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm font-medium">Utilização</div>
              <Progress 
                value={(stats.cacheStats.size / stats.cacheStats.maxSize) * 100} 
                className="mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {stats.cacheStats.size} / {stats.cacheStats.maxSize} entradas
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Memória</div>
              <div className="text-2xl font-bold">
                {(stats.cacheStats.memoryUsage / 1024).toFixed(1)} KB
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Operações</div>
              <div className="text-sm text-muted-foreground">
                Sets: {stats.cacheStats.sets}<br />
                Deletes: {stats.cacheStats.deletes}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleClearCache}>
              Limpar Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Status das APIs
          </CardTitle>
          <CardDescription>
            Monitoramento detalhado de cada endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.endpoints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum endpoint registrado para monitoramento
            </div>
          ) : (
            <div className="space-y-4">
              {stats.endpoints.map((endpoint) => (
                <div
                  key={endpoint.name}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={getStatusColor(endpoint.healthy ? 'healthy' : 'unhealthy')}>
                        {getStatusIcon(endpoint.healthy ? 'healthy' : 'unhealthy')}
                      </div>
                      <div>
                        <div className="font-medium">{endpoint.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {endpoint.method} {endpoint.url}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={endpoint.healthy ? 'default' : 'destructive'}
                      >
                        {endpoint.healthy ? 'healthy' : 'unhealthy'}
                      </Badge>
                      {getCircuitBreakerBadge(endpoint.circuitBreakerState)}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <div className="text-sm font-medium">Requests</div>
                      <div className="text-2xl font-bold">{endpoint.totalRequests}</div>
                      <div className="text-xs text-muted-foreground">
                        {endpoint.successfulRequests} sucessos
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">Taxa de Erro</div>
                      <div className="text-2xl font-bold">
                        {endpoint.errorRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {endpoint.errorCount} erros
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">Tempo de Resposta</div>
                      <div className="text-2xl font-bold">
                        {Math.round(endpoint.averageResponseTime)}ms
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total: {endpoint.totalResponseTime}ms
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">Uptime</div>
                      <div className="text-2xl font-bold">
                        {endpoint.healthy ? '100.0' : '0.0'}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Último request: {
                          endpoint.lastRequest 
                            ? endpoint.lastRequest.toLocaleTimeString()
                            : 'Nunca'
                        }
                      </div>
                    </div>
                  </div>

                  {endpoint.recentErrors.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium mb-2">Erros Recentes</div>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {endpoint.recentErrors.slice(0, 3).map((errorCode, index) => (
                            <div 
                              key={index}
                              className="text-xs bg-red-50 dark:bg-red-950 p-2 rounded"
                            >
                              <div className="font-medium">
                                Erro {errorCode} - {new Date().toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiMonitoringDashboard;
