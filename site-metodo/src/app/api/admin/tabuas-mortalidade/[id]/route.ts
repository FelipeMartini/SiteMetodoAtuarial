import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const tabua = await prisma.tabuaMortalidade.findUnique({
      where: { id: params.id },
      include: {
        taxas: { orderBy: { idade: 'asc' } },
        calculos: {
          include: { user: { select: { name: true, email: true } } },
          orderBy: { dataCalculo: 'desc' },
          take: 10
        },
        _count: { select: { taxas: true, calculos: true } }
      }
    })

    if (!tabua) {
      return NextResponse.json({ error: 'Tábua não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ tabua })
  } catch (error) {
    console.error('Erro ao buscar tábua:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { nome, ano, fonte, sexo, descricao, observacao, status } = body

    // Verificar se a tábua existe
    const existingTabua = await prisma.tabuaMortalidade.findUnique({
      where: { id: params.id }
    })

    if (!existingTabua) {
      return NextResponse.json({ error: 'Tábua não encontrada' }, { status: 404 })
    }

    // Verificar se nome já existe (exceto para a própria tábua)
    if (nome && nome !== existingTabua.nome) {
      const duplicateTabua = await prisma.tabuaMortalidade.findUnique({
        where: { nome }
      })

      if (duplicateTabua) {
        return NextResponse.json(
          { error: 'Já existe uma tábua com este nome' },
          { status: 400 }
        )
      }
    }

    // Atualizar tábua
    const tabua = await prisma.tabuaMortalidade.update({
      where: { id: params.id },
      data: {
        ...(nome && { nome }),
        ...(ano && { ano }),
        ...(fonte && { fonte }),
        ...(sexo && { sexo }),
        ...(descricao !== undefined && { descricao }),
        ...(observacao !== undefined && { observacao }),
        ...(status && { status }),
        atualizadoEm: new Date()
      },
      include: {
        taxas: { orderBy: { idade: 'asc' } },
        _count: { select: { taxas: true, calculos: true } }
      }
    })

    return NextResponse.json({ tabua })
  } catch (error) {
    console.error('Erro ao atualizar tábua:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se a tábua existe
    const existingTabua = await prisma.tabuaMortalidade.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { calculos: true } }
      }
    })

    if (!existingTabua) {
      return NextResponse.json({ error: 'Tábua não encontrada' }, { status: 404 })
    }

    // Verificar se há cálculos associados
    if (existingTabua._count.calculos > 0) {
      return NextResponse.json(
        { 
          error: 'Não é possível excluir tábua com cálculos associados. Desative-a ao invés de excluir.' 
        },
        { status: 400 }
      )
    }

    // Excluir tábua (as taxas serão excluídas em cascata)
    await prisma.tabuaMortalidade.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Tábua excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir tábua:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
