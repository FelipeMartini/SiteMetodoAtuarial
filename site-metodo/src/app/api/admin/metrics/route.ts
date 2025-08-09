import { NextResponse } from 'next/server'
import { auth, prisma } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  if ((session.user.accessLevel ?? 0) < 100) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  interface AuditModel {
    findMany: (args: { orderBy: { createdAt: 'desc' }; take: number; include: { user: { select: { id: true; email: true; name: true } } } }) => Promise<any[]>
    count: () => Promise<number>
  }
  const auditModel = (prisma as unknown as { auditLog?: AuditModel }).auditLog

  const [totalUsers, activeUsers, newUsers7d, accountsTotal] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.account.count(),
  ])

  const [lastAudit, auditCount] = auditModel
    ? await Promise.all([
        auditModel.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { id: true, email: true, name: true } } } }),
        auditModel.count(),
      ])
    : [[], 0]

  return NextResponse.json({
    totalUsers,
    activeUsers,
    newUsers7d,
    linkedAccounts: accountsTotal,
    auditCount,
    lastAudit,
  })
}
