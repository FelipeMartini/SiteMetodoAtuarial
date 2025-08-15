// Arquivado: auditLogger.ts (stub)
// Copiado antes da remoção do stub ativo

export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AuditAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  DATA_ACCESS = 'DATA_ACCESS',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
}

export interface AuditData {
  action: AuditAction
  severity: AuditSeverity
  success: boolean
  message?: string
  userId?: string
  userEmail?: string
  resource?: string
  details?: Record<string, unknown>
  ip?: string
  userAgent?: string
  description?: string
  target?: string
  metadata?: Record<string, unknown>
}

export class AuditLogger {
  private static instance: AuditLogger

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  async log(data: AuditData): Promise<void> {
    console.log('Audit Log (stub):', data)
  }

  async logAuth(action: AuditAction, userEmail: string, success: boolean, details?: Record<string, unknown>): Promise<void> {
    console.log('Auth Audit (stub):', { action, userEmail, success, details })
  }

  async logLogout(userEmail: string, details?: Record<string, unknown>): Promise<void> {
    console.log('Logout Audit (stub):', { userEmail, details })
  }

  async logAccess(userEmail: string, resource: string, granted: boolean, details?: Record<string, unknown>): Promise<void> {
    console.log('Access Audit (stub):', { userEmail, resource, granted, details })
  }

  async logDataAccess(userEmail: string, resource: string, action: string, details?: Record<string, unknown>): Promise<void> {
    console.log('Data Access Audit (stub):', { userEmail, resource, action, details })
  }

  async logUserManagement(action: string, targetUserEmail: string, adminEmail: string, details?: Record<string, unknown>): Promise<void> {
    console.log('User Management Audit (stub):', { action, targetUserEmail, adminEmail, details })
  }

  async logPermissionChange(userEmail: string, resource: string, oldPermissions: unknown, newPermissions: unknown, adminEmail: string): Promise<void> {
    console.log('Permission Change Audit (stub):', { userEmail, resource, oldPermissions, newPermissions, adminEmail })
  }

  async logSecurityEvent(message: string, severity: AuditSeverity, details?: Record<string, unknown>): Promise<void> {
    console.log('Security Event Audit (stub):', { message, severity, details })
  }

  async getAuditLogs(filters?: Record<string, unknown>, pagination?: { page: number; limit: number }) {
    console.log('Get Audit Logs (stub):', { filters, pagination })
    return []
  }

  async getAuditStats() {
    console.log('Get Audit Stats (stub)')
    return {
      totalEvents: 0,
      failedLogins: 0,
      successfulEvents: 0,
      actionsByType: [],
      eventsByDay: []
    }
  }
}

export const auditLogger = AuditLogger.getInstance()

export function useAuditLogger() {
  return auditLogger
}

export default auditLogger
