// Utilitário para exportação de usuários para PDF usando pdf-lib
// Autor: IA - 2025

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

type UsuarioExport = Record<string, string | number | null | undefined>

/**
 * Exporta um array de usuários para PDF e faz download no browser.
 * @param usuarios Array de objetos de usuário
 * @param colunas Array de colunas a exportar (chave e label)
 * @param nomeArquivo Nome do arquivo PDF
 */
export async function exportarUsuariosParaPdf(
  usuarios: UsuarioExport[],
  colunas: { key: string; label: string }[],
  nomeArquivo = 'usuarios.pdf'
) {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const page = pdfDoc.addPage()
  const { height } = page.getSize()
  const margin = 40
  const rowHeight = 24
  const fontSize = 12
  let y = height - margin

  // Cabeçalho
  let x = margin
  colunas.forEach(col => {
    page.drawText(col.label, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1),
    })
    x += 120
  })
  y -= rowHeight

  // Linhas
  usuarios.forEach(usuario => {
    x = margin
    colunas.forEach(col => {
      const valor = usuario[col.key] !== undefined ? String(usuario[col.key]) : ''
      page.drawText(valor, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      })
      x += 120
    })
    y -= rowHeight
    if (y < margin) {
      y = height - margin
      pdfDoc.addPage()
    }
  })

  const pdfBytes = await pdfDoc.save()
  // Garante que seja ArrayBuffer puro (não SharedArrayBuffer)
  const arrayBuffer = pdfBytes instanceof Uint8Array ? pdfBytes.slice().buffer : pdfBytes
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
