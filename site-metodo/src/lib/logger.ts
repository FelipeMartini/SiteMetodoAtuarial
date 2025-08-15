// Shim: re-exporta o logger canônico `logger-simple`
// Mantém compatibilidade para imports que usavam `@/lib/logger`
import logger, { LOG_LEVELS } from './logger-simple'

export type LogMeta = Record<string, unknown>

export const structuredLogger = {
  info: (m: string, meta?: LogMeta) => logger.info(m, meta),
  warn: (m: string, meta?: LogMeta) => logger.warn(m, meta),
  error: (m: string, meta?: LogMeta) => logger.error(m, meta),
  debug: (m: string, meta?: LogMeta) => logger.debug(m, meta),
  auth: (action: string, meta?: LogMeta) => logger.info(`AUTH: ${action}`, meta),
  audit: (action: string, meta?: LogMeta) => logger.info(`AUDIT: ${action}`, meta),
  security: (msg: string, level: string, meta?: LogMeta) => logger.warn(`SECURITY [${level}]: ${msg}`, meta),
  http: (msg: string, meta?: LogMeta) => logger.info(`HTTP: ${msg}`, meta),
  performance: (msg: string, meta?: LogMeta) => logger.info(`PERF: ${msg}`, meta),
}

export default structuredLogger

export const performanceLogger = {
  time: (label: string) => logger.debug(`PERF START: ${label}`),
  timeEnd: (label: string) => logger.debug(`PERF END: ${label}`),
  api: (pathname: string, method: string, responseTime: number, status: number, meta?: LogMeta) =>
    logger.info(`API: ${method} ${pathname} - ${status} (${responseTime}ms)`, meta),
}

export const logHelpers = {
  login: (userId: string, meta?: LogMeta) => structuredLogger.auth('login' as any, { ...meta, userId }),
  logout: (userId: string, meta?: LogMeta) => structuredLogger.auth('logout' as any, { ...meta, userId }),
  register: (email: string, meta?: LogMeta) => structuredLogger.auth('register' as any, { ...meta, email }),
  authenticationFailed: (email: string, reason: string, meta?: LogMeta) =>
    structuredLogger.security('authentication_failed' as any, 'medium', { ...meta, email, reason }),
  userCreated: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    structuredLogger.audit('user_created' as any, { ...meta, performedBy, targetUser }),
}

export { LOG_LEVELS }
