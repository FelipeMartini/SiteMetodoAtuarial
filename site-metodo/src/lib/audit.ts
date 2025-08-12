import { prisma } from './prisma'
import { simpleLogger, auditLogger, authLogger, securityLogger } from './simple-logger'
import { AuditAction } from '@prisma/client'

export interface AuditEntry {
  userId?: string
  action: AuditAction
  target?: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  success?: boolean
  sessionId?: string
}

export interface AuditContext {
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  performedBy?: string
}

export class AuditService {
  private static instance: AuditService

  private constructor() {}

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService()
    }
    return AuditService.instance
  }

  /**
   * Registra uma ação de auditoria no banco e no sistema de logs
   */
  async log(entry: AuditEntry): Promise<void> {
    try {
      // 1. Salvar no banco de dados
      const auditRecord = await prisma.auditLog.create({
        data: {
          userId: entry.userId,
          action: entry.action,
          target: entry.target,
          details: entry.details ? JSON.stringify(entry.details) : null,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          success: entry.success ?? true,
        },
      })

      // 2. Log estruturado
      const logMessage = `Audit: ${entry.action} ${entry.target ? `on ${entry.target}` : ''}`
      simpleLogger.info(logMessage, {
        userId: entry.userId,
        sessionId: entry.sessionId,
        ip: entry.ipAddress,
        userAgent: entry.userAgent,
        performedBy: entry.userId || 'system',
        target: entry.target,
        details: entry.details,
        success: entry.success,
        auditId: auditRecord.id,
      })
    } catch {
      // Falha na auditoria é crítica, mas não deve quebrar a aplicação
      simpleLogger.error('Failed to create audit log', {
        action: entry.action,
        userId: entry.userId,
        target: entry.target,
      })
    }
  }

  /**
   * Logs de autenticação
   */
  async logAuth(
    action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'SIGNUP',
    context: AuditContext & {
      email?: string
      provider?: string
      reason?: string
    }
  ): Promise<void> {
    await this.log({
      userId: context.userId,
      action,
      target: context.email,
      details: {
        provider: context.provider,
        reason: context.reason,
        timestamp: new Date().toISOString(),
      },
      ipAddress: context.ip,
      userAgent: context.userAgent,
      sessionId: context.sessionId,
      success: action !== 'LOGIN_FAILED',
    })

    // Log específico de auth
    if (action === 'LOGIN_SUCCESS' && context.userId) {
      authLogger.login(context.userId, {
        ip: context.ip,
        userAgent: context.userAgent,
        provider: context.provider,
      })
    } else if (action === 'LOGIN_FAILED' && context.email) {
      authLogger.failed(context.email, context.reason || 'unknown', {
        ip: context.ip,
        userAgent: context.userAgent,
      })
    }
  }

  /**
   * Logs de administração de usuários
   */
  async logUserManagement(
    action:
      | 'USER_CREATE'
      | 'USER_UPDATE'
      | 'USER_DELETE'
      | 'USER_ACTIVATE'
      | 'USER_DEACTIVATE'
      | 'ROLE_CHANGE',
    context: AuditContext & {
      targetUserId: string
      targetEmail?: string
      changes?: Record<string, any>
      fromRole?: string
      toRole?: string
    }
  ): Promise<void> {
    await this.log({
      userId: context.performedBy || context.userId,
      action,
      target: context.targetUserId,
      details: {
        targetEmail: context.targetEmail,
        changes: context.changes,
        fromRole: context.fromRole,
        toRole: context.toRole,
        timestamp: new Date().toISOString(),
      },
      ipAddress: context.ip,
      userAgent: context.userAgent,
      sessionId: context.sessionId,
    })

    // Logs específicos
    if (context.performedBy) {
      switch (action) {
        case 'USER_CREATE':
          auditLogger.userCreated(context.performedBy, context.targetUserId, {
            ip: context.ip,
            targetEmail: context.targetEmail,
          })
          break
        case 'USER_UPDATE':
          auditLogger.userUpdated(
            context.performedBy,
            context.targetUserId,
            context.changes || {},
            {
              ip: context.ip,
            }
          )
          break
        case 'USER_DELETE':
          auditLogger.userDeleted(context.performedBy, context.targetUserId, {
            ip: context.ip,
          })
          break
        case 'ROLE_CHANGE':
          if (context.fromRole && context.toRole) {
            auditLogger.roleChanged(
              context.performedBy,
              context.targetUserId,
              context.fromRole,
              context.toRole,
              { ip: context.ip }
            )
          }
          break
      }
    }
  }

  /**
   * Logs de acesso a API
   */
  async logApiAccess(
    userId: string | null,
    method: string,
    endpoint: string,
    ip: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    try {
      // Log estruturado
      simpleLogger.info(`API ${method} ${endpoint}`, {
        userId: userId || 'anonymous',
        method,
        endpoint,
        ip,
        data: data ? JSON.stringify(data) : undefined,
        timestamp: new Date().toISOString(),
      })

      // Log específico de auditoria se necessário
      if (userId) {
        auditLogger.apiAccess(userId, method, endpoint, { ip, data })
      }
    } catch {
      console.error('Erro ao registrar acesso à API:', String(_error))
    }
  }

  /**
   * Logs de segurança
   */
  async logSecurity(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    context: AuditContext & {
      details?: Record<string, unknown>
      resource?: string
    }
  ): Promise<void> {
    // Log estruturado de segurança
    securityLogger.suspiciousActivity(event, {
      userId: context.userId,
      ip: context.ip,
      userAgent: context.userAgent,
      details: context.details,
      resource: context.resource,
      severity,
    })

    // Salvar no banco se for evento crítico
    if (severity === 'high' || severity === 'critical') {
      await this.log({
        userId: context.userId,
        action: 'LOGIN_FAILED', // Usar como catch-all para eventos de segurança
        target: context.resource || 'security_event',
        details: {
          event,
          severity,
          ...context.details,
        },
        ipAddress: context.ip,
        userAgent: context.userAgent,
        sessionId: context.sessionId,
        success: false,
      })
    }
  }

  /**
   * Logs de sessão
   */
  async logSession(
    action: 'SESSION_CREATE' | 'SESSION_DELETE',
    context: AuditContext & {
      sessionToken?: string
      expiresAt?: Date
    }
  ): Promise<void> {
    await this.log({
      userId: context.userId,
      action,
      target: context.sessionToken,
      details: {
        expiresAt: context.expiresAt?.toISOString(),
        timestamp: new Date().toISOString(),
      },
      ipAddress: context.ip,
      userAgent: context.userAgent,
      sessionId: context.sessionId,
    })
  }

  /**
   * Logs de OAuth
   */
  async logOAuth(
    action: 'OAUTH_LINK' | 'OAUTH_UNLINK',
    context: AuditContext & {
      provider: string
      providerAccountId?: string
    }
  ): Promise<void> {
    await this.log({
      userId: context.userId,
      action,
      target: context.provider,
      details: {
        provider: context.provider,
        providerAccountId: context.providerAccountId,
        timestamp: new Date().toISOString(),
      },
      ipAddress: context.ip,
      userAgent: context.userAgent,
      sessionId: context.sessionId,
    })
  }

  /**
   * Logs de MFA
   */
  async logMFA(
    action: 'MFA_ENABLE' | 'MFA_DISABLE' | 'TOTP_VERIFY',
    context: AuditContext & {
      success?: boolean
      method?: string
    }
  ): Promise<void> {
    await this.log({
      userId: context.userId,
      action,
      details: {
        method: context.method,
        timestamp: new Date().toISOString(),
      },
      ipAddress: context.ip,
      userAgent: context.userAgent,
      sessionId: context.sessionId,
      success: context.success,
    })
  }

  /**
   * Buscar logs de auditoria com filtros
   */
  async searchLogs(filters: {
    userId?: string
    action?: AuditAction
    startDate?: Date
    endDate?: Date
    success?: boolean
    limit?: number
    offset?: number
  }) {
    const where: Record<string, unknown> = {}

    if (filters.userId) where.userId = filters.userId
    if (filters.action) where.action = filters.action
    if (filters.success !== undefined) where.success = filters.success

    if (filters.startDate || filters.endDate) {
      where.createdAt = {} as Record<string, unknown>
      if (filters.startDate) (where.createdAt as Record<string, unknown>).gte = filters.startDate
      if (filters.endDate) (where.createdAt as Record<string, unknown>).lte = filters.endDate
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      prisma.auditLog.count({ where }),
    ])

    return {
      logs: logs.map(log => ({
        ...log,
        details: log.details ? JSON.parse(log.details) : null,
      })),
      total,
      hasMore: (filters.offset || 0) + logs.length < total,
    }
  }

  /**
   * Estatísticas de auditoria
   */
  async getAuditStats(period: 'day' | 'week' | 'month' = 'week') {
    const startDate = new Date()
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1)
        break
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
    }

    const [totalLogs, successfulActions, failedActions, uniqueUsers, actionsByType] =
      await Promise.all([
        prisma.auditLog.count({
          where: { createdAt: { gte: startDate } },
        }),
        prisma.auditLog.count({
          where: { createdAt: { gte: startDate }, success: true },
        }),
        prisma.auditLog.count({
          where: { createdAt: { gte: startDate }, success: false },
        }),
        prisma.auditLog.groupBy({
          by: ['userId'],
          where: { createdAt: { gte: startDate }, userId: { not: null } },
          _count: true,
        }),
        prisma.auditLog.groupBy({
          by: ['action'],
          where: { createdAt: { gte: startDate } },
          _count: true,
          orderBy: { _count: { action: 'desc' } },
        }),
      ])

    return {
      period,
      startDate,
      endDate: new Date(),
      totalLogs,
      successfulActions,
      failedActions,
      uniqueUsers: uniqueUsers.length,
      actionsByType: actionsByType.map(item => ({
        action: item.action,
        count: item._count,
      })),
    }
  }
}

// Instância singleton
export const auditService = AuditService.getInstance()

// Helpers para casos comuns
export const audit = {
  // Autenticação
  loginSuccess: (
    userId: string,
    context: Omit<AuditContext, 'userId'> & { email?: string; provider?: string }
  ) => auditService.logAuth('LOGIN_SUCCESS', { ...context, userId }),

  loginFailed: (context: AuditContext & { email?: string; reason?: string }) =>
    auditService.logAuth('LOGIN_FAILED', context),

  logout: (userId: string, context: Omit<AuditContext, 'userId'>) =>
    auditService.logAuth('LOGOUT', { ...context, userId }),

  signup: (userId: string, context: Omit<AuditContext, 'userId'> & { email?: string }) =>
    auditService.logAuth('SIGNUP', { ...context, userId }),

  // Administração
  userCreated: (
    performedBy: string,
    targetUserId: string,
    context: AuditContext & { targetEmail?: string }
  ) => auditService.logUserManagement('USER_CREATE', { ...context, performedBy, targetUserId }),

  userUpdated: (
    performedBy: string,
    targetUserId: string,
    changes: Record<string, any>,
    context: AuditContext
  ) =>
    auditService.logUserManagement('USER_UPDATE', {
      ...context,
      performedBy,
      targetUserId,
      changes,
    }),

  userDeleted: (performedBy: string, targetUserId: string, context: AuditContext) =>
    auditService.logUserManagement('USER_DELETE', { ...context, performedBy, targetUserId }),

  roleChanged: (
    performedBy: string,
    targetUserId: string,
    fromRole: string,
    toRole: string,
    context: AuditContext
  ) =>
    auditService.logUserManagement('ROLE_CHANGE', {
      ...context,
      performedBy,
      targetUserId,
      fromRole,
      toRole,
    }),

  // Segurança
  suspiciousActivity: (
    event: string,
    context: AuditContext & { details?: Record<string, unknown> }
  ) => auditService.logSecurity(event, 'high', context),

  accessDenied: (resource: string, context: AuditContext) =>
    auditService.logSecurity('access_denied', 'medium', { ...context, resource }),

  dataExport: (userId: string, dataType: string, context: Omit<AuditContext, 'userId'>) =>
    auditService.logSecurity('data_export', 'medium', {
      ...context,
      userId,
      details: { dataType },
    }),
}

export default auditService
