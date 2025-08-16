/**
 * Logger de auditoria que delega para o sistema de logging com banco de dados
 * Mantém compatibilidade com a interface anterior enquanto usa o novo sistema
 */
import DatabaseLogger, { type LogContext, type AuditLogData, type SystemLogData } from '../logging/database-logger';
import { structuredLogger } from '@/lib/logger'

// Interface de compatibilidade para auditoria
export interface AuditEvent {
  action: string;
  resource: string;
  userId?: string;
  details?: any;
  metadata?: any;
  success?: boolean;
  error?: string;
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface AuditLogResponse {
  logs: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Enums de compatibilidade
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
  action: AuditAction;
  severity: AuditSeverity;
  success: boolean;
  message?: string;
  userId?: string;
  userEmail?: string;
  resource?: string;
  details?: Record<string, unknown>;
  description?: string;
  target?: string;
  metadata?: Record<string, unknown>;
  performedBy?: string;
  changes?: Record<string, unknown>;
  [key: string]: any;
}

/**
 * Sistema de auditoria com logging em banco de dados
 */
export class AuditLogger {
  /**
   * Registra um evento de auditoria
   */
  static async logEvent(event: AuditEvent, context?: LogContext): Promise<void> {
    try {
      // Mapeia a ação para os tipos padrão
      const actionMapping: Record<string, AuditLogData['action']> = {
        'create': 'CREATE',
        'update': 'UPDATE', 
        'delete': 'DELETE',
        'view': 'VIEW',
        'access': 'ACCESS',
        'login': 'LOGIN',
        'logout': 'LOGOUT',
      };

      const auditData: AuditLogData = {
        action: actionMapping[event.action.toLowerCase()] || 'ACCESS',
        resource: event.resource,
        success: event.success,
        errorMessage: event.error,
        newValues: event.details,
        context: {
          ...context,
          userId: event.userId || context?.userId,
          metadata: { ...event.metadata, ...context?.metadata },
        },
      };

      await DatabaseLogger.logAudit(auditData);

      // Se for um erro, também registra no log de sistema
      if (!event.success && event.error) {
        const systemData: SystemLogData = {
          level: 'ERROR',
          message: `Falha na operação: ${event.action} ${event.resource}`,
          module: 'audit',
          operation: event.action,
          error: event.error,
          context,
        };

        await DatabaseLogger.logSystem(systemData);
      }
    } catch (error) {
    structuredLogger.error('[AuditLogger] Falha ao registrar evento', { error: String(error) });
      // Fallback para console
    structuredLogger.info(`[AUDIT] ${event.action} ${event.resource}`, {
        userId: event.userId,
        success: event.success,
        error: event.error,
      });
    }
  }

  /**
   * Obtém logs de auditoria com paginação
   */
  static async getAuditLogs(params: GetAuditLogsParams = {}): Promise<AuditLogResponse> {
    try {
      return await DatabaseLogger.getAuditLogs({
        page: params.page,
        limit: params.limit,
        action: params.action,
        resource: params.resource,
        userId: params.userId,
        startDate: params.startDate,
        endDate: params.endDate,
      });
    } catch (error) {
    structuredLogger.error('[AuditLogger] Falha ao buscar logs', { error: String(error) });
      return {
        logs: [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 50,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  /**
   * Obtém estatísticas de auditoria
   */
  static async getAuditStats() {
    try {
      const [recentErrors, totalLogs] = await Promise.all([
        DatabaseLogger.getRecentErrors(5),
        DatabaseLogger.getAuditLogs({ limit: 1 }),
      ]);

      return {
        recentErrors: recentErrors.length,
        totalLogs: totalLogs.pagination.total,
        lastLogDate: totalLogs.logs[0]?.createdAt || null,
      };
    } catch (error) {
    structuredLogger.error('[AuditLogger] Falha ao obter estatísticas', { error: String(error) });
      return {
        recentErrors: 0,
        totalLogs: 0,
        lastLogDate: null,
      };
    }
  }
}

// Compatibilidade com interface anterior
export const auditLogger = {
  async log(data: AuditData, context?: LogContext) {
    const actionMap: Record<AuditAction, string> = {
      [AuditAction.LOGIN_SUCCESS]: 'login',
      [AuditAction.LOGIN_FAILED]: 'login',
      [AuditAction.ACCESS_GRANTED]: 'access',
      [AuditAction.ACCESS_DENIED]: 'access',
      [AuditAction.DATA_ACCESS]: 'access',
      [AuditAction.PERMISSION_CHANGE]: 'update',
      [AuditAction.USER_CREATE]: 'create',
      [AuditAction.USER_UPDATE]: 'update',
      [AuditAction.USER_DELETE]: 'delete',
    };

    await AuditLogger.logEvent({
      action: actionMap[data.action] || 'access',
      resource: data.resource || 'system',
      userId: data.userId,
      success: data.success,
      details: data.details,
      metadata: {
        severity: data.severity,
        message: data.message,
        userEmail: data.userEmail,
        description: data.description,
        target: data.target,
        performedBy: data.performedBy,
        changes: data.changes,
        ...data.metadata,
      },
    }, context);
  },

  async logAuth(action: AuditAction, userEmail: string, success: boolean, details?: Record<string, unknown>, context?: LogContext) {
    await this.log({
      action,
      severity: success ? AuditSeverity.LOW : AuditSeverity.HIGH,
      success,
      userEmail,
      resource: 'authentication',
      details,
    }, context);
  },

  async logLogout(userEmail: string, _details?: Record<string, unknown>, context?: LogContext) {
    await AuditLogger.logEvent({
      action: 'logout',
      resource: 'user_session',
      userId: userEmail,
      success: true,
      metadata: { logoutAction: true },
    }, context);
  },

  async logAccess(userEmail: string, resource: string, granted: boolean, details?: Record<string, unknown>, context?: LogContext) {
    await AuditLogger.logEvent({
      action: 'access',
      resource,
      userId: userEmail,
      success: granted,
      details,
      metadata: { resourceAccess: true },
    }, context);
  },

  async logDataAccess(userEmail: string, resource: string, action: string, details?: Record<string, unknown>, context?: LogContext) {
    await AuditLogger.logEvent({
      action: 'access',
      resource,
      userId: userEmail,
      success: true,
      details,
      metadata: { dataAccessType: action },
    }, context);
  },

  async logUserManagement(action: string, targetUserEmail: string, adminEmail: string, details?: Record<string, unknown>, context?: LogContext) {
    await AuditLogger.logEvent({
      action,
      resource: 'user',
      userId: adminEmail,
      success: true,
      details,
      metadata: { targetUser: targetUserEmail, adminAction: true },
    }, context);
  },

  async logPermissionChange(userEmail: string, resource: string, oldPermissions: unknown, newPermissions: unknown, adminEmail: string, context?: LogContext) {
    const auditData: AuditLogData = {
      action: 'UPDATE',
      resource: 'permissions',
      oldValues: { userEmail, resource, permissions: oldPermissions },
      newValues: { userEmail, resource, permissions: newPermissions },
      success: true,
      context: {
        ...context,
        userId: adminEmail,
        metadata: { permissionUpdate: true, ...context?.metadata },
      },
    };

    await DatabaseLogger.logAudit(auditData);
  },

  async logSecurityEvent(message: string, severity: AuditSeverity, details?: Record<string, unknown>, context?: LogContext) {
    await DatabaseLogger.logSystem({
      level: severity === AuditSeverity.CRITICAL ? 'ERROR' : 'WARN',
      message: `Evento de segurança: ${message}`,
      module: 'security',
      operation: 'security_event',
      context: {
        ...context,
        metadata: { severity, ...details },
      },
    });
  },

  async getAuditLogs(_filters?: Record<string, unknown>, _pagination?: { page: number; limit: number }) {
    return await AuditLogger.getAuditLogs({
      page: _pagination?.page,
      limit: _pagination?.limit,
      ..._filters,
    });
  },

  async getAuditStats() {
    return await AuditLogger.getAuditStats();
  },
};

export function useAuditLogger() { 
  return auditLogger;
}

// Exporta compatibilidade com implementação anterior
export default auditLogger;
