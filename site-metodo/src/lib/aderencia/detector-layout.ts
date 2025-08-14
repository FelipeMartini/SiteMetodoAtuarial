import ExcelJS from 'exceljs'
import { Buffer } from 'buffer'

type Mapping = {
  colunaMatricula?: number | null
  colunaSexo?: number | null
  colunaIdade?: number | null
  colunaDataNascimento?: number | null
  colunaDataObito?: number | null
}

function normalizeHeader(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '_')
    .trim()
}

function tryParseNumber(v: any) {
  if (v === null || v === undefined) return null
  const n = Number(String(v).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : null
}

function tryParseDate(v: any): string | null {
  if (!v && v !== 0) return null
  // If Excel date (number)
  if (typeof v === 'number') {
    // ExcelJS returns JS Date for date cells when reading .value as Date sometimes
    return new Date(Math.round((v - 25569) * 86400 * 1000)).toISOString()
  }
  const s = String(v).trim()
  if (!s) return null
  // YYYY-MM-DD or ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return new Date(s).toISOString()
  // DD/MM/YYYY or D/M/YYYY
  const dm = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (dm) {
    const [_, d, m, y] = dm
    return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`).toISOString()
  }
  // Try Date.parse fallback
  const parsed = Date.parse(s)
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString()
  return null
}

function normalizeSexo(v: any): 'M' | 'F' | null {
  if (v === null || v === undefined) return null
  const s = String(v).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim()
  if (!s) return null
  if (/^m(asc)?$/.test(s) || /^male$/.test(s) || s === 'm' || s === '1') return 'M'
  if (/^f(em)?$/.test(s) || /^female$/.test(s) || s === 'f' || s === '2') return 'F'
  return null
}

function splitCsvLine(line: string) {
  const result: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (ch === ',' && !inQuotes) {
      result.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  result.push(cur)
  return result
}

async function readFirstRowsFromExcel(buffer: any, maxRows = 50) {
  const workbook = new ExcelJS.Workbook()
  // ExcelJS accepts Buffer | Uint8Array | string; cast to any para evitar conflito de tipos no TS
  await workbook.xlsx.load(buffer as any)
  const sheet = workbook.worksheets[0]
  const rows: any[][] = []
  if (!sheet) return rows
  let count = 0
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (count >= maxRows) return
    const vals = row.values as any[]
    // ExcelJS row.values is 1-based
    const arr = vals.slice(1).map((c) => (c && (c as any).text ? (c as any).text : c))
    rows.push(arr)
    count++
  })
  return rows
}

function readFirstRowsFromCsvText(text: string, maxRows = 50) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  const rows: string[][] = []
  for (let i = 0; i < Math.min(lines.length, maxRows); i++) {
    rows.push(splitCsvLine(lines[i]))
  }
  return rows
}

export async function detectarLayout(buffer: Buffer, filename: string, opts?: { nRows?: number; dataReferencia?: string }) {
  const nRows = opts?.nRows ?? 50
  const ext = (filename.split('.').pop() || '').toLowerCase()
  let rows: any[][] = []

  // tentativa ExcelJS
  if (ext === 'xlsx' || ext === 'xls') {
    try {
      rows = await readFirstRowsFromExcel(buffer, nRows)
    } catch (e) {
      // ignorar e tentar CSV
    }
  }

  // fallback CSV utf8/latin1
  if (!rows || rows.length === 0) {
    const textUtf8 = buffer.toString('utf8')
    rows = readFirstRowsFromCsvText(textUtf8, nRows)
    if (!rows || rows.length === 0) {
      const textLatin1 = buffer.toString('latin1')
      rows = readFirstRowsFromCsvText(textLatin1, nRows)
    }
  }

  rows = rows || []
  const headerRow = rows[0] || []
  const cols = rows.length ? Math.max(...rows.map((r) => r.length)) : 0
  // Consider a header-like cell if it contains letters OR looks like a date (dd/mm/yyyy or yyyy-mm-dd) or is non-empty non-numeric
  const headerLikeCount = headerRow.filter((c: any) => {
    if (c === null || c === undefined) return false
    const s = String(c).trim()
    if (!s) return false
    if (/[A-Za-zÀ-ú]/.test(s)) return true
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s) || /^\d{4}-\d{2}-\d{2}/.test(s)) return true
    // if it's not purely numeric (e.g., contains punctuation) consider header-like
    if (!/^[-+]?\d+(?:[.,]\d+)?$/.test(s)) return true
    return false
  }).length
  const possibleHeader = cols > 0 && headerLikeCount >= Math.ceil(cols / 2)

  const keywords: Record<string, string[]> = {
    matricula: ['matricula', 'matr', 'registro', 'id', 'codigo', 'cod', 'mat.'] ,
    sexo: ['sexo', 'sex', 'genero', 'gender'],
    idade: ['idade', 'age', 'idade_anos'],
    data_nascimento: ['nascimento', 'data_nascimento', 'data_nasc', 'birth', 'birth_date', 'dt_nasc'],
    data_obito: ['obito', 'morte', 'falecimento', 'data_obito', 'dt_obito', 'death'] ,
    cpf: ['cpf']
  }

  type ColStats = {
    nonEmpty: number
    numericCount: number
    numericAgeCount: number
    dateCount: number
    sexCount: number
    uniqueCount: number
    samples: any[]
    header: string
  }

  const stats: ColStats[] = Array.from({ length: Math.max(0, cols) }, (_, i) => ({ nonEmpty: 0, numericCount: 0, numericAgeCount: 0, dateCount: 0, sexCount: 0, uniqueCount: 0, samples: [], header: String(headerRow[i] || '') }))

  for (let c = 0; c < cols; c++) {
    const seen = new Set<string>()
    for (let r = possibleHeader ? 1 : 0; r < Math.min(rows.length, nRows); r++) {
      const val = rows[r][c]
      if (val === null || val === undefined) continue
      const sval = String(val).trim()
      if (!sval) continue
      stats[c].nonEmpty++
      stats[c].samples.push(sval)
      seen.add(sval)
      if (/^\d{1,3}$/.test(sval) && Number(sval) >= 0 && Number(sval) <= 120) stats[c].numericCount++
      const num = Number(sval.replace(/[^0-9.-]/g, ''))
      if (!Number.isNaN(num) && num >= 18 && num <= 120) stats[c].numericAgeCount++
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(sval) || /^\d{4}-\d{2}-\d{2}/.test(sval)) stats[c].dateCount++
      if (/^m(asc)?$|^f(em)?$|^m$|^f$|^1$|^2$|^male$|^female$/i.test(sval)) stats[c].sexCount++
    }
    stats[c].uniqueCount = seen.size
  }

  const perColumnScores: Array<Record<string, number>> = Array.from({ length: Math.max(0, cols) }, () => ({}))
  for (let c = 0; c < cols; c++) {
    const hnorm = normalizeHeader(stats[c].header || '')
    for (const [key, kws] of Object.entries(keywords)) {
      let sc = 0
      if (hnorm) {
        for (const kw of kws) if (hnorm.includes(kw)) sc += 5
      }
      const s = stats[c]
      const nonEmpty = Math.max(1, s.nonEmpty)
      if (key === 'idade') {
        const ageProp = s.numericAgeCount / nonEmpty
        sc += Math.round(ageProp * 10)
        sc += Math.min(3, s.numericCount)
        // If header looks like a date but the column has many numeric ages, boost idade score
        try {
          const hdr = String(s.header || '')
          const headerIsDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(hdr) || /^\d{4}-\d{2}-\d{2}/.test(hdr)
          if (headerIsDate && ageProp > 0.6) sc += 6
        } catch (err) {
          // ignore
        }
      }
      if (key === 'sexo') {
        const sexProp = s.sexCount / nonEmpty
        sc += Math.round(sexProp * 8)
        const distinct = s.uniqueCount
        if (distinct <= 3 && s.numericCount >= Math.floor(nonEmpty * 0.6)) sc += 4
      }
      if (key === 'data_nascimento' || key === 'data_obito') {
        const dateProp = s.dateCount / nonEmpty
        sc += Math.round(dateProp * 8)
      }
      if (key === 'matricula') {
        const uniqRatio = s.uniqueCount / nonEmpty
        sc += Math.round(uniqRatio * 10)
        if (s.uniqueCount > Math.max(3, nonEmpty * 0.5)) sc += 3
      }
      perColumnScores[c][key] = sc
    }
  }

  const mapping: Mapping = {}
  const columnSummary: Array<{ index: number; header: string; scores: Record<string, number>; topKey?: string; topScore?: number }> = []
  for (let c = 0; c < cols; c++) columnSummary.push({ index: c, header: stats[c].header, scores: perColumnScores[c] })

  const chooseTop = (key: string, minScore: number) => {
    let best = -1
    let bestCol: number | null = null
    for (let c = 0; c < cols; c++) {
      const sc = perColumnScores[c][key] || 0
      if (sc > best) { best = sc; bestCol = c }
    }
    if (bestCol !== null && best >= minScore) return { col: bestCol, score: best }
    return null
  }

  const choices: Array<[string, number]> = [['matricula', 6], ['sexo', 4], ['idade', 4], ['data_nascimento', 3], ['data_obito', 3]]
  for (const [key, minScore] of choices) {
    const chosen = chooseTop(key, minScore)
    if (chosen) {
      const propName = key === 'matricula' ? 'colunaMatricula' : key === 'sexo' ? 'colunaSexo' : key === 'idade' ? 'colunaIdade' : key === 'data_nascimento' ? 'colunaDataNascimento' : 'colunaDataObito'
      ;(mapping as any)[propName] = chosen.col
      columnSummary[chosen.col].topKey = key
      columnSummary[chosen.col].topScore = chosen.score
    }
  }

  // Heuristic override: if a column has many numericAgeCount values, prefer it for idade
  try {
    let bestAgeCol = -1
    let bestAgeCount = 0
    for (let c = 0; c < cols; c++) {
      const s = stats[c]
      if (!s) continue
      if ((s.numericAgeCount || 0) > bestAgeCount) { bestAgeCount = s.numericAgeCount || 0; bestAgeCol = c }
    }
    if (bestAgeCol >= 0) {
      const nonEmpty = Math.max(1, stats[bestAgeCol].nonEmpty || 1)
      // threshold: at least 30 values or >60% non-empty are numeric ages
      if (bestAgeCount >= 30 || bestAgeCount / nonEmpty > 0.6) {
        mapping.colunaIdade = bestAgeCol
        columnSummary[bestAgeCol].topKey = 'idade'
        columnSummary[bestAgeCol].topScore = perColumnScores[bestAgeCol]?.idade ?? Math.round((bestAgeCount / nonEmpty) * 50)
      }
    }
  } catch (err) {
    // ignore
  }

  const nPreview = Math.min(10, Math.max(0, rows.length - (possibleHeader ? 1 : 0)))
  const preview: any[] = []
  for (let r = (possibleHeader ? 1 : 0); r < (possibleHeader ? 1 : 0) + nPreview; r++) {
    const row = rows[r] || []
    const item: any = {}
    if (mapping.colunaMatricula !== undefined && mapping.colunaMatricula !== null) item.matricula = row[mapping.colunaMatricula as number]
    if (mapping.colunaSexo !== undefined && mapping.colunaSexo !== null) item.sexo = normalizeSexo(row[mapping.colunaSexo as number])
    if (mapping.colunaIdade !== undefined && mapping.colunaIdade !== null) item.idade = tryParseNumber(row[mapping.colunaIdade as number])
    if (mapping.colunaDataNascimento !== undefined && mapping.colunaDataNascimento !== null) item.data_nascimento = tryParseDate(row[mapping.colunaDataNascimento as number])
    if (mapping.colunaDataObito !== undefined && mapping.colunaDataObito !== null) item.data_obito = tryParseDate(row[mapping.colunaDataObito as number])
    preview.push(item)
  }

  const chosenFields = ['colunaMatricula','colunaSexo','colunaIdade','colunaDataNascimento','colunaDataObito']
  const chosenScores = chosenFields.map(f => {
    const idx = (mapping as any)[f]
    if (idx === undefined || idx === null) return 0
    const key = f === 'colunaMatricula' ? 'matricula' : f === 'colunaSexo' ? 'sexo' : f === 'colunaIdade' ? 'idade' : f === 'colunaDataNascimento' ? 'data_nascimento' : 'data_obito'
    const sc = perColumnScores[idx]?.[key] || 0
    return sc
  })
  const maxPossible = 15
  const confidence = chosenScores.reduce((a,b)=>a+b,0) / (maxPossible * chosenScores.length || 1)
  // mapar stats para saída enxuta (sem amostras completas)
  const colStats = stats.map(s => ({
    header: s.header,
    nonEmpty: s.nonEmpty,
    numericCount: s.numericCount,
    numericAgeCount: s.numericAgeCount,
    dateCount: s.dateCount,
    sexCount: s.sexCount,
    uniqueCount: s.uniqueCount
  }))

  return {
    mapeamentoDetectado: mapping,
    amostraLinhas: rows.slice(0, Math.min(rows.length, 10)),
    previewNormalizado: preview,
    confianca: Math.max(0, Math.min(1, confidence)),
    perColumnScores: columnSummary,
    colStats
  }
}

export function normalizarLinha(rawRow: any[], mapping: Mapping) {
  const row: any = {}
  if (mapping.colunaMatricula !== undefined && mapping.colunaMatricula !== null) row.matricula = rawRow[mapping.colunaMatricula]
  if (mapping.colunaSexo !== undefined && mapping.colunaSexo !== null) row.sexo = normalizeSexo(rawRow[mapping.colunaSexo as number])
  if (mapping.colunaIdade !== undefined && mapping.colunaIdade !== null) row.idade = tryParseNumber(rawRow[mapping.colunaIdade as number])
  if (mapping.colunaDataNascimento !== undefined && mapping.colunaDataNascimento !== null) row.data_nascimento = tryParseDate(rawRow[mapping.colunaDataNascimento as number])
  if (mapping.colunaDataObito !== undefined && mapping.colunaDataObito !== null) row.data_obito = tryParseDate(rawRow[mapping.colunaDataObito as number])
  return row
}

export default detectarLayout
