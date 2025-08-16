import prisma from '@/lib/prisma'

// Re-exporta o prisma singleton para compatibilidade com caminhos antigos
export { prisma }

export default prisma
