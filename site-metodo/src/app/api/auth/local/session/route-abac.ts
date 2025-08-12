'use client'

import { NextResponse } from 'next/server'
import { auth } from '@/../auth-abac-puro'
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar permissão ABAC para visualizar sessão local
    const hasPermission = await checkABACPermission(
      session.user.email || '',
      'resource:session:local',
      'read',
      {
        department: session.user.department || '',
        location: session.user.location || '',
        jobTitle: session.user.jobTitle || '',
        timestamp: new Date()
      }
    )

    if (!hasPermission.allowed) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Retornar dados da sessão local com contexto ABAC
    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        department: session.user.department,
        location: session.user.location,
        jobTitle: session.user.jobTitle,
        isActive: session.user.isActive
      },
      sessionType: 'local',
      abacContext: {
        department: session.user.department,
        location: session.user.location,
        jobTitle: session.user.jobTitle
      }
    })
    
  } catch (error) {
    console.error('Erro ao obter sessão local:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
