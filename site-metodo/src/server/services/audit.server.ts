import { prisma } from '@/lib/prisma'
import { structuredLogger } from '@/lib/logger'

// Tipagem dinâmica parcial para evitar any excessivo
interface AuditLogRecord {
  id: string
  userId?: string | null
  action: string
  target?: string | null
  meta?: string | null
  createdAt: Date
  user?: { id: string; email?: string | null; name?: string | null }
}
type AuditLogClient = {
  create: (args: {
    data: { userId?: string; action: string; target?: string; meta?: string }
  }) => Promise<AuditLogRecord>
  findMany: (args: {
    orderBy: { createdAt: 'desc' }
    take: number
    include: { user: { select: { id: true; email: true; name: true } } }
  }) => Promise<AuditLogRecord[]>
}

function getAuditModel(): AuditLogClient | undefined {
  const p = prisma as unknown as { auditLog?: AuditLogClient }
  return p.auditLog
}

// Nota: requer migrate aplicada para existir prisma.auditLog; até lá, função retorna rápido.
export async function auditLog(params: {
  userId?: string
  action: string
  target?: string
  meta?: unknown
}) {
  const model = getAuditModel()
  if (!model) return
  try {
    await model.create({
      data: {
        userId: params.userId,
        action: params.action,
        target: params.target,
        meta: params.meta ? JSON.stringify(params.meta) : undefined,
      },
    })
  } catch (e) {
    structuredLogger.warn('[audit] falha ao registrar', { error: String(e) })
  }
}

export async function listarAuditoria(limit = 20) {
  const model = getAuditModel()
  if (!model) return []
  try {
    const rows = await model.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { id: true, email: true, name: true } } },
    })
    return rows
  } catch (e) {
    structuredLogger.warn('[audit] falha ao listar', { error: String(e) })
    return []
  }
}
