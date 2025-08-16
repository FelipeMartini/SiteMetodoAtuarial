// Implementação compatível delegando ao simple-logger
import simpleLogger, { auditLogger as _auditLogger } from '../simple-logger'

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
  // Campos adicionais usados em vários call-sites
  description?: string
  target?: string
  metadata?: Record<string, unknown>
  performedBy?: string
  changes?: Record<string, unknown>
  [key: string]: any
}

export const auditLogger = {
  async log(data: AuditData) {
    simpleLogger.info(`audit:${data.action}`, { ...data })
  },

  async logAuth(action: AuditAction, userEmail: string, success: boolean, details?: Record<string, unknown>) {
    _auditLogger.userCreated?.(userEmail, userEmail, details as any)
  },

  async logLogout(userEmail: string, details?: Record<string, unknown>) {
    simpleLogger.info('audit:logout', { userEmail, ...details })
  },

  async logAccess(userEmail: string, resource: string, granted: boolean, details?: Record<string, unknown>) {
    _auditLogger.apiAccess?.(userEmail || 'unknown', 'GET', resource, details as any)
  },

  async logDataAccess(userEmail: string, resource: string, action: string, details?: Record<string, unknown>) {
    simpleLogger.info('audit:data_access', { userEmail, resource, action, ...details })
  },

  async logUserManagement(action: string, targetUserEmail: string, adminEmail: string, details?: Record<string, unknown>) {
    simpleLogger.info('audit:user_management', { action, targetUserEmail, adminEmail, ...details })
  },

  async logPermissionChange(userEmail: string, resource: string, oldPermissions: unknown, newPermissions: unknown, adminEmail: string) {
    simpleLogger.info('audit:permission_change', { userEmail, resource, oldPermissions, newPermissions, adminEmail })
  },

  async logSecurityEvent(message: string, severity: AuditSeverity, details?: Record<string, unknown>) {
    simpleLogger.warn(`security:${severity}`, { message, ...details })
  },

  async getAuditLogs(_filters?: Record<string, unknown>, _pagination?: { page: number; limit: number }) {
    // FUTURO: implementar consulta real (ex: Prisma AccessLog) com paginação
    return [] as any
  },

  async getAuditStats() {
    return { totalEvents: 0 } as any
  }
}

export function useAuditLogger() { return auditLogger }

export default auditLogger
