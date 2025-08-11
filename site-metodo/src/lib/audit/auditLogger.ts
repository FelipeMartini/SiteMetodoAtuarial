/**
 * Sistema de Auditoria Moderno - Audit Logging
 * 
 * Registra todas as ações importantes do sistema para auditoria,
 * segurança e compliance. Baseado em melhores práticas de segurança.
 */

import { prisma } from '@/lib/prisma';
import { AuditAction } from '@prisma/client';

/**
 * Tipos de eventos de auditoria (usando enum do Prisma)
 */
export { AuditAction as AuditEventType } from '@prisma/client';

/**
 * Níveis de severidade
 */
export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Interface para dados de auditoria
 */
export interface AuditLogData {
  action: AuditAction;
  severity: AuditSeverity;
  userId?: string;
  userEmail?: string;
  userRole?: string[] | string | null;
  description?: string;
  target?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success?: boolean;
  errorMessage?: string;
}

/**
 * Sistema de auditoria principal
 */
export class AuditLogger {
  private static instance: AuditLogger;
  
  private constructor() {}
  
  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Registra um evento de auditoria
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      const details = {
        description: data.description,
        severity: data.severity,
        userEmail: data.userEmail,
        userRole: Array.isArray(data.userRole) ? data.userRole.join(',') : data.userRole,
        sessionId: data.sessionId,
        errorMessage: data.errorMessage,
        metadata: data.metadata,
      };

      await prisma.auditLog.create({
        data: {
          action: data.action,
          userId: data.userId,
          target: data.target,
          details: JSON.stringify(details),
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          success: data.success ?? true,
        },
      });

      // Para eventos críticos, também logar no console
      if (data.severity === AuditSeverity.CRITICAL || data.severity === AuditSeverity.HIGH) {
        console.warn(`[AUDIT-${data.severity}] ${data.action}: ${data.description}`, {
          userId: data.userId,
          userEmail: data.userEmail,
          metadata: data.metadata,
        });
      }
    } catch (_error) {
      console.error('[AUDIT] ❌ Failed to log audit event:', error);
      // Em caso de erro no sistema de auditoria, logar no console como fallback
      console.error('[AUDIT-FALLBACK]', JSON.stringify(data, null, 2));
    }
  }

  /**
   * Helpers para eventos comuns de auditoria
   */

  async logLogin(userId: string, userEmail: string, userRole: string[] | string | null, success: boolean, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      action: success ? AuditAction.LOGIN_SUCCESS : AuditAction.LOGIN_FAILED,
      severity: success ? AuditSeverity.LOW : AuditSeverity.MEDIUM,
      userId: success ? userId : undefined,
      userEmail,
      userRole: success ? userRole : null,
      description: success ? `User logged in successfully` : `Failed login attempt`,
      ipAddress,
      userAgent,
      success,
    });
  }

  async logLogout(userId: string, userEmail: string, userRole: string[] | string | null, ipAddress?: string): Promise<void> {
    await this.log({
      action: AuditAction.LOGOUT,
      severity: AuditSeverity.LOW,
      userId,
      userEmail,
      userRole,
      description: 'User logged out',
      ipAddress,
      success: true,
    });
  }

  async logAccessDenied(userId: string | undefined, userEmail: string | undefined, userRole: string[] | string | null, resource: string, requiredRole: string[] | string, ipAddress?: string): Promise<void> {
    await this.log({
      action: AuditAction.LOGIN_FAILED, // Usando LOGIN_FAILED como proxy para access denied
      severity: AuditSeverity.MEDIUM,
      userId,
      userEmail,
      userRole,
      description: `Access denied to resource: ${resource}`,
      target: resource,
      metadata: {
        requiredRole,
        userRole,
        reason: 'insufficient_permissions',
      },
      ipAddress,
      success: false,
    });
  }

  async logAccessGranted(userId: string, userEmail: string, userRole: string[] | string | null, resource: string, ipAddress?: string): Promise<void> {
    await this.log({
      action: AuditAction.LOGIN_SUCCESS, // Usando LOGIN_SUCCESS como proxy para access granted
      severity: AuditSeverity.LOW,
      userId,
      userEmail,
      userRole,
      description: `Access granted to resource: ${resource}`,
      target: resource,
      ipAddress,
      success: true,
    });
  }

  async logUserCreation(adminUserId: string, adminEmail: string, adminRole: string[] | string | null, newUserId: string, newUserEmail: string, newUserRole: string[] | string | null): Promise<void> {
    await this.log({
      action: AuditAction.USER_CREATE,
      severity: AuditSeverity.MEDIUM,
      userId: adminUserId,
      userEmail: adminEmail,
      userRole: adminRole,
      description: `Created new user: ${newUserEmail}`,
      target: newUserId,
      metadata: {
        newUserEmail,
        newUserRole,
      },
      success: true,
    });
  }

  async logRoleChange(adminUserId: string, adminEmail: string, adminRole: string[] | string | null, targetUserId: string, targetUserEmail: string, oldRole: string[] | string | null, newRole: string[] | string | null): Promise<void> {
    await this.log({
      action: AuditAction.ROLE_CHANGE,
      severity: AuditSeverity.HIGH,
      userId: adminUserId,
      userEmail: adminEmail,
      userRole: adminRole,
      description: `Changed user role for: ${targetUserEmail}`,
      target: targetUserId,
      metadata: {
        targetUserEmail,
        oldRole,
        newRole,
      },
      success: true,
    });
  }

  async logSuspiciousActivity(userId: string | undefined, userEmail: string | undefined, description: string, metadata?: Record<string, unknown>, ipAddress?: string): Promise<void> {
    await this.log({
      action: AuditAction.LOGIN_FAILED, // Usando LOGIN_FAILED como proxy para atividade suspeita
      severity: AuditSeverity.HIGH,
      userId,
      userEmail,
      description: `Suspicious activity detected: ${description}`,
      metadata,
      ipAddress,
      success: false,
    });
  }

  async logSystemError(error: Error, userId?: string, userEmail?: string, context?: string): Promise<void> {
    await this.log({
      action: AuditAction.LOGIN_FAILED, // Usando LOGIN_FAILED como proxy para erros do sistema
      severity: AuditSeverity.MEDIUM,
      userId,
      userEmail,
      description: `System error occurred${context ? ` in ${context}` : ''}`,
      errorMessage: error.message,
      metadata: {
        stack: error.stack,
        context,
        type: 'system_error',
      },
      success: false,
    });
  }

  /**
   * Busca logs de auditoria com filtros
   */
  async getLogs(filters?: {
    action?: AuditAction;
    userId?: string;
    userEmail?: string;
    startDate?: Date;
    endDate?: Date;
    success?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const where: {
      action?: AuditAction;
      userId?: string;
      success?: boolean;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (filters?.action) where.action = filters.action;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.success !== undefined) where.success = filters.success;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    return await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            name: true,
            roleType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 100,
      skip: filters?.offset || 0,
    });
  }

  /**
   * Obtém estatísticas de auditoria
   */
  async getStats(startDate?: Date, endDate?: Date) {
    const where: {
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      totalEvents,
      failedEvents,
      eventsByAction,
    ] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.count({ where: { ...where, success: false } }),
      prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }),
    ]);

    return {
      totalEvents,
      failedEvents,
      successRate: totalEvents > 0 ? ((totalEvents - failedEvents) / totalEvents) * 100 : 100,
      eventsByAction,
    };
  }
}

// Instância singleton para uso global
export const auditLogger = AuditLogger.getInstance();

/**
 * Hook para facilitar uso em componentes React
 */
export function useAuditLogger() {
  return auditLogger;
}

export default auditLogger;
