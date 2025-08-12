'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Calculator, TrendingUp, Shield, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { calculadoraAtuarial } from '@/lib/atuarial/calculadora'
import { calculosFinanceiros, DadosSeguro, DadosAnuidade } from '@/lib/atuarial/calculos-financeiros'

interface ResultadoCalculo {
  tipo: string
  valor: number
  detalhes?: Record<string, unknown>
}

export default function CalculadoraAtuarialPage() {
  const [tipoCalculo, setTipoCalculo] = useState<string>('')
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null)
  const [loading, setLoading] = useState(false)

  // Estados para diferentes tipos de cálculos
  const [dadosSeguro, setDadosSeguro] = useState<DadosSeguro>({
    tipoSeguro: 'vida',
    capital: 100000,
    idade: 35,
    sexo: 'M',
    taxaJuros: 0.06,
    carregamento: 0.3
  })

  const [dadosAnuidade, setDadosAnuidade] = useState<DadosAnuidade>({
    valorPagamento: 1000,
    periodos: 120,
    taxaJuros: 0.06,
    tipoAnuidade: 'ordinaria'
  })

  const [dadosMortalidade, setDadosMortalidade] = useState({
    idade: 35,
    sexo: 'M' as 'M' | 'F',
    prazo: 1
  })

  const executarCalculo = async () => {
    setLoading(true)
    try {
      let resultado: ResultadoCalculo

      switch (tipoCalculo) {
        case 'premio-nivelado':
          const premio = calculosFinanceiros.premioNivelado(dadosSeguro)
          resultado = {
            tipo: 'Prêmio Nivelado',
            valor: premio,
            detalhes: { capital: dadosSeguro.capital, idade: dadosSeguro.idade }
          }
          break

        case 'valor-presente-anuidade':
          const vp = calculosFinanceiros.valorPresenteAnuidade(dadosAnuidade)
          resultado = {
            tipo: 'Valor Presente da Anuidade',
            valor: vp,
            detalhes: { periodos: dadosAnuidade.periodos, pagamento: dadosAnuidade.valorPagamento }
          }
          break

        case 'probabilidade-sobrevivencia':
          const probSobrev = calculadoraAtuarial.calcularProbabilidadeSobrevivencia(
            dadosMortalidade.idade,
            dadosMortalidade.sexo,
            dadosMortalidade.prazo
          )
          resultado = {
            tipo: 'Probabilidade de Sobrevivência',
            valor: probSobrev,
            detalhes: { idade: dadosMortalidade.idade, prazo: dadosMortalidade.prazo }
          }
          break

        case 'expectativa-vida':
          const expectativa = calculadoraAtuarial.calcularExpectativaVida(
            dadosMortalidade.idade,
            dadosMortalidade.sexo
          )
          resultado = {
            tipo: 'Expectativa de Vida',
            valor: expectativa,
            detalhes: { idade: dadosMortalidade.idade, sexo: dadosMortalidade.sexo }
          }
          break

        case 'reserva-tecnica':
          const reserva = calculosFinanceiros.reservaTecnica(dadosSeguro, 5)
          resultado = {
            tipo: 'Reserva Técnica',
            valor: reserva,
            detalhes: { capital: dadosSeguro.capital, tempoDecorrido: 5 }
          }
          break

        case 'analise-sensibilidade':
          const sensibilidade = calculosFinanceiros.analiseSensibilidade(dadosSeguro)
          resultado = {
            tipo: 'Análise de Sensibilidade',
            valor: sensibilidade.sensibilidade,
            detalhes: sensibilidade
          }
          break

        default:
          throw new Error('Tipo de cálculo não selecionado')
      }

      setResultado(resultado)
      toast.success('Cálculo realizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao realizar o cálculo: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const renderFormularioSeguro = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tipoSeguro">Tipo de Seguro</Label>
          <Select value={dadosSeguro.tipoSeguro} onValueChange={(value) => 
            setDadosSeguro(prev => ({ ...prev, tipoSeguro: value as DadosSeguro['tipoSeguro'] }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vida">Seguro de Vida</SelectItem>
              <SelectItem value="acidentes">Acidentes Pessoais</SelectItem>
              <SelectItem value="temporario">Temporário</SelectItem>
              <SelectItem value="dotal">Dotal</SelectItem>
              <SelectItem value="misto">Misto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sexo">Sexo</Label>
          <Select value={dadosSeguro.sexo} onValueChange={(value) => 
            setDadosSeguro(prev => ({ ...prev, sexo: value as 'M' | 'F' }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Feminino</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capital">Capital Segurado (R$)</Label>
          <Input
            type="number"
            value={dadosSeguro.capital}
            onChange={(e) => setDadosSeguro(prev => ({ ...prev, capital: Number(e.target.value) }))}
          />
        </div>

        <div>
          <Label htmlFor="idade">Idade</Label>
          <Input
            type="number"
            min="18"
            max="80"
            value={dadosSeguro.idade}
            onChange={(e) => setDadosSeguro(prev => ({ ...prev, idade: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taxaJuros">Taxa de Juros (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={dadosSeguro.taxaJuros * 100}
            onChange={(e) => setDadosSeguro(prev => ({ ...prev, taxaJuros: Number(e.target.value) / 100 }))}
          />
        </div>

        <div>
          <Label htmlFor="carregamento">Carregamento (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={dadosSeguro.carregamento ? dadosSeguro.carregamento * 100 : 30}
            onChange={(e) => setDadosSeguro(prev => ({ ...prev, carregamento: Number(e.target.value) / 100 }))}
          />
        </div>
      </div>
    </div>
  )

  const renderFormularioAnuidade = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valorPagamento">Valor do Pagamento (R$)</Label>
          <Input
            type="number"
            value={dadosAnuidade.valorPagamento}
            onChange={(e) => setDadosAnuidade(prev => ({ ...prev, valorPagamento: Number(e.target.value) }))}
          />
        </div>

        <div>
          <Label htmlFor="periodos">Número de Períodos</Label>
          <Input
            type="number"
            value={dadosAnuidade.periodos}
            onChange={(e) => setDadosAnuidade(prev => ({ ...prev, periodos: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taxaJurosAnuidade">Taxa de Juros (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={dadosAnuidade.taxaJuros * 100}
            onChange={(e) => setDadosAnuidade(prev => ({ ...prev, taxaJuros: Number(e.target.value) / 100 }))}
          />
        </div>

        <div>
          <Label htmlFor="tipoAnuidade">Tipo de Anuidade</Label>
          <Select value={dadosAnuidade.tipoAnuidade} onValueChange={(value) => 
            setDadosAnuidade(prev => ({ ...prev, tipoAnuidade: value as DadosAnuidade['tipoAnuidade'] }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ordinaria">Ordinária</SelectItem>
              <SelectItem value="antecipada">Antecipada</SelectItem>
              <SelectItem value="diferida">Diferida</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderFormularioMortalidade = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="idadeMortalidade">Idade</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={dadosMortalidade.idade}
            onChange={(e) => setDadosMortalidade(prev => ({ ...prev, idade: Number(e.target.value) }))}
          />
        </div>

        <div>
          <Label htmlFor="sexoMortalidade">Sexo</Label>
          <Select value={dadosMortalidade.sexo} onValueChange={(value) => 
            setDadosMortalidade(prev => ({ ...prev, sexo: value as 'M' | 'F' }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculino</SelectItem>
              <SelectItem value="F">Feminino</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="prazo">Prazo (anos)</Label>
          <Input
            type="number"
            min="1"
            max="50"
            value={dadosMortalidade.prazo}
            onChange={(e) => setDadosMortalidade(prev => ({ ...prev, prazo: Number(e.target.value) }))}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Calculadora Atuarial Profissional
        </h1>
        <p className="text-gray-600">
          Sistema completo de cálculos atuariais baseado em normas SUSEP
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção do Tipo de Cálculo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Tipo de Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={tipoCalculo} onValueChange={setTipoCalculo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cálculo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="premio-nivelado">Prêmio Nivelado</SelectItem>
                <SelectItem value="valor-presente-anuidade">Valor Presente - Anuidade</SelectItem>
                <SelectItem value="probabilidade-sobrevivencia">Probabilidade Sobrevivência</SelectItem>
                <SelectItem value="expectativa-vida">Expectativa de Vida</SelectItem>
                <SelectItem value="reserva-tecnica">Reserva Técnica</SelectItem>
                <SelectItem value="analise-sensibilidade">Análise de Sensibilidade</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Formulários de Entrada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Parâmetros
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(tipoCalculo === 'premio-nivelado' || 
              tipoCalculo === 'reserva-tecnica' || 
              tipoCalculo === 'analise-sensibilidade') && renderFormularioSeguro()}
            
            {tipoCalculo === 'valor-presente-anuidade' && renderFormularioAnuidade()}
            
            {(tipoCalculo === 'probabilidade-sobrevivencia' || 
              tipoCalculo === 'expectativa-vida') && renderFormularioMortalidade()}

            <Separator className="my-4" />
            
            <Button 
              onClick={executarCalculo}
              disabled={!tipoCalculo || loading}
              className="w-full"
            >
              {loading ? 'Calculando...' : 'Calcular'}
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resultado ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {resultado.tipo}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    {resultado.tipo.includes('Probabilidade') || resultado.tipo.includes('Sensibilidade') 
                      ? `${(resultado.valor * 100).toFixed(4)}%`
                      : `R$ ${resultado.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    }
                  </div>
                </div>

                {resultado.detalhes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Detalhes:</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {Object.entries(resultado.detalhes).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                          <span>{typeof value === 'number' 
                            ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                            : String(value)
                          }</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Selecione um tipo de cálculo e preencha os parâmetros para ver os resultados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
