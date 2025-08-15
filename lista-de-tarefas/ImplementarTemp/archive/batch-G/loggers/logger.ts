// Arquivo arquivado: logger.ts (compat shim)
// Movido para archive em batch-G. Preserva a versão de compatibilidade antiga.

// Conteúdo original preservado como histórico.
import logger from '@libs/logger-simple'

export interface LogMeta { [key: string]: unknown }

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

export const structuredLogger = new StructuredLogger()
export default structuredLogger

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

export const logHelpers = {
  login: (userId: string, meta?: LogMeta) => structuredLogger.auth('login', { ...meta, userId }),
  logout: (userId: string, meta?: LogMeta) => structuredLogger.auth('logout', { ...meta, userId }),
  register: (email: string, meta?: LogMeta) =>
    structuredLogger.auth('register', { ...meta, email }),
  authenticationFailed: (email: string, reason: string, meta?: LogMeta) =>
    structuredLogger.security('authentication_failed', 'medium', { ...meta, email, reason }),
  userCreated: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    structuredLogger.audit('user_created', { ...meta, performedBy, targetUser }),
}
