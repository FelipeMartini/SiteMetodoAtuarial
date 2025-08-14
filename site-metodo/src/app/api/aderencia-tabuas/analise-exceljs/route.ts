import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { analisarExcel } from '@/lib/analise-excel/analisadorExcel'

// Schema para validação da requisição
const AnaliseExcelJSSchema = z.object({
  importacaoId: z.string(),
  configuracao: z.object({
    planilhaMassa: z.string().optional(),
    planilhaObitos: z.string().optional(),
    planilhaQx: z.string().optional(),
    extrairFormulas: z.boolean().default(true),
    validarDados: z.boolean().default(true),
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

interface ProcessedData {
  massa_participantes: Array<{
    matricula: string;
    nome?: string;
    sexo: number;
    idade: number;
    dataNascimento?: Date;
    anoIngressao?: number;
  }>;
  obitos_registrados: Array<{
    matricula: string;
    anoObito: number;
    idadeObito: number;
    causaObito?: string;
  }>;
  qx_mortalidade: Array<{
    idade: number;
    qxMasculino?: number;
    qxFeminino?: number;
  }>;
  metadados: {
    totalPlanilhas: number;
    planilhasEncontradas: string[];
    linhasProcessadas: number;
    errosEncontrados: string[];
    resumoEstatistico: any;
  };
}

function processarDadosExcel(analiseExcel: any, _configuracao: any): ProcessedData {
  const resultado: ProcessedData = {
    massa_participantes: [],
    obitos_registrados: [],
    qx_mortalidade: [],
    metadados: {
      totalPlanilhas: analiseExcel.planilhas?.length || 0,
      planilhasEncontradas: analiseExcel.planilhas?.map((p: any) => p.nome) || [],
      linhasProcessadas: 0,
      errosEncontrados: [],
      resumoEstatistico: {}
    }
  }

  try {
    // Processa massa de participantes
    const planilhaMassa = analiseExcel.planilhas?.find((p: any) => 
      p.nome.toLowerCase().includes('massa') || 
      p.nome.toLowerCase().includes('participantes') ||
      p.nome.toLowerCase().includes('unificada')
    )

    if (planilhaMassa) {
      const linhas = planilhaMassa.linhas.slice(1) // Pula cabeçalho
      
      for (const linha of linhas) {
        try {
          if (linha.celulas && linha.celulas.length > 0) {
            const participante = {
              matricula: String(linha.celulas[0]?.valor || '').trim(),
              nome: String(linha.celulas[1]?.valor || '').trim() || undefined,
              sexo: Number(linha.celulas[2]?.valor) || (linha.celulas[1]?.valor === 'M' ? 1 : 2),
              idade: Number(linha.celulas[3]?.valor) || 0,
              dataNascimento: linha.celulas[4]?.valor ? new Date(linha.celulas[4].valor) : undefined,
              anoIngressao: Number(linha.celulas[5]?.valor) || undefined
            }

            if (participante.matricula && participante.idade > 0) {
              resultado.massa_participantes.push(participante)
            }
          }
        } catch (error) {
          resultado.metadados.errosEncontrados.push(`Erro na linha ${linha.numero}: ${(error as Error).message}`)
        }
      }
    }

    // Processa óbitos
    const planilhaObitos = analiseExcel.planilhas?.find((p: any) => 
      p.nome.toLowerCase().includes('obito') || 
      p.nome.toLowerCase().includes('óbito') ||
      p.nome.toLowerCase().includes('mortes')
    )

    if (planilhaObitos) {
      const linhas = planilhaObitos.linhas.slice(1) // Pula cabeçalho
      
      for (const linha of linhas) {
        try {
          if (linha.celulas && linha.celulas.length > 0) {
            const obito = {
              matricula: String(linha.celulas[0]?.valor || '').trim(),
              anoObito: Number(linha.celulas[1]?.valor) || new Date().getFullYear(),
              idadeObito: Number(linha.celulas[2]?.valor) || 0,
              causaObito: String(linha.celulas[3]?.valor || '').trim() || undefined
            }

            if (obito.matricula && obito.idadeObito > 0) {
              resultado.obitos_registrados.push(obito)
            }
          }
        } catch (error) {
          resultado.metadados.errosEncontrados.push(`Erro na linha de óbito ${linha.numero}: ${(error as Error).message}`)
        }
      }
    }

    // Processa qx de mortalidade
    const planilhaQx = analiseExcel.planilhas?.find((p: any) => 
      p.nome.toLowerCase().includes('qx') || 
      p.nome.toLowerCase().includes('mortalidade') ||
      p.nome.toLowerCase().includes('tabua')
    )

    if (planilhaQx) {
      const linhas = planilhaQx.linhas.slice(3) // Pula cabeçalhos
      
      for (const linha of linhas) {
        try {
          if (linha.celulas && linha.celulas.length > 0) {
            const qx = {
              idade: Number(linha.celulas[0]?.valor) || 0,
              qxMasculino: Number(linha.celulas[1]?.valor) || undefined,
              qxFeminino: Number(linha.celulas[2]?.valor) || undefined
            }

            if (qx.idade >= 0 && (qx.qxMasculino || qx.qxFeminino)) {
              resultado.qx_mortalidade.push(qx)
            }
          }
        } catch (error) {
          resultado.metadados.errosEncontrados.push(`Erro na linha qx ${linha.numero}: ${(error as Error).message}`)
        }
      }
    }

    // Calcular estatísticas
    resultado.metadados.linhasProcessadas = 
      resultado.massa_participantes.length + 
      resultado.obitos_registrados.length + 
      resultado.qx_mortalidade.length

    resultado.metadados.resumoEstatistico = {
      participantes: {
        total: resultado.massa_participantes.length,
        masculinos: resultado.massa_participantes.filter(p => p.sexo === 1).length,
        femininos: resultado.massa_participantes.filter(p => p.sexo === 2).length,
        idadeMedia: resultado.massa_participantes.reduce((acc, p) => acc + p.idade, 0) / resultado.massa_participantes.length || 0
      },
      obitos: {
        total: resultado.obitos_registrados.length,
        anoMaisRecente: Math.max(...resultado.obitos_registrados.map(o => o.anoObito)) || 0,
        anoMaisAntigo: Math.min(...resultado.obitos_registrados.map(o => o.anoObito)) || 0
      },
      qx: {
        total: resultado.qx_mortalidade.length,
        idadeMinima: Math.min(...resultado.qx_mortalidade.map(q => q.idade)) || 0,
        idadeMaxima: Math.max(...resultado.qx_mortalidade.map(q => q.idade)) || 0
      }
    }

  } catch (error) {
    resultado.metadados.errosEncontrados.push(`Erro geral no processamento: ${(error as Error).message}`)
  }

  return resultado
}

export async function POST(request: Request, { params: _params }: { params: { slug: string[] } }, _configuracao?: any) {
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
      
      // Analisar com ExcelJS
      const analiseExcel = await analisarExcel(buffer)
      
      // Processar dados específicos de mortalidade
      const dadosProcessados = processarDadosExcel(analiseExcel, dados.configuracao)

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
            analiseExcelJS: {
              configuracao: dados.configuracao,
              resultado: dadosProcessados.metadados,
              processadoEm: new Date().toISOString()
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        importacaoId: dados.importacaoId,
        dadosProcessados,
        tempoProcessamento,
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
            erro: {
              message: (error as Error).message,
              timestamp: new Date().toISOString()
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
    descricao: 'Endpoint para análise de arquivos Excel usando ExcelJS',
    metodo: 'POST',
    exemplo_request: {
      importacaoId: 'uuid-da-importacao',
      configuracao: {
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
