import fs from 'fs'
import path from 'path'
import detectarLayout from '../src/lib/aderencia/detector-layout'

async function run() {
  const repoRoot = path.resolve(__dirname, '..', '..')
  const revisaoDir = path.join(repoRoot, 'revisao-completa')
  const xlogsDir = path.join(repoRoot, 'XLOGS')
  if (!fs.existsSync(xlogsDir)) fs.mkdirSync(xlogsDir, { recursive: true })

  if (!fs.existsSync(revisaoDir)) {
    console.error('Diretório revisao-completa não encontrado em', revisaoDir)
    process.exit(1)
  }

  const files = fs.readdirSync(revisaoDir)
  const targets = files.filter(f => /MASSA|MORTALIDADE/i.test(f))
  if (targets.length === 0) {
    console.error('Nenhum arquivo alvo encontrado em revisao-completa')
    process.exit(1)
  }

  const results: any[] = []
  for (const fname of targets) {
    try {
      const full = path.join(revisaoDir, fname)
      console.log('Processando', full)
      const buffer = fs.readFileSync(full)
      const res = await detectarLayout(buffer, fname)
      results.push({ arquivo: fname, resultado: res })
    } catch (err) {
      console.error('Erro processando', fname, err)
      results.push({ arquivo: fname, erro: String(err) })
    }
  }

  const outPath = path.join(xlogsDir, `detector-samples-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8')
  console.log('Resultados salvos em', outPath)
}

run().catch(err => { console.error(err); process.exit(1) })
