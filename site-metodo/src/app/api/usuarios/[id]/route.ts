import { NextRequest, NextResponse } from 'next/server'
import { auth, prisma } from '@/lib/auth'
import { auditLog } from '@/server/services/audit.server'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  accessLevel: z.number().int().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  if ((session.user.accessLevel ?? 0) < 100) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  const body = await req.json().catch(()=> ({}))
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos', issues: parsed.error.issues }, { status: 400 })
  const { id } = params
  try {
    const before = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, accessLevel: true, isActive: true } })
    if (!before) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    const updated = await prisma.user.update({ where: { id }, data: parsed.data, select: { id: true, name: true, accessLevel: true, isActive: true } })
    await auditLog({ userId: session.user.id, action: 'user.update', target: id, meta: { before, after: updated } })
    return NextResponse.json({ ok: true, user: updated })
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}
