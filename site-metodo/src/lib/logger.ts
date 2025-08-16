// Re-exporta a facade de logging para manter compatibilidade com imports
// anteriores que usam `@/lib/logger`.
import facade, { performanceLogger as facadePerf, DatabaseLogger } from './logging/facade'
import { LOG_LEVELS } from './logger-simple'

export type LogMeta = Record<string, unknown>

export const structuredLogger = facade

export default structuredLogger

export const performanceLogger = facadePerf

export const logHelpers = {
  login: (userId: string, meta?: LogMeta) => structuredLogger.auth('login' as any, { ...meta, userId }),
  logout: (userId: string, meta?: LogMeta) => structuredLogger.auth('logout' as any, { ...meta, userId }),
  register: (email: string, meta?: LogMeta) => structuredLogger.auth('register' as any, { ...meta, email }),
  authenticationFailed: (email: string, reason: string, meta?: LogMeta) =>
    structuredLogger.security('authentication_failed' as any, 'medium', { ...meta, email, reason }),
  userCreated: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    structuredLogger.audit('user_created' as any, { ...meta, performedBy, targetUser }),
}

export { LOG_LEVELS, DatabaseLogger }
