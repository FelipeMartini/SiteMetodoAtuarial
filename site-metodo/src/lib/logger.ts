import winston from 'winston'
import { format } from 'winston'
import path from 'path'

// Definir níveis de log
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  audit: 4,
  debug: 5,
}

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  audit: 'cyan',
  debug: 'blue',
}

// Adicionar cores aos níveis
winston.addColors(logColors)

// Formato para desenvolvimento
const devFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.colorize({ all: true }),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
)

// Formato para produção (JSON estruturado)
const prodFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json(),
  format.printf((info) => {
    return JSON.stringify({
      timestamp: info.timestamp,
      level: info.level,
      message: info.message,
      service: 'metodo-atuarial',
      environment: process.env.NODE_ENV,
      ...(info.meta && typeof info.meta === 'object' ? info.meta : {}),
    })
  })
)

// Criar diretório de logs se não existir
const logsDir = path.join(process.cwd(), 'logs')

// Configurar transports
const transports: winston.transport[] = [
  // Console sempre ativo
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  }),
]

// Em produção, adicionar file transports
if (process.env.NODE_ENV === 'production') {
  transports.push(
    // Log de erros
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: prodFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Log de auditoria
    new winston.transports.File({
      filename: path.join(logsDir, 'audit.log'),
      level: 'audit',
      format: prodFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
    
    // Log combinado
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: prodFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )
}

// Criar logger principal
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  levels: logLevels,
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
    }),
  ],
})

// Tipo para metadados estruturados
export interface LogMeta {
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  endpoint?: string
  method?: string
  statusCode?: number
  responseTime?: number
  error?: Error | string
  action?: string
  resource?: string
  changes?: Record<string, unknown>
  [key: string]: unknown
}

// Classe Logger estruturado
export class StructuredLogger {
  private static instance: StructuredLogger
  private logger: winston.Logger

  private constructor() {
    this.logger = logger
  }

  public static getInstance(): StructuredLogger {
    if (!StructuredLogger.instance) {
      StructuredLogger.instance = new StructuredLogger()
    }
    return StructuredLogger.instance
  }

  // Logs de sistema
  public info(message: string, meta?: LogMeta) {
    this.logger.info(message, { meta })
  }

  public warn(message: string, meta?: LogMeta) {
    this.logger.warn(message, { meta })
  }

  public error(message: string, error?: Error | string, meta?: LogMeta) {
    this.logger.error(message, { 
      meta: { 
        ...meta, 
        error: error instanceof Error ? error.stack : error 
      }
    })
  }

  public debug(message: string, meta?: LogMeta) {
    this.logger.debug(message, { meta })
  }

  // Logs HTTP
  public http(message: string, meta?: LogMeta) {
    this.logger.http(message, { meta })
  }

  // Logs de auditoria
  public audit(action: string, meta: LogMeta & { performedBy: string }) {
    this.logger.log('audit', `Audit: ${action}`, { 
      meta: { 
        ...meta, 
        action,
        auditType: 'user_action',
        timestamp: new Date().toISOString()
      }
    })
  }

  // Logs de autenticação
  public auth(event: 'login' | 'logout' | 'register' | 'password_reset', meta: LogMeta) {
    this.logger.info(`Auth: ${event}`, { 
      meta: { 
        ...meta, 
        authEvent: event,
        category: 'authentication'
      }
    })
  }

  // Logs de performance
  public performance(endpoint: string, responseTime: number, meta?: LogMeta) {
    const level = responseTime > 1000 ? 'warn' : 'info'
    this.logger.log(level, `Performance: ${endpoint} took ${responseTime}ms`, {
      meta: {
        ...meta,
        endpoint,
        responseTime,
        category: 'performance'
      }
    })
  }

  // Logs de segurança
  public security(event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: LogMeta) {
    const level = severity === 'critical' ? 'error' : severity === 'high' ? 'warn' : 'info'
    this.logger.log(level, `Security: ${event}`, {
      meta: {
        ...meta,
        securityEvent: event,
        severity,
        category: 'security'
      }
    })
  }

  // Log de mudanças no banco de dados
  public database(operation: 'CREATE' | 'UPDATE' | 'DELETE', table: string, meta?: LogMeta) {
    this.logger.info(`Database: ${operation} on ${table}`, {
      meta: {
        ...meta,
        dbOperation: operation,
        table,
        category: 'database'
      }
    })
  }

  // Getter para acesso direto ao winston logger
  public get raw(): winston.Logger {
    return this.logger
  }
}

// Instância singleton
export const structuredLogger = StructuredLogger.getInstance()

// Export padrão para compatibilidade
export default structuredLogger

// Helpers para contextos específicos
export const authLogger = {
  login: (userId: string, meta?: LogMeta) => 
    structuredLogger.auth('login', { ...meta, userId }),
  logout: (userId: string, meta?: LogMeta) => 
    structuredLogger.auth('logout', { ...meta, userId }),
  register: (email: string, meta?: LogMeta) => 
    structuredLogger.auth('register', { ...meta, email }),
  failed: (email: string, reason: string, meta?: LogMeta) => 
    structuredLogger.security('authentication_failed', 'medium', { ...meta, email, reason }),
}

export const auditLogger = {
  userCreated: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    structuredLogger.audit('user_created', { ...meta, performedBy, targetUser }),
  userUpdated: (performedBy: string, targetUser: string, changes: Record<string, any>, meta?: LogMeta) =>
    structuredLogger.audit('user_updated', { ...meta, performedBy, targetUser, changes }),
  userDeleted: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    structuredLogger.audit('user_deleted', { ...meta, performedBy, targetUser }),
  roleChanged: (performedBy: string, targetUser: string, fromRole: string, toRole: string, meta?: LogMeta) =>
    structuredLogger.audit('role_changed', { ...meta, performedBy, targetUser, fromRole, toRole }),
  apiAccess: (userId: string, method: string, endpoint: string, meta?: LogMeta) =>
    structuredLogger.audit('api_access', { ...meta, performedBy: userId, method, endpoint }),
}

export const performanceLogger = {
  api: (endpoint: string, method: string, responseTime: number, statusCode: number, meta?: LogMeta) =>
    structuredLogger.performance(endpoint, responseTime, { ...meta, method, statusCode }),
  database: (query: string, duration: number, meta?: LogMeta) =>
    structuredLogger.performance(`Database Query`, duration, { ...meta, query }),
}

export const securityLogger = {
  suspiciousActivity: (event: string, meta?: LogMeta) =>
    structuredLogger.security(event, 'high', meta),
  accessDenied: (resource: string, meta?: LogMeta) =>
    structuredLogger.security('access_denied', 'medium', { ...meta, resource }),
  dataExport: (performedBy: string, dataType: string, meta?: LogMeta) =>
    structuredLogger.security('data_export', 'medium', { ...meta, performedBy, dataType }),
}
