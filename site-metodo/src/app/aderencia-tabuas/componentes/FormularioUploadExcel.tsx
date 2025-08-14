'use client'

import { useCallback, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormularioUploadExcelProps {
  onUpload: (arquivo: File) => Promise<void>
  carregando: boolean
}

export function FormularioUploadExcel({ onUpload, carregando }: FormularioUploadExcelProps) {
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null)
  const [arrastandoSobre, setArrastandoSobre] = useState(false)
  const [progressoUpload, setProgressoUpload] = useState(0)

  const validarArquivo = (arquivo: File): { valido: boolean; erro?: string } => {
    // Verifica extensão
    const extensoesValidas = ['.xlsx', '.xls']
    const extensaoArquivo = arquivo.name.toLowerCase().substring(arquivo.name.lastIndexOf('.'))
    
    if (!extensoesValidas.includes(extensaoArquivo)) {
      return { 
        valido: false, 
        erro: 'Apenas arquivos Excel (.xlsx, .xls) são aceitos.' 
      }
    }

    // Verifica tamanho (max 50MB)
    const tamanhoMaximo = 50 * 1024 * 1024 // 50MB
    if (arquivo.size > tamanhoMaximo) {
      return { 
        valido: false, 
        erro: 'Arquivo muito grande. Tamanho máximo: 50MB.' 
      }
    }

    return { valido: true }
  }

  const manipularSelecaoArquivo = useCallback((arquivo: File) => {
    const { valido, erro } = validarArquivo(arquivo)
    
    if (!valido) {
      alert(erro)
      return
    }

    setArquivoSelecionado(arquivo)
  }, [])

  const manipularInputArquivo = useCallback((evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0]
    if (arquivo) {
      manipularSelecaoArquivo(arquivo)
    }
  }, [manipularSelecaoArquivo])

  const manipularDrop = useCallback((evento: React.DragEvent<HTMLDivElement>) => {
    evento.preventDefault()
    setArrastandoSobre(false)
    
    const arquivo = evento.dataTransfer.files[0]
    if (arquivo) {
      manipularSelecaoArquivo(arquivo)
    }
  }, [manipularSelecaoArquivo])

  const manipularDragOver = useCallback((evento: React.DragEvent<HTMLDivElement>) => {
    evento.preventDefault()
    setArrastandoSobre(true)
  }, [])

  const manipularDragLeave = useCallback((evento: React.DragEvent<HTMLDivElement>) => {
    evento.preventDefault()
    setArrastandoSobre(false)
  }, [])

  const executarUpload = async () => {
    if (!arquivoSelecionado) return

    try {
      setProgressoUpload(0)
      
      // Simula progresso durante o upload
      const intervalo = setInterval(() => {
        setProgressoUpload(prev => {
          const proximo = prev + 10
          if (proximo >= 90) {
            clearInterval(intervalo)
            return 90
          }
          return proximo
        })
      }, 200)

      await onUpload(arquivoSelecionado)
      
      clearInterval(intervalo)
      setProgressoUpload(100)
      
    } catch (erro) {
      console.error('Erro no upload:', erro)
      setProgressoUpload(0)
    }
  }

  const formatarTamanhoArquivo = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const tamanhos = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tamanhos[i]
  }

  return (
    <div className="space-y-6">
      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Requisitos do Arquivo Excel
          </CardTitle>
          <CardDescription>
            Seu arquivo deve conter as seguintes planilhas com estruturas específicas:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">📋 Planilhas Obrigatórias:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>MASSA TRABALHADA UNIFICADA</strong> - dados dos participantes</li>
                <li>• <strong>qx</strong> - tábuas de mortalidade com valores qx</li>
                <li>• <strong>Calculos Massa qx</strong> - cálculos por participante</li>
                <li>• <strong>Calculos Estatisticos</strong> - dados agregados</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">📊 Colunas Esperadas:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Matrícula, sexo, idade, ano de cadastro</li>
                <li>• Valores qx por idade e sexo</li>
                <li>• Óbitos observados vs esperados</li>
                <li>• Dados estatísticos calculados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload do Arquivo</CardTitle>
          <CardDescription>
            Arraste e solte seu arquivo Excel ou clique para selecionar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              arrastandoSobre 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              carregando && "opacity-50 cursor-not-allowed"
            )}
            onDrop={manipularDrop}
            onDragOver={manipularDragOver}
            onDragLeave={manipularDragLeave}
          >
            {!arquivoSelecionado ? (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <Label htmlFor="arquivo-excel" className="cursor-pointer">
                    <span className="text-lg font-medium">
                      Clique aqui ou arraste seu arquivo Excel
                    </span>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Formatos aceitos: .xlsx, .xls (máx. 50MB)
                    </span>
                  </Label>
                  <Input
                    id="arquivo-excel"
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={manipularInputArquivo}
                    disabled={carregando}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                <div>
                  <p className="font-medium">{arquivoSelecionado.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatarTamanhoArquivo(arquivoSelecionado.size)}
                  </p>
                </div>
                
                {carregando && (
                  <div className="space-y-2">
                    <Progress value={progressoUpload} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      Processando arquivo... {progressoUpload}%
                    </p>
                  </div>
                )}
                
                {!carregando && (
                  <div className="flex gap-2 justify-center">
                    <Button onClick={executarUpload} disabled={carregando}>
                      <Upload className="h-4 w-4 mr-2" />
                      Processar Arquivo
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setArquivoSelecionado(null)}
                      disabled={carregando}
                    >
                      Remover
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Exemplo de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Exemplo de Estrutura de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Seu arquivo deve ser similar ao modelo fornecido. Certifique-se de que:
              <br />• Os nomes das planilhas estão corretos
              <br />• As colunas estão na ordem esperada  
              <br />• Os dados estão limpos e formatados
              <br />• Não há células mescladas nos dados
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
