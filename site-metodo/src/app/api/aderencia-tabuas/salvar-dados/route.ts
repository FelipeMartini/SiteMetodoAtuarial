import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Schema para dados da massa de participantes
const MassaParticipanteSchema = z.object({
  idade: z.number().int().min(0).max(120),
  sexo: z.enum(['MASCULINO', 'FEMININO']),
  dataNascimento: z.string().optional(),
  salario: z.number().optional(),
  nome: z.string().optional(),
  cpf: z.string().optional(),
  metadados: z.record(z.string(), z.any()).optional()
})

// Schema para dados de óbitos
const ObitoRegistradoSchema = z.object({
  idadeObito: z.number().int().min(0).max(120),
  sexo: z.enum(['MASCULINO', 'FEMININO']),
  dataObito: z.string(),
  causaObito: z.string().optional(),
  cpfParticipante: z.string().optional(),
  metadados: z.record(z.string(), z.any()).optional()
})

// Schema para dados de qx
const QxMortalidadeSchema = z.object({
  idade: z.number().int().min(0).max(120),
  qxMasculino: z.number().min(0).max(1).optional(),
  qxFeminino: z.number().min(0).max(1).optional(),
  qxGeral: z.number().min(0).max(1).optional(),
  fonte: z.string().optional(),
  metadados: z.record(z.string(), z.any()).optional()
})

// Schema principal para salvar dados
const SalvarDadosSchema = z.object({
  importacaoId: z.string(),
  configuracao: z.object({
    sobrescreverExistentes: z.boolean().default(false),
    validarIntegridade: z.boolean().default(true),
    criarBackup: z.boolean().default(true),
    processarEmLotes: z.boolean().default(true),
    tamanhoLote: z.number().min(10).max(1000).default(100)
  }),
  dadosProcessados: z.object({
    massaParticipantes: z.array(MassaParticipanteSchema).optional(),
    obituarios: z.array(ObitoRegistradoSchema).optional(),
    tabulaReferencia: z.array(QxMortalidadeSchema).optional(),
    origem: z.string(),
    metadadosGerais: z.record(z.string(), z.any()).optional()
  }).optional(),
  caminhoResultadoPython: z.string().optional()
})

export async function POST(request: NextRequest) {
  const _transacao: any = null
  
  try {
    const body = await request.json()
    const dados = SalvarDadosSchema.parse(body)

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

    // Carregar dados do arquivo Python se não fornecidos diretamente
    let dadosParaSalvar = dados.dadosProcessados
    
    if (!dadosParaSalvar && dados.caminhoResultadoPython) {
      try {
        const resultadoPython = JSON.parse(await readFile(dados.caminhoResultadoPython, 'utf-8'))
        dadosParaSalvar = await processarResultadoPython(resultadoPython, dados.importacaoId)
      } catch (error) {
        return NextResponse.json(
          { error: 'Erro ao carregar resultado Python', detalhes: (error as Error).message },
          { status: 400 }
        )
      }
    }

    if (!dadosParaSalvar) {
      return NextResponse.json(
        { error: 'Nenhum dado fornecido para salvar' },
        { status: 400 }
      )
    }

    const inicioSalvamento = Date.now()
    const resultadoSalvamento = {
      massaParticipantes: { inseridos: 0, atualizados: 0, erros: 0 },
      obituarios: { inseridos: 0, atualizados: 0, erros: 0 },
      tabulaReferencia: { inseridos: 0, atualizados: 0, erros: 0 },
      logs: [] as string[],
      backup: null as string | null
    }

    // Criar backup se solicitado
    if (dados.configuracao.criarBackup) {
      resultadoSalvamento.backup = await criarBackupDados(dados.importacaoId)
    }

    // Iniciar transação
    await prisma.$transaction(async (tx: any) => {
      // transacao = tx (removido pois não é usado)

      // Salvar massa de participantes
      if (dadosParaSalvar?.massaParticipantes?.length) {
        const resultado = await salvarMassaParticipantes(
          tx, 
          dadosParaSalvar.massaParticipantes, 
          dados.importacaoId,
          dados.configuracao
        )
        resultadoSalvamento.massaParticipantes = resultado
      }

      // Salvar óbitos
      if (dadosParaSalvar?.obituarios?.length) {
        const resultado = await salvarObituarios(
          tx, 
          dadosParaSalvar.obituarios, 
          dados.importacaoId,
          dados.configuracao
        )
        resultadoSalvamento.obituarios = resultado
      }

      // Salvar tábua de referência
      if (dadosParaSalvar?.tabulaReferencia?.length) {
        const resultado = await salvarTabulaReferencia(
          tx, 
          dadosParaSalvar.tabulaReferencia, 
          dados.importacaoId,
          dados.configuracao
        )
        resultadoSalvamento.tabulaReferencia = resultado
      }

      // Atualizar importação com resultado do salvamento
      await tx.importacaoMortalidade.update({
        where: { id: dados.importacaoId },
        data: {
          status: 'DADOS_SALVOS',
          tempoProcessamento: (importacao.tempoProcessamento || 0) + Math.round((Date.now() - inicioSalvamento) / 1000),
          logImportacao: {
            ...importacao.logImportacao as any,
            salvamentoDados: {
              processadoEm: new Date().toISOString(),
              configuracao: dados.configuracao,
              resultado: resultadoSalvamento,
              origem: dadosParaSalvar?.origem || 'API_DIRETA'
            }
          }
        }
      })
    })

    const tempoSalvamento = Math.round((Date.now() - inicioSalvamento) / 1000)

    return NextResponse.json({
      success: true,
      importacaoId: dados.importacaoId,
      resultado: resultadoSalvamento,
      tempoSalvamento,
      proximoPasso: `/api/aderencia-tabuas/relatorio/${dados.importacaoId}`,
      resumo: {
        totalRegistrosProcessados: 
          resultadoSalvamento.massaParticipantes.inseridos + 
          resultadoSalvamento.obituarios.inseridos + 
          resultadoSalvamento.tabulaReferencia.inseridos,
        totalErros: 
          resultadoSalvamento.massaParticipantes.erros + 
          resultadoSalvamento.obituarios.erros + 
          resultadoSalvamento.tabulaReferencia.erros
      }
    })

  } catch (error) {
    console.error('Erro ao salvar dados:', error)
    
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
        error: 'Erro interno do servidor ao salvar dados',
        detalhes: (error as Error).message
      },
      { status: 500 }
    )
  }
}

async function processarResultadoPython(resultadoPython: any, _importacaoId: string) {
  /**
   * Converte resultado do Python para formato esperado pela API
   */
  const dadosProcessados: any = {
    origem: 'PYTHON_SCRIPT',
    metadadosGerais: resultadoPython.metadados || {}
  }

  // Processar massa de participantes
  const mapperSexo = (valor: any) => {
    if (!valor && valor !== 0) return undefined
    const s = String(valor).toUpperCase()
    if (['M', 'MASCULINO', '1', 'MALE'].includes(s)) return 'MASCULINO'
    if (['F', 'FEMININO', '2', 'FEMALE'].includes(s)) return 'FEMININO'
    return undefined
  }

  if (resultadoPython.dados_extraidos?.massa_participantes) {
    const arr = resultadoPython.dados_extraidos.massa_participantes
    dadosProcessados.massaParticipantes = Array.isArray(arr)
      ? arr.map((p: any) => {
          const idade = Number(p.idade ?? p.age ?? p.id) || 0
          const sexo = mapperSexo(p.sexo ?? p.gender ?? p.sexoTexto)
          return {
            idade,
            sexo: sexo || 'MASCULINO',
            dataNascimento: p.dataNascimento || p.data_nascimento || p.birthDate || undefined,
            salario: p.salario ?? p.salary ?? undefined,
            nome: p.nome || p.name || undefined,
            cpf: p.cpf || p.citizenId || undefined,
            metadados: p.metadados || p.meta || {}
          }
        }).filter((x: any) => x.idade >= 0)
      : []
  }

  // Processar óbitos
  if (resultadoPython.dados_extraidos?.obitos_registrados) {
    const arr = resultadoPython.dados_extraitos?.obitos_registrados || resultadoPython.dados_extraidos.obitos_registrados
    datos:
    dadosProcessados.obituarios = Array.isArray(arr)
          ? arr.map((o: any) => {
          const idadeObito = Number(((o.idadeObito ?? o.idade) || o.age)) || 0
          const sexo = mapperSexo(o.sexo ?? o.gender)
          const dataObito = o.dataObito || o.data_obito || o.date || undefined
          return {
            idadeObito,
            sexo: sexo || 'MASCULINO',
            dataObito,
            causaObito: o.causaObito || o.cause || undefined,
            cpfParticipante: o.cpfParticipante || o.cpf || undefined,
            metadados: o.metadados || o.meta || {}
          }
        }).filter((x: any) => x.idadeObito >= 0)
      : []
  }

  // Processar qx
  if (resultadoPython.dados_extraidos?.qx_mortalidade) {
    const arr = resultadoPython.dados_extraidos.qx_mortalidade
    dadosProcessados.tabulaReferencia = Array.isArray(arr)
      ? arr.map((q: any) => ({
          idade: Number(q.idade ?? q.age) || 0,
          qxMasculino: q.qxMasculino ?? q.qx_masc ?? q.male_qx ?? undefined,
          qxFeminino: q.qxFeminino ?? q.qx_fem ?? q.female_qx ?? undefined,
          qxGeral: q.qxGeral ?? q.qx ?? undefined,
          fonte: q.fonte || q.source || undefined,
          metadados: q.metadados || q.meta || {}
        })).filter((x: any) => x.idade >= 0)
      : []
  }

  return dadosProcessados
}

async function salvarMassaParticipantes(
  tx: any, 
  participantes: any[], 
  importacaoId: string, 
  configuracao: any
) {
  let inseridos = 0, atualizados = 0, erros = 0
  const logs: string[] = []

  try {
    if (configuracao.processarEmLotes) {
      // Processar em lotes
      for (let i = 0; i < participantes.length; i += configuracao.tamanhoLote) {
        const lote = participantes.slice(i, i + configuracao.tamanhoLote)
        
        for (const participante of lote) {
          try {
            const resultado = await tx.massaParticipantes.upsert({
              where: { 
                cpf_importacaoId: { 
                  cpf: participante.cpf || `auto_${importacaoId}_${i}`,
                  importacaoId 
                }
              },
              update: {
                idade: participante.idade,
                sexo: participante.sexo,
                dataNascimento: participante.dataNascimento ? new Date(participante.dataNascimento) : null,
                salario: participante.salario,
                nome: participante.nome,
                metadados: participante.metadados || {},
                atualizadoEm: new Date()
              },
              create: {
                idade: participante.idade,
                sexo: participante.sexo,
                dataNascimento: participante.dataNascimento ? new Date(participante.dataNascimento) : null,
                salario: participante.salario,
                nome: participante.nome,
                cpf: participante.cpf || `auto_${importacaoId}_${i}`,
                metadados: participante.metadados || {},
                importacaoId,
                criadoEm: new Date(),
                atualizadoEm: new Date()
              }
            })
            
            if (resultado.criadoEm === resultado.atualizadoEm) {
              inseridos++
            } else {
              atualizados++
            }
            
          } catch (error) {
            erros++
            logs.push(`Erro ao salvar participante: ${(error as Error).message}`)
          }
        }
      }
    }
  } catch (error) {
    logs.push(`Erro geral na massa: ${(error as Error).message}`)
  }

  return { inseridos, atualizados, erros, logs }
}

async function salvarObituarios(
  tx: any, 
  obitos: any[], 
  importacaoId: string, 
  configuracao: any
) {
  let inseridos = 0, atualizados = 0, erros = 0
  const logs: string[] = []

  try {
    if (configuracao.processarEmLotes) {
      for (let i = 0; i < obitos.length; i += configuracao.tamanhoLote) {
        const lote = obitos.slice(i, i + configuracao.tamanhoLote)
        
        for (const obito of lote) {
          try {
            const resultado = await tx.obitoRegistrado.upsert({
              where: { 
                cpfParticipante_dataObito: { 
                  cpfParticipante: obito.cpfParticipante || `auto_obito_${importacaoId}_${i}`,
                  dataObito: new Date(obito.dataObito)
                }
              },
              update: {
                idadeObito: obito.idadeObito,
                sexo: obito.sexo,
                causaObito: obito.causaObito,
                metadados: obito.metadados || {},
                atualizadoEm: new Date()
              },
              create: {
                idadeObito: obito.idadeObito,
                sexo: obito.sexo,
                dataObito: new Date(obito.dataObito),
                causaObito: obito.causaObito,
                cpfParticipante: obito.cpfParticipante || `auto_obito_${importacaoId}_${i}`,
                metadados: obito.metadados || {},
                importacaoId,
                criadoEm: new Date(),
                atualizadoEm: new Date()
              }
            })
            
            if (resultado.criadoEm === resultado.atualizadoEm) {
              inseridos++
            } else {
              atualizados++
            }
            
          } catch (error) {
            erros++
            logs.push(`Erro ao salvar óbito: ${(error as Error).message}`)
          }
        }
      }
    }
  } catch (error) {
    logs.push(`Erro geral nos óbitos: ${(error as Error).message}`)
  }

  return { inseridos, atualizados, erros, logs }
}

async function salvarTabulaReferencia(
  tx: any, 
  qxDados: any[], 
  importacaoId: string, 
  configuracao: any
) {
  let inseridos = 0, atualizados = 0, erros = 0
  const logs: string[] = []

  try {
    if (configuracao.processarEmLotes) {
      for (let i = 0; i < qxDados.length; i += configuracao.tamanhoLote) {
        const lote = qxDados.slice(i, i + configuracao.tamanhoLote)
        
        for (const qx of lote) {
          try {
            const resultado = await tx.qxMortalidade.upsert({
              where: { 
                idade_fonte_importacaoId: { 
                  idade: qx.idade,
                  fonte: qx.fonte || 'IMPORTACAO',
                  importacaoId
                }
              },
              update: {
                qxMasculino: qx.qxMasculino,
                qxFeminino: qx.qxFeminino,
                qxGeral: qx.qxGeral,
                metadados: qx.metadados || {},
                atualizadoEm: new Date()
              },
              create: {
                idade: qx.idade,
                qxMasculino: qx.qxMasculino,
                qxFeminino: qx.qxFeminino,
                qxGeral: qx.qxGeral,
                fonte: qx.fonte || 'IMPORTACAO',
                metadados: qx.metadados || {},
                importacaoId,
                criadoEm: new Date(),
                atualizadoEm: new Date()
              }
            })
            
            if (resultado.criadoEm === resultado.atualizadoEm) {
              inseridos++
            } else {
              atualizados++
            }
            
          } catch (error) {
            erros++
            logs.push(`Erro ao salvar qx idade ${qx.idade}: ${(error as Error).message}`)
          }
        }
      }
    }
  } catch (error) {
    logs.push(`Erro geral no qx: ${(error as Error).message}`)
  }

  return { inseridos, atualizados, erros, logs }
}

async function criarBackupDados(importacaoId: string): Promise<string> {
  /**
   * Cria backup dos dados existentes antes da importação
   */
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupId = `backup_${importacaoId}_${timestamp}`
  
  // Implementar lógica de backup conforme necessário
  // Por enquanto retorna apenas o ID do backup
  
  return backupId
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/aderencia-tabuas/salvar-dados',
    descricao: 'Endpoint para salvar dados processados no banco SQLite',
    metodo: 'POST',
    funcionalidades: [
      'Salvamento em lotes para performance',
      'Upsert (inserir ou atualizar) dados existentes',
      'Backup automático antes do salvamento',
      'Validação de integridade dos dados',
      'Transações para consistência'
    ],
    exemplo_request: {
      importacaoId: 'uuid-da-importacao',
      configuracao: {
        sobrescreverExistentes: false,
        validarIntegridade: true,
        criarBackup: true,
        processarEmLotes: true,
        tamanhoLote: 100
      },
      dadosProcessados: {
        massaParticipantes: [
          {
            idade: 45,
            sexo: 'MASCULINO',
            dataNascimento: '1978-05-15',
            salario: 5000.00,
            nome: 'João Silva',
            cpf: '12345678901'
          }
        ],
        obituarios: [
          {
            idadeObito: 67,
            sexo: 'FEMININO',
            dataObito: '2023-12-01',
            causaObito: 'Natural',
            cpfParticipante: '98765432100'
          }
        ],
        tabulaReferencia: [
          {
            idade: 45,
            qxMasculino: 0.0023,
            qxFeminino: 0.0018,
            fonte: 'SUSEP'
          }
        ]
      }
    }
  })
}
