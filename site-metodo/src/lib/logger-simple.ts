// Logger otimizado para build do Next.js
// Evita problemas com winston em ambiente de build

interface LogLevel {
  ERROR: 'error'
  WARN: 'warn' 
  INFO: 'info'
  DEBUG: 'debug'
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
}

export interface Logger {
  error: (message: string, meta?: Record<string, unknown>) => void
  warn: (message: string, meta?: Record<string, unknown>) => void
  info: (message: string, meta?: Record<string, unknown>) => void
  debug: (message: string, meta?: Record<string, unknown>) => void
}

class SimpleLogger implements Logger {
  private isServer = typeof window === 'undefined'

  private log(level: string, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    
    if (meta) {
      console.log(logMessage, meta)
    } else {
      console.log(logMessage)
    }

    // Em produção server-side, podemos adicionar outros transports
    if (this.isServer && process.env.NODE_ENV === 'production') {
      // TODO: Adicionar integração com serviços de log externos
      // como DataDog, CloudWatch, etc.
    }
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.log(LOG_LEVELS.ERROR, message, meta)
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log(LOG_LEVELS.WARN, message, meta)
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log(LOG_LEVELS.INFO, message, meta)
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LOG_LEVELS.DEBUG, message, meta)
    }
  }
}

// Instância singleton do logger
const logger = new SimpleLogger()

export { logger, LOG_LEVELS }
export default logger
