import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10)
    
    const user = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin Teste',
        password: hashedPassword,
        accessLevel: 100,
        isActive: true,
        emailVerified: new Date()
      }
    })

    console.log('✅ Usuário de teste criado:')
    console.log('📧 Email: admin@test.com')
    console.log('🔑 Senha: 123456')
    console.log('🛡️  Nível: Admin (100)')
    console.log('🆔 ID:', user.id)
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
