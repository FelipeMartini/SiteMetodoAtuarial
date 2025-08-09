import { NextRequest, NextResponse } from 'next/server'

// Simulação de dados de acessos por dia da semana
export async function GET(req: NextRequest) {
  const acessos = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
    data: [120, 190, 300, 250, 220],
  }
  return NextResponse.json(acessos)
}
