'use client'

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  Calculator,
  Target
} from 'lucide-react';
import { 
  useCalculationHistory, 
  useMortalityTables, 
  useSelectedTable 
} from '@/lib/actuarial/store';
import { MortalityCalculations } from '@/lib/actuarial/calculations';

const CHART_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', 
  '#ff00ff', '#00ffff', '#ff0000', '#0000ff', '#ffff00'
];

export function ActuarialReports() {
  const [reportFilters, setReportFilters] = useState({
    tableName: '',
    startAge: 20,
    endAge: 80,
    calculationType: 'all'
  });

  const calculationHistory = useCalculationHistory();
  const mortalityTables = useMortalityTables();
  const selectedTable = useSelectedTable();

  // Dados processados para gráficos
  const mortalityChartData = useMemo(() => {
    if (!selectedTable) return [];
    
    const startAge = reportFilters.startAge;
    const endAge = reportFilters.endAge;
    
    return selectedTable.entries
      .filter(entry => entry.age >= startAge && entry.age <= endAge)
      .map(entry => ({
        age: entry.age,
        qx: entry.qx,
        qxPercent: entry.qx * 100,
        px: 1 - entry.qx,
        pxPercent: (1 - entry.qx) * 100
      }));
  }, [selectedTable, reportFilters.startAge, reportFilters.endAge]);

  // Dados de expectativa de vida
  const lifeExpectancyData = useMemo(() => {
    if (!selectedTable) return [];
    
    const data = [];
    
    for (let age = reportFilters.startAge; age <= reportFilters.endAge; age += 5) {
      const lifeExpectancy = MortalityCalculations.lifeExpectancy(selectedTable, age);
      data.push({
        age,
        lifeExpectancy: lifeExpectancy,
        remainingYears: Math.round(lifeExpectancy * 10) / 10
      });
    }
    
    return data;
  }, [selectedTable, reportFilters.startAge, reportFilters.endAge]);

  // Análise de portfólio de seguros
  const portfolioAnalysis = useMemo(() => {
    const lifeInsuranceCalcs = calculationHistory.filter(calc => calc.type === 'life-insurance');
    const annuityCalcs = calculationHistory.filter(calc => calc.type === 'annuity');
    
    const portfolioStats = {
      totalPolicies: lifeInsuranceCalcs.length,
      totalAnnuities: annuityCalcs.length,
      totalPremiums: lifeInsuranceCalcs.reduce((sum, calc) => sum + ((calc.outputs.annualPremium as number) || 0), 0),
      totalCoverage: lifeInsuranceCalcs.reduce((sum, calc) => sum + ((calc.inputs.insuranceAmount as number) || 0), 0),
      averageAge: lifeInsuranceCalcs.length > 0 ? 
        lifeInsuranceCalcs.reduce((sum, calc) => sum + ((calc.inputs.age as number) || 0), 0) / lifeInsuranceCalcs.length : 0,
      riskDistribution: {} as Array<{ range: string; count: number; percentage: number }>
    };

    // Distribuição de risco por faixa etária
    const ageGroups = {
      '18-30': 0,
      '31-45': 0,
      '46-60': 0,
      '61-80': 0,
      '80+': 0
    };

    lifeInsuranceCalcs.forEach(calc => {
      const age = (calc.inputs.age as number) || 0;
      if (age <= 30) ageGroups['18-30']++;
      else if (age <= 45) ageGroups['31-45']++;
      else if (age <= 60) ageGroups['46-60']++;
      else if (age <= 80) ageGroups['61-80']++;
      else ageGroups['80+']++;
    });

    portfolioStats.riskDistribution = Object.entries(ageGroups).map(([range, count]) => ({
      range,
      count,
      percentage: portfolioStats.totalPolicies > 0 ? (count / portfolioStats.totalPolicies) * 100 : 0
    }));

    return portfolioStats;
  }, [calculationHistory]);

  // Análise comparativa de tabelas
  const tableComparison = useMemo(() => {
    if (mortalityTables.length < 2) return [];
    
    const comparisonData: Array<Record<string, number>> = [];
    const ages = [25, 35, 45, 55, 65, 75];
    
    ages.forEach(age => {
      const dataPoint: Record<string, number> = { age };
      
      mortalityTables.forEach(table => {
        const entry = table.entries.find(e => e.age === age);
        if (entry) {
          dataPoint[table.name] = entry.qx * 1000; // qx per 1000
        }
      });
      
      comparisonData.push(dataPoint);
    });
    
    return comparisonData;
  }, [mortalityTables]);

  // Funções de formatação
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Exportar dados como CSV
  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Atuariais</h1>
          <p className="text-muted-foreground">
            Análises e visualizações dos cálculos atuariais realizados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Relatório Completo
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Relatório</CardTitle>
          <CardDescription>Configure os parâmetros para análise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="table-filter">Tabela de Mortalidade</Label>
              <Select 
                value={reportFilters.tableName} 
                onValueChange={(value) => setReportFilters(prev => ({ ...prev, tableName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as tabelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as tabelas</SelectItem>
                  {mortalityTables.map(table => (
                    <SelectItem key={table.name} value={table.name}>
                      {table.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start-age">Idade Inicial</Label>
              <Input
                id="start-age"
                type="number"
                min="18"
                max="100"
                value={reportFilters.startAge}
                onChange={(e) => setReportFilters(prev => ({ 
                  ...prev, 
                  startAge: parseInt(e.target.value) || 18 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="end-age">Idade Final</Label>
              <Input
                id="end-age"
                type="number"
                min="18"
                max="100"
                value={reportFilters.endAge}
                onChange={(e) => setReportFilters(prev => ({ 
                  ...prev, 
                  endAge: parseInt(e.target.value) || 100 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="calc-type">Tipo de Cálculo</Label>
              <Select 
                value={reportFilters.calculationType} 
                onValueChange={(value) => setReportFilters(prev => ({ ...prev, calculationType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="life-insurance">Seguro de Vida</SelectItem>
                  <SelectItem value="annuity">Anuidades</SelectItem>
                  <SelectItem value="mortality-analysis">Análise de Mortalidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cálculos</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculationHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              +{calculationHistory.filter(calc => 
                new Date(calc.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length} esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prêmios Totais</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolioAnalysis.totalPremiums)}
            </div>
            <p className="text-xs text-muted-foreground">
              {portfolioAnalysis.totalPolicies} apólices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolioAnalysis.totalCoverage)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor segurado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idade Média</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioAnalysis.averageAge.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              anos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Análises */}
      <Tabs defaultValue="mortality-analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mortality-analysis">Análise de Mortalidade</TabsTrigger>
          <TabsTrigger value="portfolio-analysis">Análise de Portfólio</TabsTrigger>
          <TabsTrigger value="table-comparison">Comparação de Tabelas</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        {/* Análise de Mortalidade */}
        <TabsContent value="mortality-analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Mortalidade (qx)</CardTitle>
                <CardDescription>
                  {selectedTable ? `Tabela: ${selectedTable.description}` : 'Selecione uma tabela'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mortalityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis tickFormatter={(value) => `${(value * 100).toFixed(3)}%`} />
                    <Tooltip 
                      formatter={(value: number) => [`${(value * 100).toFixed(4)}%`, 'qx']}
                      labelFormatter={(label) => `Idade: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="qx" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expectativa de Vida</CardTitle>
                <CardDescription>Anos restantes esperados por idade</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={lifeExpectancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)} anos`, 'Expectativa']}
                      labelFormatter={(label) => `Idade: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lifeExpectancy" 
                      stroke="#82ca9d" 
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Probabilidade de Sobrevivência (px)</CardTitle>
              <CardDescription>Complemento da taxa de mortalidade</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={mortalityChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
                  <Tooltip 
                    formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'px']}
                    labelFormatter={(label) => `Idade: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="px" 
                    stroke="#ffc658" 
                    fill="#ffc658"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análise de Portfólio */}
        <TabsContent value="portfolio-analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Faixa Etária</CardTitle>
                <CardDescription>Concentração de risco no portfólio</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioAnalysis.riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {portfolioAnalysis.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} apólices`, 'Quantidade']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo do Portfólio</CardTitle>
                <CardDescription>Estatísticas principais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total de Apólices:</span>
                    <Badge variant="outline">{portfolioAnalysis.totalPolicies}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total de Anuidades:</span>
                    <Badge variant="outline">{portfolioAnalysis.totalAnnuities}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Prêmios Anuais:</span>
                    <span className="text-sm">{formatCurrency(portfolioAnalysis.totalPremiums)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cobertura Total:</span>
                    <span className="text-sm">{formatCurrency(portfolioAnalysis.totalCoverage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Idade Média:</span>
                    <span className="text-sm">{portfolioAnalysis.averageAge.toFixed(1)} anos</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => exportToCSV(
                      calculationHistory.map(calc => ({
                        tipo: calc.type,
                        idade: calc.inputs.age,
                        valor: calc.inputs.insuranceAmount || calc.inputs.annuityAmount,
                        premio: calc.outputs.annualPremium,
                        timestamp: calc.timestamp
                      })),
                      'portfolio-analysis'
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Dados do Portfólio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico Recente */}
          <Card>
            <CardHeader>
              <CardTitle>Cálculos Recentes</CardTitle>
              <CardDescription>Últimos 10 cálculos realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {calculationHistory.slice(0, 10).map((calc) => (
                  <div key={calc.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <span className="font-medium">{calc.description}</span>
                      <div className="text-xs text-muted-foreground">
                        {new Date(calc.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {calc.type.replace('-', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparação de Tabelas */}
        <TabsContent value="table-comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparação entre Tabelas de Mortalidade</CardTitle>
              <CardDescription>
                qx por 1000 pessoas para idades selecionadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tableComparison.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={tableComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    {mortalityTables.map((table, index) => (
                      <Line 
                        key={table.name}
                        type="monotone" 
                        dataKey={table.name} 
                        stroke={CHART_COLORS[index % CHART_COLORS.length]}
                        strokeWidth={2}
                        name={table.description}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Importe pelo menos 2 tabelas de mortalidade para comparação
                </div>
              )}
            </CardContent>
          </Card>

          {tableComparison.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tabelas Comparadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {mortalityTables.map((table, index) => (
                    <div key={table.name} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      ></div>
                      <span className="text-sm">{table.description}</span>
                      <Badge variant="outline">{table.gender}</Badge>
                      <Badge variant="outline">{table.year}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tendências */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Cálculos</CardTitle>
              <CardDescription>Análise temporal dos cálculos realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Funcionalidade em desenvolvimento - análise de tendências temporais
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
