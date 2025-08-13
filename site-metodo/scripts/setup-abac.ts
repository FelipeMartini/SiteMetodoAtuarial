/**
 * Script para configurar políticas ABAC básicas
 * Configura felipemartinii@gmail.com como super admin
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupABACPolicies() {
  console.log('🚀 Configurando políticas ABAC...')

  try {
    // Limpar políticas existentes
    await prisma.casbinRule.deleteMany({})
    console.log('✅ Políticas antigas removidas')

    // Políticas para felipemartinii@gmail.com - Super Admin
    const adminPolicies = [
      // Acesso completo ao sistema
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: '*', v2: '*' },
      
      // Acesso específico para sessões
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: 'session:read', v2: 'read' },
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: 'session:write', v2: 'write' },
      
      // Acesso administrativo
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: 'admin:dashboard', v2: 'read' },
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: 'admin:users', v2: 'read' },
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: 'admin:users', v2: 'write' },
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: 'admin:abac', v2: 'read' },
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: 'admin:abac', v2: 'write' },
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: 'audit_logs', v2: 'read' },
      
      // Área do cliente
      { ptype: 'p', v0: 'felipemartinii@gmail.com', v1: 'area-cliente', v2: 'read' },
    ]

    // Inserir políticas
    for (const policy of adminPolicies) {
      await prisma.casbinRule.create({ data: policy })
      console.log(`✅ Política criada: ${policy.v0} -> ${policy.v1} ${policy.v2}`)
    }

    // Políticas padrão para usuários logados
    const userPolicies = [
      // Qualquer usuário logado pode ler sessões próprias
      { ptype: 'p', v0: 'user:*', v1: 'session:read', v2: 'read' },
      { ptype: 'p', v0: 'user:*', v1: 'area-cliente', v2: 'read' },
    ]

    for (const policy of userPolicies) {
      await prisma.casbinRule.create({ data: policy })
      console.log(`✅ Política de usuário criada: ${policy.v0} -> ${policy.v1} ${policy.v2}`)
    }

    console.log('🎉 Políticas ABAC configuradas com sucesso!')

  } catch (error) {
    console.error('❌ Erro ao configurar políticas ABAC:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupABACPolicies()
}

export { setupABACPolicies }
