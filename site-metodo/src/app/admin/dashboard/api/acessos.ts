import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Simulação de dados
  return NextResponse.json({ total: 5421 })
}
