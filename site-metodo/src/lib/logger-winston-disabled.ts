// Arquivado: mover para lista-de-tarefas/ImplementarTemp/archive/batch-G/loggers
// Stub seguro para build — não contém dependências externas (winston)

// Arquivado: implementação antiga (winston) movida para
// lista-de-tarefas/ImplementarTemp/archive/batch-G/loggers/logger-winston-disabled.ts
// Este stub fornece a API mínima esperada sem depender de winston, para evitar que o
// build trave ao tentar carregar implementações pesadas durante a compilação.

export interface LogMeta {
  [key: string]: unknown
}

export const structuredLogger = {
  info: (_msg?: string, _meta?: LogMeta) => undefined as void,
  warn: (_msg?: string, _meta?: LogMeta) => undefined as void,
  error: (_msg?: string, _meta?: LogMeta) => undefined as void,
  debug: (_msg?: string, _meta?: LogMeta) => undefined as void,
  auth: (_action?: string, _meta?: LogMeta) => undefined as void,
  audit: (_action?: string, _meta?: LogMeta) => undefined as void,
  security: (_event?: string, _severity?: string, _meta?: LogMeta) => undefined as void,
  http: (_msg?: string, _meta?: LogMeta) => undefined as void,
  performance: (_endpoint?: string, _responseTime?: number, _meta?: LogMeta) => undefined as void,
}

// Export padrão para compatibilidade
export default structuredLogger

// Helpers para contextos específicos
export const authLogger = {
  login: (userId: string, meta?: LogMeta) => structuredLogger.auth('login', { ...meta, userId }),
  logout: (userId: string, meta?: LogMeta) => structuredLogger.auth('logout', { ...meta, userId }),
  register: (email: string, meta?: LogMeta) =>
    structuredLogger.auth('register', { ...meta, email }),
  failed: (email: string, reason: string, meta?: LogMeta) =>
    structuredLogger.security('authentication_failed', 'medium', { ...meta, email, reason }),
}

export const auditLogger = {
  userCreated: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    structuredLogger.audit('user_created', { ...meta, performedBy, targetUser }),
  userUpdated: (
    performedBy: string,
    targetUser: string,
    changes: Record<string, unknown>,
    meta?: LogMeta
  ) => structuredLogger.audit('user_updated', { ...meta, performedBy, targetUser, changes }),
  userDeleted: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    structuredLogger.audit('user_deleted', { ...meta, performedBy, targetUser }),
  roleChanged: (
    performedBy: string,
    targetUser: string,
    fromRole: string,
    toRole: string,
    meta?: LogMeta
  ) =>
    structuredLogger.audit('role_changed', { ...meta, performedBy, targetUser, fromRole, toRole }),
  apiAccess: (userId: string, method: string, endpoint: string, meta?: LogMeta) =>
    structuredLogger.audit('api_access', { ...meta, performedBy: userId, method, endpoint }),
}

export const performanceLogger = {
  api: (
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number,
    meta?: LogMeta
  ) => structuredLogger.performance(endpoint, responseTime, { ...meta, method, statusCode }),
  database: (query: string, duration: number, meta?: LogMeta) =>
  structuredLogger.performance(`Database Query`, duration, { ...(meta || {}), query } as any),
}

export const securityLogger = {
  suspiciousActivity: (event: string, meta?: LogMeta) =>
    structuredLogger.security(event, 'high', meta),
  accessDenied: (resource: string, meta?: LogMeta) =>
    structuredLogger.security('access_denied', 'medium', { ...meta, resource }),
  dataExport: (performedBy: string, dataType: string, meta?: LogMeta) =>
    structuredLogger.security('data_export', 'medium', { ...meta, performedBy, dataType }),
}
