// use client
// Util simples para exportação CSV - será evoluído (delimitador configurável, encoding, BOM)
export function salvarCsv(linhas: Record<string, unknown>[], nomeBase: string) {
  if (!linhas.length) return
  const colunas = Object.keys(linhas[0])
  const header = colunas.join(',')
  const corpo = linhas
    .map(l =>
      colunas
        .map(c => {
          const val = l[c] ?? ''
          const s = typeof val === 'string' ? val : String(val)
          // Escapa aspas duplas
          const esc = s.replace(/"/g, '""')
          return /[",\n;]/.test(esc) ? `"${esc}"` : esc
        })
        .join(',')
    )
    .join('\n')
  const conteudo = [header, corpo].join('\n')
  const blob = new Blob(['\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${nomeBase}-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
