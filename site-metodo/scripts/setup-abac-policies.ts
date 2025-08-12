#!/usr/bin/env npx tsx

/**
 * 🛡️ SETUP INICIAL DE POLÍTICAS ABAC/ASIC
 * =======================================
 * 
 * Script para configurar políticas básicas do sistema ABAC
 * - Políticas para usuário admin felipemartinii@gmail.com
 * - Permissões para sessão, admin dashboard, área cliente
 */

import { prisma } from '../src/lib/prisma'
import { addABACPolicy, reloadABACPolicies } from '../src/lib/abac/enforcer-abac-puro'

async function setupABACPolicies() {
  console.log('🚀 Iniciando setup de políticas ABAC...')

  try {
    // 1. Política admin universal para felipemartinii@gmail.com
    await addABACPolicy(
      'user:cme9393ab000083y90zydz4cg', // ID do usuário Felipe
      '*', // Todos os objetos
      '*', // Todas as ações
      'allow',
      { department: 'admin', location: '*', time: '*' }
    )

    // 2. Política para acesso de sessão (todos os usuários autenticados)
    await addABACPolicy(
      'user:*',
      'session:read',
      'read',
      'allow',
      { time: '*', location: '*' }
    )

    // 3. Política para área cliente (usuários ativos)
    await addABACPolicy(
      'user:*',
      'area-cliente:*',
      '*',
      'allow',
      { time: 'business_hours', location: '*' }
    )

    // 4. Política para admin dashboard (apenas admins)
    await addABACPolicy(
      'department:admin',
      'admin:*',
      '*',
      'allow',
      { time: '*', location: '*' }
    )

    // 5. Política específica para endpoint ABAC check
    await addABACPolicy(
      'user:*',
      'api:abac:check',
      'read',
      'allow',
      { time: '*', location: '*' }
    )

    // Recarregar políticas
    await reloadABACPolicies()

    console.log('✅ Políticas ABAC configuradas com sucesso!')
    
    // Listar políticas criadas
    const policies = await prisma.casbinRule.findMany()
    console.log(`📋 Total de políticas: ${policies.length}`)
    
    policies.forEach((policy, index) => {
      console.log(`${index + 1}. ${policy.ptype} ${policy.v0} ${policy.v1} ${policy.v2} ${policy.v3}`)
    })

  } catch (error) {
    console.error('❌ Erro ao configurar políticas ABAC:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar setup
setupABACPolicies()
