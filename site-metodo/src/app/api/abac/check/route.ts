import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { checkABACPermission } from '@/lib/abac/enforcer-abac-puro'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'

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

    // Verificar permissão via ABAC e medir tempo
    const start = Date.now()
    const permissionResult = await checkABACPermission(
      subject,
      object,
      action,
      context
    )
    const duration = Date.now() - start

    // Persistir log simples em XLOGS/abac-check.log
    try {
      const logsDir = path.resolve(process.cwd(), 'XLOGS')
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true })
      const logPath = path.join(logsDir, 'abac-check.log')
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'local'
      const entry = JSON.stringify({ ts: new Date().toISOString(), subject, object, action, ip, allowed: permissionResult.allowed, reason: permissionResult.reason, responseTime: permissionResult.responseTime, routeDurationMs: duration }) + '\n'
      fs.appendFileSync(logPath, entry)
    } catch (e) {
      console.error('Falha ao escrever log ABAC:', e)
    }

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
