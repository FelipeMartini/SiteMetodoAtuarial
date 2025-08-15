import simpleLogger, { auditLogger as _auditLogger } from './simple-logger'

// Arquivado: audit.ts original foi movido para lista-de-tarefas/ImplementarTemp/archive/batch-H/audit.ts
// Substituído por shim que força falha explícita se usada sem migração.
export const auditService = {
  async logAuthEvent() { throw new Error('auditService.logAuthEvent: impl arquivada — use o auditLogger ou implemente a integração real'); },
  async logUserEvent() { throw new Error('auditService.logUserEvent: impl arquivada'); },
  async logSecurityEvent() { throw new Error('auditService.logSecurityEvent: impl arquivada'); },
  async logSessionEvent(action: string, userEmail: string, details: Record<string, unknown> = {}) {
    simpleLogger.info(`session:${action}`, { userEmail, ...details })
  },

  async logOAuthEvent(action: string, userEmail: string, details: Record<string, unknown> = {}) {
    simpleLogger.info(`oauth:${action}`, { userEmail, ...details })
  },

  async logMFAEvent(action: string, userEmail: string, details: Record<string, unknown> = {}) {
    simpleLogger.info(`mfa:${action}`, { userEmail, ...details })
  },

  async logApiAccess(userEmail: string | null, method: string, path: string, clientIp?: string, details: Record<string, unknown> = {}) {
    // usa o helper auditLogger.apiAccess do simple-logger
    try {
      _auditLogger.apiAccess?.(userEmail || 'anonymous', method, path, { clientIp, ...(details || {}) })
    } catch (e) {
      simpleLogger.warn('auditService.logApiAccess fallback', { userEmail, method, path })
    }
  },

  async getAuditLogs(filters: Record<string, unknown> = {}, pagination = { page: 1, limit: 50 }) {
    // implementação mínima: retorna vazia; integracão completa deve buscar do DB/Prisma
    return { logs: [], total: 0, page: pagination.page, limit: pagination.limit, pages: 0 }
  },

  async getAuditStats(filters: Record<string, unknown> = {}) {
    return { totalEvents: 0, successfulLogins: 0, failedLogins: 0 }
  },
}
