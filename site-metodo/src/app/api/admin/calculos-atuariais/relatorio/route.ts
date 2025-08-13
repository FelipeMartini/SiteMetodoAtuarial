import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const calculoId = searchParams.get('calculoId')
    const tipo = searchParams.get('tipo') || 'geral'

    // Se for um cálculo específico
    if (calculoId) {
      const calculo = await prisma.calculoAtuarial.findUnique({
        where: { id: calculoId },
        include: {
          tabua: { select: { nome: true, ano: true, fonte: true } },
          user: { select: { name: true, email: true } }
        }
      })

      if (!calculo) {
        return NextResponse.json({ error: 'Cálculo não encontrado' }, { status: 404 })
      }

      return generateCalculationReport(calculo)
    }

    // Relatório geral
    if (tipo === 'geral') {
      return generateGeneralReport(session.user.id)
    }

    return NextResponse.json({ error: 'Tipo de relatório inválido' }, { status: 400 })

  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + (error instanceof Error ? error.message : 'Erro desconhecido') },
      { status: 500 }
    )
  }
}

function generateCalculationReport(calculo: any) {
  const doc = new jsPDF()
  
  // Configurar fonte
  doc.setFont('helvetica')
  
  // Cabeçalho
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('RELATÓRIO DE CÁLCULO ATUARIAL', 20, 20)
  
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 30)
  
  // Linha separadora
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 35, 190, 35)
  
  // Informações básicas
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('INFORMAÇÕES DO CÁLCULO', 20, 45)
  
  doc.setFontSize(10)
  const basicInfo = [
    ['ID do Cálculo:', calculo.id],
    ['Tipo:', calculo.tipo.replace('_', ' ').toUpperCase()],
    ['Data do Cálculo:', new Date(calculo.dataCalculo).toLocaleDateString('pt-BR')],
    ['Usuário:', calculo.user?.name || 'N/A'],
    ['Email:', calculo.user?.email || 'N/A'],
    ['Tábua Utilizada:', calculo.tabua ? `${calculo.tabua.nome} (${calculo.tabua.ano})` : 'AT-2000 (Padrão)'],
    ['Fonte da Tábua:', calculo.tabua?.fonte || 'SUSEP'],
    ['Observação:', calculo.observacao || 'Nenhuma']
  ]
  
  let yPos = 55
  basicInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(label, 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), 70, yPos)
    yPos += 7
  })
  
  // Parâmetros utilizados
  yPos += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('PARÂMETROS UTILIZADOS', 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const parametros = calculo.parametros
  Object.entries(parametros).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    doc.text(`${label}:`, 20, yPos)
    doc.text(String(value), 70, yPos)
    yPos += 7
  })
  
  // Resultados
  yPos += 10
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('RESULTADOS', 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const resultado = calculo.resultado
  if (resultado.valor !== undefined) {
    doc.setFont('helvetica', 'bold')
    doc.text('Valor Principal:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`R$ ${Number(resultado.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 70, yPos)
    yPos += 10
  }
  
  Object.entries(resultado).forEach(([key, value]) => {
    if (key === 'valor') return // Já exibido acima
    
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
    doc.text(`${label}:`, 20, yPos)
    doc.text(String(value), 70, yPos)
    yPos += 7
  })
  
  // Rodapé
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('Método Atuarial - Sistema de Cálculos Atuariais', 20, 280)
  doc.text('Este documento foi gerado automaticamente pelo sistema.', 20, 285)
  
  // Retornar PDF
  const pdfBuffer = doc.output('arraybuffer')
  const fileName = `calculo_${calculo.tipo}_${calculo.id.substring(0, 8)}.pdf`
  
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.byteLength.toString(),
    },
  })
}

async function generateGeneralReport(userId: string) {
  // Buscar dados do usuário e cálculos
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true }
  })
  
  const calculos = await prisma.calculoAtuarial.findMany({
    where: { userId },
    include: {
      tabua: { select: { nome: true, ano: true } }
    },
    orderBy: { dataCalculo: 'desc' },
    take: 50 // Limitar a 50 cálculos mais recentes
  })
  
  const doc = new jsPDF()
  
  // Cabeçalho
  doc.setFontSize(16)
  doc.text('RELATÓRIO GERAL DE CÁLCULOS ATUARIAIS', 20, 20)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Usuário: ${user?.name || 'N/A'} (${user?.email || 'N/A'})`, 20, 30)
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 36)
  
  // Estatísticas
  const stats = {
    total: calculos.length,
    tipos: calculos.reduce((acc, calc) => {
      acc[calc.tipo] = (acc[calc.tipo] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    ultimoCalculo: calculos[0]?.dataCalculo
  }
  
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('ESTATÍSTICAS', 20, 50)
  
  doc.setFontSize(10)
  doc.text(`Total de Cálculos: ${stats.total}`, 20, 60)
  doc.text(`Último Cálculo: ${stats.ultimoCalculo ? new Date(stats.ultimoCalculo).toLocaleDateString('pt-BR') : 'N/A'}`, 20, 67)
  
  // Distribuição por tipo
  let yPos = 80
  doc.text('Distribuição por Tipo:', 20, yPos)
  yPos += 7
  Object.entries(stats.tipos).forEach(([tipo, count]) => {
    doc.text(`  ${tipo.replace('_', ' ')}: ${count}`, 25, yPos)
    yPos += 6
  })
  
  // Tabela de cálculos
  if (calculos.length > 0) {
    const tableData = calculos.map(calc => [
      calc.tipo.replace('_', ' '),
      new Date(calc.dataCalculo).toLocaleDateString('pt-BR'),
      calc.tabua?.nome || 'AT-2000',
      calc.resultado && typeof calc.resultado === 'object' && 'valor' in calc.resultado ? 
        `R$ ${Number((calc.resultado as any).valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A',
      calc.observacao?.substring(0, 30) + (calc.observacao && calc.observacao.length > 30 ? '...' : '') || '-'
    ])
    
    doc.autoTable({
      head: [['Tipo', 'Data', 'Tábua', 'Valor', 'Observação']],
      body: tableData,
      startY: yPos + 10,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 129, 189] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20 }
    })
  }
  
  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('Método Atuarial - Sistema de Cálculos Atuariais', 20, 280)
    doc.text(`Página ${i} de ${pageCount}`, 170, 280)
  }
  
  // Retornar PDF
  const pdfBuffer = doc.output('arraybuffer')
  const fileName = `relatorio_geral_${new Date().toISOString().split('T')[0]}.pdf`
  
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.byteLength.toString(),
    },
  })
}
