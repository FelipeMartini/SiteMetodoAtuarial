/**
 * Facade de logging: expõe o DatabaseLogger e fornece um wrapper compatível
 * que não quebre imports existentes (structuredLogger, performanceLogger).
 * Em ambiente server, prefere persistir em banco via DatabaseLogger.
 * Em ambiente cliente ou quando o DB falhar, cai para o simpleLogger.
 */
import DatabaseLogger from './database-logger'
import simpleLogger from '../logger-simple'
import auditCompat from '@/lib/audit/auditLogger'

const isServer = typeof window === 'undefined'

export { DatabaseLogger }

export const databaseLogger = DatabaseLogger

// Wrapper compatível com a API usada pelo projeto
export const structuredLogger = {
  info: async (m: string, meta?: Record<string, unknown>) => {
    if (isServer) {
      try {
        await DatabaseLogger.logSystem({ level: 'INFO', message: m, module: meta?.module as any, operation: meta?.operation as any, context: { metadata: meta } })
        return
      } catch (e) {
        console.error('[structuredLogger] fallback INFO', e)
      }
    }
    simpleLogger.info(m, meta)
  },
  warn: async (m: string, meta?: Record<string, unknown>) => {
    if (isServer) {
      try {
        await DatabaseLogger.logSystem({ level: 'WARN', message: m, module: meta?.module as any, operation: meta?.operation as any, context: { metadata: meta } })
        return
      } catch (e) {
        console.error('[structuredLogger] fallback WARN', e)
      }
    }
    simpleLogger.warn(m, meta)
  },
  error: async (m: string, meta?: Record<string, unknown>) => {
    if (isServer) {
      try {
        await DatabaseLogger.logSystem({ level: 'ERROR', message: m, module: meta?.module as any, operation: meta?.operation as any, error: (meta && (meta.error as any)) || undefined, context: { metadata: meta } })
        return
      } catch (e) {
        console.error('[structuredLogger] fallback ERROR', e)
      }
    }
    simpleLogger.error(m, meta)
  },
  debug: async (m: string, meta?: Record<string, unknown>) => {
    if (!isServer) {
      simpleLogger.debug(m, meta)
      return
    }
    // Em server, grava como DEBUG se necessário
    try {
      await DatabaseLogger.logSystem({ level: 'DEBUG', message: m, context: { metadata: meta } })
    } catch (e) {
      console.debug('[structuredLogger] debug fallback', m, meta)
    }
  },

  auth: (action: string, meta?: Record<string, unknown>) => {
    // encaminha para simple logger (rápido) e para audit quando aplicável
    simpleLogger.info(`AUTH: ${action}`, meta)
    if (isServer) {
      // mapear para AuditLogData usando `context` para evitar violar o tipo
      DatabaseLogger.logAudit({ action: 'ACCESS', resource: meta?.resource as any || 'authentication', newValues: meta ? JSON.parse(JSON.stringify(meta)) : undefined, context: { userId: meta?.userId as any } as any }).catch(() => {})
    }
  },
  audit: (action: string, meta?: Record<string, unknown>) => {
    simpleLogger.info(`AUDIT: ${action}`, meta)
    if (isServer) {
      DatabaseLogger.logAudit({ action: 'ACCESS', resource: meta?.resource as any || 'system', newValues: meta ? JSON.parse(JSON.stringify(meta)) : undefined, context: { userId: meta?.userId as any } as any }).catch(() => {})
    }
  },
  security: (msg: string, level: string, meta?: Record<string, unknown>) => {
    // level: low/medium/high -> mapear
    simpleLogger.warn(`SECURITY [${level}]: ${msg}`, meta)
    if (isServer) {
      DatabaseLogger.logSystem({ level: level === 'CRITICAL' ? 'ERROR' : 'WARN', message: `SECURITY: ${msg}`, context: { metadata: meta } }).catch(() => {})
    }
  },
  http: (msg: string, meta?: Record<string, unknown>) => {
    simpleLogger.info(`HTTP: ${msg}`, meta)
    if (isServer) {
      DatabaseLogger.logSystem({ level: 'INFO', message: `HTTP: ${msg}`, context: { metadata: meta } }).catch(() => {})
    }
  },
  performance: (msg: string, meta?: Record<string, unknown>) => {
    simpleLogger.info(`PERF: ${msg}`, meta)
    if (isServer && meta && typeof (meta as any).duration === 'number') {
      DatabaseLogger.logPerformance({ operation: (meta as any).operation as any || msg, duration: (meta as any).duration as number, method: (meta as any).method as any, path: (meta as any).path as any, context: { metadata: meta } }).catch(() => {})
    }
  },
}

export const performanceLogger = {
  time: (label: string) => simpleLogger.debug(`PERF START: ${label}`),
  timeEnd: (label: string) => simpleLogger.debug(`PERF END: ${label}`),
  api: (pathname: string, method: string, responseTime: number, status: number, meta?: Record<string, unknown>) => {
    const payload = { operation: `${method} ${pathname}`, duration: responseTime, method, path: pathname, ...meta }
    structuredLogger.performance(`API: ${method} ${pathname} - ${status} (${responseTime}ms)`, payload)
  },
}

// Re-export do audit compat para casos que importam diretamente
export { auditCompat as auditLogger }

export default structuredLogger
