import prisma from '@/lib/prisma';

// Permite desabilitar gravação em banco para builds locais/prerender
const DB_LOGS_DISABLED = process.env.DISABLE_DB_LOGS === 'true'
// Import dinâmico de headers apenas quando disponível (ambiente server app router)
let getHeaders: (() => Promise<any>) | null = null;
try {
  // Usar dynamic import para evitar require
  import('next/headers').then(mod => {
    if (mod && typeof mod.headers === 'function') {
      getHeaders = mod.headers;
    }
  }).catch(() => {
    // Headers não disponível em cliente
  });
} catch (_e) {
  // Ignora em ambientes onde next/headers não está disponível
}

// Tipos para logs estruturados
export interface LogContext {
  userId?: string;
  sessionId?: string;
  correlationId?: string;
  ip?: string;
  userAgent?: string;
  module?: string;
  operation?: string;
  metadata?: any;
  duration?: number;
}

export interface SystemLogData {
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  module?: string;
  operation?: string;
  error?: string;
  context?: LogContext;
}

export interface AuditLogData {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'ACCESS' | 'LOGIN' | 'LOGOUT';
  resource: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  success?: boolean;
  errorMessage?: string;
  context?: LogContext;
}

export interface PerformanceLogData {
  operation: string;
  method?: string;
  path?: string;
  duration: number;
  memoryUsage?: number;
  cpuUsage?: number;
  dbQueries?: number;
  cacheHits?: number;
  cacheMisses?: number;
  context?: LogContext;
}

/**
 * Sistema completo de logging com banco de dados usando Prisma
 * Substitui a implementação baseada em arquivos
 */
export class DatabaseLogger {
  /**
   * Obtém informações de contexto da requisição HTTP
   */
  private static async getRequestContext(): Promise<LogContext> {
    try {
  const headersList = getHeaders ? await getHeaders() : null;
  const forwarded = headersList?.get('x-forwarded-for');
  const realIp = headersList?.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  const userAgent = headersList?.get('user-agent') || 'unknown';

      return {
        ip,
        userAgent,
      };
    } catch (_error) {
      return {};
    }
  }

  /**
   * Gera um ID de correlação único para rastrear operações relacionadas
   */
  static generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log de sistema (informações gerais, erros, debug)
   */
  static async logSystem(data: SystemLogData): Promise<void> {
    try {
      if (DB_LOGS_DISABLED) {
        // durante build/prerender, não tentamos gravar no DB
        console.debug('[DatabaseLogger] DB_LOGS_DISABLED active - skipping logSystem', { message: data.message })
        return
      }
      const requestContext = await this.getRequestContext();
      const context = { ...requestContext, ...data.context };

      await prisma.systemLog.create({
        data: {
          level: data.level,
          message: data.message,
          module: data.module || context.module,
          operation: data.operation || context.operation,
          userId: context.userId,
          sessionId: context.sessionId,
          correlationId: context.correlationId,
          metadata: context.metadata ? JSON.parse(JSON.stringify(context.metadata)) : null,
          error: data.error,
          ip: context.ip,
          userAgent: context.userAgent,
          duration: context.duration,
        },
      });
    } catch (_error) {
      console.error('[DatabaseLogger] Falha ao salvar log de sistema:', _error);
      // Fallback para console se banco falhar
      console.log(`[${data.level}] ${data.message}`, { 
        module: data.module, 
        operation: data.operation,
        error: data.error 
      });
    }
  }

  /**
   * Log de auditoria (ações do usuário, mudanças de dados)
   */
  static async logAudit(data: AuditLogData): Promise<void> {
    try {
      if (DB_LOGS_DISABLED) {
        console.debug('[DatabaseLogger] DB_LOGS_DISABLED active - skipping logAudit', { action: data.action, resource: data.resource })
        return
      }
      const requestContext = await this.getRequestContext();
      const context = { ...requestContext, ...data.context };

      await prisma.auditLog.create({
        data: {
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          userId: context.userId,
          sessionId: context.sessionId,
          correlationId: context.correlationId,
          oldValues: data.oldValues ? JSON.parse(JSON.stringify(data.oldValues)) : null,
          newValues: data.newValues ? JSON.parse(JSON.stringify(data.newValues)) : null,
          metadata: context.metadata ? JSON.parse(JSON.stringify(context.metadata)) : null,
          ip: context.ip,
          userAgent: context.userAgent,
          success: data.success ?? true,
          errorMessage: data.errorMessage,
        },
      });
    } catch (error) {
      console.error('[DatabaseLogger] Falha ao salvar log de auditoria:', error);
      // Fallback para console se banco falhar
      console.log(`[AUDIT] ${data.action} ${data.resource}`, {
        resourceId: data.resourceId,
        success: data.success,
      });
    }
  }

  /**
   * Log de performance (tempos de resposta, uso de recursos)
   */
  static async logPerformance(data: PerformanceLogData): Promise<void> {
    try {
      if (DB_LOGS_DISABLED) {
        console.debug('[DatabaseLogger] DB_LOGS_DISABLED active - skipping logPerformance', { operation: data.operation })
        return
      }
      const requestContext = await this.getRequestContext();
      const context = { ...requestContext, ...data.context };

      await prisma.performanceLog.create({
        data: {
          operation: data.operation,
          method: data.method,
          path: data.path,
          userId: context.userId,
          sessionId: context.sessionId,
          correlationId: context.correlationId,
          duration: data.duration,
          memoryUsage: data.memoryUsage,
          cpuUsage: data.cpuUsage,
          dbQueries: data.dbQueries,
          cacheHits: data.cacheHits,
          cacheMisses: data.cacheMisses,
          metadata: context.metadata ? JSON.parse(JSON.stringify(context.metadata)) : null,
          ip: context.ip,
          userAgent: context.userAgent,
        },
      });
    } catch (error) {
      console.error('[DatabaseLogger] Falha ao salvar log de performance:', error);
      // Fallback para console se banco falhar
      console.log(`[PERF] ${data.operation}: ${data.duration}ms`, {
        method: data.method,
        path: data.path,
      });
    }
  }

  /**
   * Consulta logs do sistema com paginação e filtros
   */
  static async getSystemLogs(options: {
    page?: number;
    limit?: number;
    level?: string;
    module?: string;
    operation?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    const { page = 1, limit = 50, level, module, operation, userId, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (level) where.level = level;
    if (module) where.module = module;
    if (operation) where.operation = operation;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    if (DB_LOGS_DISABLED) {
      return { logs: [], pagination: { page, limit, total: 0, totalPages: 0 } }
    }

    const [logs, total] = await Promise.all([
      prisma.systemLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.systemLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Consulta logs de auditoria com paginação e filtros
   */
  static async getAuditLogs(options: {
    page?: number;
    limit?: number;
    action?: string;
    resource?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    const { page = 1, limit = 50, action, resource, userId, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    if (DB_LOGS_DISABLED) {
      return { logs: [], pagination: { page, limit, total: 0, totalPages: 0 } }
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Consulta logs de performance com paginação e filtros
   */
  static async getPerformanceLogs(options: {
    page?: number;
    limit?: number;
    operation?: string;
    method?: string;
    minDuration?: number;
    maxDuration?: number;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    const { page = 1, limit = 50, operation, method, minDuration, maxDuration, userId, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (operation) where.operation = operation;
    if (method) where.method = method;
    if (userId) where.userId = userId;
    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) where.duration.gte = minDuration;
      if (maxDuration !== undefined) where.duration.lte = maxDuration;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    if (DB_LOGS_DISABLED) {
      return { logs: [], pagination: { page, limit, total: 0, totalPages: 0 } }
    }

    const [logs, total] = await Promise.all([
      prisma.performanceLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.performanceLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Métrica rápida - últimos erros
   */
  static async getRecentErrors(limit: number = 10) {
  if (DB_LOGS_DISABLED) return []
  return prisma.systemLog.findMany({
      where: { level: 'ERROR' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  }

  /**
   * Métrica rápida - operações mais lentas
   */
  static async getSlowestOperations(limit: number = 10) {
  if (DB_LOGS_DISABLED) return []
  return prisma.performanceLog.findMany({
      orderBy: { duration: 'desc' },
      take: limit,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  }

  /**
   * Limpa logs antigos (para manutenção)
   */
  static async cleanupOldLogs(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const [systemDeleted, auditDeleted, performanceDeleted] = await Promise.all([
      prisma.systemLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      }),
      prisma.auditLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      }),
      prisma.performanceLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      }),
    ]);

    return {
      systemLogsDeleted: systemDeleted.count,
      auditLogsDeleted: auditDeleted.count,
      performanceLogsDeleted: performanceDeleted.count,
      cutoffDate,
    };
  }
}

export { prisma };
export default DatabaseLogger;
