import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import ExcelJS from 'exceljs'
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
  // aceitar manualMapping opcional no payload
  const manualMapping = (body as any).manualMapping || undefined
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
    // Se não vier dadosProcessados mas vier manualMapping, reprocessar o arquivo salvo
    if (!dadosParaSalvar && manualMapping) {
      try {
        // carregar arquivo salvo na importacao
        const caminho = importacao.caminhoArquivo as string
        const fileBuffer = await readFile(caminho)
        const ext = (importacao.tipoArquivo || '').toLowerCase()
  const rows: any[][] = []
        if (ext === 'XLSX' || ext === 'XLS' || caminho.toLowerCase().endsWith('.xlsx') || caminho.toLowerCase().endsWith('.xls')) {
          const workbook = new ExcelJS.Workbook()
          await workbook.xlsx.load(fileBuffer as any)
          const sheet = workbook.worksheets[0]
          if (sheet) {
            sheet.eachRow({ includeEmpty: false }, (row) => {
              const vals = (row.values as any[]).slice(1).map((c:any) => (c && c.text) ? c.text : c)
              rows.push(vals)
            })
          }
        } else {
          const text = fileBuffer.toString('utf8')
          const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
          for (const l of lines) rows.push(l.split(',').map(v => v.replace(/^"|"$/g, '').trim()))
        }

        // detectar header provável (simples)
        const headerRow = rows[0] || []
        const cols = rows.length ? Math.max(...rows.map(r => r.length)) : 0
        const headerLikeCount = headerRow.filter((c:any) => { if (c === null || c === undefined) return false; const s = String(c).trim(); if (!s) return false; if (/[A-Za-zÀ-ú]/.test(s)) return true; if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s) || /^\d{4}-\d{2}-\d{2}/.test(s)) return true; if (!/^[-+]?\d+(?:[.,]\d+)?$/.test(s)) return true; return false }).length
        const possibleHeader = cols > 0 && headerLikeCount >= Math.ceil(cols / 2)

        // converter manualMapping para formato esperado por normalizarLinha
        const mappingForNormalizer: any = {}
        if (manualMapping.matricula !== undefined) mappingForNormalizer.colunaMatricula = manualMapping.matricula
        if (manualMapping.sexo !== undefined) mappingForNormalizer.colunaSexo = manualMapping.sexo
        if (manualMapping.idade !== undefined) mappingForNormalizer.colunaIdade = manualMapping.idade
        if (manualMapping.data_nascimento !== undefined) mappingForNormalizer.colunaDataNascimento = manualMapping.data_nascimento
        if (manualMapping.data_obito !== undefined) mappingForNormalizer.colunaDataObito = manualMapping.data_obito

  // normalizar linhas usando a função util do detector
  // importar dinamicamente para evitar ciclos e sem usar require
  const detectorMod = await import('@/lib/aderencia/detector-layout')
  const { normalizarLinha } = detectorMod as any

        const start = possibleHeader ? 1 : 0
        const massa: any[] = []
        for (let r = start; r < rows.length; r++) {
          const raw = rows[r] || []
          const normalized = normalizarLinha(raw, mappingForNormalizer)
          // transformar sexo para padrão do schema
          if (normalized.sexo === 'M') normalized.sexo = 'MASCULINO'
          else if (normalized.sexo === 'F') normalized.sexo = 'FEMININO'
          // garantir idade numérica
          if (normalized.idade === null || normalized.idade === undefined || Number.isNaN(Number(normalized.idade))) normalized.idade = 0
          massa.push({ idade: Number(normalized.idade || 0), sexo: normalized.sexo || 'MASCULINO', dataNascimento: normalized.data_nascimento || undefined, nome: normalized.matricula || undefined })
        }

        dadosParaSalvar = { origem: 'MANUAL_MAPPING', massaParticipantes: massa }
      } catch (err) {
        console.error('Erro ao reprocessar arquivo com manualMapping:', err)
      }
    }
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

    // preparar snapshot dos dados processados (primeiras 20 linhas) para logging
    const snapshot = (dadosParaSalvar?.massaParticipantes && Array.isArray(dadosParaSalvar.massaParticipantes))
      ? dadosParaSalvar.massaParticipantes.slice(0, 20)
      : []

    // Criar backup se solicitado
    if (dados.configuracao.criarBackup) {
      resultadoSalvamento.backup = await criarBackupDados(dados.importacaoId)
    }

    // calcular estatísticas básicas da massa a ser salva e incluir no log
    const stats = (dadosParaSalvar?.massaParticipantes && Array.isArray(dadosParaSalvar.massaParticipantes)) ? calcStatsFromMassa(dadosParaSalvar.massaParticipantes) : null
    // incluir stats no snapshot (para facilitar auditoria)
    if (stats) {
      // anexar metadata
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
              origem: dadosParaSalvar?.origem || 'API_DIRETA',
              manualMapping: manualMapping || null,
      snapshot: snapshot,
      stats: stats
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
  try {
    // recuperar registros atuais da massa associados à importacao
    const existentes = await prisma.massaParticipantes.findMany({ where: { importacaoId } })
    const backupsDir = join(process.cwd(), 'XLOGS', 'backups')
    await mkdir(backupsDir, { recursive: true })
    const filePath = join(backupsDir, `${backupId}.json`)
    await writeFile(filePath, JSON.stringify({ backupId, createdAt: new Date().toISOString(), count: existentes.length, data: existentes }, null, 2), 'utf8')
    return filePath
  } catch (err) {
    console.error('Erro ao criar backup:', err)
    return backupId
  }
}

function calcStatsFromMassa(massa: any[]) {
  const ages = massa.map((p:any) => Number(p.idade)).filter((v:any)=>!Number.isNaN(v))
  const count = ages.length
  const missingAges = massa.length - count
  const sorted = ages.slice().sort((a:any,b:any)=>a-b)
  const sum = ages.reduce((a:any,b:any)=>a+b,0)
  const mean = count ? sum / count : 0
  const median = (() => { if (!count) return 0; const mid = Math.floor(count/2); return (count % 2 === 1) ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2 })()
  const min = count ? sorted[0] : 0
  const max = count ? sorted[sorted.length-1] : 0
  const std = (() => {
    if (!count) return 0
    const varSum = ages.reduce((acc:any,v:any)=> acc + Math.pow(v - mean, 2), 0)
    return Math.sqrt(varSum / count)
  })()
  const sexoCounts: Record<string, number> = {}
  for (const p of massa) {
    const s = (p.sexo || '').toString()
    sexoCounts[s] = (sexoCounts[s]||0) + 1
  }
  return { count, min, max, mean, median, std, missingAges, sexoCounts }
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
