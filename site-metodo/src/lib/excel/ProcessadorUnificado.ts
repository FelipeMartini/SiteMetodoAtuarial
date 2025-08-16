/**
 * Processador Unificado de Excel - Sistema Aderência
 * 
 * Consolida todo o processamento de arquivos Excel em um pipeline único,
 * substituindo as duplicações encontradas em:
 * - analisadorExcel.ts (wrapper ExcelJS básico)
 * - detector-layout.ts (detecção de colunas)
 * - salvar-dados/route.ts (processamento manual)
 * - analise-exceljs/route.ts (lógica específica)
 */

import ExcelJS from 'exceljs'
import { Buffer } from 'buffer'

// ===== TIPOS UNIFICADOS =====

export interface ConfiguracaoProcessamento {
  planilhaMassa?: string
  planilhaObitos?: string
  planilhaQx?: string
  extrairFormulas?: boolean
  validarDados?: boolean
  mapeamentoColunas?: {
    massa?: MapeamentoColunas
    obitos?: MapeamentoColunas
    qx?: MapeamentoColunas
  }
  autoDeteccao?: boolean
  limiteMmaxLinhas?: number
}

export interface MapeamentoColunas {
  matricula?: string | number
  nome?: string | number
  sexo?: string | number
  idade?: string | number
  dataNascimento?: string | number
  anoIngressao?: string | number
  anoObito?: string | number
  idadeObito?: string | number
  causaObito?: string | number
  qxMasculino?: string | number
  qxFeminino?: string | number
}

export interface DadosProcessados {
  massa_participantes: Array<{
    matricula: string
    nome?: string
    sexo: number // 1 = masculino, 2 = feminino
    idade: number
    dataNascimento?: Date
    anoIngressao?: number
  }>
  obitos_registrados: Array<{
    matricula: string
    anoObito: number
    idadeObito: number
    causaObito?: string
  }>
  qx_mortalidade: Array<{
    idade: number
    qxMasculino?: number
    qxFeminino?: number
  }>
  metadados: {
    totalPlanilhas: number
    planilhasEncontradas: string[]
    linhasProcessadas: number
    errosEncontrados: string[]
    resumoEstatistico: any
    deteccaoAutomatica?: DeteccaoLayout
  }
}

export interface DeteccaoLayout {
  planilhaIdentificada: string
  tipoDetectado: 'MASSA' | 'OBITOS' | 'QX' | 'MISTO'
  confianca: number
  mapeamentoSugerido: MapeamentoColunas
  estatisticasColunas: Array<{
    indice: number
    header: string
    tipo: 'MATRICULA' | 'SEXO' | 'IDADE' | 'DATA' | 'QX' | 'DESCONHECIDO'
    confianca: number
    amostras: any[]
  }>
}

// ===== DETECÇÃO AUTOMÁTICA DE LAYOUT =====

function normalizeHeader(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '_')
    .trim()
}

function detectarTipoColuna(header: string, valores: any[]): { tipo: string; confianca: number } {
  const headerNorm = normalizeHeader(header)
  
  // Keywords para identificação
  const keywords = {
    matricula: ['matricula', 'matr', 'registro', 'id', 'codigo', 'cod'],
    sexo: ['sexo', 'sex', 'genero', 'gender'],
    idade: ['idade', 'age', 'anos'],
    data_nascimento: ['nascimento', 'data_nascimento', 'data_nasc', 'birth', 'dt_nasc'],
    data_obito: ['obito', 'morte', 'falecimento', 'data_obito', 'dt_obito', 'death'],
    qx: ['qx', 'mortalidade', 'prob', 'probabilidade']
  }

  // Análise de header
  let maxScore = 0
  let tipoDetectado = 'DESCONHECIDO'

  for (const [tipo, kws] of Object.entries(keywords)) {
    let score = 0
    for (const kw of kws) {
      if (headerNorm.includes(kw)) {
        score += 5
      }
    }
    if (score > maxScore) {
      maxScore = score
      tipoDetectado = tipo.toUpperCase()
    }
  }

  // Análise de conteúdo
  if (valores.length > 0) {
    const valoresLimpos = valores.filter(v => v != null && String(v).trim() !== '').slice(0, 100)
    
    if (valoresLimpos.length > 0) {
      // Detectar idade
      const idadesValidas = valoresLimpos.filter(v => {
        const num = Number(String(v).replace(/[^0-9.-]/g, ''))
        return !Number.isNaN(num) && num >= 0 && num <= 120
      }).length
      
      if (idadesValidas / valoresLimpos.length > 0.8) {
        if (tipoDetectado === 'DESCONHECIDO' || maxScore < 3) {
          tipoDetectado = 'IDADE'
          maxScore = Math.max(maxScore, 4)
        }
      }

      // Detectar sexo
      const sexosValidos = valoresLimpos.filter(v => {
        const s = String(v).toLowerCase().trim()
        return ['m', 'f', 'masc', 'fem', 'masculino', 'feminino', '1', '2'].includes(s)
      }).length
      
      if (sexosValidos / valoresLimpos.length > 0.7) {
        if (tipoDetectado === 'DESCONHECIDO' || maxScore < 3) {
          tipoDetectado = 'SEXO'
          maxScore = Math.max(maxScore, 4)
        }
      }

      // Detectar datas
      const datasValidas = valoresLimpos.filter(v => {
        const s = String(v).trim()
        return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s) || /^\d{4}-\d{2}-\d{2}/.test(s)
      }).length
      
      if (datasValidas / valoresLimpos.length > 0.5) {
        if (tipoDetectado === 'DESCONHECIDO') {
          tipoDetectado = 'DATA'
          maxScore = 3
        }
      }

      // Detectar qx (valores decimais pequenos)
      const qxValidos = valoresLimpos.filter(v => {
        const num = Number(String(v).replace(/,/g, '.'))
        return !Number.isNaN(num) && num >= 0 && num <= 1 && num < 0.1
      }).length
      
      if (qxValidos / valoresLimpos.length > 0.8) {
        if (tipoDetectado === 'DESCONHECIDO' || headerNorm.includes('qx')) {
          tipoDetectado = 'QX'
          maxScore = Math.max(maxScore, 4)
        }
      }

      // Detectar matrículas (strings/números únicos)
      const uniqueCount = new Set(valoresLimpos.map(v => String(v).trim())).size
      if (uniqueCount / valoresLimpos.length > 0.95 && valoresLimpos.length > 10) {
        if (tipoDetectado === 'DESCONHECIDO' || maxScore < 2) {
          tipoDetectado = 'MATRICULA'
          maxScore = Math.max(maxScore, 2)
        }
      }
    }
  }

  return {
    tipo: tipoDetectado,
    confianca: Math.min(maxScore / 5, 1)
  }
}

async function detectarLayoutPlanilha(planilha: ExcelJS.Worksheet): Promise<DeteccaoLayout> {
  const linhas: any[][] = []
  const maxLinhasAnalise = 100

  // Ler linhas para análise
  let count = 0
  planilha.eachRow({ includeEmpty: false }, (row) => {
    if (count >= maxLinhasAnalise) return
    const vals = (row.values as any[]).slice(1) // ExcelJS é 1-based
    linhas.push(vals.map(c => c && (c as any).text ? (c as any).text : c))
    count++
  })

  if (linhas.length === 0) {
    return {
      planilhaIdentificada: planilha.name,
      tipoDetectado: 'MISTO',
      confianca: 0,
      mapeamentoSugerido: {},
      estatisticasColunas: []
    }
  }

  const headerRow = linhas[0] || []
  const dadosLinhas = linhas.slice(1)
  const cols = Math.max(...linhas.map(r => r.length))

  // Analisar cada coluna
  const estatisticasColunas = []
  for (let c = 0; c < cols; c++) {
    const header = String(headerRow[c] || '').trim()
    const valores = dadosLinhas.map(r => r[c]).filter(v => v != null)
    
    const { tipo, confianca } = detectarTipoColuna(header, valores)
    
    estatisticasColunas.push({
      indice: c,
      header,
      tipo: tipo as any,
      confianca,
      amostras: valores.slice(0, 5)
    })
  }

  // Determinar tipo da planilha
  const tiposEncontrados = estatisticasColunas.map(e => e.tipo)
  let tipoDetectado: 'MASSA' | 'OBITOS' | 'QX' | 'MISTO' = 'MISTO'
  let confiancaGeral = 0

  if (tiposEncontrados.includes('QX')) {
    tipoDetectado = 'QX'
    confiancaGeral = 0.8
  } else if (tiposEncontrados.includes('DATA_OBITO') || planilha.name.toLowerCase().includes('obito')) {
    tipoDetectado = 'OBITOS'
    confiancaGeral = 0.7
  } else if (tiposEncontrados.includes('MATRICULA') && tiposEncontrados.includes('IDADE')) {
    tipoDetectado = 'MASSA'
    confiancaGeral = 0.9
  }

  // Gerar mapeamento sugerido
  const mapeamentoSugerido: MapeamentoColunas = {}
  for (const col of estatisticasColunas) {
    if (col.confianca > 0.5) {
      switch (col.tipo) {
        case 'MATRICULA':
          mapeamentoSugerido.matricula = col.indice
          break
        case 'SEXO':
          mapeamentoSugerido.sexo = col.indice
          break
        case 'IDADE':
          mapeamentoSugerido.idade = col.indice
          break
        case 'DATA_NASCIMENTO':
          mapeamentoSugerido.dataNascimento = col.indice
          break
        case 'DATA_OBITO':
          mapeamentoSugerido.anoObito = col.indice
          break
      }
    }
  }

  return {
    planilhaIdentificada: planilha.name,
    tipoDetectado,
    confianca: confiancaGeral,
    mapeamentoSugerido,
    estatisticasColunas
  }
}

// ===== PROCESSAMENTO UNIFICADO =====

function normalizarSexo(valor: any): number {
  if (valor === null || valor === undefined) return 1 // default masculino
  const s = String(valor).toLowerCase().trim()
  if (/^m(asc)?$/.test(s) || s === 'male' || s === '1') return 1
  if (/^f(em)?$/.test(s) || s === 'female' || s === '2') return 2
  return 1 // default
}

function normalizarData(valor: any): Date | undefined {
  if (!valor && valor !== 0) return undefined
  
  if (typeof valor === 'number') {
    // Excel date serial number
    return new Date(Math.round((valor - 25569) * 86400 * 1000))
  }
  
  const s = String(valor).trim()
  if (!s) return undefined
  
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    return new Date(s)
  }
  
  const dm = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (dm) {
    const [, d, m, y] = dm
    return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`)
  }
  
  const parsed = Date.parse(s)
  if (!Number.isNaN(parsed)) {
    return new Date(parsed)
  }
  
  return undefined
}

function processarPlanilhaMassa(
  planilha: ExcelJS.Worksheet,
  mapeamento?: MapeamentoColunas
): Array<any> {
  const resultado: any[] = []
  const linhas: any[][] = []

  // Ler todas as linhas
  planilha.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return // pular header
    const vals = (row.values as any[]).slice(1)
    linhas.push(vals.map(c => c && (c as any).text ? (c as any).text : c))
  })

  // Mapear colunas (usar detecção automática se não fornecido)
  const colMatricula = mapeamento?.matricula ?? 0
  const colNome = mapeamento?.nome ?? 1
  const colSexo = mapeamento?.sexo ?? 2
  const colIdade = mapeamento?.idade ?? 3
  const colDataNasc = mapeamento?.dataNascimento ?? 4
  const colAnoIngresso = mapeamento?.anoIngressao ?? 5

  for (const linha of linhas) {
    try {
      const participante = {
        matricula: String(linha[colMatricula as number] || '').trim(),
        nome: linha[colNome as number] ? String(linha[colNome as number]).trim() : undefined,
        sexo: normalizarSexo(linha[colSexo as number]),
        idade: Number(linha[colIdade as number]) || 0,
        dataNascimento: normalizarData(linha[colDataNasc as number]),
        anoIngressao: linha[colAnoIngresso as number] ? Number(linha[colAnoIngresso as number]) : undefined
      }

      if (participante.matricula && participante.idade > 0) {
        resultado.push(participante)
      }
    } catch (error) {
      console.warn('Erro ao processar linha massa:', error)
    }
  }

  return resultado
}

function processarPlanilhaObitos(
  planilha: ExcelJS.Worksheet,
  mapeamento?: MapeamentoColunas
): Array<any> {
  const resultado: any[] = []
  const linhas: any[][] = []

  planilha.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return // pular header
    const vals = (row.values as any[]).slice(1)
    linhas.push(vals.map(c => c && (c as any).text ? (c as any).text : c))
  })

  const colMatricula = mapeamento?.matricula ?? 0
  const colAnoObito = mapeamento?.anoObito ?? 1
  const colIdadeObito = mapeamento?.idadeObito ?? 2
  const colCausa = mapeamento?.causaObito ?? 3

  for (const linha of linhas) {
    try {
      const obito = {
        matricula: String(linha[colMatricula as number] || '').trim(),
        anoObito: Number(linha[colAnoObito as number]) || new Date().getFullYear(),
        idadeObito: Number(linha[colIdadeObito as number]) || 0,
        causaObito: linha[colCausa as number] ? String(linha[colCausa as number]).trim() : undefined
      }

      if (obito.matricula && obito.idadeObito > 0) {
        resultado.push(obito)
      }
    } catch (error) {
      console.warn('Erro ao processar linha óbitos:', error)
    }
  }

  return resultado
}

function processarPlanilhaQx(
  planilha: ExcelJS.Worksheet,
  mapeamento?: MapeamentoColunas
): Array<any> {
  const resultado: any[] = []
  const linhas: any[][] = []

  planilha.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber <= 2) return // pular headers
    const vals = (row.values as any[]).slice(1)
    linhas.push(vals.map(c => c && (c as any).text ? (c as any).text : c))
  })

  const colIdade = mapeamento?.idade ?? 0
  const colQxMasc = mapeamento?.qxMasculino ?? 1
  const colQxFem = mapeamento?.qxFeminino ?? 2

  for (const linha of linhas) {
    try {
      const qx = {
        idade: Number(linha[colIdade as number]) || 0,
        qxMasculino: linha[colQxMasc as number] ? Number(linha[colQxMasc as number]) : undefined,
        qxFeminino: linha[colQxFem as number] ? Number(linha[colQxFem as number]) : undefined
      }

      if (qx.idade >= 0 && (qx.qxMasculino || qx.qxFeminino)) {
        resultado.push(qx)
      }
    } catch (error) {
      console.warn('Erro ao processar linha qx:', error)
    }
  }

  return resultado
}

// ===== FUNÇÃO PRINCIPAL UNIFICADA =====

/**
 * Processa arquivo Excel completo com detecção automática ou mapeamento manual
 */
export async function processarExcelUnificado(
  buffer: Buffer | ArrayBuffer | Uint8Array,
  configuracao: ConfiguracaoProcessamento = {}
): Promise<DadosProcessados> {
  // Normalizar buffer para Buffer do Node.js
  let workbookBuffer: Buffer
  if (Buffer.isBuffer(buffer)) {
    workbookBuffer = buffer
  } else if (buffer instanceof ArrayBuffer) {
    workbookBuffer = Buffer.from(buffer)
  } else if (buffer instanceof Uint8Array) {
    workbookBuffer = Buffer.from(buffer)
  } else {
    throw new Error('Tipo de buffer não suportado')
  }

  const workbook = new ExcelJS.Workbook()
  // Usar any para contornar incompatibilidade de tipos do ExcelJS
  await workbook.xlsx.load(workbookBuffer as any)

  const resultado: DadosProcessados = {
    massa_participantes: [],
    obitos_registrados: [],
    qx_mortalidade: [],
    metadados: {
      totalPlanilhas: workbook.worksheets.length,
      planilhasEncontradas: workbook.worksheets.map(w => w.name),
      linhasProcessadas: 0,
      errosEncontrados: [],
      resumoEstatistico: {},
      deteccaoAutomatica: undefined
    }
  }

  try {
    // Processamento por planilha
    for (const planilha of workbook.worksheets) {
      const nomeMinusculo = planilha.name.toLowerCase()
      
      // Detecção automática se habilitada
      if (configuracao.autoDeteccao !== false) {
        const deteccao = await detectarLayoutPlanilha(planilha)
        resultado.metadados.deteccaoAutomatica = deteccao

        // Processar baseado na detecção
        if (deteccao.tipoDetectado === 'MASSA' || nomeMinusculo.includes('massa') || nomeMinusculo.includes('participantes')) {
          const massa = processarPlanilhaMassa(planilha, deteccao.mapeamentoSugerido)
          resultado.massa_participantes.push(...massa)
        } else if (deteccao.tipoDetectado === 'OBITOS' || nomeMinusculo.includes('obito') || nomeMinusculo.includes('morte')) {
          const obitos = processarPlanilhaObitos(planilha, deteccao.mapeamentoSugerido)
          resultado.obitos_registrados.push(...obitos)
        } else if (deteccao.tipoDetectado === 'QX' || nomeMinusculo.includes('qx') || nomeMinusculo.includes('mortalidade')) {
          const qx = processarPlanilhaQx(planilha, deteccao.mapeamentoSugerido)
          resultado.qx_mortalidade.push(...qx)
        }
      } else {
        // Processamento manual baseado em configuração
        if (configuracao.planilhaMassa && planilha.name === configuracao.planilhaMassa) {
          const massa = processarPlanilhaMassa(planilha, configuracao.mapeamentoColunas?.massa)
          resultado.massa_participantes.push(...massa)
        }
        if (configuracao.planilhaObitos && planilha.name === configuracao.planilhaObitos) {
          const obitos = processarPlanilhaObitos(planilha, configuracao.mapeamentoColunas?.obitos)
          resultado.obitos_registrados.push(...obitos)
        }
        if (configuracao.planilhaQx && planilha.name === configuracao.planilhaQx) {
          const qx = processarPlanilhaQx(planilha, configuracao.mapeamentoColunas?.qx)
          resultado.qx_mortalidade.push(...qx)
        }
      }
    }

    // Estatísticas finais
    resultado.metadados.linhasProcessadas = 
      resultado.massa_participantes.length + 
      resultado.obitos_registrados.length + 
      resultado.qx_mortalidade.length

    resultado.metadados.resumoEstatistico = {
      participantes: {
        total: resultado.massa_participantes.length,
        masculinos: resultado.massa_participantes.filter(p => p.sexo === 1).length,
        femininos: resultado.massa_participantes.filter(p => p.sexo === 2).length,
        idadeMedia: resultado.massa_participantes.length > 0 
          ? resultado.massa_participantes.reduce((acc, p) => acc + p.idade, 0) / resultado.massa_participantes.length 
          : 0
      },
      obitos: {
        total: resultado.obitos_registrados.length,
        anoMaisRecente: resultado.obitos_registrados.length > 0 
          ? Math.max(...resultado.obitos_registrados.map(o => o.anoObito)) 
          : 0,
        anoMaisAntigo: resultado.obitos_registrados.length > 0 
          ? Math.min(...resultado.obitos_registrados.map(o => o.anoObito)) 
          : 0
      },
      qx: {
        total: resultado.qx_mortalidade.length,
        idadeMinima: resultado.qx_mortalidade.length > 0 
          ? Math.min(...resultado.qx_mortalidade.map(q => q.idade)) 
          : 0,
        idadeMaxima: resultado.qx_mortalidade.length > 0 
          ? Math.max(...resultado.qx_mortalidade.map(q => q.idade)) 
          : 0
      }
    }

  } catch (error) {
    resultado.metadados.errosEncontrados.push(`Erro geral no processamento: ${(error as Error).message}`)
  }

  return resultado
}

// ===== FUNÇÕES AUXILIARES =====

/**
 * Detecta apenas o layout sem processar os dados
 */
export async function detectarLayoutArquivo(buffer: Buffer | ArrayBuffer | Uint8Array): Promise<DeteccaoLayout[]> {
  // Normalizar buffer
  let workbookBuffer: Buffer
  if (Buffer.isBuffer(buffer)) {
    workbookBuffer = buffer
  } else if (buffer instanceof ArrayBuffer) {
    workbookBuffer = Buffer.from(buffer)
  } else if (buffer instanceof Uint8Array) {
    workbookBuffer = Buffer.from(buffer)
  } else {
    throw new Error('Tipo de buffer não suportado')
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(workbookBuffer as any)

  const deteccoes: DeteccaoLayout[] = []
  
  for (const planilha of workbook.worksheets) {
    const deteccao = await detectarLayoutPlanilha(planilha)
    deteccoes.push(deteccao)
  }

  return deteccoes
}

/**
 * Valida se arquivo Excel pode ser processado
 */
export function validarArquivoExcel(buffer: Buffer): { valido: boolean; erros: string[] } {
  const erros: string[] = []

  if (!Buffer.isBuffer(buffer)) {
    erros.push('Buffer inválido')
  }

  if (buffer.length === 0) {
    erros.push('Arquivo vazio')
  }

  if (buffer.length > 50 * 1024 * 1024) { // 50MB
    erros.push('Arquivo muito grande (máximo 50MB)')
  }

  return {
    valido: erros.length === 0,
    erros
  }
}
