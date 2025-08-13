import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import ExcelJS from 'exceljs'

interface TaxaMortalidadeData {
  idade: number;
  qx: number;
  lx?: number;
  dx?: number;
  ex?: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const nome = formData.get('nome') as string
    const ano = parseInt(formData.get('ano') as string)
    const fonte = formData.get('fonte') as string
    const sexo = formData.get('sexo') as string
    const descricao = formData.get('descricao') as string || ''

    if (!file || !nome || !ano || !fonte || !sexo) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: arquivo, nome, ano, fonte, sexo' },
        { status: 400 }
      )
    }

    // Verificar se o arquivo é Excel
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return NextResponse.json(
        { error: 'Formato de arquivo inválido. Use apenas .xlsx ou .xls' },
        { status: 400 }
      )
    }

    // Converter arquivo para buffer
    const buffer = await file.arrayBuffer()
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)

    const worksheet = workbook.getWorksheet(1)
    if (!worksheet) {
      return NextResponse.json(
        { error: 'Planilha vazia ou inválida' },
        { status: 400 }
      )
    }

    // Verificar se já existe uma tábua com o mesmo nome
    const existingTabua = await prisma.tabuaMortalidade.findUnique({
      where: { nome }
    })

    if (existingTabua) {
      return NextResponse.json(
        { error: 'Já existe uma tábua com este nome' },
        { status: 409 }
      )
    }

    // Criar a tábua de mortalidade
    const tabua = await prisma.tabuaMortalidade.create({
      data: {
        nome,
        ano,
        fonte,
        sexo,
        descricao,
        status: 'ativa'
      }
    })

    // Processar dados do Excel
    const taxas: { idade: number; qx: number; lx?: number; dx?: number; ex?: number; px?: number }[] = []
    
    // Assumindo que a primeira linha são cabeçalhos
    // Colunas esperadas: Idade, qx, lx, dx, ex
    let headerRow = 1
    let dataStartRow = 2

    // Tentar encontrar cabeçalhos automaticamente
    for (let row = 1; row <= 5; row++) {
      const cell = worksheet.getCell(row, 1)
      if (cell.value && String(cell.value).toLowerCase().includes('idade')) {
        headerRow = row
        dataStartRow = row + 1
        break
      }
    }

    // Mapear colunas
    const headers = []
    for (let col = 1; col <= 10; col++) {
      const cell = worksheet.getCell(headerRow, col)
      headers.push(String(cell.value || '').toLowerCase())
    }

    const idadeCol = headers.findIndex(h => h.includes('idade')) + 1
    const qxCol = headers.findIndex(h => h.includes('qx') || h.includes('morte')) + 1
    const lxCol = headers.findIndex(h => h.includes('lx') || h.includes('sobreviv')) + 1
    const dxCol = headers.findIndex(h => h.includes('dx') || h.includes('mort')) + 1
    const exCol = headers.findIndex(h => h.includes('ex') || h.includes('expectat')) + 1

    if (!idadeCol || !qxCol) {
      return NextResponse.json(
        { error: 'Colunas obrigatórias não encontradas: Idade e qx' },
        { status: 400 }
      )
    }

    // Processar dados
    for (let row = dataStartRow; row <= worksheet.rowCount; row++) {
      const idadeCell = worksheet.getCell(row, idadeCol)
      const qxCell = worksheet.getCell(row, qxCol)

      if (!idadeCell.value || !qxCell.value) continue

      const idade = Number(idadeCell.value)
      const qx = Number(qxCell.value)

      if (isNaN(idade) || isNaN(qx) || idade < 0 || idade > 120 || qx < 0 || qx > 1) {
        continue // Pular linhas inválidas
      }

      const taxa: TaxaMortalidadeData = { idade, qx }

      // Colunas opcionais
      if (lxCol) {
        const lxCell = worksheet.getCell(row, lxCol)
        if (lxCell.value && !isNaN(Number(lxCell.value))) {
          taxa.lx = Number(lxCell.value)
        }
      }

      if (dxCol) {
        const dxCell = worksheet.getCell(row, dxCol)
        if (dxCell.value && !isNaN(Number(dxCell.value))) {
          taxa.dx = Number(dxCell.value)
        }
      }

      if (exCol) {
        const exCell = worksheet.getCell(row, exCol)
        if (exCell.value && !isNaN(Number(exCell.value))) {
          taxa.ex = Number(exCell.value)
        }
      }

      // Calcular px (probabilidade de sobrevivência)
      taxa.px = 1 - qx

      taxas.push(taxa)
    }

    if (taxas.length === 0) {
      // Limpar tábua criada se não houver dados válidos
      await prisma.tabuaMortalidade.delete({ where: { id: tabua.id } })
      return NextResponse.json(
        { error: 'Nenhum dado válido encontrado no arquivo' },
        { status: 400 }
      )
    }

    // Inserir taxas em lote
    await prisma.taxaMortalidade.createMany({
      data: taxas.map(taxa => ({
        tabuaId: tabua.id,
        ...taxa
      }))
    })

    // Retornar resultado
    const tabuaCompleta = await prisma.tabuaMortalidade.findUnique({
      where: { id: tabua.id },
      include: {
        taxas: {
          select: { idade: true, qx: true, lx: true, dx: true, ex: true, px: true },
          orderBy: { idade: 'asc' }
        }
      }
    })

    return NextResponse.json({ 
      tabua: tabuaCompleta,
      message: `Tábua ${nome} importada com sucesso! ${taxas.length} idades processadas.`
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao importar tábua:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + (error instanceof Error ? error.message : 'Erro desconhecido') },
      { status: 500 }
    )
  }
}
