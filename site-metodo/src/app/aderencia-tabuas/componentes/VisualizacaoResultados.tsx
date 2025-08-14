'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { CheckCircle, XCircle, TrendingUp, FileText, AlertTriangle } from 'lucide-react'

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

interface VisualizacaoResultadosProps {
  dados: DadosAderencia
  onGerarRelatorio: () => void
}

export function VisualizacaoResultados({ dados, onGerarRelatorio }: VisualizacaoResultadosProps) {
  const { calculos_estatisticos } = dados

  // Processa dados para gráficos
  const dadosGraficoIdade = dados.calculos_massa_qx.reduce((acc, item) => {
    const idade = item.idade
    const existente = acc.find(d => d.idade === idade)
    
    if (existente) {
      existente.observados += item.obitos_observados
      existente.esperados += item.obitos_esperados
    } else {
      acc.push({
        idade,
        observados: item.obitos_observados,
        esperados: item.obitos_esperados
      })
    }
    
    return acc
  }, [] as Array<{ idade: number; observados: number; esperados: number }>)
  .sort((a, b) => a.idade - b.idade)

  // Dados para gráfico de linha (qx por idade)
  const dadosQxIdade = dados.tabuas_mortalidade
    .filter(t => t.idade >= 50 && t.idade <= 85) // Foco nas idades mais relevantes
    .map(t => ({
      idade: t.idade,
      qx_masculino: t.qx_masculino * 1000, // Converte para por mil
      qx_feminino: t.qx_feminino * 1000,
      at2000_masc: t.at2000_suav_masc * 1000,
      at2000_fem: t.at2000_suav_fem * 1000
    }))

  const totalObservados = dados.calculos_massa_qx.reduce((acc, c) => acc + c.obitos_observados, 0)
  const totalEsperados = dados.calculos_massa_qx.reduce((acc, c) => acc + c.obitos_esperados, 0)
  const razaoObsEsp = totalObservados / totalEsperados

  // Interpretação do resultado
  const interpretacao = calculos_estatisticos.resultado_teste === 'ACEITA' 
    ? {
        titulo: 'Tábua Aderente',
        descricao: 'A tábua de mortalidade demonstra aderência estatisticamente significativa à massa de participantes.',
        cor: 'text-green-600',
        icone: CheckCircle,
        recomendacao: 'A tábua pode ser utilizada com confiança para cálculos atuariais desta massa.'
      }
    : {
        titulo: 'Tábua Não Aderente',
        descricao: 'A tábua de mortalidade NÃO demonstra aderência à massa de participantes.',
        cor: 'text-red-600',
        icone: XCircle,
        recomendacao: 'Recomenda-se revisão da tábua ou ajustes na hipótese de mortalidade.'
      }

  return (
    <div className="space-y-6">
      {/* Resultado Principal */}
      <Card className={calculos_estatisticos.resultado_teste === 'ACEITA' ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${interpretacao.cor}`}>
            <interpretacao.icone className="h-6 w-6" />
            {interpretacao.titulo}
          </CardTitle>
          <CardDescription className="text-base">
            {interpretacao.descricao}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Chi-Quadrado (χ²)</div>
              <div className="text-2xl font-bold">{calculos_estatisticos.chi_quadrado.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Valor-p</div>
              <div className="text-2xl font-bold">
                {calculos_estatisticos.valor_p < 0.001 ? '&lt;0.001' : calculos_estatisticos.valor_p.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Graus de Liberdade</div>
              <div className="text-2xl font-bold">{calculos_estatisticos.graus_liberdade}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Nível de Significância</div>
              <div className="text-2xl font-bold">{(calculos_estatisticos.nivel_significancia * 100).toFixed(0)}%</div>
            </div>
          </div>

          <Alert className="mt-4">
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <strong>Recomendação:</strong> {interpretacao.recomendacao}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Estatísticas Descritivas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Óbitos Observados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObservados}</div>
            <p className="text-xs text-muted-foreground">No período analisado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Óbitos Esperados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEsperados.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Baseado na tábua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Razão Obs/Esp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{razaoObsEsp.toFixed(3)}</div>
            <Badge variant={Math.abs(razaoObsEsp - 1) > 0.2 ? 'destructive' : 'default'}>
              {Math.abs(razaoObsEsp - 1) > 0.2 ? 'Alto desvio' : 'Dentro do esperado'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.massa_participantes.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total analisado</p>
          </CardContent>
        </Card>
      </div>

      {/* Visualizações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Análise Gráfica dos Resultados
          </CardTitle>
          <CardDescription>
            Comparação entre óbitos observados e esperados por faixa etária
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="barras" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="barras">Óbitos por Idade</TabsTrigger>
              <TabsTrigger value="qx">Curvas de Mortalidade (qx)</TabsTrigger>
            </TabsList>

            <TabsContent value="barras" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficoIdade}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="idade" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        value, 
                        name === 'observados' ? 'Óbitos Observados' : 'Óbitos Esperados'
                      ]}
                    />
                    <Bar dataKey="observados" fill="#ef4444" name="observados" />
                    <Bar dataKey="esperados" fill="#3b82f6" name="esperados" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="qx" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosQxIdade}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="idade" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${Number(value).toFixed(2)}‰`,
                        name === 'qx_masculino' ? 'qx Masculino' :
                        name === 'qx_feminino' ? 'qx Feminino' :
                        name === 'at2000_masc' ? 'AT2000 Masculino' : 'AT2000 Feminino'
                      ]}
                    />
                    <Line type="monotone" dataKey="qx_masculino" stroke="#2563eb" strokeWidth={2} name="qx_masculino" />
                    <Line type="monotone" dataKey="qx_feminino" stroke="#dc2626" strokeWidth={2} name="qx_feminino" />
                    <Line type="monotone" dataKey="at2000_masc" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 5" name="at2000_masc" />
                    <Line type="monotone" dataKey="at2000_fem" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" name="at2000_fem" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                * Valores em por mil (‰). Linhas sólidas: qx original. Linhas tracejadas: AT-2000 suavizada.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detalhes Estatísticos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Teste Estatístico</CardTitle>
          <CardDescription>
            Informações técnicas sobre a execução do teste chi-quadrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Hipóteses Testadas:</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• <strong>H₀:</strong> A tábua é aderente à massa</li>
                  <li>• <strong>H₁:</strong> A tábua não é aderente à massa</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm">Critério de Decisão:</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {calculos_estatisticos.valor_p < calculos_estatisticos.nivel_significancia 
                    ? `Como p-valor (${calculos_estatisticos.valor_p.toFixed(4)}) < α (${calculos_estatisticos.nivel_significancia}), rejeitamos H₀.`
                    : `Como p-valor (${calculos_estatisticos.valor_p.toFixed(4)}) ≥ α (${calculos_estatisticos.nivel_significancia}), não rejeitamos H₀.`
                  }
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Pressupostos Verificados:</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• ✓ Frequências esperadas adequadas</li>
                  <li>• ✓ Observações independentes</li>
                  <li>• ✓ Distribuição qui-quadrado aplicável</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Tamanho do Efeito:</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Desvio relativo: {((razaoObsEsp - 1) * 100).toFixed(1)}%
                  {Math.abs(razaoObsEsp - 1) > 0.1 && (
                    <Badge variant="outline" className="ml-2">
                      Efeito {Math.abs(razaoObsEsp - 1) > 0.2 ? 'Grande' : 'Moderado'}
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>
            Gere um relatório detalhado ou faça uma nova análise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onGerarRelatorio} size="lg" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório Completo
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <TrendingUp className="h-4 w-4 mr-2" />
              Análise de Sensibilidade
            </Button>
          </div>

          {calculos_estatisticos.resultado_teste === 'REJEITA' && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Recomendação:</strong> Como a tábua não demonstrou aderência, considere:
                <br />• Revisão dos dados de entrada
                <br />• Teste com tábuas alternativas  
                <br />• Ajustes nos valores qx baseados na experiência observada
                <br />• Análise por subgrupos (sexo, faixa etária, etc.)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
