import { NextRequest, NextResponse } from 'next/server'
import { CalculadoraAtuarial } from '@/lib/calculadora-atuarial'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tipo, parametros } = body || {}

    if (!tipo || !parametros) {
      return NextResponse.json({ error: 'Campos obrigatórios: tipo, parametros' }, { status: 400 })
    }

    const calculadora = new CalculadoraAtuarial()
    let resultado: unknown = null

    try {
      switch (tipo) {
        case 'premio_unico_vida':
        case 'premio_unico_seguro_vida':
          resultado = calculadora.calcularPremioSeguroVida(
            parametros.idade,
            parametros.valorCapital,
            parametros.taxaJuros,
            1
          )
          break
        case 'renda_vitalicia':
          resultado = calculadora.calcularAnuidadeVitalicia(
            parametros.idade,
            parametros.valorAno,
            parametros.taxaJuros
          )
          break
        case 'reserva_matematica':
          resultado = calculadora.calcularReservaTecnica(
            parametros.idadeAtual,
            parametros.idadeContratacao,
            parametros.valorCapital,
            parametros.premioAnual,
            parametros.taxaJuros,
            parametros.periodoPagamento
          )
          break
        case 'expectativa_vida':
          const analise = calculadora.analiseMortalidade(parametros.idade, parametros.idade)
          resultado = analise[0]?.ex ?? null
          break
        case 'probabilidade_sobrevivencia':
          resultado = calculadora.px(parametros.idade)
          break
        default:
          return NextResponse.json({ error: 'Tipo de cálculo inválido ou não implementado' }, { status: 400 })
      }
    } catch (calcError) {
      console.error('Erro no cálculo:', calcError)
      return NextResponse.json({ error: 'Erro ao realizar o cálculo: ' + (calcError as Error).message }, { status: 400 })
    }

    return NextResponse.json({ resultado })
  } catch (_error) {
    console.error('Erro na rota /api/atuarial/calcular:', _error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Permite checagem simples via query string: ?tipo=expectativa_vida&idade=30
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')

    if (!tipo) return NextResponse.json({ message: 'Endpoint de cálculos atuariais. Envie POST com { tipo, parametros }' })

    const calculadora = new CalculadoraAtuarial()
    if (tipo === 'ping') return NextResponse.json({ ok: true })

    // Exemplo rápido para expectativa_vida via GET
    if (tipo === 'expectativa_vida') {
      const idade = parseInt(searchParams.get('idade') || '0')
      const analise = calculadora.analiseMortalidade(idade, idade)
      return NextResponse.json({ idade, expectativa: analise[0]?.ex ?? null })
    }

    return NextResponse.json({ error: 'Tipo não suportado via GET' }, { status: 400 })
  } catch (_error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
