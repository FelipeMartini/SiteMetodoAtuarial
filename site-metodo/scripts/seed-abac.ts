import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function seedABACData() {
  console.log('🌱 Iniciando seed do sistema ABAC...')

  try {
    // 1. Criar roles básicos
    console.log('📝 Criando roles básicos...')

    const roles = [
      { name: 'admin', description: 'Administrador do sistema' },
      { name: 'moderator', description: 'Moderador' },
      { name: 'user', description: 'Usuário padrão' },
      { name: 'actuarial', description: 'Especialista atuarial' },
    ]

    for (const role of roles) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      })
    }

    // 2. Criar usuário admin se não existir
    console.log('👤 Criando usuário administrador...')

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@metodoatuarial.com' },
      update: {},
      create: {
        email: 'admin@metodoatuarial.com',
        name: 'Administrador',
        password: hashSync('admin123', 12),
        emailVerified: new Date(),
      },
    })

    // 3. Criar usuário atuarial se não existir
    console.log('👤 Criando usuário atuarial...')

    const actuarialUser = await prisma.user.upsert({
      where: { email: 'atuario@metodoatuarial.com' },
      update: {},
      create: {
        email: 'atuario@metodoatuarial.com',
        name: 'Especialista Atuarial',
        password: hashSync('atuario123', 12),
        emailVerified: new Date(),
      },
    })

    // 4. Atribuir roles
    console.log('🔗 Atribuindo roles aos usuários...')

    const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } })
    const actuarialRole = await prisma.role.findUnique({ where: { name: 'actuarial' } })

    if (adminRole && actuarialRole) {
      // Atribuir role admin
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: adminUser.id,
            roleId: adminRole.id,
          },
        },
        update: {},
        create: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      })

      // Atribuir role actuarial
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: actuarialUser.id,
            roleId: actuarialRole.id,
          },
        },
        update: {},
        create: {
          userId: actuarialUser.id,
          roleId: actuarialRole.id,
        },
      })
    }

    // 5. Criar políticas básicas ABAC
    console.log('🛡️ Criando políticas ABAC básicas...')

    const policies = [
      {
        subject: 'admin',
        object: '/admin/*',
        action: 'manage',
        effect: 'allow' as const,
        description: 'Administradores têm acesso completo à área administrativa',
      },
      {
        subject: 'admin',
        object: '/api/abac/*',
        action: 'manage',
        effect: 'allow' as const,
        description: 'Administradores podem gerenciar políticas ABAC',
      },
      {
        subject: 'actuarial',
        object: '/area-cliente/calculos-atuariais',
        action: 'read',
        effect: 'allow' as const,
        description: 'Atuários podem acessar calculadora atuarial',
      },
      {
        subject: 'actuarial',
        object: '/area-cliente/calculos-atuariais',
        action: 'write',
        effect: 'allow' as const,
        description: 'Atuários podem realizar cálculos',
      },
      {
        subject: 'user',
        object: '/area-cliente/dashboard',
        action: 'read',
        effect: 'allow' as const,
        description: 'Usuários podem acessar o dashboard',
      },
      {
        subject: 'user',
        object: '/area-cliente/perfil',
        action: 'read',
        effect: 'allow' as const,
        description: 'Usuários podem ver seu perfil',
      },
      {
        subject: 'user',
        object: '/area-cliente/perfil',
        action: 'write',
        effect: 'allow' as const,
        description: 'Usuários podem editar seu perfil',
      },
      {
        subject: 'anonymous',
        object: '/admin/*',
        action: '*',
        effect: 'deny' as const,
        description: 'Usuários anônimos não podem acessar área administrativa',
      },
    ]

    for (const policy of policies) {
      const existingPolicy = await prisma.authorizationPolicy.findFirst({
        where: {
          subject: policy.subject,
          object: policy.object,
          action: policy.action,
          effect: policy.effect,
        },
      })

      if (!existingPolicy) {
        await prisma.authorizationPolicy.create({
          data: policy,
        })
      }
    }

    console.log('✅ Seed do sistema ABAC concluído com sucesso!')
    console.log('')
    console.log('📋 Resumo dos dados criados:')
    console.log('- Roles: admin, moderator, user, actuarial')
    console.log(
      '- Usuários: admin@metodoatuarial.com (admin123), atuario@metodoatuarial.com (atuario123)'
    )
    console.log('- Políticas: 8 políticas básicas de acesso')
    console.log('')
    console.log('🔑 Credenciais de teste:')
    console.log('Admin: admin@metodoatuarial.com / admin123')
    console.log('Atuário: atuario@metodoatuarial.com / atuario123')
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
    throw error
  }
}

async function main() {
  try {
    await seedABACData()
  } catch (error) {
    console.error('Erro fatal:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default seedABACData
