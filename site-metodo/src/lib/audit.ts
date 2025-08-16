import auditLogger, { AuditAction, AuditSeverity } from './audit/auditLogger'

// Serviço de auditoria público usado pelo restante da aplicação.
// Implementação delega para auditLogger quando disponível. Usamos operadores opcionais
// e try/catch para evitar que falhas na camada de auditoria quebrem o fluxo principal.
export const auditService = {
  async logAuthEvent(userEmail?: string, success?: boolean, details?: Record<string, unknown>) {
    try {
      if (success) {
        await auditLogger.logAuth?.(AuditAction.LOGIN_SUCCESS as any, userEmail || 'unknown', true, details as any)
      } else {
        await auditLogger.logAuth?.(AuditAction.LOGIN_FAILED as any, userEmail || 'unknown', false, details as any)
      }
    } catch (_e) {
      // fallback silencioso para não interromper autenticação
    }
  },

  async logUserEvent(action: AuditAction | string, targetUserEmail?: string, performedBy?: string, details?: Record<string, unknown>) {
    try {
      await auditLogger.logUserManagement?.(action as any, targetUserEmail || 'unknown', performedBy || 'system', details as any)
    } catch (_e) {
      // noop
    }
  },

  async logSecurityEvent(message: string, severity: AuditSeverity = AuditSeverity.MEDIUM, details?: Record<string, unknown>) {
    try {
      await auditLogger.logSecurityEvent?.(message, severity as any, details as any)
    } catch (_e) {
      // noop
    }
  },

  async logSessionEvent(action: string, userEmail: string, details: Record<string, unknown> = {}) {
    try {
      await auditLogger.log?.({ action: AuditAction.ACCESS_DENIED as any, severity: AuditSeverity.LOW, success: true, userEmail, description: `${action}`, ...(details as any) } as any)
    } catch (_e) {
      // noop
    }
  },

  async logOAuthEvent(action: string, userEmail: string, details: Record<string, unknown> = {}) {
    try {
      await auditLogger.log?.({ action: AuditAction.DATA_ACCESS as any, severity: AuditSeverity.LOW, success: true, userEmail, description: `oauth:${action}`, ...(details as any) } as any)
    } catch (_e) {
      // noop
    }
  },

  async logMFAEvent(action: string, userEmail: string, details: Record<string, unknown> = {}) {
    try {
      await auditLogger.log?.({ action: AuditAction.DATA_ACCESS as any, severity: AuditSeverity.LOW, success: true, userEmail, description: `mfa:${action}`, ...(details as any) } as any)
    } catch (e) {
      // noop
    }
  },

  async logApiAccess(userEmail: string | null, method: string, path: string, clientIp?: string, details: Record<string, unknown> = {}) {
    try {
      await auditLogger.logAccess?.(userEmail || 'anonymous', path, true, { method, clientIp, ...(details || {}) } as any)
    } catch (e) {
      // noop
    }
  },

  async getAuditLogs(filters: Record<string, unknown> = {}, pagination = { page: 1, limit: 50 }) {
    try {
      return (await auditLogger.getAuditLogs?.(filters as any, pagination as any)) as any
    } catch (_e) {
      return { logs: [], total: 0, page: pagination.page, limit: pagination.limit, pages: 0 }
    }
  },

  async getAuditStats(filters: Record<string, unknown> = {}) {
    try {
      // auditLogger.getAuditStats pode não aceitar filtros na implementação atual
      return (await auditLogger.getAuditStats?.()) as any
    } catch (_e) {
      return { totalEvents: 0, successfulLogins: 0, failedLogins: 0 }
    }
  },
}

export default auditService
