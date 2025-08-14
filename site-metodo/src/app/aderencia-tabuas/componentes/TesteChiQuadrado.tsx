'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Calculator, Play, Info, AlertTriangle, ChevronRight } from 'lucide-react'

interface DadosAderencia {
  massa_participantes: Array<{
    matricula: string;
    sexo: number;
    idade: number;
    ano_cadastro: number;
  }>;
  tabuas_mortalidade: Array<{
    idade: number;
    qx_masculino: number;
    qx_feminino: number;
    at2000_suav_masc: number;
    at2000_suav_fem: number;
  }>;
  calculos_massa_qx: Array<{
    matricula: string;
    ano_obito: number;
    sexo: number;
    idade: number;
    qx_aplicado: number;
    obitos_observados: number;
    obitos_esperados: number;
  }>;
  calculos_estatisticos: {
    graus_liberdade: number;
    chi_quadrado: number;
    valor_p: number;
    nivel_significancia: number;
    resultado_teste: 'ACEITA' | 'REJEITA';
  };
}

interface TesteChiQuadradoProps {
  dados: DadosAderencia
  onExecutarTeste: () => Promise<void>
  processando: boolean
}

export function TesteChiQuadrado({ dados, onExecutarTeste, processando }: TesteChiQuadradoProps) {
  const [nivelSignificancia, setNivelSignificancia] = useState([0.05])
  const [tabuaSelecionada, setTabuaSelecionada] = useState<'at2000' | 'qx_original'>('at2000')

  const totalObitosObservados = dados.calculos_massa_qx.reduce((acc, c) => acc + c.obitos_observados, 0)
  const totalObitosEsperados = dados.calculos_massa_qx.reduce((acc, c) => acc + c.obitos_esperados, 0)
  const razaoObsEsp = totalObitosObservados / totalObitosEsperados

  // Calcula graus de liberdade estimados
  const gruposIdade = [...new Set(dados.calculos_massa_qx.map(c => c.idade))].length
  const grausLiberdadeEstimados = Math.max(1, gruposIdade - 1)

  // Valores críticos aproximados para alguns níveis de significância
  const obterValorCritico = (gl: number, alpha: number): number => {
    // Aproximação simples - em produção usar biblioteca estatística
    const tabela: Record<number, Record<string, number>> = {
      1: { '0.05': 3.841, '0.01': 6.635, '0.10': 2.706 },
      5: { '0.05': 11.07, '0.01': 15.09, '0.10': 9.236 },
      10: { '0.05': 18.31, '0.01': 23.21, '0.10': 15.99 },
      20: { '0.05': 31.41, '0.01': 37.57, '0.10': 28.41 },
      30: { '0.05': 43.77, '0.01': 50.89, '0.10': 40.26 }
    }
    
    const alphaKey = alpha.toString()
    const glProximo = Object.keys(tabela).map(Number).reduce((prev, curr) => 
      Math.abs(curr - gl) < Math.abs(prev - gl) ? curr : prev
    )
    
    return tabela[glProximo]?.[alphaKey] || 0
  }

  const valorCriticoEstimado = obterValorCritico(grausLiberdadeEstimados, nivelSignificancia[0])

  return (
    <div className="space-y-6">
      {/* Informações do Teste */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Configuração do Teste Chi-Quadrado (χ²)
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para o teste de aderência da tábua de mortalidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Nível de Significância (α)</Label>
                <div className="mt-2">
                  <Slider
                    value={nivelSignificancia}
                    onValueChange={setNivelSignificancia}
                    min={0.01}
                    max={0.10}
                    step={0.01}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1%</span>
                    <span className="font-medium">{(nivelSignificancia[0] * 100).toFixed(0)}%</span>
                    <span>10%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Probabilidade de erro tipo I (rejeitar H₀ quando verdadeira)
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Tábua de Referência</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="at2000"
                      name="tabua"
                      checked={tabuaSelecionada === 'at2000'}
                      onChange={() => setTabuaSelecionada('at2000')}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="at2000" className="text-sm">AT-2000 Suavizada (10%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="qx_original"
                      name="tabua"
                      checked={tabuaSelecionada === 'qx_original'}
                      onChange={() => setTabuaSelecionada('qx_original')}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="qx_original" className="text-sm">qx Original</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Graus de Liberdade</Label>
                  <div className="text-2xl font-bold">{grausLiberdadeEstimados}</div>
                  <p className="text-xs text-muted-foreground">
                    Baseado em {gruposIdade} grupos de idade
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valor Crítico</Label>
                  <div className="text-2xl font-bold">{valorCriticoEstimado.toFixed(3)}</div>
                  <p className="text-xs text-muted-foreground">
                    Para α = {(nivelSignificancia[0] * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Razão Observado/Esperado</Label>
                <div className="text-2xl font-bold">{razaoObsEsp.toFixed(3)}</div>
                <Badge variant={razaoObsEsp > 1.2 || razaoObsEsp < 0.8 ? 'destructive' : 'default'}>
                  {razaoObsEsp > 1.2 ? 'Alto desvio' : razaoObsEsp < 0.8 ? 'Baixo desvio' : 'Próximo ao esperado'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Dados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.massa_participantes.length.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Óbitos Observados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObitosObservados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Óbitos Esperados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObitosEsperados.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Período de Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2019-2024</div>
          </CardContent>
        </Card>
      </div>

      {/* Metodologia do Teste */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Metodologia do Teste Chi-Quadrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hipoteses" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hipoteses">Hipóteses</TabsTrigger>
              <TabsTrigger value="formula">Fórmula</TabsTrigger>
              <TabsTrigger value="interpretacao">Interpretação</TabsTrigger>
            </TabsList>

            <TabsContent value="hipoteses" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">H₀ (Hipótese Nula):</h4>
                  <p className="text-sm text-muted-foreground">
                    A tábua de mortalidade é aderente à massa de participantes analisada.
                    Não há diferença significativa entre os óbitos observados e esperados.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">H₁ (Hipótese Alternativa):</h4>
                  <p className="text-sm text-muted-foreground">
                    A tábua de mortalidade NÃO é aderente à massa de participantes.
                    Existe diferença significativa entre os óbitos observados e esperados.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="formula" className="mt-4">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Fórmula do Chi-Quadrado:</h4>
                  <div className="text-lg font-mono">
                    χ² = Σ [(Oᵢ - Eᵢ)² / Eᵢ]
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Onde: Oᵢ = óbitos observados no grupo i, Eᵢ = óbitos esperados no grupo i
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Critério de Decisão:</h4>
                  <p className="text-sm text-muted-foreground">
                    Se χ² calculado &gt; χ² crítico, rejeita-se H₀ (tábua não aderente)
                    <br />
                    Se χ² calculado ≤ χ² crítico, aceita-se H₀ (tábua aderente)
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interpretacao" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Nível de Significância (α = {(nivelSignificancia[0] * 100).toFixed(0)}%):</h4>
                  <p className="text-sm text-muted-foreground">
                    Probabilidade de rejeitar incorretamente uma tábua aderente (erro tipo I).
                    Valores menores são mais conservadores.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Valor-p:</h4>
                  <p className="text-sm text-muted-foreground">
                    Probabilidade de observar um χ² igual ou maior que o calculado, assumindo H₀ verdadeira.
                    Se p-valor &lt; α, rejeita-se H₀.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Pressupostos do Teste:</h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Frequência esperada ≥ 5 em pelo menos 80% das células</li>
                    <li>Observações independentes</li>
                    <li>Dados seguem distribuição qui-quadrado</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Avisos e Validações */}
      {razaoObsEsp > 1.5 || razaoObsEsp < 0.5 ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> A razão óbitos observados/esperados ({razaoObsEsp.toFixed(3)}) 
            está muito distante de 1.0, indicando possível não aderência da tábua. 
            O teste chi-quadrado provavelmente rejeitará a hipótese nula.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Execução do Teste */}
      <Card>
        <CardHeader>
          <CardTitle>Executar Teste Chi-Quadrado</CardTitle>
          <CardDescription>
            Clique no botão abaixo para executar o teste estatístico
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processando ? (
            <div className="space-y-4">
              <Progress value={66} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">
                Executando cálculos estatísticos...
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button 
                onClick={onExecutarTeste}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Executar Teste Chi-Quadrado
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
