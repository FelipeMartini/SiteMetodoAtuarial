import { NextRequest, NextResponse } from 'next/server'
// Exemplo: endpoint GET para usuários (depois integrar Prisma, RBAC, Zod)

export async function GET(req: NextRequest) {
  // Simulação de dados
  const usuarios = [
    { id: 1, nome: 'Felipe', email: 'felipe@email.com', role: 'admin' },
    { id: 2, nome: 'Ana', email: 'ana@email.com', role: 'editor' },
  ]
  return NextResponse.json(usuarios)
}
