// Shim de compatibilidade: reexporta o singleton definido em `src/lib/prisma.ts`
// para evitar múltiplas instâncias do PrismaClient espalhadas pelo projeto.
// Mantém compatibilidade com scripts que importam `site-metodo/prisma/client.ts`.
import prismaSingleton, { prisma as prismaNamed, db } from '@/lib/prisma'

// Exporta em várias formas para compatibilidade com importações existentes
export const prisma = prismaNamed || prismaSingleton || db

export default prisma

// Comentário: Este arquivo agora é um shim. Não instancie PrismaClient aqui.
