import { NextResponse } from 'next/server'
import { auth } from '@/../auth'
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

    // Check ABAC permission para acessar sessão - usar email do usuário
    const hasPermission = await checkABACPermission(
      session.user.email || `user:${session.user.id}`,
      'session:read',
      'read',
      {
        time: new Date().toISOString(),
        location: session.user.location || 'unknown',
        department: session.user.department || 'unknown',
        ip: 'session-check'
      }
    )

    if (!hasPermission.allowed) {
      return NextResponse.json(
        { error: 'Acesso negado pelo sistema ABAC' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          department: session.user.department,
          location: session.user.location,
          jobTitle: session.user.jobTitle,
          isActive: session.user.isActive,
          validFrom: session.user.validFrom,
          validUntil: session.user.validUntil
        },
        abac: {
          enabled: true,
          permission: hasPermission,
          context: hasPermission.context
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao obter sessão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
