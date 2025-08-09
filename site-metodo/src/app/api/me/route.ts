import { NextRequest, NextResponse } from 'next/server'
import { auth, prisma } from '@/auth'
import { z } from 'zod'

const updateMeSchema = z.object({ name: z.string().min(2).max(120).optional() })

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  return NextResponse.json({ user: session.user })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const body = await req.json().catch(()=> ({}))
  const parsed = updateMeSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos', issues: parsed.error.issues }, { status: 400 })
  if (Object.keys(parsed.data).length === 0) return NextResponse.json({ ok: true })
  const updated = await prisma.user.update({ where: { id: session.user.id }, data: parsed.data, select: { id: true, name: true, email: true, accessLevel: true } })
  return NextResponse.json({ ok: true, user: updated })
}
