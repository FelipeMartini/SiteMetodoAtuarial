'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calculator, TrendingUp, FileText, Database, Download, Upload, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCalculosAtuariais } from '@/hooks/useCalculosAtuariais'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

export function CalculosAtuariaisModerno() {
  const {
    calculos,
    tabuas,
    isLoadingCalculos,
    isLoadingTabuas,
    isCalculating,
    calculoError,
    tabuasError,
    calcularSeguroVida,
    calcularRendaVitalicia,
    calcularReservaMatematica
  } = useCalculosAtuariais()

  const [activeTab, setActiveTab] = useState('calculadora')
  const [selectedTable, setSelectedTable] = useState<string>('')

  // Estados para formulários
  const [lifeInsuranceForm, setLifeInsuranceForm] = useState({
    idade: 30,
    sexo: 'M' as 'M' | 'F',
    capital: 100000,
    taxaJuros: 0.06,
    anos: 20
  })

  const [annuityForm, setAnnuityForm] = useState({
    idade: 65,
    sexo: 'M' as 'M' | 'F',
    valorRenda: 5000,
    taxaJuros: 0.05,
    tipo: 'vitalicia'
  })

  const [reserveForm, setReserveForm] = useState({
    idade: 35,
    sexo: 'F' as 'M' | 'F',
    capital: 200000,
    taxaJuros: 0.055,
    anosPassados: 5
  })

  // Dados para gráficos
  const chartData = [
    { idade: 30, qx: 0.001, ex: 45.2 },
    { idade: 40, qx: 0.002, ex: 35.8 },
    { idade: 50, qx: 0.005, ex: 26.5 },
    { idade: 60, qx: 0.012, ex: 18.2 },
    { idade: 70, qx: 0.035, ex: 11.1 },
    { idade: 80, qx: 0.085, ex: 5.8 },
  ]

  const pieData = [
    { name: 'Seguro de Vida', value: 35, color: '#8884d8' },
    { name: 'Renda Vitalícia', value: 25, color: '#82ca9d' },
    { name: 'Reserva Matemática', value: 20, color: '#ffc658' },
    { name: 'Outros', value: 20, color: '#ff7300' },
  ]

  const handleLifeInsuranceCalculation = async () => {
    try {
      await calcularSeguroVida(lifeInsuranceForm, selectedTable || undefined)
    } catch (error) {
      console.error('Erro no cálculo:', error)
    }
  }

  const handleAnnuityCalculation = async () => {
    try {
      await calcularRendaVitalicia(annuityForm, selectedTable || undefined)
    } catch (error) {
      console.error('Erro no cálculo:', error)
    }
  }

  const handleReserveCalculation = async () => {
    try {
      await calcularReservaMatematica(reserveForm, selectedTable || undefined)
    } catch (error) {
      console.error('Erro no cálculo:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Alertas de Erro */}
      {(calculoError || tabuasError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {calculoError?.message || tabuasError?.message || 'Erro desconhecido'}
          </AlertDescription>
        </Alert>
      )}

      {/* Header com Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cálculos Realizados</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculos?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total de cálculos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tábuas Ativas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tabuas?.filter(t => t.status === 'ativa').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {tabuas?.length || 0} tábuas totais
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculos?.length > 0 
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(
                    calculos.reduce((sum, calc) => sum + (calc.resultado?.valor || 0), 0) / calculos.length
                  )
                : 'R$ 0'
              }
            </div>
            <p className="text-xs text-muted-foreground">Média dos cálculos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Disponível em breve</p>
          </CardContent>
        </Card>
      </div>

      {/* Interface Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculadora">Calculadoras</TabsTrigger>
          <TabsTrigger value="tabuas">Tábuas de Mortalidade</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Aba Calculadoras */}
        <TabsContent value="calculadora" className="space-y-4">
          {/* Seletor de Tábua de Mortalidade */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>
                Selecione a tábua de mortalidade para os cálculos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="mortality-table">Tábua de Mortalidade</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma tábua (padrão: AT-2000)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">AT-2000 (Padrão)</SelectItem>
                    {tabuas?.map((tabua) => (
                      <SelectItem key={tabua.id} value={tabua.id}>
                        {tabua.nome} ({tabua.ano}) - {tabua.fonte}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Seguro de Vida */}
            <Card>
              <CardHeader>
                <CardTitle>Seguro de Vida</CardTitle>
                <CardDescription>
                  Calcule prêmios únicos e nivelados para seguros de vida
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="life-age">Idade</Label>
                    <Input
                      id="life-age"
                      type="number"
                      value={lifeInsuranceForm.idade}
                      onChange={(e) => setLifeInsuranceForm(prev => ({
                        ...prev,
                        idade: parseInt(e.target.value) || 30
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="life-sex">Sexo</Label>
                    <Select
                      value={lifeInsuranceForm.sexo}
                      onValueChange={(value: 'M' | 'F') => setLifeInsuranceForm(prev => ({
                        ...prev,
                        sexo: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="life-capital">Capital Segurado</Label>
                    <Input
                      id="life-capital"
                      type="number"
                      value={lifeInsuranceForm.capital}
                      onChange={(e) => setLifeInsuranceForm(prev => ({
                        ...prev,
                        capital: parseFloat(e.target.value) || 100000
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="life-rate">Taxa de Juros (%)</Label>
                    <Input
                      id="life-rate"
                      type="number"
                      step="0.01"
                      value={lifeInsuranceForm.taxaJuros * 100}
                      onChange={(e) => setLifeInsuranceForm(prev => ({
                        ...prev,
                        taxaJuros: parseFloat(e.target.value) / 100 || 0.06
                      }))}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleLifeInsuranceCalculation}
                  disabled={isCalculating}
                  className="w-full"
                >
                  {isCalculating ? 'Calculando...' : 'Calcular Prêmio'}
                </Button>
              </CardContent>
            </Card>

            {/* Renda Vitalícia */}
            <Card>
              <CardHeader>
                <CardTitle>Renda Vitalícia</CardTitle>
                <CardDescription>
                  Calcule valores presentes de rendas vitalícias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annuity-age">Idade</Label>
                    <Input
                      id="annuity-age"
                      type="number"
                      value={annuityForm.idade}
                      onChange={(e) => setAnnuityForm(prev => ({
                        ...prev,
                        idade: parseInt(e.target.value) || 65
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annuity-sex">Sexo</Label>
                    <Select
                      value={annuityForm.sexo}
                      onValueChange={(value: 'M' | 'F') => setAnnuityForm(prev => ({
                        ...prev,
                        sexo: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annuity-value">Valor da Renda</Label>
                    <Input
                      id="annuity-value"
                      type="number"
                      value={annuityForm.valorRenda}
                      onChange={(e) => setAnnuityForm(prev => ({
                        ...prev,
                        valorRenda: parseFloat(e.target.value) || 5000
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annuity-rate">Taxa de Juros (%)</Label>
                    <Input
                      id="annuity-rate"
                      type="number"
                      step="0.01"
                      value={annuityForm.taxaJuros * 100}
                      onChange={(e) => setAnnuityForm(prev => ({
                        ...prev,
                        taxaJuros: parseFloat(e.target.value) / 100 || 0.05
                      }))}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAnnuityCalculation}
                  disabled={isCalculating}
                  className="w-full"
                >
                  {isCalculating ? 'Calculando...' : 'Calcular Renda'}
                </Button>
              </CardContent>
            </Card>

            {/* Reserva Matemática */}
            <Card>
              <CardHeader>
                <CardTitle>Reserva Matemática</CardTitle>
                <CardDescription>
                  Calcule reservas matemáticas para apólices existentes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reserve-age">Idade Atual</Label>
                    <Input
                      id="reserve-age"
                      type="number"
                      value={reserveForm.idade}
                      onChange={(e) => setReserveForm(prev => ({
                        ...prev,
                        idade: parseInt(e.target.value) || 35
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reserve-sex">Sexo</Label>
                    <Select
                      value={reserveForm.sexo}
                      onValueChange={(value: 'M' | 'F') => setReserveForm(prev => ({
                        ...prev,
                        sexo: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reserve-capital">Capital Segurado</Label>
                    <Input
                      id="reserve-capital"
                      type="number"
                      value={reserveForm.capital}
                      onChange={(e) => setReserveForm(prev => ({
                        ...prev,
                        capital: parseFloat(e.target.value) || 200000
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reserve-years">Anos Passados</Label>
                    <Input
                      id="reserve-years"
                      type="number"
                      value={reserveForm.anosPassados}
                      onChange={(e) => setReserveForm(prev => ({
                        ...prev,
                        anosPassados: parseInt(e.target.value) || 5
                      }))}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleReserveCalculation}
                  disabled={isCalculating}
                  className="w-full"
                >
                  {isCalculating ? 'Calculando...' : 'Calcular Reserva'}
                </Button>
              </CardContent>
            </Card>

            {/* Visualizações */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Mortalidade</CardTitle>
                <CardDescription>
                  Visualização das taxas de mortalidade por idade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="idade" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="qx" stroke="#8884d8" name="Taxa Mortalidade" />
                    <Line type="monotone" dataKey="ex" stroke="#82ca9d" name="Expectativa Vida" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Tábuas de Mortalidade */}
        <TabsContent value="tabuas" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Gestão de Tábuas de Mortalidade</h3>
              <p className="text-sm text-muted-foreground">
                Importe, exporte e gerencie suas tábuas de mortalidade
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Importar Excel
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {isLoadingTabuas ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {tabuas?.map((table) => (
                <Card key={table.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{table.nome}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Ano: {table.ano}</span>
                          <span>•</span>
                          <span>Fonte: {table.fonte}</span>
                          <span>•</span>
                          <span>Sexo: {table.sexo}</span>
                          <span>•</span>
                          <span>Taxas: {table._count?.taxas || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={table.status === 'ativa' ? 'default' : 'secondary'}>
                          {table.status}
                        </Badge>
                        <Button variant="outline" size="sm" disabled>
                          Visualizar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!tabuas || tabuas.length === 0) && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma tábua de mortalidade encontrada.
                      <br />
                      Use os botões acima para importar tábuas.
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Aba Relatórios */}
        <TabsContent value="relatorios" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Cálculos</CardTitle>
                <CardDescription>
                  Tipos de cálculos mais utilizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume de Cálculos</CardTitle>
                <CardDescription>
                  Análise temporal dos cálculos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="idade" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="qx" fill="#8884d8" name="Frequência" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gerar Relatórios</CardTitle>
              <CardDescription>
                Exporte relatórios detalhados dos cálculos realizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" disabled>
                  <FileText className="h-4 w-4 mr-2" />
                  Relatório PDF
                </Button>
                <Button variant="outline" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
                <Button variant="outline" disabled>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Análise Comparativa
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Recursos de exportação disponíveis em breve
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Histórico */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Cálculos</CardTitle>
              <CardDescription>
                Últimos cálculos realizados ({calculos?.length || 0} registros)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCalculos ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : calculos && calculos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum cálculo realizado ainda.
                  <br />
                  Use as calculadoras para ver o histórico aqui.
                </div>
              ) : (
                <div className="space-y-4">
                  {calculos?.map((calculo, index) => (
                    <div key={calculo.id || index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {calculo.tipo.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(calculo.dataCalculo).toLocaleString('pt-BR')}
                          </span>
                          {calculo.tabua && (
                            <Badge variant="secondary">
                              {calculo.tabua.nome}
                            </Badge>
                          )}
                        </div>
                        <div className="text-lg font-semibold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(calculo.resultado?.valor || 0)}
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="text-sm text-muted-foreground">
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(calculo.parametros).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium capitalize">{key}:</span>{' '}
                              {typeof value === 'number' && key.includes('taxa') 
                                ? `${(value * 100).toFixed(2)}%`
                                : String(value)
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
