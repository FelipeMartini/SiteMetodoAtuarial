const fs = require('fs')
const path = require('path')
const ExcelJS = require('exceljs')

function splitCsvLine(line) {
  const result = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i+1] === '"') { cur += '"'; i++; } else { inQuotes = !inQuotes }
      continue
    }
    if (ch === ',' && !inQuotes) { result.push(cur); cur = ''; continue }
    cur += ch
  }
  result.push(cur)
  return result
}

async function readFirstRowsFromExcel(filePath, maxRows=50) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)
  const sheet = workbook.worksheets[0]
  const rows = []
  let count = 0
  sheet.eachRow({ includeEmpty: false }, (row) => {
    if (count >= maxRows) return
    const vals = row.values.slice(1)
    rows.push(vals.map(v => (v && v.text) ? v.text : v))
    count++
  })
  return rows
}

function readFirstRowsFromCsvText(text, maxRows=50) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length>0)
  return lines.slice(0, maxRows).map(l => splitCsvLine(l))
}

async function process() {
  const repoRoot = path.resolve(__dirname, '..')
  const revisaoDir = path.join(repoRoot, '..', 'revisao-completa')
  const xlogsDir = path.join(repoRoot, '..', 'XLOGS')
  if (!fs.existsSync(xlogsDir)) fs.mkdirSync(xlogsDir, { recursive: true })

  if (!fs.existsSync(revisaoDir)) {
    console.error('revisao-completa not found at', revisaoDir)
    process.exit(1)
  }

  const files = fs.readdirSync(revisaoDir)
  const targets = files.filter(f => /MASSA|MORTALIDADE/i.test(f))
  const results = []
  for (const fname of targets) {
    try {
      const full = path.join(revisaoDir, fname)
      console.log('Processing', full)
      const ext = fname.split('.').pop().toLowerCase()
      let rows = []
      if (ext === 'xlsx' || ext === 'xls') {
        rows = await readFirstRowsFromExcel(full)
      } else {
        const text = fs.readFileSync(full, 'utf8')
        rows = readFirstRowsFromCsvText(text)
      }

      // Heurísticas: keywords e content scoring
  const headerRow = rows[0] || []
  const cols = Math.max(...rows.map(r => r.length), 0)
  const headerTextCount = headerRow.filter(c => typeof c === 'string' && /[A-Za-zÀ-ú]/.test(c) && String(c).trim().length > 0).length
  // consider header present if at least half of columns contain textual header-like cells
  const possibleHeader = headerTextCount >= Math.ceil(cols / 2)

      const normalizeHeader = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '_')

      const keywords = {
        matricula: ['matricula','matr','registro','id','codigo','cod','mat.'],
        sexo: ['sexo','sex','genero','gender'],
        idade: ['idade','age'],
        data_nascimento: ['nascimento','data_nascimento','data_nasc','birth','dt_nasc'],
        data_obito: ['obito','morte','falecimento','data_obito','dt_obito','death'],
        cpf: ['cpf']
      }

  const scores = Array.from({length: cols}, () => ({}))
      for (let c = 0; c < cols; c++) {
        const header = headerRow[c] || ''
        const hnorm = normalizeHeader(header)
        for (const key of Object.keys(keywords)) {
          let sc = 0
          if (hnorm) {
            for (const kw of keywords[key]) if (hnorm.includes(kw)) sc += 3
          }
          let numericCount = 0, dateCount = 0, sexCount = 0, cpfCount = 0
          for (let r = 1; r < Math.min(rows.length, 50); r++) {
            const val = rows[r][c]
            if (val === null || val === undefined) continue
            const sval = String(val).trim()
            if (!sval) continue
            if (/^\d{1,3}$/.test(sval) && Number(sval) >= 0 && Number(sval) <= 120) numericCount++
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(sval) || /^\d{4}-\d{2}-\d{2}/.test(sval)) dateCount++
            if (/^m(asc)?$|^f(em)?$|^m$|^f$|^1$|^2$|^male$|^female$/i.test(sval)) sexCount++
            if (/^\d{11}$/.test(sval.replace(/\D/g,''))) cpfCount++
          }
          if (key === 'idade') sc += numericCount
          if (key === 'data_nascimento' || key === 'data_obito') sc += dateCount
          if (key === 'sexo') sc += sexCount * 2
          if (key === 'cpf') sc += cpfCount * 3
          scores[c][key] = sc
        }
      }

      const mapping = {}
      const keysOrder = ['matricula','sexo','idade','data_nascimento','data_obito']
      for (const key of keysOrder) {
        let best = -1, bestCol = null
        for (let c = 0; c < cols; c++) {
          const sc = scores[c][key] || 0
          if (sc > best) { best = sc; bestCol = c }
        }
        // threshold: require at least 2 points
        if (best >= 2) {
          mapping[key] = bestCol
        } else {
          mapping[key] = null
        }
      }

      // build preview
      const nPreview = Math.min(10, Math.max(0, rows.length - (possibleHeader ? 1 : 0)))
      const preview = []
      for (let r = (possibleHeader ? 1 : 0); r < (possibleHeader ? 1 : 0) + nPreview; r++) {
        const row = rows[r] || []
        const item = {}
        if (mapping.matricula !== null) item.matricula = row[mapping.matricula]
        if (mapping.sexo !== null) item.sexo = (String(row[mapping.sexo]||'')).toUpperCase()
        if (mapping.idade !== null) {
          const raw = String(row[mapping.idade] || '').replace(/[^0-9.-]/g, '')
          item.idade = raw.length ? Number(raw) : null
        }
        if (mapping.data_nascimento !== null) item.data_nascimento = String(row[mapping.data_nascimento]||'')
        if (mapping.data_obito !== null) item.data_obito = String(row[mapping.data_obito]||'')
        preview.push(item)
      }

      const found = ['matricula','sexo','idade','data_nascimento','data_obito'].filter(k => mapping[k] !== null).length
      const confidence = found / 5

      results.push({ arquivo: fname, linhasLidas: Math.min(rows.length,50), mapeamentoDetectado: mapping, previewNormalizado: preview, confianca: confidence })
    } catch (err) {
      console.error('Erro', err)
      results.push({ arquivo: fname, erro: String(err) })
    }
  }
  const outPath = path.join(xlogsDir, `detector-samples-cjs-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8')
  console.log('Wrote', outPath)
}

process().catch(err => { console.error(err); process.exit(1) })
