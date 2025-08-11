/**
 * Exportação Excel usando ExcelJS - Biblioteca segura e moderna
 *
 * ExcelJS é uma biblioteca mais segura que oferece:
 * ✅ Sem vulnerabilidades conhecidas de Prototype Pollution
 * ✅ Melhor performance para arquivos grandes
 * ✅ Suporte nativo a TypeScript
 * ✅ Mais funcionalidades de formatação
 */
'use client'

import ExcelJS from 'exceljs'

/**
 * Exporta dados para arquivo Excel usando ExcelJS
 * @param linhas Array de objetos com os dados a serem exportados
 * @param nomeBase Nome base do arquivo (será adicionada a data)
 * @param nomeAba Nome da aba/planilha (padrão: 'Dados')
 */
export async function salvarExcel(
  linhas: Record<string, unknown>[],
  nomeBase: string,
  nomeAba: string = 'Dados'
) {
  if (!linhas.length) {
    console.warn('Não há dados para exportar')
    return
  }

  try {
    // Criar nova planilha
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(nomeAba)

    // Obter colunas do primeiro objeto
    const colunas = Object.keys(linhas[0])

    // Definir headers da planilha
    worksheet.columns = colunas.map(coluna => ({
      header: coluna.charAt(0).toUpperCase() + coluna.slice(1), // Capitalizar primeira letra
      key: coluna,
      width: 15, // Largura padrão
    }))

    // Aplicar estilo ao header
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    }

    // Adicionar dados
    linhas.forEach(linha => {
      const row = worksheet.addRow(linha)

      // Aplicar formatação de borda a todas as células
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
      })
    })

    // Aplicar borda ao header também
    worksheet.getRow(1).eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
    })

    // Ajustar largura das colunas automaticamente
    worksheet.columns.forEach(column => {
      if (column.values) {
        const lengths = column.values.map(v => (v ? v.toString().length : 10))
        const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
        column.width = Math.min(Math.max(maxLength + 2, 10), 50) // Min 10, Max 50
      }
    })

    // Gerar nome do arquivo com data
    const hoje = new Date().toISOString().slice(0, 10)
    const nomeArquivo = `${nomeBase}-${hoje}.xlsx`

    // Salvar arquivo
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Criar link de download
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nomeArquivo
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    console.log(`Arquivo ${nomeArquivo} exportado com sucesso!`)
  } catch (error: any) {
    console.error('Erro ao exportar Excel:', String(error))
    throw new Error('Falha na exportação do arquivo Excel')
  }
}
