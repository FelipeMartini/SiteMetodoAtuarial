import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Prisma instance (usando singleton do auth.ts)
const prisma = new PrismaClient()

const updateMeSchema = z.object({ name: z.string().min(2).max(120).optional() })

/**
 * GET /api/me - ESTRATÉGIA HÍBRIDA
 * Funciona com JWT (Credentials) e Database Sessions (OAuth)
 */
export async function GET() {
  try {
    console.log("[API] GET /api/me - Verificando sessão...")
    
    const session = await auth()
    
    if (!session?.user) {
      console.log("[API] GET /api/me - Não autenticado")
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    console.log("[API] GET /api/me - Usuário autenticado:", session.user.email)
    
    return NextResponse.json({ 
      user: session.user,
      timestamp: new Date().toISOString()
    })
  } catch (_error) {
    console.error("[API] GET /api/me - Erro:", error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

/**
 * PATCH /api/me - Atualizar dados do usuário
 * Funciona com ambas as estratégias de sessão
 */
export async function PATCH(req: NextRequest) {
  try {
    console.log("[API] PATCH /api/me - Verificando sessão...")
    
    const session = await auth()
    
    if (!session?.user?.id) {
      console.log("[API] PATCH /api/me - Não autenticado")
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const parsed = updateMeSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Dados inválidos', 
        issues: parsed.error.issues 
      }, { status: 400 })
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ ok: true })
    }

    const updated = await prisma.user.update({ 
      where: { id: session.user.id }, 
      data: parsed.data, 
      select: { 
        id: true, 
        name: true, 
        email: true, 
        accessLevel: true,
        isActive: true
      } 
    })

    console.log("[API] PATCH /api/me - Usuário atualizado:", updated.email)
    
    return NextResponse.json({ ok: true, user: updated })
  } catch (_error) {
    console.error("[API] PATCH /api/me - Erro:", error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
