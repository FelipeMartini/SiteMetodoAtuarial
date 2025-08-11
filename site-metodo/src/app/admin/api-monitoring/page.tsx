'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Database, 
  Globe, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Server,
  Clock,
  BarChart3
} from 'lucide-react';

interface ApiMetrics {
  endpoints: Array<{
    name: string;
    url: string;
    totalRequests: number;
    successfulRequests: number;
    averageResponseTime: number;
    errorRate: number;
    lastRequest?: string;
    healthy: boolean;
  }>;
  systemMetrics: {
    totalRequests: number;
    totalErrors: number;
    averageResponseTime: number;
    uptime: number;
  };
  cacheStats: {
    normal: {
      hits: number;
      misses: number;
      size: number;
      maxSize: number;
    };
    fast: {
      hits: number;
      misses: number;
      size: number;
      maxSize: number;
    };
    persistent: {
      hits: number;
      misses: number;
      size: number;
      maxSize: number;
    };
  };
}

interface TestResults {
  testType: string;
  results: any;
  timestamp: string;
  message: string;
}

export default function ApiMonitoringPage() {
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // segundos
  const [cepTest, setCepTest] = useState('01310-100');
  const [exchangeFrom, setExchangeFrom] = useState('USD');
  const [exchangeTo, setExchangeTo] = useState('BRL');

  // Buscar métricas
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/monitoring/apis');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Executar testes
  const runTests = async (testType: string = 'all') => {
    setTestLoading(true);
    try {
      const response = await fetch(`/api/test/apis?type=${testType}`);
      if (response.ok) {
        const data = await response.json();
        setTestResults(data);
      }
    } catch (error) {
      console.error('Erro ao executar testes:', error);
    } finally {
      setTestLoading(false);
    }
  };

  // Testar CEP específico
  const testSpecificCep = async () => {
    try {
      const response = await fetch(`/api/cep?cep=${cepTest}`);
      const data = await response.json();
      setTestResults({
        testType: 'cep-specific',
        results: data,
        timestamp: new Date().toISOString(),
        message: `Teste de CEP ${cepTest}`,
      });
    } catch (error) {
      console.error('Erro ao testar CEP:', error);
    }
  };

  // Testar conversão específica
  const testSpecificExchange = async () => {
    try {
      const response = await fetch(`/api/exchange?from=${exchangeFrom}&to=${exchangeTo}&amount=100`);
      const data = await response.json();
      setTestResults({
        testType: 'exchange-specific',
        results: data,
        timestamp: new Date().toISOString(),
        message: `Teste de câmbio ${exchangeFrom} → ${exchangeTo}`,
      });
    } catch (error) {
      console.error('Erro ao testar câmbio:', error);
    }
  };

  // Limpar cache
  const clearCache = async () => {
    try {
      const response = await fetch('/api/monitoring/apis?action=clear-cache');
      if (response.ok) {
        fetchMetrics(); // Atualizar métricas após limpar cache
      }
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  };

  // Auto refresh
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(fetchMetrics, refreshInterval * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  // Carregar métricas inicial
  useEffect(() => {
    fetchMetrics();
  }, []);

  const calculateCacheHitRate = (cache: { hits: number; misses: number }) => {
    const total = cache.hits + cache.misses;
    return total > 0 ? ((cache.hits / total) * 100).toFixed(1) : '0';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Monitoramento de APIs</h1>
          <p className="text-muted-foreground">
            Status e métricas das integrações externas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={fetchMetrics} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button 
            onClick={() => runTests('all')} 
            disabled={testLoading}
          >
            <Activity className="h-4 w-4 mr-2" />
            Executar Testes
          </Button>
        </div>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Controles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="autoRefresh">Auto-refresh</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="interval">Intervalo (s):</Label>
              <Input
                id="interval"
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-20"
                min="5"
                max="300"
              />
            </div>
            
            <Button onClick={clearCache} variant="destructive" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Limpar Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="tests">Testes</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Requisições
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.systemMetrics.totalRequests.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de Erro
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((metrics.systemMetrics.totalErrors / metrics.systemMetrics.totalRequests) * 100).toFixed(2)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tempo Médio
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.systemMetrics.averageResponseTime.toFixed(0)}ms
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Endpoints Ativos
                  </CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.endpoints.filter(e => e.healthy).length}/{metrics.endpoints.length}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Endpoints */}
        <TabsContent value="endpoints" className="space-y-4">
          {metrics?.endpoints.map((endpoint) => (
            <Card key={endpoint.name}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {endpoint.healthy ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      {endpoint.name}
                    </CardTitle>
                    <CardDescription>{endpoint.url}</CardDescription>
                  </div>
                  <Badge variant={endpoint.healthy ? "default" : "destructive"}>
                    {endpoint.healthy ? "Online" : "Offline"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Requisições</p>
                    <p className="font-medium">{endpoint.totalRequests}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Taxa de Sucesso</p>
                    <p className="font-medium">
                      {((endpoint.successfulRequests / endpoint.totalRequests) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tempo Médio</p>
                    <p className="font-medium">{endpoint.averageResponseTime.toFixed(0)}ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Última Requisição</p>
                    <p className="font-medium">
                      {endpoint.lastRequest ? 
                        new Date(endpoint.lastRequest).toLocaleTimeString() : 
                        'Nunca'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Cache */}
        <TabsContent value="cache" className="space-y-4">
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(metrics.cacheStats).map(([type, stats]) => (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="capitalize">{type} Cache</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Hit Rate</span>
                      <span className="text-sm font-medium">
                        {calculateCacheHitRate(stats)}%
                      </span>
                    </div>
                    
                    <Progress 
                      value={Number(calculateCacheHitRate(stats))} 
                      className="h-2" 
                    />
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Hits</p>
                        <p className="font-medium">{stats.hits}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Misses</p>
                        <p className="font-medium">{stats.misses}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-medium">{stats.size}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Size</p>
                        <p className="font-medium">{stats.maxSize}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Testes */}
        <TabsContent value="tests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Testes Automatizados */}
            <Card>
              <CardHeader>
                <CardTitle>Testes Automatizados</CardTitle>
                <CardDescription>
                  Execute testes completos da infraestrutura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => runTests('all')} 
                  disabled={testLoading}
                  className="w-full"
                >
                  Teste Completo
                </Button>
                <Button 
                  onClick={() => runTests('cep')} 
                  disabled={testLoading}
                  variant="outline"
                  className="w-full"
                >
                  Apenas CEP
                </Button>
                <Button 
                  onClick={() => runTests('exchange')} 
                  disabled={testLoading}
                  variant="outline"
                  className="w-full"
                >
                  Apenas Câmbio
                </Button>
              </CardContent>
            </Card>

            {/* Teste CEP Específico */}
            <Card>
              <CardHeader>
                <CardTitle>Teste CEP</CardTitle>
                <CardDescription>
                  Teste um CEP específico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="cep-test">CEP</Label>
                <Input
                  id="cep-test"
                  value={cepTest}
                  onChange={(e) => setCepTest(e.target.value)}
                  placeholder="01310-100"
                />
                <Button onClick={testSpecificCep} className="w-full">
                  Testar CEP
                </Button>
              </CardContent>
            </Card>

            {/* Teste Câmbio Específico */}
            <Card>
              <CardHeader>
                <CardTitle>Teste Câmbio</CardTitle>
                <CardDescription>
                  Teste uma conversão específica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="exchange-from">De</Label>
                    <Input
                      id="exchange-from"
                      value={exchangeFrom}
                      onChange={(e) => setExchangeFrom(e.target.value.toUpperCase())}
                      placeholder="USD"
                      maxLength={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exchange-to">Para</Label>
                    <Input
                      id="exchange-to"
                      value={exchangeTo}
                      onChange={(e) => setExchangeTo(e.target.value.toUpperCase())}
                      placeholder="BRL"
                      maxLength={3}
                    />
                  </div>
                </div>
                <Button onClick={testSpecificExchange} className="w-full">
                  Testar Conversão
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultados dos Testes */}
          {testResults && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados do Teste</CardTitle>
                <CardDescription>
                  {testResults.message} - {new Date(testResults.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(testResults.results, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
