import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import ExcelJS from 'exceljs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = params

    // Buscar tábua com taxas
    const tabua = await prisma.tabuaMortalidade.findUnique({
      where: { id },
      include: {
        taxas: {
          orderBy: { idade: 'asc' }
        }
      }
    })

    if (!tabua) {
      return NextResponse.json({ error: 'Tábua não encontrada' }, { status: 404 })
    }

    // Criar workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Tábua ${tabua.nome}`)

    // Configurar metadados
    workbook.creator = 'Método Atuarial'
    workbook.created = new Date()
    workbook.subject = `Tábua de Mortalidade: ${tabua.nome}`
    workbook.description = `Exportação da tábua de mortalidade ${tabua.nome} (${tabua.fonte}, ${tabua.ano})`

    // Adicionar informações da tábua
    worksheet.mergeCells('A1:F1')
    worksheet.getCell('A1').value = `TÁBUA DE MORTALIDADE: ${tabua.nome.toUpperCase()}`
    worksheet.getCell('A1').font = { bold: true, size: 14 }
    worksheet.getCell('A1').alignment = { horizontal: 'center' }

    worksheet.getCell('A3').value = 'Nome:'
    worksheet.getCell('B3').value = tabua.nome
    worksheet.getCell('D3').value = 'Ano:'
    worksheet.getCell('E3').value = tabua.ano

    worksheet.getCell('A4').value = 'Fonte:'
    worksheet.getCell('B4').value = tabua.fonte
    worksheet.getCell('D4').value = 'Sexo:'
    worksheet.getCell('E4').value = tabua.sexo

    worksheet.getCell('A5').value = 'Descrição:'
    worksheet.getCell('B5').value = tabua.descricao || 'N/A'
    worksheet.getCell('D5').value = 'Status:'
    worksheet.getCell('E5').value = tabua.status

    worksheet.getCell('A6').value = 'Data de Importação:'
    worksheet.getCell('B6').value = tabua.dataImportacao.toLocaleDateString('pt-BR')
    worksheet.getCell('D6').value = 'Total de Idades:'
    worksheet.getCell('E6').value = tabua.taxas.length

    // Cabeçalhos da tabela (linha 8)
    const headerRow = 8
    const headers = ['Idade', 'qx (Prob. Morte)', 'px (Prob. Sobrev.)', 'lx (Sobreviventes)', 'dx (Mortes)', 'ex (Expect. Vida)']
    
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(headerRow, index + 1)
      cell.value = header
      cell.font = { bold: true }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }
      }
      cell.font = { bold: true, color: { argb: 'FFFFFF' } }
      cell.alignment = { horizontal: 'center' }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })

    // Dados das taxas
    tabua.taxas.forEach((taxa, index) => {
      const row = headerRow + 1 + index
      
      worksheet.getCell(row, 1).value = taxa.idade // Idade
      worksheet.getCell(row, 2).value = taxa.qx     // qx
      worksheet.getCell(row, 3).value = taxa.px || (1 - taxa.qx) // px
      worksheet.getCell(row, 4).value = taxa.lx || null // lx
      worksheet.getCell(row, 5).value = taxa.dx || null // dx
      worksheet.getCell(row, 6).value = taxa.ex || null // ex

      // Formatação
      for (let col = 1; col <= 6; col++) {
        const cell = worksheet.getCell(row, col)
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        
        // Formatação numérica
        if (col === 1) { // Idade
          cell.numFmt = '0'
        } else if (col === 2 || col === 3) { // qx, px
          cell.numFmt = '0.000000'
        } else if (col === 4 || col === 5) { // lx, dx
          cell.numFmt = '#,##0'
        } else if (col === 6) { // ex
          cell.numFmt = '0.00'
        }
      }
    })

    // Ajustar largura das colunas
    worksheet.getColumn(1).width = 10  // Idade
    worksheet.getColumn(2).width = 15  // qx
    worksheet.getColumn(3).width = 15  // px
    worksheet.getColumn(4).width = 15  // lx
    worksheet.getColumn(5).width = 12  // dx
    worksheet.getColumn(6).width = 15  // ex

    // Adicionar estatísticas no final
    const lastDataRow = headerRow + tabua.taxas.length
    const statsStartRow = lastDataRow + 3

    worksheet.getCell(statsStartRow, 1).value = 'ESTATÍSTICAS'
    worksheet.getCell(statsStartRow, 1).font = { bold: true, size: 12 }

    worksheet.getCell(statsStartRow + 1, 1).value = 'Idade Mínima:'
    worksheet.getCell(statsStartRow + 1, 2).value = Math.min(...tabua.taxas.map(t => t.idade))

    worksheet.getCell(statsStartRow + 2, 1).value = 'Idade Máxima:'
    worksheet.getCell(statsStartRow + 2, 2).value = Math.max(...tabua.taxas.map(t => t.idade))

    worksheet.getCell(statsStartRow + 3, 1).value = 'qx Médio:'
    worksheet.getCell(statsStartRow + 3, 2).value = tabua.taxas.reduce((sum, t) => sum + t.qx, 0) / tabua.taxas.length
    worksheet.getCell(statsStartRow + 3, 2).numFmt = '0.000000'

    worksheet.getCell(statsStartRow + 4, 1).value = 'qx Máximo:'
    worksheet.getCell(statsStartRow + 4, 2).value = Math.max(...tabua.taxas.map(t => t.qx))
    worksheet.getCell(statsStartRow + 4, 2).numFmt = '0.000000'

    // Gerar arquivo Excel
    const buffer = await workbook.xlsx.writeBuffer()

    // Definir nome do arquivo
    const fileName = `tabua_${tabua.nome.replace(/[^a-zA-Z0-9]/g, '_')}_${tabua.ano}.xlsx`

    // Retornar arquivo
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': buffer.byteLength.toString(),
      },
    })

  } catch (error) {
    console.error('Erro ao exportar tábua:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + (error instanceof Error ? error.message : 'Erro desconhecido') },
      { status: 500 }
    )
  }
}
