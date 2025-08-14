import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Schema para validação da requisição
const AnalisePythonSchema = z.object({
  importacaoId: z.string(),
  configuracao: z.object({
    metodoAnalise: z.enum(['COMPLETO', 'RAPIDO', 'DETALHADO']).default('COMPLETO'),
    extrairFormulas: z.boolean().default(true),
    calcularEstatisticas: z.boolean().default(true),
    validarIntegridade: z.boolean().default(true),
    timeoutSegundos: z.number().min(30).max(600).default(300),
    planilhasEspecificas: z.array(z.string()).optional(),
    parametrosPersonalizados: z.record(z.string(), z.any()).optional()
  })
})

function executarScriptPython(
  caminhoArquivo: string, 
  configuracao: any, 
  timeoutMs: number
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const scriptPath = join(process.cwd(), 'scripts', 'analisar-mortalidade-python.py')
    
    // Preparar argumentos para o script Python
    const args = [
      scriptPath,
      caminhoArquivo,
      JSON.stringify(configuracao)
    ]

    const pythonProcess = spawn('python3', args, {
      stdio: 'pipe',
      timeout: timeoutMs
    })

    let stdout = ''
    let stderr = ''

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr })
      } else {
        reject(new Error(`Processo Python falhou com código ${code}. Stderr: ${stderr}`))
      }
    })

    pythonProcess.on('error', (error) => {
      reject(new Error(`Erro ao executar script Python: ${error.message}`))
    })

    // Timeout manual adicional
    setTimeout(() => {
      pythonProcess.kill('SIGTERM')
      reject(new Error('Timeout: Script Python demorou muito para executar'))
    }, timeoutMs)
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const dados = AnalisePythonSchema.parse(body)

    // Buscar informações da importação
    const importacao = await prisma.importacaoMortalidade.findUnique({
      where: { id: dados.importacaoId }
    })

    if (!importacao) {
      return NextResponse.json(
        { error: 'Importação não encontrada' },
        { status: 404 }
      )
    }

    if (!importacao.caminhoArquivo) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar status para processando
    await prisma.importacaoMortalidade.update({
      where: { id: dados.importacaoId },
      data: { status: 'PROCESSANDO' }
    })

    const inicioProcessamento = Date.now()

    try {
      // Executar script Python
      const timeoutMs = dados.configuracao.timeoutSegundos * 1000
      const { stdout, stderr } = await executarScriptPython(
        importacao.caminhoArquivo,
        dados.configuracao,
        timeoutMs
      )

      // Parse do resultado JSON do Python
      let resultadoPython
      try {
        resultadoPython = JSON.parse(stdout)
      } catch (_parseError) {
        throw new Error(`Erro ao fazer parse do resultado Python: ${stdout.substring(0, 500)}...`)
      }

      const tempoProcessamento = Math.round((Date.now() - inicioProcessamento) / 1000)

      // Salvar resultado em arquivo para referência
      const resultadoPath = join(process.cwd(), 'uploads', 'mortalidade', `python-result-${dados.importacaoId}.json`)
      await writeFile(resultadoPath, JSON.stringify(resultadoPython, null, 2))

      // Atualizar importação com resultados
      await prisma.importacaoMortalidade.update({
        where: { id: dados.importacaoId },
        data: {
          status: 'CONCLUIDA',
          totalRegistros: resultadoPython.estatisticas?.totalLinhas || 0,
          registrosImportados: resultadoPython.estatisticas?.linhasValidas || 0,
          registrosErro: resultadoPython.estatisticas?.linhasComErro || 0,
          concluidaEm: new Date(),
          tempoProcessamento,
          logImportacao: {
            ...importacao.logImportacao as any,
            analisePython: {
              configuracao: dados.configuracao,
              caminhoResultado: resultadoPath,
              stderr: stderr || null,
              processadoEm: new Date().toISOString(),
              versaoPython: resultadoPython.metadados?.versaoPython,
              bibliotecasUtilizadas: resultadoPython.metadados?.bibliotecas
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        importacaoId: dados.importacaoId,
        resultado: resultadoPython,
        tempoProcessamento,
        caminhoResultado: resultadoPath,
        logs: {
          stderr: stderr || null,
          warnings: resultadoPython.warnings || []
        },
        proximoPasso: `/api/aderencia-tabuas/salvar-dados/${dados.importacaoId}`
      })

    } catch (error) {
      const tempoProcessamento = Math.round((Date.now() - inicioProcessamento) / 1000)
      
      // Atualizar status para erro
      await prisma.importacaoMortalidade.update({
        where: { id: dados.importacaoId },
        data: {
          status: 'ERRO',
          tempoProcessamento,
          logImportacao: {
            ...importacao.logImportacao as any,
            erroPython: {
              message: (error as Error).message,
              timestamp: new Date().toISOString(),
              duracao: tempoProcessamento
            }
          }
        }
      })

      throw error
    }

  } catch (error) {
    console.error('Erro na análise Python:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados de entrada inválidos',
          detalhes: error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor na análise Python',
        detalhes: (error as Error).message
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/aderencia-tabuas/analise-python',
    descricao: 'Endpoint para análise de arquivos Excel usando Python + OpenPyXL',
    metodo: 'POST',
    requisitos: [
      'Python 3.x instalado',
      'Bibliotecas: openpyxl, pandas, numpy, scipy',
      'Script analisar-mortalidade-python.py'
    ],
    exemplo_request: {
      importacaoId: 'uuid-da-importacao',
      configuracao: {
        metodoAnalise: 'COMPLETO',
        extrairFormulas: true,
        calcularEstatisticas: true,
        validarIntegridade: true,
        timeoutSegundos: 300,
        planilhasEspecificas: ['MASSA TRABALHADA UNIFICADA', 'qx'],
        parametrosPersonalizados: {
          calcularQxPorIdade: true,
          gerarGraficos: false
        }
      }
    },
    exemplo_response: {
      success: true,
      resultado: {
        estrutura_arquivo: {
          planilhas: ['MASSA TRABALHADA UNIFICADA', 'qx', 'Calculos Massa qx'],
          total_linhas: 4150,
          formulas_encontradas: 125
        },
        dados_extraidos: {
          massa_participantes: 4019,
          obitos_registrados: 89,
          qx_mortalidade: 129
        },
        estatisticas: {
          distribuicao_idade: {},
          distribuicao_sexo: {},
          resumo_obitos: {}
        },
        validacao: {
          erros_encontrados: [],
          warnings: [],
          integridade_ok: true
        }
      }
    }
  })
}
