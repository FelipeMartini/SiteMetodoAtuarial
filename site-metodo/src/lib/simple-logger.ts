/**
 * Logger simplificado que funciona no ambiente Next.js
 */

export interface LogMeta {
  [key: string]: Record<string, unknown>;
}

export interface LogEntry {
  level: string;
  message: string;
  meta?: LogMeta;
  timestamp: string;
}

class SimpleLogger {
  private static instance: SimpleLogger;

  private constructor() {}

  public static getInstance(): SimpleLogger {
    if (!SimpleLogger.instance) {
      SimpleLogger.instance = new SimpleLogger();
    }
    return SimpleLogger.instance;
  }

  private log(level: string, message: string, meta?: LogMeta) {
    const entry: LogEntry = {
      level,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };

    // No ambiente de desenvolvimento, log no console
    if (process.env.NODE_ENV === 'development') {
      const logMethod = level === 'error' ? console.error : 
                      level === 'warn' ? console.warn : 
                      console.log;
      
      logMethod(`[${level.toUpperCase()}] ${message}`, meta ? JSON.stringify(meta, null, 2) : '');
    }

    // Em produção, você pode enviar para um serviço de logging externo
    // Por exemplo: Sentry, LogRocket, etc.
  }

  public info(message: string, meta?: LogMeta) {
    this.log('info', message, meta);
  }

  public warn(message: string, meta?: LogMeta) {
    this.log('warn', message, meta);
  }

  public error(message: string, meta?: LogMeta) {
    this.log('error', message, meta);
  }

  public debug(message: string, meta?: LogMeta) {
    this.log('debug', message, meta);
  }

  // Logs específicos
  public audit(action: string, meta: LogMeta & { performedBy: string }) {
    this.log('audit', `Audit: ${action}`, meta);
  }

  public auth(event: string, meta: LogMeta) {
    this.log('info', `Auth: ${event}`, meta);
  }

  public performance(endpoint: string, responseTime: number, meta?: LogMeta) {
    const level = responseTime > 1000 ? 'warn' : 'info';
    this.log(level, `Performance: ${endpoint} took ${responseTime}ms`, meta);
  }

  public security(event: string, severity: string, meta?: LogMeta) {
    this.log('warn', `Security: ${event} (${severity})`, meta);
  }
}

// Instância singleton
export const simpleLogger = SimpleLogger.getInstance();

// Helpers para compatibilidade
export const authLogger = {
  login: (userId: string, meta?: LogMeta) => 
    simpleLogger.auth('login', { ...meta, userId }),
  logout: (userId: string, meta?: LogMeta) => 
    simpleLogger.auth('logout', { ...meta, userId }),
  register: (email: string, meta?: LogMeta) => 
    simpleLogger.auth('register', { ...meta, email }),
  failed: (email: string, reason: string, meta?: LogMeta) => 
    simpleLogger.security('authentication_failed', 'medium', { ...meta, email, reason }),
};

export const auditLogger = {
  userCreated: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    simpleLogger.audit('user_created', { ...meta, performedBy, targetUser }),
  userUpdated: (performedBy: string, targetUser: string, changes: Record<string, any>, meta?: LogMeta) =>
    simpleLogger.audit('user_updated', { ...meta, performedBy, targetUser, changes }),
  userDeleted: (performedBy: string, targetUser: string, meta?: LogMeta) =>
    simpleLogger.audit('user_deleted', { ...meta, performedBy, targetUser }),
  roleChanged: (performedBy: string, targetUser: string, fromRole: string, toRole: string, meta?: LogMeta) =>
    simpleLogger.audit('role_changed', { ...meta, performedBy, targetUser, fromRole, toRole }),
  apiAccess: (userId: string, method: string, endpoint: string, meta?: LogMeta) =>
    simpleLogger.audit('api_access', { ...meta, performedBy: userId, method, endpoint }),
};

export const performanceLogger = {
  api: (endpoint: string, method: string, responseTime: number, statusCode: number, meta?: LogMeta) =>
    simpleLogger.performance(endpoint, responseTime, { ...meta, method, statusCode }),
  database: (query: string, duration: number, meta?: LogMeta) =>
    simpleLogger.performance(`Database Query`, duration, { ...meta, query }),
};

export const securityLogger = {
  suspiciousActivity: (event: string, meta?: LogMeta) =>
    simpleLogger.security(event, 'high', meta),
  accessDenied: (resource: string, meta?: LogMeta) =>
    simpleLogger.security('access_denied', 'medium', { ...meta, resource }),
  dataExport: (performedBy: string, dataType: string, meta?: LogMeta) =>
    simpleLogger.security('data_export', 'medium', { ...meta, performedBy, dataType }),
};

// Export principal para compatibilidade
export default simpleLogger;
