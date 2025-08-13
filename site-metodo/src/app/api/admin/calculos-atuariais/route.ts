import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { CalculadoraAtuarial } from '@/lib/calculadora-atuarial'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Record<string, unknown> = {}
    if (tipo) where.tipo = tipo
    if (session.user?.id) where.userId = session.user.id

    const calculos = await prisma.calculoAtuarial.findMany({
      where,
      include: {
        tabua: { select: { nome: true, ano: true, fonte: true } },
        user: { select: { name: true, email: true } }
      },
      orderBy: { dataCalculo: 'desc' },
      take: limit
    })

    return NextResponse.json({ calculos })
  } catch (error) {
    console.error('Erro ao buscar cálculos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, parametros, tabuaId } = body

    // Validações
    if (!tipo || !parametros) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: tipo, parametros' },
        { status: 400 }
      )
    }

    const tiposPermitidos = [
      'seguro_vida',
      'renda_vitalicia',
      'reserva_matematica',
      'expectativa_vida',
      'probabilidade_sobrevivencia'
    ]

    if (!tiposPermitidos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de cálculo inválido' },
        { status: 400 }
      )
    }

    // Realizar o cálculo
    const calculadora = new CalculadoraAtuarial()
    const resultado: Record<string, unknown> = {}

    try {
      switch (tipo) {
        case 'premio_unico_vida':
          resultado.valor = calculadora.calcularPremioSeguroVida(parametros.idade, parametros.valorCapital, parametros.taxaJuros, 1)
          break
        case 'renda_vitalicia':
          resultado.valor = calculadora.calcularAnuidadeVitalicia(parametros.idade, parametros.valorAno, parametros.taxaJuros)
          break
        case 'reserva_matematica':
          resultado.valor = calculadora.calcularReservaTecnica(
            parametros.idadeAtual,
            parametros.idadeContratacao,
            parametros.valorCapital,
            parametros.premioAnual,
            parametros.taxaJuros,
            parametros.periodoPagamento
          )
          break
        case 'expectativa_vida':
          const analise = calculadora.analiseMortalidade(parametros.idade, parametros.idade, 100000, 0.06)
          resultado.valor = analise[0]?.ex || 0
          break
        case 'probabilidade_sobrevivencia':
          resultado.valor = calculadora.px(parametros.idade)
          break
        default:
          throw new Error('Tipo de cálculo não implementado')
      }

      // Adicionar metadados ao resultado
      resultado.metodologia = 'AT-2000 com juros compostos'
      resultado.tabelaMortalidade = tabuaId ? 'Tábua personalizada' : 'AT-2000 (SUSEP)'
      resultado.dataCalculo = new Date()
      resultado.parametrosUtilizados = parametros

    } catch (calcError) {
      console.error('Erro no cálculo:', calcError)
      return NextResponse.json(
        { error: 'Erro ao realizar o cálculo: ' + (calcError as Error).message },
        { status: 400 }
      )
    }

    // Salvar no banco de dados
    const calculo = await prisma.calculoAtuarial.create({
      data: {
        tipo,
        parametros,
        resultado: resultado as any,
        tabuaId,
        userId: session.user.id,
        observacao: `Cálculo ${tipo} realizado automaticamente`
      },
      include: {
        tabua: { select: { nome: true, ano: true, fonte: true } },
        user: { select: { name: true, email: true } }
      }
    })

    return NextResponse.json({ calculo }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar cálculo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
