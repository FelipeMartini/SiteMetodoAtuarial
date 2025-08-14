const fs = require('fs')
const path = require('path')
const ExcelJS = require('exceljs')

function tryParseNumber(v) {
  if (v === null || v === undefined) return null
  const s = String(v).trim()
  if (!s) return null
  const num = Number(s.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(num) ? num : null
}

function normalizeSexo(v) {
  if (v === null || v === undefined) return null
  const s = String(v).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim()
  if (!s) return null
  if (/^m(asc)?$/.test(s) || /^male$/.test(s) || s === 'm' || s === '1') return 'M'
  if (/^f(em)?$/.test(s) || /^female$/.test(s) || s === 'f' || s === '2') return 'F'
  return 'O'
}

function statsFromArray(arr) {
  const n = arr.length
  if (n === 0) return null
  const sorted = arr.slice().sort((a,b)=>a-b)
  const sum = arr.reduce((s,v)=>s+v,0)
  const mean = sum / n
  const median = (n%2===1)? sorted[(n-1)/2] : (sorted[n/2-1]+sorted[n/2])/2
  const variance = arr.reduce((s,v)=>s + Math.pow(v-mean,2),0)/n
  const std = Math.sqrt(variance)
  return { count: n, min: sorted[0], max: sorted[sorted.length-1], mean, median, std }
}

async function analyzeFile(fullPath, out) {
  const workbook = new ExcelJS.Workbook()
  try {
    await workbook.xlsx.readFile(fullPath)
  } catch (e) {
    out.errors.push({ file: fullPath, error: String(e) })
    return
  }

  const fileReport = { file: path.basename(fullPath), sheets: [] }

  workbook.eachSheet((sheet, sheetId) => {
    const rows = []
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const vals = row.values.slice(1)
      rows.push(vals.map(v => (v && v.text)? v.text : v))
    })

    if (rows.length === 0) {
      fileReport.sheets.push({ name: sheet.name, reason: 'empty' })
      return
    }

    const header = rows[0].map(h => String(h||'').trim())
    const possibleHeader = header.every(h => typeof h === 'string' && /[A-Za-zÀ-ú]/.test(h))
    const dataRows = rows.slice(possibleHeader?1:0)

    // infer columns
    const cols = header.length
    const colNames = header.map((h,i)=> ({ i, name: h || `Col ${i}` }))

    // heuristics: find age col, sexo col, matricula, data_obito
    const ageKeywords = ['idade','age']
    const sexoKeywords = ['sexo','sex','genero','gender']
    const obitoKeywords = ['obito','morte','falecimento','data_obito','dt_obito','death']
    const matriculaKeywords = ['matricula','registro','id','codigo','cod']

    const colStats = colNames.map(c => ({ index: c.i, name: c.name, nonEmpty:0, numericCount:0, numericAgeCount:0, dateLike:0, sexCount:0, unique: new Set(), samples: [] }))

    for (const r of dataRows) {
      const limit = Math.min(cols, r.length)
      for (let c = 0; c < limit; c++) {
        const val = r[c]
        if (val === null || val === undefined) continue
        const s = String(val).trim()
        if (!s) continue
        const st = colStats[c]
        if (!st) continue
        st.nonEmpty++
        st.unique.add(s)
        st.samples.push(s)
        if (/^\d{1,3}$/.test(s)) st.numericCount++
        const num = Number(s.replace(/[^0-9.-]/g,''))
        if (!Number.isNaN(num) && num >= 0 && num <= 120) st.numericAgeCount++
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(s) || /^\d{4}-\d{2}-\d{2}/.test(s)) st.dateLike++
        if (/^m(asc)?$|^f(em)?$|^m$|^f$|^1$|^2$|^male$|^female$/i.test(s)) st.sexCount++
      }
    }

    // choose likely columns
    const guess = { idade: null, sexo: null, matricula: null, data_obito: null }
    for (let c = 0; c < Math.min(cols, colStats.length); c++) {
      const cs = colStats[c]
      if (!cs) continue
      const name = String(cs.name||'').toLowerCase()
      if (idadeMatch(name)) guess.idade = guess.idade ?? c
      if (sexoMatch(name)) guess.sexo = guess.sexo ?? c
      if (matriculaMatch(name)) guess.matricula = guess.matricula ?? c
      if (obitoMatch(name)) guess.data_obito = guess.data_obito ?? c
    }

    // fallback by content
    for (let c = 0; c < Math.min(cols, colStats.length); c++) {
      const s = colStats[c]
      if (!s) continue
      if (!guess.idade && s.numericAgeCount > Math.max(3, s.nonEmpty*0.4)) guess.idade = c
      if (!guess.sexo && s.sexCount > Math.max(3, s.nonEmpty*0.3)) guess.sexo = c
      if (!guess.matricula && s.unique.size > Math.max(5, s.nonEmpty*0.6)) guess.matricula = c
      if (!guess.data_obito && s.dateLike > Math.max(1, s.nonEmpty*0.2)) guess.data_obito = c
    }

    // compute age stats if idade found
    const ages = []
    let missingAges = 0
    for (const r of dataRows) {
      if (guess.idade === null) { missingAges = dataRows.length; break }
      const v = r[guess.idade]
      const n = tryParseNumber(v)
      if (n === null) missingAges++
      else ages.push(n)
    }

    const ageStats = statsFromArray(ages)

    // sexo distribution
    const sexoCounts = { M:0, F:0, O:0 }
    if (guess.sexo !== null) {
      for (const r of dataRows) {
        const v = r[guess.sexo]
        const s = normalizeSexo(v)
        if (s === 'M') sexoCounts.M++
        else if (s === 'F') sexoCounts.F++
        else sexoCounts.O++
      }
    }

    // adjustments: detect if header present and if first data row included header-like values
    const adjustments = []
    if (possibleHeader) adjustments.push('header_detected')
    if (ages.length === 0 && guess.idade !== null) adjustments.push('no_valid_ages_parsed')

    fileReport.sheets.push({
      name: sheet.name,
      possibleHeader,
      guesses: guess,
      rows: dataRows.length,
      cols,
      ageStats,
      missingAges,
      sexoCounts,
      adjustments,
      colStats: colStats.map(s=> ({ index: s.index, name: s.name, nonEmpty: s.nonEmpty, unique: s.unique.size, numericCount: s.numericCount, numericAgeCount: s.numericAgeCount, dateLike: s.dateLike, sexCount: s.sexCount }))
    })
  })

  out.files.push(fileReport)
}

function idadeMatch(name) {
  name = String(name||'').toLowerCase()
  return /idade|age|anos|idade_anos/.test(name)
}
function sexoMatch(name) { name = String(name||'').toLowerCase(); return /sexo|sex|genero|gender/.test(name) }
function obitoMatch(name) { name = String(name||'').toLowerCase(); return /obito|óbito|morte|faleciment|data_obito|dt_obito|death/.test(name) }
function matriculaMatch(name) { name = String(name||'').toLowerCase(); return /matricula|matr|registro|id|codigo|cod/.test(name) }

async function main() {
  const repoRoot = path.resolve(__dirname, '..')
  const revisaoDir = path.join(repoRoot, '..', 'revisao-completa')
  const xlogsDir = path.join(repoRoot, '..', 'XLOGS')
  if (!fs.existsSync(xlogsDir)) fs.mkdirSync(xlogsDir, { recursive: true })

  const out = { generatedAt: new Date().toISOString(), files: [], errors: [] }

  if (!fs.existsSync(revisaoDir)) {
    console.error('revisao-completa not found at', revisaoDir)
    process.exit(1)
  }

  const files = fs.readdirSync(revisaoDir).filter(f=>/\.xlsx?$|\.xls$|\.csv$/i.test(f))
  for (const f of files) {
    await analyzeFile(path.join(revisaoDir, f), out)
  }

  const outPath = path.join(xlogsDir, `import-report-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8')
  const summaryPath = outPath.replace(/\.json$/, '.txt')
  const lines = []
  lines.push(`Import report generated at ${out.generatedAt}`)
  for (const file of out.files) {
    lines.push(`\nFile: ${file.file}`)
    for (const s of file.sheets) {
      lines.push(` Sheet: ${s.name} — rows=${s.rows} cols=${s.cols} header=${s.possibleHeader} guesses=${JSON.stringify(s.guesses)}`)
      if (s.ageStats) lines.push(`  Ages: count=${s.ageStats.count} min=${s.ageStats.min} max=${s.ageStats.max} mean=${s.ageStats.mean.toFixed(2)} median=${s.ageStats.median} std=${s.ageStats.std.toFixed(2)} missing=${s.missingAges}`)
      else lines.push(`  Ages: none parsed, missing=${s.missingAges}`)
      lines.push(`  Sexo: M=${s.sexoCounts.M} F=${s.sexoCounts.F} O=${s.sexoCounts.O}`)
      if (s.adjustments && s.adjustments.length) lines.push(`  Ajustes: ${s.adjustments.join(', ')}`)
    }
  }
  fs.writeFileSync(summaryPath, lines.join('\n'), 'utf8')
  console.log('Wrote', outPath, summaryPath)
}

main().catch(e=>{ console.error(e); process.exit(1) })
