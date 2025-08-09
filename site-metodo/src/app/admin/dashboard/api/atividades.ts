import { NextRequest, NextResponse } from 'next/server'

// Exemplo: endpoint GET para atividades recentes (depois integrar Prisma, RBAC, Zod)
export async function GET(req: NextRequest) {
  // Simulação de dados
  const atividades = [
    { usuario: "Felipe", acao: "Criou um usuário", data: "09/08/2025 10:12" },
    { usuario: "Ana", acao: "Atualizou permissões", data: "09/08/2025 09:55" },
    { usuario: "Carlos", acao: "Removeu um acesso", data: "08/08/2025 18:40" },
  ]
  return NextResponse.json(atividades)
}
