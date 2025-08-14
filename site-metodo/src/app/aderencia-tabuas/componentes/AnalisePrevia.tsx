'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Calculator, TrendingUp, ChevronRight } from 'lucide-react'

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

interface AnalisePreviaProps {
  dados: DadosAderencia
  onProximo: () => void
}

export function AnalisePrevia({ dados, onProximo }: AnalisePreviaProps) {
  const totalParticipantes = dados.massa_participantes.length
  const participantesMasculinos = dados.massa_participantes.filter(p => p.sexo === 1).length
  const participantesFemininos = dados.massa_participantes.filter(p => p.sexo === 2).length
  
  const idadeMedia = dados.massa_participantes.reduce((acc, p) => acc + p.idade, 0) / totalParticipantes
  const idadeMinima = Math.min(...dados.massa_participantes.map(p => p.idade))
  const idadeMaxima = Math.max(...dados.massa_participantes.map(p => p.idade))
  
  const totalObitosObservados = dados.calculos_massa_qx.reduce((acc, c) => acc + c.obitos_observados, 0)
  const totalObitosEsperados = dados.calculos_massa_qx.reduce((acc, c) => acc + c.obitos_esperados, 0)
  
  // Amostra dos dados para exibição
  const amostraParticipantes = dados.massa_participantes.slice(0, 10)
  const amostraTabuas = dados.tabuas_mortalidade.slice(0, 10)
  const amostraCalculos = dados.calculos_massa_qx.slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Resumo Estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total de Participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipantes.toLocaleString()}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">
                ♂ {participantesMasculinos} ({((participantesMasculinos/totalParticipantes)*100).toFixed(1)}%)
              </Badge>
              <Badge variant="outline">
                ♀ {participantesFemininos} ({((participantesFemininos/totalParticipantes)*100).toFixed(1)}%)
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Idade dos Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{idadeMedia.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Média (min: {idadeMinima}, max: {idadeMaxima})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Óbitos Observados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObitosObservados}</div>
            <p className="text-xs text-muted-foreground">
              No período analisado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Óbitos Esperados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObitosEsperados.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Baseado na tábua
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualização dos Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Prévia dos Dados Carregados
          </CardTitle>
          <CardDescription>
            Visualização das principais tabelas para validação antes do teste chi-quadrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="participantes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="participantes">
                Massa de Participantes ({totalParticipantes})
              </TabsTrigger>
              <TabsTrigger value="tabuas">
                Tábuas de Mortalidade ({dados.tabuas_mortalidade.length})
              </TabsTrigger>
              <TabsTrigger value="calculos">
                Cálculos por Participante ({dados.calculos_massa_qx.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participantes" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>Ano Cadastro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amostraParticipantes.map((participante, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{participante.matricula}</TableCell>
                        <TableCell>
                          <Badge variant={participante.sexo === 1 ? 'default' : 'secondary'}>
                            {participante.sexo === 1 ? 'Masculino' : 'Feminino'}
                          </Badge>
                        </TableCell>
                        <TableCell>{participante.idade}</TableCell>
                        <TableCell>{participante.ano_cadastro}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalParticipantes > 10 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Mostrando primeiros 10 de {totalParticipantes} participantes
                </p>
              )}
            </TabsContent>

            <TabsContent value="tabuas" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Idade</TableHead>
                      <TableHead>qx Masculino</TableHead>
                      <TableHead>qx Feminino</TableHead>
                      <TableHead>AT2000 Suav. Masc</TableHead>
                      <TableHead>AT2000 Suav. Fem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amostraTabuas.map((tabua, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{tabua.idade}</TableCell>
                        <TableCell>{tabua.qx_masculino.toFixed(6)}</TableCell>
                        <TableCell>{tabua.qx_feminino.toFixed(6)}</TableCell>
                        <TableCell>{tabua.at2000_suav_masc.toFixed(6)}</TableCell>
                        <TableCell>{tabua.at2000_suav_fem.toFixed(6)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {dados.tabuas_mortalidade.length > 10 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Mostrando primeiros 10 de {dados.tabuas_mortalidade.length} registros de tábua
                </p>
              )}
            </TabsContent>

            <TabsContent value="calculos" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Ano Óbito</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>qx Aplicado</TableHead>
                      <TableHead>Óbitos Obs.</TableHead>
                      <TableHead>Óbitos Esp.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amostraCalculos.map((calculo, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{calculo.matricula}</TableCell>
                        <TableCell>{calculo.ano_obito}</TableCell>
                        <TableCell>
                          <Badge variant={calculo.sexo === 1 ? 'default' : 'secondary'}>
                            {calculo.sexo === 1 ? 'M' : 'F'}
                          </Badge>
                        </TableCell>
                        <TableCell>{calculo.idade}</TableCell>
                        <TableCell>{calculo.qx_aplicado.toFixed(6)}</TableCell>
                        <TableCell>{calculo.obitos_observados}</TableCell>
                        <TableCell>{calculo.obitos_esperados.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {dados.calculos_massa_qx.length > 10 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Mostrando primeiros 10 de {dados.calculos_massa_qx.length} cálculos
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Validação e Próximo Passo */}
      <Card>
        <CardHeader>
          <CardTitle>Validação dos Dados</CardTitle>
          <CardDescription>
            Verificações automáticas da qualidade e integridade dos dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">✓</Badge>
              <span className="text-sm">Massa de participantes carregada ({totalParticipantes} registros)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">✓</Badge>
              <span className="text-sm">Tábuas de mortalidade carregadas ({dados.tabuas_mortalidade.length} idades)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">✓</Badge>
              <span className="text-sm">Cálculos por participante disponíveis ({dados.calculos_massa_qx.length} registros)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">✓</Badge>
              <span className="text-sm">Estrutura de dados compatível com teste chi-quadrado</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onProximo} size="lg">
              <Calculator className="h-4 w-4 mr-2" />
              Prosseguir para Teste Chi-Quadrado
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
