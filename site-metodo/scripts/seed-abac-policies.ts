/**
 * 🌱 SEED DE POLÍTICAS ABAC - VERSÃO PURA
 * Script para popular o banco com políticas ABAC iniciais
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 📋 POLÍTICAS ABAC INICIAIS
const initialABACPolicies = [
  {
    name: 'admin-full-access',
    subject: 'user:*',
    object: 'system:admin',
    action: 'access',
    effect: 'allow',
    conditions: JSON.stringify({ department: 'admin', isActive: true }),
    description: 'Usuários do departamento admin têm acesso completo'
  },
  {
    name: 'admin-manage-users',
    subject: 'dept:admin',
    object: 'resource:users',
    action: '*',
    effect: 'allow',
    conditions: JSON.stringify({ isActive: true }),
    description: 'Administradores podem gerenciar usuários'
  },
  {
    name: 'admin-create-users',
    subject: 'dept:admin',
    object: 'resource:users',
    action: 'create',
    effect: 'allow',
    description: 'Administradores podem criar usuários'
  },
  {
    name: 'admin-update-users',
    subject: 'dept:admin',
    object: 'resource:users',
    action: 'update',
    effect: 'allow',
    description: 'Administradores podem atualizar usuários'
  },
  {
    name: 'admin-delete-users',
    subject: 'dept:admin',
    object: 'resource:users',
    action: 'delete',
    effect: 'allow',
    description: 'Administradores podem deletar usuários'
  },
  {
    name: 'admin-list-users',
    subject: 'dept:admin',
    object: 'resource:users',
    action: 'list',
    effect: 'allow',
    description: 'Administradores podem listar usuários'
  },
  {
    name: 'admin-system-metrics',
    subject: 'dept:admin',
    object: 'resource:system:metrics',
    action: 'read',
    effect: 'allow',
    description: 'Administradores podem ver métricas do sistema'
  },
  {
    name: 'admin-system-health',
    subject: 'dept:admin',
    object: 'resource:system:health',
    action: 'read',
    effect: 'allow',
    description: 'Administradores podem ver saúde do sistema'
  },
  {
    name: 'admin-system-admin',
    subject: 'dept:admin',
    object: 'resource:system:*',
    action: '*',
    effect: 'allow',
    description: 'Administradores têm acesso total ao sistema'
  },
  {
    name: 'user-read-own-profile',
    subject: 'user:*',
    object: 'resource:users:self',
    action: 'read',
    effect: 'allow',
    conditions: JSON.stringify({ isActive: true }),
    description: 'Usuários podem ler seu próprio perfil'
  },
  {
    name: 'user-update-own-profile',
    subject: 'user:*',
    object: 'resource:users:self',
    action: 'update',
    effect: 'allow',
    conditions: JSON.stringify({ isActive: true }),
    description: 'Usuários podem atualizar seu próprio perfil'
  },
  {
    name: 'active-user-basic-access',
    subject: 'user:*',
    object: 'resource:dashboard',
    action: 'read',
    effect: 'allow',
    conditions: JSON.stringify({ isActive: true }),
    description: 'Usuários ativos podem acessar o dashboard'
  },
  {
    name: 'deny-inactive-users',
    subject: 'user:*',
    object: 'resource:*',
    action: '*',
    effect: 'deny',
    conditions: JSON.stringify({ isActive: false }),
    description: 'Usuários inativos são negados'
  },
  {
    name: 'deny-expired-users',
    subject: 'user:*',
    object: 'resource:*',
    action: '*',
    effect: 'deny',
    conditions: JSON.stringify({ validUntil: 'expired' }),
    description: 'Usuários com período expirado são negados'
  },
  {
    name: 'business-hours-sensitive-data',
    subject: 'user:*',
    object: 'resource:sensitive:*',
    action: 'read',
    effect: 'allow',
    conditions: JSON.stringify({ 
      timeRange: '08:00-18:00',
      weekdays: true,
      department: ['admin', 'finance']
    }),
    description: 'Dados sensíveis apenas em horário comercial para departamentos autorizados'
  }
]

// 🎯 REGRAS CASBIN INICIAIS
const initialCasbinRules = [
  // Mapeamento de grupos
  ['g', 'admin@test.com', 'dept:admin'],
  ['g', 'user@test.com', 'dept:general'],
  
  // Políticas por departamento
  ['p', 'dept:admin', 'resource:users', '*', 'allow'],
  ['p', 'dept:admin', 'resource:system:*', '*', 'allow'],
  ['p', 'dept:general', 'resource:dashboard', 'read', 'allow'],
  
  // Políticas por usuário
  ['p', 'user:*', 'resource:users:self', 'read', 'allow'],
  ['p', 'user:*', 'resource:users:self', 'update', 'allow']
]

/**
 * 🚀 Função principal de seed
 */
async function seedABACPolicies() {
  try {
    console.log('🌱 Iniciando seed de políticas ABAC...')
    
    // Limpar políticas existentes
    await prisma.authorizationPolicy.deleteMany({})
    await prisma.casbinRule.deleteMany({})
    console.log('🧹 Políticas existentes removidas')
    
    // Criar políticas ABAC na tabela AuthorizationPolicy
    for (const policy of initialABACPolicies) {
      await prisma.authorizationPolicy.create({
        data: {
          name: policy.name,
          subject: policy.subject,
          object: policy.object,
          action: policy.action,
          effect: policy.effect,
          conditions: policy.conditions || null,
          description: policy.description
        }
      })
      console.log(`✅ Política criada: ${policy.name}`)
    }
    
    // Criar regras Casbin
    for (const rule of initialCasbinRules) {
      await prisma.casbinRule.create({
        data: {
          ptype: rule[0],
          v0: rule[1] || null,
          v1: rule[2] || null,
          v2: rule[3] || null,
          v3: rule[4] || null,
          v4: rule[5] || null,
          v5: rule[6] || null
        }
      })
      console.log(`✅ Regra Casbin criada: ${rule.join(' ')}`)
    }
    
    console.log('🎉 Seed de políticas ABAC concluído com sucesso!')
    console.log(`📊 Total de políticas criadas: ${initialABACPolicies.length}`)
    console.log(`📊 Total de regras Casbin criadas: ${initialCasbinRules.length}`)
    
  } catch (error) {
    console.error('❌ Erro no seed de políticas ABAC:', error)
    throw error
  }
}

/**
 * 🏃‍♂️ Executar seed
 */
async function main() {
  try {
    await seedABACPolicies()
    console.log('✅ Script de seed concluído')
  } catch (error) {
    console.error('❌ Erro no script de seed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
}

export { seedABACPolicies }
