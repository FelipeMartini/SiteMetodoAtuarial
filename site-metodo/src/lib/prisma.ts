/**
 * 🔧 Prisma Client Singleton Pattern
 *
 * Implementação profissional para evitar múltiplas instâncias
 * do PrismaClient durante desenvolvimento e garantir performance
 * otimizada em produção.
 *
 * @see https://authjs.dev/getting-started/adapters/prisma
 */
import { PrismaClient } from '@prisma/client'
import { structuredLogger } from '@/lib/logger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * 🔐 Função auxiliar para desconectar o Prisma Client
 * Útil em testes e durante shutdown da aplicação
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}

/**
 * 🚀 Função auxiliar para verificar conexão com database
 * Útil para health checks e validação de setup
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
  await structuredLogger.info('Database connection successful')
    return true
  } catch (_error) {
  await structuredLogger.error('Database connection failed', { error: _error instanceof Error ? _error.message : String(_error) })
    throw _error
  }
}

// Compatibilidade com código existente
export { prisma as db }

export default prisma
