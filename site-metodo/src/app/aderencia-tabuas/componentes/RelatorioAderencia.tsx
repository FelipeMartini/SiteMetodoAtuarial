'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Download, Printer, Share, CheckCircle, XCircle } from 'lucide-react'

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

interface RelatorioAderenciaProps {
  dados: DadosAderencia
}

export function RelatorioAderencia({ dados }: RelatorioAderenciaProps) {
  const [gerandoPDF, setGerandoPDF] = useState(false)

  const totalParticipantes = dados.massa_participantes.length
  const participantesMasculinos = dados.massa_participantes.filter(p => p.sexo === 1).length
  const participantesFemininos = dados.massa_participantes.filter(p => p.sexo === 2).length
  
  const totalObservados = dados.calculos_massa_qx.reduce((acc, c) => acc + c.obitos_observados, 0)
  const totalEsperados = dados.calculos_massa_qx.reduce((acc, c) => acc + c.obitos_esperados, 0)
  const razaoObsEsp = totalObservados / totalEsperados

  const idadeMedia = dados.massa_participantes.reduce((acc, p) => acc + p.idade, 0) / totalParticipantes
  const idadeMinima = Math.min(...dados.massa_participantes.map(p => p.idade))
  const idadeMaxima = Math.max(...dados.massa_participantes.map(p => p.idade))

  // Resumo por faixa etária
  const resumoPorIdade = dados.calculos_massa_qx.reduce((acc, item) => {
    const faixa = Math.floor(item.idade / 5) * 5 // Agrupa por faixas de 5 anos
    const chave = `${faixa}-${faixa + 4}`
    
    if (!acc[chave]) {
      acc[chave] = {
        faixa: chave,
        participantes: 0,
        observados: 0,
        esperados: 0,
        contribuicao_chi2: 0
      }
    }
    
    acc[chave].participantes += 1
    acc[chave].observados += item.obitos_observados
    acc[chave].esperados += item.obitos_esperados
    
    // Contribuição para chi-quadrado
    if (item.obitos_esperados > 0) {
      const diff = item.obitos_observados - item.obitos_esperados
      acc[chave].contribuicao_chi2 += (diff * diff) / item.obitos_esperados
    }
    
    return acc
  }, {} as Record<string, any>)

  const tabelaResumo = Object.values(resumoPorIdade).sort((a: any, b: any) => {
    const aMin = parseInt(a.faixa.split('-')[0])
    const bMin = parseInt(b.faixa.split('-')[0])
    return aMin - bMin
  })

  const gerarPDF = async () => {
    setGerandoPDF(true)
    try {
      // Simula geração de PDF (implementar com biblioteca como jsPDF)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Em uma implementação real, você usaria jsPDF ou similar
      console.log('PDF gerado com sucesso')
    } catch (erro) {
      console.error('Erro ao gerar PDF:', erro)
    } finally {
      setGerandoPDF(false)
    }
  }

  const imprimir = () => {
    window.print()
  }

  const compartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Relatório de Aderência de Tábuas de Mortalidade',
          text: `Teste Chi-Quadrado: ${dados.calculos_estatisticos.resultado_teste}`,
          url: window.location.href
        })
      } catch (erro) {
        console.error('Erro ao compartilhar:', erro)
      }
    }
  }

  const dataRelatorio = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Cabeçalho do Relatório */}
      <Card className="print:shadow-none print:border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            📊 RELATÓRIO DE ADERÊNCIA DE TÁBUAS DE MORTALIDADE
          </CardTitle>
          <CardDescription className="text-lg">
            Teste Chi-Quadrado (χ²) para Validação de Hipóteses Biométricas
          </CardDescription>
          <div className="text-sm text-muted-foreground mt-2">
            Gerado em: {dataRelatorio}
          </div>
        </CardHeader>
      </Card>

      {/* Ações do Relatório */}
      <Card className="print:hidden">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={gerarPDF} disabled={gerandoPDF}>
              <Download className="h-4 w-4 mr-2" />
              {gerandoPDF ? 'Gerando PDF...' : 'Download PDF'}
            </Button>
            <Button variant="outline" onClick={imprimir}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={compartilhar}>
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 1. Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {dados.calculos_estatisticos.resultado_teste === 'ACEITA' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            1. RESUMO EXECUTIVO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Resultado do Teste:</h4>
                <Badge 
                  variant={dados.calculos_estatisticos.resultado_teste === 'ACEITA' ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {dados.calculos_estatisticos.resultado_teste === 'ACEITA' 
                    ? '✓ TÁBUA ADERENTE' 
                    : '✗ TÁBUA NÃO ADERENTE'
                  }
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {dados.calculos_estatisticos.resultado_teste === 'ACEITA'
                    ? 'A tábua de mortalidade demonstra aderência estatisticamente significativa à massa de participantes analisada.'
                    : 'A tábua de mortalidade NÃO demonstra aderência estatisticamente significativa à massa de participantes analisada.'
                  }
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Principais Métricas:</h4>
                <div className="space-y-1 text-sm">
                  <div>Chi-Quadrado (χ²): <strong>{dados.calculos_estatisticos.chi_quadrado.toFixed(4)}</strong></div>
                  <div>Valor-p: <strong>{dados.calculos_estatisticos.valor_p.toFixed(4)}</strong></div>
                  <div>Graus de Liberdade: <strong>{dados.calculos_estatisticos.graus_liberdade}</strong></div>
                  <div>Nível de Significância: <strong>{(dados.calculos_estatisticos.nivel_significancia * 100).toFixed(0)}%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Características da Massa */}
      <Card>
        <CardHeader>
          <CardTitle>2. CARACTERÍSTICAS DA MASSA ANALISADA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Composição Total:</h4>
              <div className="space-y-1 text-sm">
                <div>Total de Participantes: <strong>{totalParticipantes.toLocaleString()}</strong></div>
                <div>Participantes Masculinos: <strong>{participantesMasculinos.toLocaleString()} ({((participantesMasculinos/totalParticipantes)*100).toFixed(1)}%)</strong></div>
                <div>Participantes Femininos: <strong>{participantesFemininos.toLocaleString()} ({((participantesFemininos/totalParticipantes)*100).toFixed(1)}%)</strong></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Distribuição Etária:</h4>
              <div className="space-y-1 text-sm">
                <div>Idade Média: <strong>{idadeMedia.toFixed(1)} anos</strong></div>
                <div>Idade Mínima: <strong>{idadeMinima} anos</strong></div>
                <div>Idade Máxima: <strong>{idadeMaxima} anos</strong></div>
                <div>Amplitude: <strong>{idadeMaxima - idadeMinima} anos</strong></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Mortalidade Observada:</h4>
              <div className="space-y-1 text-sm">
                <div>Óbitos Observados: <strong>{totalObservados}</strong></div>
                <div>Óbitos Esperados: <strong>{totalEsperados.toFixed(1)}</strong></div>
                <div>Razão Obs/Esp: <strong>{razaoObsEsp.toFixed(3)}</strong></div>
                <div>Desvio Relativo: <strong>{((razaoObsEsp - 1) * 100).toFixed(1)}%</strong></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Metodologia do Teste */}
      <Card>
        <CardHeader>
          <CardTitle>3. METODOLOGIA DO TESTE CHI-QUADRADO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Hipóteses Testadas:</h4>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div><strong>H₀ (Hipótese Nula):</strong> A tábua de mortalidade é aderente à massa de participantes</div>
                <div><strong>H₁ (Hipótese Alternativa):</strong> A tábua de mortalidade NÃO é aderente à massa de participantes</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Fórmula Aplicada:</h4>
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="text-lg font-mono">χ² = Σ [(Oᵢ - Eᵢ)² / Eᵢ]</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Onde: Oᵢ = óbitos observados no grupo i, Eᵢ = óbitos esperados no grupo i
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Critério de Decisão:</h4>
              <p className="text-sm">
                {dados.calculos_estatisticos.valor_p < dados.calculos_estatisticos.nivel_significancia 
                  ? `Como o valor-p (${dados.calculos_estatisticos.valor_p.toFixed(4)}) é menor que o nível de significância α (${dados.calculos_estatisticos.nivel_significancia}), rejeitamos a hipótese nula H₀.`
                  : `Como o valor-p (${dados.calculos_estatisticos.valor_p.toFixed(4)}) é maior ou igual ao nível de significância α (${dados.calculos_estatisticos.nivel_significancia}), não rejeitamos a hipótese nula H₀.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Resultados Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle>4. RESULTADOS DETALHADOS POR FAIXA ETÁRIA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faixa Etária</TableHead>
                  <TableHead className="text-right">Participantes</TableHead>
                  <TableHead className="text-right">Óbitos Observados</TableHead>
                  <TableHead className="text-right">Óbitos Esperados</TableHead>
                  <TableHead className="text-right">Razão Obs/Esp</TableHead>
                  <TableHead className="text-right">Contribuição χ²</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tabelaResumo.map((linha: any, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{linha.faixa} anos</TableCell>
                    <TableCell className="text-right">{linha.participantes}</TableCell>
                    <TableCell className="text-right">{linha.observados}</TableCell>
                    <TableCell className="text-right">{linha.esperados.toFixed(1)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={Math.abs((linha.observados/linha.esperados) - 1) > 0.2 ? 'destructive' : 'default'}>
                        {linha.esperados > 0 ? (linha.observados/linha.esperados).toFixed(3) : 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{linha.contribuicao_chi2.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold border-t-2">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right">{totalParticipantes.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{totalObservados}</TableCell>
                  <TableCell className="text-right">{totalEsperados.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={Math.abs(razaoObsEsp - 1) > 0.2 ? 'destructive' : 'default'}>
                      {razaoObsEsp.toFixed(3)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{dados.calculos_estatisticos.chi_quadrado.toFixed(4)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Conclusões e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>5. CONCLUSÕES E RECOMENDAÇÕES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Conclusão Estatística:</h4>
              <p className="text-sm">
                {dados.calculos_estatisticos.resultado_teste === 'ACEITA'
                  ? 'Com base no teste chi-quadrado realizado, não há evidências estatísticas suficientes para rejeitar a hipótese de que a tábua de mortalidade é aderente à massa de participantes analisada. A tábua pode ser considerada adequada para os cálculos atuariais desta população.'
                  : 'Com base no teste chi-quadrado realizado, há evidências estatísticas suficientes para rejeitar a hipótese de que a tábua de mortalidade é aderente à massa de participantes analisada. A tábua NÃO é adequada para os cálculos atuariais desta população.'
                }
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Recomendações:</h4>
              {dados.calculos_estatisticos.resultado_teste === 'ACEITA' ? (
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>A tábua pode ser utilizada com confiança para cálculos atuariais</li>
                  <li>Manter monitoramento periódico da aderência</li>
                  <li>Considerar análises de subgrupos para maior precisão</li>
                  <li>Atualizar o teste anualmente com novos dados</li>
                </ul>
              ) : (
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li><strong>Revisar os dados de entrada</strong> para identificar possíveis inconsistências</li>
                  <li><strong>Testar tábuas alternativas</strong> que possam ser mais aderentes</li>
                  <li><strong>Considerar ajustes nos valores qx</strong> baseados na experiência observada</li>
                  <li><strong>Realizar análise por subgrupos</strong> (sexo, faixa etária, categoria profissional)</li>
                  <li><strong>Investigar fatores externos</strong> que possam explicar os desvios observados</li>
                  <li><strong>Buscar assessoria atuarial especializada</strong> para definição de nova hipótese</li>
                </ul>
              )}
            </div>
            
            <Separator />
            
            <div className="text-xs text-muted-foreground">
              <p><strong>Nota Técnica:</strong> Este relatório foi gerado automaticamente pelo Sistema de Análise de Aderência de Tábuas de Mortalidade. Os resultados devem ser interpretados por profissional qualificado em ciências atuariais.</p>
              <p className="mt-2"><strong>Responsabilidade:</strong> O usuário é responsável pela qualidade e veracidade dos dados de entrada, bem como pela adequada interpretação dos resultados apresentados.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
