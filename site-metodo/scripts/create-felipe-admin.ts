import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function createFelipeAdmin() {
  console.log('🌱 Criando usuário admin para felipemartiniii@gmail.com...')

  try {
    // 1. Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'felipemartiniii@gmail.com' }
    })

    if (existingUser) {
      console.log('👤 Usuário já existe, atualizando permissões...')
    } else {
      console.log('👤 Criando novo usuário...')
    }

    // 2. Criar/atualizar o usuário
    const felipeUser = await prisma.user.upsert({
      where: { email: 'felipemartiniii@gmail.com' },
      update: {
        name: 'Felipe Martin III',
        emailVerified: new Date(),
      },
      create: {
        email: 'felipemartiniii@gmail.com',
        name: 'Felipe Martin III',
        password: hashSync('felipe2024!', 12), // Senha temporária
        emailVerified: new Date(),
      },
    })

    // 3. Buscar o role admin
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' }
    })

    if (!adminRole) {
      throw new Error('Role admin não encontrado. Execute o seed ABAC primeiro.')
    }

    // 4. Atribuir role admin ao usuário
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: felipeUser.id,
          roleId: adminRole.id
        }
      },
      update: {},
      create: {
        userId: felipeUser.id,
        roleId: adminRole.id
      }
    })

    console.log('✅ Usuário admin criado/atualizado com sucesso!')
    console.log('📋 Dados do usuário:')
    console.log('- Email: felipemartiniii@gmail.com')
    console.log('- Nome: Felipe Martin III')
    console.log('- Role: admin')
    console.log('- Senha temporária: felipe2024!')
    console.log('🔑 Faça login com estas credenciais e altere a senha.')

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar a função
createFelipeAdmin()
  .catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })
