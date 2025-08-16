import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { processarExcelUnificado, validarArquivoExcel, type ConfiguracaoProcessamento } from '@/lib/excel/ProcessadorUnificado'

// Schema para validação da requisição - mantido para compatibilidade
const AnaliseExcelJSSchema = z.object({
  importacaoId: z.string(),
  configuracao: z.object({
    planilhaMassa: z.string().optional(),
    planilhaObitos: z.string().optional(),
    planilhaQx: z.string().optional(),
    extrairFormulas: z.boolean().default(true),
    validarDados: z.boolean().default(true),
    autoDeteccao: z.boolean().default(true),
    mapeamentoColunas: z.object({
      massa: z.object({
        matricula: z.string().or(z.number()).optional(),
        nome: z.string().or(z.number()).optional(),
        sexo: z.string().or(z.number()).optional(),
        idade: z.string().or(z.number()).optional(),
        dataNascimento: z.string().or(z.number()).optional(),
        anoIngressao: z.string().or(z.number()).optional()
      }).optional(),
      obitos: z.object({
        matricula: z.string().or(z.number()).optional(),
        anoObito: z.string().or(z.number()).optional(),
        idadeObito: z.string().or(z.number()).optional(),
        causaObito: z.string().or(z.number()).optional()
      }).optional(),
      qx: z.object({
        idade: z.string().or(z.number()).optional(),
        qxMasculino: z.string().or(z.number()).optional(),
        qxFeminino: z.string().or(z.number()).optional()
      }).optional()
    }).optional()
  })
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const dados = AnaliseExcelJSSchema.parse(body)

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
      // Ler arquivo
      const buffer = await readFile(importacao.caminhoArquivo)
      
      // Validar arquivo
      const validacao = validarArquivoExcel(buffer)
      if (!validacao.valido) {
        throw new Error(`Arquivo inválido: ${validacao.erros.join(', ')}`)
      }

      // Converter configuração para formato unificado
      const configuracaoUnificada: ConfiguracaoProcessamento = {
        planilhaMassa: dados.configuracao.planilhaMassa,
        planilhaObitos: dados.configuracao.planilhaObitos,
        planilhaQx: dados.configuracao.planilhaQx,
        extrairFormulas: dados.configuracao.extrairFormulas,
        validarDados: dados.configuracao.validarDados,
        autoDeteccao: dados.configuracao.autoDeteccao,
        mapeamentoColunas: dados.configuracao.mapeamentoColunas ? {
          massa: dados.configuracao.mapeamentoColunas.massa,
          obitos: dados.configuracao.mapeamentoColunas.obitos,
          qx: dados.configuracao.mapeamentoColunas.qx
        } : undefined
      }
      
      // Processar com biblioteca unificada
      const dadosProcessados = await processarExcelUnificado(buffer, configuracaoUnificada)

      const tempoProcessamento = Math.round((Date.now() - inicioProcessamento) / 1000)

      // Atualizar importação com resultados
      await prisma.importacaoMortalidade.update({
        where: { id: dados.importacaoId },
        data: {
          status: 'CONCLUIDA',
          totalRegistros: dadosProcessados.metadados.linhasProcessadas,
          registrosImportados: dadosProcessados.metadados.linhasProcessadas - dadosProcessados.metadados.errosEncontrados.length,
          registrosErro: dadosProcessados.metadados.errosEncontrados.length,
          concluidaEm: new Date(),
          tempoProcessamento,
          logImportacao: {
            ...importacao.logImportacao as any,
            analiseExcelJS_v2: {
              configuracao: configuracaoUnificada,
              resultado: dadosProcessados.metadados,
              deteccaoAutomatica: dadosProcessados.metadados.deteccaoAutomatica,
              processadoEm: new Date().toISOString(),
              versao: '2.0-UNIFICADO'
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        versao: '2.0-UNIFICADO',
        importacaoId: dados.importacaoId,
        dadosProcessados,
        tempoProcessamento,
        deteccaoAutomatica: dadosProcessados.metadados.deteccaoAutomatica,
        proximoPasso: `/api/aderencia-tabuas/salvar-dados/${dados.importacaoId}`
      })

    } catch (error) {
      // Atualizar status para erro
      await prisma.importacaoMortalidade.update({
        where: { id: dados.importacaoId },
        data: {
          status: 'ERRO',
          logImportacao: {
            ...importacao.logImportacao as any,
            erro_v2: {
              message: (error as Error).message,
              timestamp: new Date().toISOString(),
              versao: '2.0-UNIFICADO'
            }
          }
        }
      })

      throw error
    }

  } catch (error) {
    console.error('Erro na análise ExcelJS:', error)
    
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
      { error: 'Erro interno do servidor na análise ExcelJS' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/aderencia-tabuas/analise-exceljs',
    descricao: 'Endpoint para análise de arquivos Excel usando Processador Unificado',
    versao: '2.0-UNIFICADO',
    metodo: 'POST',
    novidades: [
      'Detecção automática de layout inteligente',
      'Processamento unificado eliminando duplicações',
      'Maior robustez na detecção de tipos de dados',
      'Cache automático de resultados',
      'Validação avançada de arquivos Excel'
    ],
    exemplo_request: {
      importacaoId: 'uuid-da-importacao',
      configuracao: {
        autoDeteccao: true,
        planilhaMassa: 'MASSA TRABALHADA UNIFICADA',
        planilhaObitos: 'OBITOS',
        planilhaQx: 'qx',
        extrairFormulas: true,
        validarDados: true,
        mapeamentoColunas: {
          massa: {
            matricula: 0,
            nome: 1,
            sexo: 2,
            idade: 3,
            dataNascimento: 4,
            anoIngressao: 5
          }
        }
      }
    }
  })
}
