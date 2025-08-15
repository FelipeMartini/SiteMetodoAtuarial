// Arquivo arquivado: logger-winston-disabled.ts
// Movido para archive em batch-G para consolidacao de loggers.
// Conteúdo preservado para histórico.
import winston from 'winston'
import { format } from 'winston'
import path from 'path'

// (conteúdo original preservado)
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

winston.addColors(logColors)

const devFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.colorize({ all: true }),
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
)

const prodFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json(),
  format.printf(info => {
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

const logsDir = path.join(process.cwd(), 'logs')

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  }),
]

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: prodFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'audit.log'),
      level: 'audit',
      format: prodFormat,
      maxsize: 5242880,
      maxFiles: 10,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: prodFormat,
      maxsize: 5242880,
      maxFiles: 5,
    })
  )
}

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

export interface LogMeta { [key: string]: unknown }

export class StructuredLogger { /* archived */ }

export const structuredLogger = {} as any

export default structuredLogger
