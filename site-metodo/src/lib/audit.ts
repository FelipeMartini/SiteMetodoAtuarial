import auditLogger, { AuditAction, AuditSeverity } from './audit/auditLogger'

// Merge resolution: preferimos a implementação local que delega ao auditLogger
// de forma segura (usa operadores opcionais). A versão remota (cleanup/remove-api-users)
// substituiu por shims que lançavam erros; optamos por manter compatibilidade
// preservando a API e fallback silencioso para evitar que o sistema quebre.
export const auditService = {
  async logAuthEvent(userEmail?: string, success?: boolean, details?: Record<string, unknown>) {
    // Usa userCreated/logAuth em scenarios simplificados
    try {
      if (success) {
        await auditLogger.logAuth?.(AuditAction.LOGIN_SUCCESS as any, userEmail || 'unknown', true, details as any)
      } else {
        await auditLogger.logAuth?.(AuditAction.LOGIN_FAILED as any, userEmail || 'unknown', false, details as any)
      }
    } catch (e) {
      // fallback silencioso
    }
  },

  async logUserEvent(action: AuditAction | string, targetUserEmail?: string, performedBy?: string, details?: Record<string, unknown>) {
    try {
      await auditLogger.logUserManagement?.(action as any, targetUserEmail || 'unknown', performedBy || 'system', details as any)
    } catch (e) {}
  },

  async logSecurityEvent(message: string, severity: AuditSeverity = AuditSeverity.MEDIUM, details?: Record<string, unknown>) {
    await auditLogger.logSecurityEvent?.(message, severity as any, details as any)
  },

  async logSessionEvent(action: string, userEmail: string, details: Record<string, unknown> = {}) {
    await auditLogger.log({ action: AuditAction.ACCESS_DENIED as any, severity: AuditSeverity.LOW, success: true, userEmail, description: `${action}`, ...details } as any)
  },

  async logOAuthEvent(action: string, userEmail: string, details: Record<string, unknown> = {}) {
    await auditLogger.log({ action: AuditAction.DATA_ACCESS as any, severity: AuditSeverity.LOW, success: true, userEmail, description: `oauth:${action}`, ...details } as any)
  },

  async logMFAEvent(action: string, userEmail: string, details: Record<string, unknown> = {}) {
    await auditLogger.log({ action: AuditAction.DATA_ACCESS as any, severity: AuditSeverity.LOW, success: true, userEmail, description: `mfa:${action}`, ...details } as any)
  },

  async logApiAccess(userEmail: string | null, method: string, path: string, clientIp?: string, details: Record<string, unknown> = {}) {
    await auditLogger.logAccess?.(userEmail || 'anonymous', path, true, { method, clientIp, ...(details || {}) } as any)
  },

  async getAuditLogs(filters: Record<string, unknown> = {}, pagination = { page: 1, limit: 50 }) {
    return auditLogger.getAuditLogs?.(filters as any, pagination as any) as any
  },

  async getAuditStats(filters: Record<string, unknown> = {}) {
  // auditLogger.getAuditStats não aceita filtros na implementação atual (stub),
  // portanto chamamos sem argumentos para compatibilidade.
  return auditLogger.getAuditStats?.() as any
  },
}

export default auditService
