import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedMortalityTables() {
  try {
    console.log('🌱 Criando tábuas de mortalidade de demonstração...')

    // Criar tábua AT-2000 Masculina
    const tabuaAT2000M = await prisma.tabuaMortalidade.create({
      data: {
        nome: 'AT-2000 Masculina',
        ano: 2000,
        fonte: 'SUSEP',
        sexo: 'M',
        status: 'ativa',
        descricao: 'Tábua de mortalidade AT-2000 para população masculina',
        observacao: 'Tábua oficial da SUSEP para cálculos atuariais'
      }
    })

    // Criar tábua AT-2000 Feminina
    const tabuaAT2000F = await prisma.tabuaMortalidade.create({
      data: {
        nome: 'AT-2000 Feminina',
        ano: 2000,
        fonte: 'SUSEP',
        sexo: 'F',
        status: 'ativa',
        descricao: 'Tábua de mortalidade AT-2000 para população feminina',
        observacao: 'Tábua oficial da SUSEP para cálculos atuariais'
      }
    })

    // Criar tábua BR-EMS
    const tabuaBREMS = await prisma.tabuaMortalidade.create({
      data: {
        nome: 'BR-EMS 2021',
        ano: 2021,
        fonte: 'IBGE',
        sexo: 'AMBOS',
        status: 'ativa',
        descricao: 'Tábua de experiência de mortalidade BR-EMS 2021',
        observacao: 'Tábua baseada na experiência brasileira, ambos os sexos'
      }
    })

    // Dados de exemplo para tábua masculina (idades 18-80)
    const taxasM = []
    for (let idade = 18; idade <= 80; idade++) {
      const qx = Math.min(0.001 * Math.exp((idade - 18) * 0.08), 0.95)
      const lx = 100000 * Math.pow(1 - qx, idade - 18)
      const dx = lx * qx
      const px = 1 - qx
      const ex = Math.max(1, 82 - idade + Math.random() * 5)

      taxasM.push({
        tabuaId: tabuaAT2000M.id,
        idade,
        qx: Math.round(qx * 1000000) / 1000000, // 6 casas decimais
        lx: Math.round(lx),
        dx: Math.round(dx),
        px: Math.round(px * 1000000) / 1000000,
        ex: Math.round(ex * 100) / 100,
        observacao: null
      })
    }

    // Dados de exemplo para tábua feminina (idades 18-80)
    const taxasF = []
    for (let idade = 18; idade <= 80; idade++) {
      const qx = Math.min(0.0008 * Math.exp((idade - 18) * 0.075), 0.90) // Mortalidade feminina menor
      const lx = 100000 * Math.pow(1 - qx, idade - 18)
      const dx = lx * qx
      const px = 1 - qx
      const ex = Math.max(1, 85 - idade + Math.random() * 5) // Expectativa maior

      taxasF.push({
        tabuaId: tabuaAT2000F.id,
        idade,
        qx: Math.round(qx * 1000000) / 1000000,
        lx: Math.round(lx),
        dx: Math.round(dx),
        px: Math.round(px * 1000000) / 1000000,
        ex: Math.round(ex * 100) / 100,
        observacao: null
      })
    }

    // Dados de exemplo para tábua BR-EMS (idades 18-80)
    const taxasBR = []
    for (let idade = 18; idade <= 80; idade++) {
      const qx = Math.min(0.0009 * Math.exp((idade - 18) * 0.077), 0.92)
      const lx = 100000 * Math.pow(1 - qx, idade - 18)
      const dx = lx * qx
      const px = 1 - qx
      const ex = Math.max(1, 83 - idade + Math.random() * 4)

      taxasBR.push({
        tabuaId: tabuaBREMS.id,
        idade,
        qx: Math.round(qx * 1000000) / 1000000,
        lx: Math.round(lx),
        dx: Math.round(dx),
        px: Math.round(px * 1000000) / 1000000,
        ex: Math.round(ex * 100) / 100,
        observacao: null
      })
    }

    // Inserir todas as taxas
    console.log('📊 Inserindo taxas de mortalidade...')
    
    await prisma.taxaMortalidade.createMany({
      data: [...taxasM, ...taxasF, ...taxasBR]
    })

    console.log(`✅ Criadas 3 tábuas de mortalidade com ${taxasM.length + taxasF.length + taxasBR.length} taxas`)
    console.log('📈 Tábuas disponíveis:')
    console.log('  - AT-2000 Masculina (idades 18-80)')
    console.log('  - AT-2000 Feminina (idades 18-80)')
    console.log('  - BR-EMS 2021 (idades 18-80)')

  } catch (error) {
    console.error('❌ Erro ao criar dados de demonstração:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedMortalityTables()
    .then(() => {
      console.log('🎉 Dados de demonstração criados com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Falha ao criar dados:', error)
      process.exit(1)
    })
}

export { seedMortalityTables }
