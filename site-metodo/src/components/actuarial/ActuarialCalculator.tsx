'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calculator, TrendingUp, Users, FileText, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  useActuarialStore, 
  useSelectedTable, 
  useCalculationHistory, 
  useIsCalculating, 
  useLastError,
  useMortalityTables,
  useDefaultRates
} from '@/lib/actuarial/store';
import { LifeInsuranceParams, AnnuityParams } from '@/lib/actuarial/calculations';

export function ActuarialCalculator() {
  const [activeTab, setActiveTab] = useState('life-insurance');
  
  // Estado do Zustand
  const selectedTable = useSelectedTable();
  const calculationHistory = useCalculationHistory();
  const isCalculating = useIsCalculating();
  const lastError = useLastError();
  const mortalityTables = useMortalityTables();
  const defaultRates = useDefaultRates();
  
  // Actions do store
  const {
    selectMortalityTable,
    calculateLifeInsurance,
    calculateAnnuity,
    calculateMortalityAnalysis,
    clearError
  } = useActuarialStore();

  // Estados dos formulários
  const [lifeInsuranceForm, setLifeInsuranceForm] = useState({
    age: 35,
    insuranceAmount: 100000,
    premiumPaymentPeriod: 20,
    interestRate: defaultRates.interestRate,
    loading: defaultRates.loadingRate
  });

  const [annuityForm, setAnnuityForm] = useState({
    age: 65,
    annuityAmount: 2000,
    paymentFrequency: 12,
    interestRate: defaultRates.interestRate,
    immediateStart: true
  });

  const [mortalityForm, setMortalityForm] = useState({
    age: 40
  });

  // Handlers dos formulários
  const handleLifeInsuranceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) {
      alert('Selecione uma tabela de mortalidade');
      return;
    }

    const params: LifeInsuranceParams = {
      ...lifeInsuranceForm,
      mortalityTable: selectedTable
    };

    await calculateLifeInsurance(params);
  };

  const handleAnnuitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) {
      alert('Selecione uma tabela de mortalidade');
      return;
    }

    const params: AnnuityParams = {
      ...annuityForm,
      mortalityTable: selectedTable
    };

    await calculateAnnuity(params);
  };

  const handleMortalityAnalysisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) {
      alert('Selecione uma tabela de mortalidade');
      return;
    }

    await calculateMortalityAnalysis(selectedTable.name, mortalityForm.age);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calculadora Atuarial</h1>
          <p className="text-muted-foreground">
            Ferramentas avançadas para cálculos de seguros, anuidades e análise de mortalidade
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Manual
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Seleção da Tabela de Mortalidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tabela de Mortalidade
          </CardTitle>
          <CardDescription>
            Selecione a tabela de mortalidade para os cálculos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="mortality-table">Tabela Selecionada</Label>
              <Select onValueChange={selectMortalityTable} value={selectedTable?.name || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma tabela..." />
                </SelectTrigger>
                <SelectContent>
                  {mortalityTables.map((table) => (
                    <SelectItem key={table.name} value={table.name}>
                      {table.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTable && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedTable.country}</Badge>
                  <Badge variant="outline">{selectedTable.year}</Badge>
                  <Badge variant="outline" className="capitalize">{selectedTable.gender}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedTable.entries.length} idades disponíveis 
                  (de {Math.min(...selectedTable.entries.map(e => e.age))} a {Math.max(...selectedTable.entries.map(e => e.age))} anos)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mensagem de Erro */}
      {lastError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {lastError}
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2" 
              onClick={clearError}
            >
              Fechar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Calculadoras */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="life-insurance">Seguro de Vida</TabsTrigger>
          <TabsTrigger value="annuity">Anuidades</TabsTrigger>
          <TabsTrigger value="mortality">Análise de Mortalidade</TabsTrigger>
        </TabsList>

        {/* Seguro de Vida */}
        <TabsContent value="life-insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Cálculo de Seguro de Vida
              </CardTitle>
              <CardDescription>
                Calcule prêmios e valores presentes para seguros de vida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLifeInsuranceSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <Label htmlFor="life-age">Idade do Segurado</Label>
                    <Input
                      id="life-age"
                      type="number"
                      min="18"
                      max="100"
                      value={lifeInsuranceForm.age}
                      onChange={(e) => setLifeInsuranceForm(prev => ({
                        ...prev,
                        age: parseInt(e.target.value) || 18
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="insurance-amount">Valor Segurado (R$)</Label>
                    <Input
                      id="insurance-amount"
                      type="number"
                      min="1000"
                      step="1000"
                      value={lifeInsuranceForm.insuranceAmount}
                      onChange={(e) => setLifeInsuranceForm(prev => ({
                        ...prev,
                        insuranceAmount: parseFloat(e.target.value) || 1000
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-period">Período de Pagamento (anos)</Label>
                    <Input
                      id="payment-period"
                      type="number"
                      min="1"
                      max="50"
                      value={lifeInsuranceForm.premiumPaymentPeriod}
                      onChange={(e) => setLifeInsuranceForm(prev => ({
                        ...prev,
                        premiumPaymentPeriod: parseInt(e.target.value) || 1
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="life-interest-rate">Taxa de Juros (%)</Label>
                    <Input
                      id="life-interest-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={lifeInsuranceForm.interestRate * 100}
                      onChange={(e) => setLifeInsuranceForm(prev => ({
                        ...prev,
                        interestRate: (parseFloat(e.target.value) || 0) / 100
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="loading-rate">Carregamento (%)</Label>
                    <Input
                      id="loading-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={lifeInsuranceForm.loading * 100}
                      onChange={(e) => setLifeInsuranceForm(prev => ({
                        ...prev,
                        loading: (parseFloat(e.target.value) || 0) / 100
                      }))}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isCalculating || !selectedTable}
                  className="w-full md:w-auto"
                >
                  {isCalculating ? 'Calculando...' : 'Calcular Seguro de Vida'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anuidades */}
        <TabsContent value="annuity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Cálculo de Anuidades
              </CardTitle>
              <CardDescription>
                Calcule valores presentes de anuidades vitalícias e temporárias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnnuitySubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <Label htmlFor="annuity-age">Idade do Beneficiário</Label>
                    <Input
                      id="annuity-age"
                      type="number"
                      min="18"
                      max="100"
                      value={annuityForm.age}
                      onChange={(e) => setAnnuityForm(prev => ({
                        ...prev,
                        age: parseInt(e.target.value) || 18
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="annuity-amount">Valor da Anuidade (R$)</Label>
                    <Input
                      id="annuity-amount"
                      type="number"
                      min="100"
                      step="100"
                      value={annuityForm.annuityAmount}
                      onChange={(e) => setAnnuityForm(prev => ({
                        ...prev,
                        annuityAmount: parseFloat(e.target.value) || 100
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-frequency">Frequência de Pagamento</Label>
                    <Select 
                      value={annuityForm.paymentFrequency.toString()} 
                      onValueChange={(value) => setAnnuityForm(prev => ({
                        ...prev,
                        paymentFrequency: parseInt(value)
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Anual</SelectItem>
                        <SelectItem value="2">Semestral</SelectItem>
                        <SelectItem value="4">Trimestral</SelectItem>
                        <SelectItem value="12">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="annuity-interest-rate">Taxa de Juros (%)</Label>
                    <Input
                      id="annuity-interest-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={annuityForm.interestRate * 100}
                      onChange={(e) => setAnnuityForm(prev => ({
                        ...prev,
                        interestRate: (parseFloat(e.target.value) || 0) / 100
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="immediate-start">Início dos Pagamentos</Label>
                    <Select 
                      value={annuityForm.immediateStart.toString()} 
                      onValueChange={(value) => setAnnuityForm(prev => ({
                        ...prev,
                        immediateStart: value === 'true'
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Imediato</SelectItem>
                        <SelectItem value="false">Diferido (1 ano)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isCalculating || !selectedTable}
                  className="w-full md:w-auto"
                >
                  {isCalculating ? 'Calculando...' : 'Calcular Anuidade'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análise de Mortalidade */}
        <TabsContent value="mortality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Análise de Mortalidade
              </CardTitle>
              <CardDescription>
                Analise probabilidades de sobrevivência e expectativa de vida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMortalityAnalysisSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="mortality-age">Idade para Análise</Label>
                    <Input
                      id="mortality-age"
                      type="number"
                      min="18"
                      max="100"
                      value={mortalityForm.age}
                      onChange={(e) => setMortalityForm(prev => ({
                        ...prev,
                        age: parseInt(e.target.value) || 18
                      }))}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isCalculating || !selectedTable}
                  className="w-full md:w-auto"
                >
                  {isCalculating ? 'Analisando...' : 'Analisar Mortalidade'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Histórico de Cálculos */}
      {calculationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Cálculos</CardTitle>
            <CardDescription>
              Últimos cálculos realizados ({calculationHistory.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calculationHistory.slice(0, 5).map((calc) => (
                <div key={calc.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{calc.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(calc.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {calc.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  {calc.type === 'life-insurance' && (
                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      <div>
                        <span className="font-medium">Prêmio Anual: </span>
                        {formatCurrency(calc.outputs.annualPremium as number)}
                      </div>
                      <div>
                        <span className="font-medium">Valor Presente: </span>
                        {formatCurrency(calc.outputs.presentValue as number)}
                      </div>
                      <div>
                        <span className="font-medium">Taxa Efetiva: </span>
                        {formatPercentage(calc.outputs.effectiveRate as number)}
                      </div>
                    </div>
                  )}
                  
                  {calc.type === 'annuity' && (
                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      <div>
                        <span className="font-medium">VP Anuidade Vitalícia: </span>
                        {formatCurrency(calc.outputs.lifeAnnuityPV as number)}
                      </div>
                      <div>
                        <span className="font-medium">Capital Necessário: </span>
                        {formatCurrency(calc.outputs.capitalRequired as number)}
                      </div>
                      <div>
                        <span className="font-medium">Expectativa de Vida: </span>
                        {(calc.outputs.lifeExpectancy as number).toFixed(2)} anos
                      </div>
                    </div>
                  )}
                  
                  {calc.type === 'mortality-analysis' && (
                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      <div>
                        <span className="font-medium">Expectativa de Vida: </span>
                        {(calc.outputs.lifeExpectancy as number).toFixed(2)} anos
                      </div>
                      <div>
                        <span className="font-medium">Sobrevivência 10 anos: </span>
                        {formatPercentage(((calc.outputs.survivalProbabilities as Record<string, unknown>).year10 as number) || 0)}
                      </div>
                      <div>
                        <span className="font-medium">qx atual: </span>
                        {formatPercentage(calc.outputs.currentQx as number)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
