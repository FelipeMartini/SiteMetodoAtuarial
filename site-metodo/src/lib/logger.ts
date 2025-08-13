// Logger compatibility shim para build
// Importa logger simples e cria interface compatível

import logger from '@libs/logger-simple'

// Interfaces de compatibilidade
export interface LogMeta {
  [key: string]: unknown
}

// Classe de compatibilidade para estruturedLogger
class StructuredLogger {
  info(message: string, meta?: Record<string, unknown>) {
    logger.info(message, meta)
  }

  error(message: string, meta?: Record<string, unknown>) {
    logger.error(message, meta)
  }

  warn(message: string, meta?: Record<string, unknown>) {
    logger.warn(message, meta)
  }

  debug(message: string, meta?: Record<string, unknown>) {
    logger.debug(message, meta)
  }

  // Métodos específicos que eram usados antes
  auth(action: string, meta?: Record<string, unknown>) {
    logger.info(`AUTH: ${action}`, meta)
  }

  audit(action: string, meta?: Record<string, unknown>) {
    logger.info(`AUDIT: ${action}`, meta)
  }

  security(message: string, level: string, meta?: Record<string, unknown>) {
    logger.warn(`SECURITY [${level}]: ${message}`, meta)
  }

  http(message: string, meta?: Record<string, unknown>) {
    logger.info(`HTTP: ${message}`, meta)
  }

  performance(message: string, meta?: Record<string, unknown>) {
    logger.info(`PERF: ${message}`, meta)
  }

  static getInstance(): StructuredLogger {
    return new StructuredLogger()
  }
}

// Exports de compatibilidade
export const structuredLogger = new StructuredLogger()
export default structuredLogger

// Logger de performance
export const performanceLogger = {
  time: (label: string) => {
    logger.debug(`PERF START: ${label}`)
  },
  timeEnd: (label: string) => {
    logger.debug(`PERF END: ${label}`)
  },
  api: (
    pathname: string, 
    method: string, 
    responseTime: number, 
    status: number, 
    meta?: Record<string, unknown>
  ) => {
    logger.info(`API: ${method} ${pathname} - ${status} (${responseTime}ms)`, meta)
  }
}

// Helpers de log específicos
export const logHelpers = {
  login: (userId: string, meta?: LogMeta) => structuredLogger.auth('login', { ...meta, userId }),
  logout: (userId: string, meta?: LogMeta) => structuredLogger.auth('logout', { ...meta, userId }),
  register: (email: string, meta?: LogMeta) =>
    structuredLogger.auth('register', { ...meta, email }),
  authenticationFailed: (email: string, reason: string, meta?: LogMeta) =>
    structuredLogger.security('authentication_failed', 'medium', { ...meta, email, reason }),
  userCreated: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    structuredLogger.audit('user_created', { ...meta, performedBy, targetUser }),
  userUpdated: (
    performedBy: string,
    targetUser: string,
    changes: Record<string, unknown>,
    meta?: LogMeta
  ) => structuredLogger.audit('user_updated', { ...meta, performedBy, targetUser, changes }),
}

export { StructuredLogger }
