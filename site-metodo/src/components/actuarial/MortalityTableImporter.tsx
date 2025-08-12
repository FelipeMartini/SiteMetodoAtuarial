'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Trash2,
} from 'lucide-react'
import { useActuarialStore, useMortalityTables } from '@/lib/actuarial/store'
import { MortalityTable, MortalityTableEntry } from '@/lib/actuarial/calculations'

interface ImportedTable {
  name: string
  description: string
  country: string
  year: number
  gender: 'male' | 'female' | 'unisex'
  entries: MortalityTableEntry[]
  source?: string
  notes?: string
}

export function MortalityTableImporter() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importState, setImportState] = useState<{
    isProcessing: boolean
    error: string | null
    success: string | null
    previewData: ImportedTable | null
  }>({
    isProcessing: false,
    error: null,
    success: null,
    previewData: null,
  })

  const [manualTableForm, setManualTableForm] = useState({
    name: '',
    description: '',
    country: 'BR',
    year: new Date().getFullYear(),
    gender: 'unisex' as 'male' | 'female' | 'unisex',
    source: '',
    notes: '',
    csvData: '',
  })

  const mortalityTables = useMortalityTables()
  const { addMortalityTable, removeMortalityTable } = useActuarialStore()

  // Função para processar CSV
  const parseCSV = (csvText: string): MortalityTableEntry[] => {
    const lines = csvText.trim().split('\n')
    const entries: MortalityTableEntry[] = []

    // Detectar se tem cabeçalho
    const firstLine = lines[0].toLowerCase()
    const hasHeader =
      firstLine.includes('idade') || firstLine.includes('age') || firstLine.includes('qx')
    const startIndex = hasHeader ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const columns = line.split(/[,;\t]/).map(col => col.trim())

      if (columns.length >= 2) {
        const age = parseInt(columns[0])
        const qx = parseFloat(columns[1].replace(',', '.'))

        if (!isNaN(age) && !isNaN(qx) && age >= 0 && age <= 150 && qx >= 0 && qx <= 1) {
          entries.push({ age, qx })
        }
      }
    }

    return entries.sort((a, b) => a.age - b.age)
  }

  // Função para processar arquivo Excel/CSV
  const processFile = async (file: File) => {
    setImportState(prev => ({ ...prev, isProcessing: true, error: null }))

    try {
      const text = await file.text()
      const entries = parseCSV(text)

      if (entries.length === 0) {
        throw new Error('Nenhum dado válido encontrado no arquivo')
      }

      // Gerar metadados baseados no nome do arquivo
      const fileName = file.name.replace(/\.[^/.]+$/, '')
      const previewData: ImportedTable = {
        name: fileName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        description: fileName,
        country: 'BR',
        year: new Date().getFullYear(),
        gender: fileName.toLowerCase().includes('male')
          ? 'male'
          : fileName.toLowerCase().includes('female')
            ? 'female'
            : 'unisex',
        entries,
        source: `Arquivo: ${file.name}`,
      }

      setImportState(prev => ({
        ...prev,
        isProcessing: false,
        previewData,
        success: `Arquivo processado: ${entries.length} idades encontradas`,
      }))
    } catch (_error) {
      setImportState(prev => ({
        ...prev,
        isProcessing: false,
        error: _error instanceof Error ? _error.message : 'Erro ao processar arquivo',
      }))
    }
  }

  // Handler para upload de arquivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  // Processar dados manuais
  const handleManualTableSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setImportState(prev => ({ ...prev, isProcessing: true, error: null }))

    try {
      const entries = parseCSV(manualTableForm.csvData)

      if (entries.length === 0) {
        throw new Error('Nenhum dado válido encontrado nos dados CSV')
      }

      const previewData: ImportedTable = {
        name: manualTableForm.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        description: manualTableForm.description,
        country: manualTableForm.country,
        year: manualTableForm.year,
        gender: manualTableForm.gender,
        entries,
        source: manualTableForm.source || 'Entrada manual',
        notes: manualTableForm.notes,
      }

      setImportState(prev => ({
        ...prev,
        isProcessing: false,
        previewData,
        success: `Tabela processada: ${entries.length} idades encontradas`,
      }))
    } catch (_error) {
      setImportState(prev => ({
        ...prev,
        isProcessing: false,
        error: _error instanceof Error ? _error.message : 'Erro ao processar dados',
      }))
    }
  }

  // Confirmar importação
  const confirmImport = () => {
    if (importState.previewData) {
      const mortalityTable: MortalityTable = {
        name: importState.previewData.name,
        description: importState.previewData.description,
        country: importState.previewData.country,
        year: importState.previewData.year,
        gender: importState.previewData.gender,
        entries: importState.previewData.entries,
      }

      addMortalityTable(mortalityTable)

      setImportState({
        isProcessing: false,
        error: null,
        success: 'Tabela importada com sucesso!',
        previewData: null,
      })

      // Limpar formulários
      setManualTableForm({
        name: '',
        description: '',
        country: 'BR',
        year: new Date().getFullYear(),
        gender: 'unisex',
        source: '',
        notes: '',
        csvData: '',
      })

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Cancelar preview
  const cancelPreview = () => {
    setImportState(prev => ({ ...prev, previewData: null, error: null, success: null }))
  }

  // Remover tabela existente
  const handleRemoveTable = (tableName: string) => {
    if (window.confirm(`Tem certeza que deseja remover a tabela "${tableName}"?`)) {
      removeMortalityTable(tableName)
    }
  }

  // Exportar tabela como CSV
  const exportTableAsCSV = (table: MortalityTable) => {
    const csvContent = ['Idade,qx', ...table.entries.map(entry => `${entry.age},${entry.qx}`)].join(
      '\n'
    )

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${table.name}.csv`
    link.click()
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Tabelas de Mortalidade</h1>
        <p className='text-muted-foreground'>
          Importe, gerencie e visualize tabelas de mortalidade para seus cálculos atuariais
        </p>
      </div>

      {/* Mensagens de Estado */}
      {importState.error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{importState.error}</AlertDescription>
        </Alert>
      )}

      {importState.success && !importState.previewData && (
        <Alert>
          <CheckCircle className='h-4 w-4' />
          <AlertDescription>{importState.success}</AlertDescription>
        </Alert>
      )}

      {/* Preview da Tabela */}
      {importState.previewData && (
        <Card className='border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Eye className='h-5 w-5' />
              Preview da Tabela Importada
            </CardTitle>
            <CardDescription>Verifique os dados antes de confirmar a importação</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <h3 className='font-medium mb-2'>Informações da Tabela</h3>
                <div className='space-y-1 text-sm'>
                  <div>
                    <span className='font-medium'>Nome:</span> {importState.previewData.name}
                  </div>
                  <div>
                    <span className='font-medium'>Descrição:</span>{' '}
                    {importState.previewData.description}
                  </div>
                  <div>
                    <span className='font-medium'>País:</span> {importState.previewData.country}
                  </div>
                  <div>
                    <span className='font-medium'>Ano:</span> {importState.previewData.year}
                  </div>
                  <div>
                    <span className='font-medium'>Gênero:</span> {importState.previewData.gender}
                  </div>
                  {importState.previewData.source && (
                    <div>
                      <span className='font-medium'>Fonte:</span> {importState.previewData.source}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className='font-medium mb-2'>Estatísticas dos Dados</h3>
                <div className='space-y-1 text-sm'>
                  <div>
                    <span className='font-medium'>Total de idades:</span>{' '}
                    {importState.previewData.entries.length}
                  </div>
                  <div>
                    <span className='font-medium'>Idade mínima:</span>{' '}
                    {Math.min(...importState.previewData.entries.map(e => e.age))}
                  </div>
                  <div>
                    <span className='font-medium'>Idade máxima:</span>{' '}
                    {Math.max(...importState.previewData.entries.map(e => e.age))}
                  </div>
                  <div>
                    <span className='font-medium'>qx médio:</span>{' '}
                    {(
                      importState.previewData.entries.reduce((sum, e) => sum + e.qx, 0) /
                      importState.previewData.entries.length
                    ).toFixed(6)}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview dos primeiros dados */}
            <div>
              <h3 className='font-medium mb-2'>Primeiros 10 registros</h3>
              <div className='grid grid-cols-5 gap-2 text-sm'>
                {importState.previewData.entries.slice(0, 10).map((entry, index) => (
                  <div key={index} className='p-2 bg-background rounded border'>
                    <div className='font-medium'>Idade {entry.age}</div>
                    <div className='text-muted-foreground'>qx: {entry.qx.toFixed(6)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex gap-2'>
              <Button onClick={confirmImport}>
                <CheckCircle className='h-4 w-4 mr-2' />
                Confirmar Importação
              </Button>
              <Button variant='outline' onClick={cancelPreview}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Importação */}
      <Tabs defaultValue='file-upload' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='file-upload'>Upload de Arquivo</TabsTrigger>
          <TabsTrigger value='manual-entry'>Entrada Manual</TabsTrigger>
        </TabsList>

        {/* Upload de Arquivo */}
        <TabsContent value='file-upload'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Upload className='h-5 w-5' />
                Upload de Arquivo CSV/Excel
              </CardTitle>
              <CardDescription>
                Faça upload de arquivos CSV ou Excel com dados de mortalidade. Formato esperado:
                Idade, qx (separados por vírgula, ponto-e-vírgula ou tab)
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center'>
                <FileSpreadsheet className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
                <div className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>
                    Clique para selecionar ou arraste um arquivo aqui
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Suporte para CSV, TSV e TXT (máximo 10MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.csv,.tsv,.txt'
                  onChange={handleFileUpload}
                  className='hidden'
                />
                <Button
                  variant='outline'
                  className='mt-4'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importState.isProcessing}
                >
                  {importState.isProcessing ? 'Processando...' : 'Selecionar Arquivo'}
                </Button>
              </div>

              <div className='bg-muted/50 rounded-lg p-4'>
                <h3 className='font-medium mb-2'>Formato do Arquivo</h3>
                <pre className='text-xs text-muted-foreground'>
                  {`Idade,qx
18,0.001234
19,0.001345
20,0.001456
...`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entrada Manual */}
        <TabsContent value='manual-entry'>
          <Card>
            <CardHeader>
              <CardTitle>Entrada Manual de Dados</CardTitle>
              <CardDescription>
                Insira os dados da tabela de mortalidade manualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualTableSubmit} className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='table-name'>Nome da Tabela *</Label>
                    <Input
                      id='table-name'
                      value={manualTableForm.name}
                      onChange={e =>
                        setManualTableForm(prev => ({ ...prev, name: e.target.value }))
                      }
                      placeholder='ex: br_ems_male_2020'
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='table-description'>Descrição *</Label>
                    <Input
                      id='table-description'
                      value={manualTableForm.description}
                      onChange={e =>
                        setManualTableForm(prev => ({ ...prev, description: e.target.value }))
                      }
                      placeholder='ex: BR-EMS Homens 2020'
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='table-country'>País</Label>
                    <Input
                      id='table-country'
                      value={manualTableForm.country}
                      onChange={e =>
                        setManualTableForm(prev => ({ ...prev, country: e.target.value }))
                      }
                      placeholder='ex: BR'
                    />
                  </div>
                  <div>
                    <Label htmlFor='table-year'>Ano</Label>
                    <Input
                      id='table-year'
                      type='number'
                      min='1900'
                      max='2030'
                      value={manualTableForm.year}
                      onChange={e =>
                        setManualTableForm(prev => ({
                          ...prev,
                          year: parseInt(e.target.value) || new Date().getFullYear(),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor='table-gender'>Gênero</Label>
                    <Select
                      value={manualTableForm.gender}
                      onValueChange={(value: 'male' | 'female' | 'unisex') =>
                        setManualTableForm(prev => ({ ...prev, gender: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='male'>Masculino</SelectItem>
                        <SelectItem value='female'>Feminino</SelectItem>
                        <SelectItem value='unisex'>Unissex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='table-source'>Fonte</Label>
                    <Input
                      id='table-source'
                      value={manualTableForm.source}
                      onChange={e =>
                        setManualTableForm(prev => ({ ...prev, source: e.target.value }))
                      }
                      placeholder='ex: SUSEP, IBGE, etc.'
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='table-notes'>Observações</Label>
                  <Textarea
                    id='table-notes'
                    value={manualTableForm.notes}
                    onChange={e => setManualTableForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder='Observações adicionais sobre a tabela...'
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor='csv-data'>Dados CSV *</Label>
                  <Textarea
                    id='csv-data'
                    value={manualTableForm.csvData}
                    onChange={e =>
                      setManualTableForm(prev => ({ ...prev, csvData: e.target.value }))
                    }
                    placeholder='Idade,qx&#10;18,0.001234&#10;19,0.001345&#10;...'
                    rows={8}
                    className='font-mono text-sm'
                    required
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Formato: Idade,qx (uma linha por idade)
                  </p>
                </div>

                <Button
                  type='submit'
                  disabled={importState.isProcessing}
                  className='w-full md:w-auto'
                >
                  {importState.isProcessing ? 'Processando...' : 'Processar Dados'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tabelas Existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Tabelas Existentes</CardTitle>
          <CardDescription>
            {mortalityTables.length} tabela(s) de mortalidade disponível(eis)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mortalityTables.length === 0 ? (
            <p className='text-muted-foreground text-center py-8'>
              Nenhuma tabela importada ainda. Use as opções acima para importar dados.
            </p>
          ) : (
            <div className='space-y-4'>
              {mortalityTables.map(table => (
                <div key={table.name} className='p-4 border rounded-lg'>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h3 className='font-medium'>{table.description}</h3>
                      <p className='text-sm text-muted-foreground'>Nome: {table.name}</p>
                    </div>
                    <div className='flex gap-2'>
                      <Button variant='outline' size='sm' onClick={() => exportTableAsCSV(table)}>
                        <Download className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleRemoveTable(table.name)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  <div className='flex gap-2 mb-2'>
                    <Badge variant='outline'>{table.country}</Badge>
                    <Badge variant='outline'>{table.year}</Badge>
                    <Badge variant='outline' className='capitalize'>
                      {table.gender}
                    </Badge>
                  </div>

                  <div className='text-sm text-muted-foreground'>
                    {table.entries.length} idades (de {Math.min(...table.entries.map(e => e.age))} a{' '}
                    {Math.max(...table.entries.map(e => e.age))} anos)
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
