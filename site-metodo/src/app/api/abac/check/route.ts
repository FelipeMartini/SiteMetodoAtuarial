import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro'
import { z } from 'zod'

const CheckPermissionSchema = z.object({
  subject: z.string(),
  object: z.string(),
  action: z.string(),
  context: z.record(z.string(), z.unknown()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ 
        allowed: false, 
        error: 'Não autenticado' 
      }, { status: 401 })
    }

    const body = await request.json()
    const result = CheckPermissionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({
        allowed: false,
        error: 'Dados da requisição inválidos',
        details: result.error.issues,
      }, { status: 400 })
    }

    const { subject, object, action, context = {} } = result.data

    // Verificar permissão via ABAC
    const permissionResult = await checkABACPermission(
      subject,
      object,
      action,
      context
    )

    return NextResponse.json({
      allowed: permissionResult.allowed,
      reason: permissionResult.reason,
      appliedPolicies: permissionResult.appliedPolicies,
      responseTime: permissionResult.responseTime
    })

  } catch (error) {
    console.error('Erro ao verificar permissão ABAC:', error)
    return NextResponse.json({
      allowed: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
