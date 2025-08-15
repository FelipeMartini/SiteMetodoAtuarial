const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // acessar DMMF via _dmmf quando disponível
    const dmmf = require('@prisma/client').Prisma.dmmf
    if (dmmf && dmmf.datamodel) {
      const models = dmmf.datamodel.models.map(m => m.name)
      console.log('Models:', models.join(', '))
    } else {
      console.log('DMMF not found on Prisma client; trying runtime model names...')
      console.log(Object.keys(prisma).filter(k => typeof prisma[k] === 'object').join(', '))
    }
  } catch (e) {
    console.error('Erro listando models:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
