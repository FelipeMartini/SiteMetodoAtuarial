// Stub temporário para auditService enquanto o sistema ABAC está sendo implementado

export interface AuditEntry {
  userId?: string
  userEmail?: string
  action: string
  resource?: string
  details?: Record<string, unknown>
  ip?: string
  userAgent?: string
  success?: boolean
}

// Implementação stub do auditService
export const auditService = {
  async logAuthEvent(
    action: string,
    userEmail?: string,
    details: Record<string, unknown> = {}
  ): Promise<void> {
    console.log('Audit (stub):', { action, userEmail, details })
  },

  async logUserEvent(
    action: string,
    userEmail: string,
    details: Record<string, unknown> = {}
  ): Promise<void> {
    console.log('Audit (stub):', { action, userEmail, details })
  },

  async logSecurityEvent(
    action: string,
    details: Record<string, unknown> = {},
    userEmail?: string
  ): Promise<void> {
    console.log('Security audit (stub):', { action, userEmail, details })
  },

  async logSessionEvent(
    action: string,
    userEmail: string,
    details: Record<string, unknown> = {}
  ): Promise<void> {
    console.log('Session audit (stub):', { action, userEmail, details })
  },

  async logOAuthEvent(
    action: string,
    userEmail: string,
    details: Record<string, unknown> = {}
  ): Promise<void> {
    console.log('OAuth audit (stub):', { action, userEmail, details })
  },

  async logMFAEvent(
    action: string,
    userEmail: string,
    details: Record<string, unknown> = {}
  ): Promise<void> {
    console.log('MFA audit (stub):', { action, userEmail, details })
  },

  async logApiAccess(
    userEmail: string | null,
    method: string,
    path: string,
    details: Record<string, unknown> = {}
  ): Promise<void> {
    console.log('API access audit (stub):', { userEmail, method, path, details })
  },

  async getAuditLogs(
    filters: Record<string, unknown> = {},
    pagination = { page: 1, limit: 50 }
  ) {
    console.log('Get audit logs (stub):', { filters, pagination })
    return {
      logs: [],
      total: 0,
      page: pagination.page,
      limit: pagination.limit,
      pages: 0
    }
  },

  async getAuditStats(filters: Record<string, unknown> = {}) {
    console.log('Get audit stats (stub):', { filters })
    return {
      totalEvents: 0,
      successfulLogins: 0,
      failedLogins: 0,
      actionsByType: [],
      eventsByDay: []
    }
  }
}
