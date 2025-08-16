import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { executarTesteAderencia, validarConsistenciaDados, type DadosMortalidade, type ConfiguracaoTeste } from '@/lib/atuarial/CalculosEstatisticos'

// Schema para validação dos dados de entrada - mantido para compatibilidade
const ChiQuadradoRequestSchema = z.object({
  massa_participantes: z.array(z.object({
    matricula: z.string(),
    sexo: z.number().min(1).max(2), // 1 = masculino, 2 = feminino
    idade: z.number().min(0).max(120),
    ano_cadastro: z.number()
  })),
  tabuas_mortalidade: z.array(z.object({
    idade: z.number().min(0).max(120),
    qx_masculino: z.number().min(0).max(1),
    qx_feminino: z.number().min(0).max(1),
    at2000_suav_masc: z.number().min(0).max(1).optional(),
    at2000_suav_fem: z.number().min(0).max(1).optional()
  })),
  calculos_massa_qx: z.array(z.object({
    matricula: z.string(),
    ano_obito: z.number().optional(),
    sexo: z.number().min(1).max(2),
    idade: z.number().min(0).max(120),
    qx_aplicado: z.number().min(0).max(1),
    obitos_observados: z.number().min(0),
    obitos_esperados: z.number().min(0)
  })),
  configuracao: z.object({
    nivel_significancia: z.number().min(0.001).max(0.5).default(0.05),
    usar_correcao_continuidade: z.boolean().default(false),
    agrupar_por_faixa_etaria: z.boolean().default(false),
    tamanho_faixa: z.number().min(1).max(10).default(5)
  }).optional()
})

type ChiQuadradoRequest = z.infer<typeof ChiQuadradoRequestSchema>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação dos dados de entrada
    const dadosValidados = ChiQuadradoRequestSchema.parse(body)
    
    // Converter para formato da biblioteca unificada
    const dadosMortalidade: DadosMortalidade = {
      massa_participantes: dadosValidados.massa_participantes,
      tabuas_mortalidade: dadosValidados.tabuas_mortalidade,
      calculos_massa_qx: dadosValidados.calculos_massa_qx
    }

    const configuracao: ConfiguracaoTeste = {
      nivel_significancia: dadosValidados.configuracao?.nivel_significancia || 0.05,
      usar_correcao_continuidade: dadosValidados.configuracao?.usar_correcao_continuidade || false,
      agrupar_por_faixa_etaria: dadosValidados.configuracao?.agrupar_por_faixa_etaria || false,
      tamanho_faixa: dadosValidados.configuracao?.tamanho_faixa || 5
    }

    // Validação de consistência usando biblioteca unificada
    const validacao = validarConsistenciaDados(dadosMortalidade)
    if (!validacao.valido) {
      return NextResponse.json(
        { 
          error: 'Dados inconsistentes',
          detalhes: validacao.erros.join('; ')
        },
        { status: 400 }
      )
    }

    // Execução do cálculo chi-quadrado usando biblioteca unificada
    const resultado = await executarTesteAderencia(dadosMortalidade, configuracao)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...resultado
    })

  } catch (error) {
    console.error('Erro no cálculo chi-quadrado:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Dados de entrada inválidos',
          detalhes: (error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('; ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor ao calcular chi-quadrado' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/aderencia-tabuas/chi-quadrado',
    descricao: 'Endpoint para cálculo do teste chi-quadrado de aderência de tábuas de mortalidade',
    versao: '2.0 - Biblioteca Unificada',
    metodo: 'POST',
    exemplo_request: {
      massa_participantes: [
        {
          matricula: '12345',
          sexo: 1,
          idade: 45,
          ano_cadastro: 2020
        }
      ],
      tabuas_mortalidade: [
        {
          idade: 45,
          qx_masculino: 0.001234,
          qx_feminino: 0.000987,
          at2000_suav_masc: 0.001150,
          at2000_suav_fem: 0.000890
        }
      ],
      calculos_massa_qx: [
        {
          matricula: '12345',
          sexo: 1,
          idade: 45,
          qx_aplicado: 0.001234,
          obitos_observados: 1,
          obitos_esperados: 0.98
        }
      ],
      configuracao: {
        nivel_significancia: 0.05,
        usar_correcao_continuidade: false,
        agrupar_por_faixa_etaria: true,
        tamanho_faixa: 5
      }
    }
  })
}
