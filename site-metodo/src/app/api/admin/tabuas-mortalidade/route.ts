import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

interface TabuaWhereClause {
  status?: string;
  sexo?: string;
}

interface TaxaInput {
  idade: number;
  qx: number;
  lx?: number;
  dx?: number;
  ex?: number;
  px?: number;
  observacao?: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const sexo = searchParams.get('sexo')

    const where: TabuaWhereClause = {}
    if (status) where.status = status
    if (sexo) where.sexo = sexo

    const tabuas = await prisma.tabuaMortalidade.findMany({
      where,
      include: {
        taxas: {
          take: 10, // Limitar para performance
          orderBy: { idade: 'asc' }
        },
        _count: {
          select: { taxas: true, calculos: true }
        }
      },
      orderBy: { criadoEm: 'desc' }
    })

    return NextResponse.json({ tabuas })
  } catch (error) {
    console.error('Erro ao buscar tábuas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { nome, ano, fonte, sexo, descricao, observacao, taxas } = body

    // Validações
    if (!nome || !ano || !fonte || !sexo) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, ano, fonte, sexo' },
        { status: 400 }
      )
    }

    if (!['M', 'F', 'AMBOS'].includes(sexo)) {
      return NextResponse.json(
        { error: 'Sexo deve ser M, F ou AMBOS' },
        { status: 400 }
      )
    }

    // Verificar se já existe tabua com mesmo nome
    const existingTabua = await prisma.tabuaMortalidade.findUnique({
      where: { nome }
    })

    if (existingTabua) {
      return NextResponse.json(
        { error: 'Já existe uma tábua com este nome' },
        { status: 400 }
      )
    }

    // Criar tábua
    const tabua = await prisma.tabuaMortalidade.create({
      data: {
        nome,
        ano,
        fonte,
        sexo,
        descricao,
        observacao,
        status: 'ativa'
      }
    })

    // Adicionar taxas se fornecidas
    if (taxas && Array.isArray(taxas)) {
      const taxasData = taxas.map((taxa: TaxaInput) => ({
        tabuaId: tabua.id,
        idade: taxa.idade,
        qx: taxa.qx,
        lx: taxa.lx || null,
        dx: taxa.dx || null,
        ex: taxa.ex || null,
        px: taxa.px || (1 - taxa.qx),
        observacao: taxa.observacao || null
      }))

      await prisma.taxaMortalidade.createMany({
        data: taxasData
      })
    }

    // Buscar tábua completa
    const tabuaCompleta = await prisma.tabuaMortalidade.findUnique({
      where: { id: tabua.id },
      include: {
        taxas: { orderBy: { idade: 'asc' } },
        _count: { select: { taxas: true, calculos: true } }
      }
    })

    return NextResponse.json({ tabua: tabuaCompleta }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar tábua:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
