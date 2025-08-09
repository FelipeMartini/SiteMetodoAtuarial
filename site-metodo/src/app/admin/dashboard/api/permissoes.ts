import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Simulação de dados
  const permissoes = [
    { id: 1, nome: 'admin' },
    { id: 2, nome: 'editor' },
    { id: 3, nome: 'viewer' },
    { id: 4, nome: 'financeiro' },
    { id: 5, nome: 'suporte' },
    { id: 6, nome: 'dev' },
    { id: 7, nome: 'rh' },
    { id: 8, nome: 'marketing' },
  ]
  return NextResponse.json(permissoes)
}
