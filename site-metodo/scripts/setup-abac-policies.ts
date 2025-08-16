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
  const adminEmail = 'felipemartinii@gmail.com'
  // Verifica existência antes de adicionar para evitar duplicatas
  async function ensurePolicy(subject: string, object: string, action: string, effect: 'allow' | 'deny' = 'allow', context?: Record<string, unknown>) {
    const exists = await prisma.casbinRule.findFirst({ where: { v0: subject, v1: object, v2: action, v3: effect } })
    if (exists) {
      console.log('policy exists, skipping', { subject, object, action, effect })
      return
    }
    await addABACPolicy(subject, object, action, effect, context)
  }

  await ensurePolicy(adminEmail, '*', '*', 'allow', { department: 'admin', location: '*', time: '*' })

  // 2. Política para acesso de sessão (admin explicit)
  await ensurePolicy(adminEmail, 'session:read', 'read', 'allow', { time: '*', location: '*' })
  await ensurePolicy(adminEmail, 'session:write', 'write', 'allow', { time: '*', location: '*' })

  // 4. Política para admin:abac (admin explicit)
  await ensurePolicy(adminEmail, 'admin:abac', 'read', 'allow', { time: '*', location: '*' })
  await ensurePolicy(adminEmail, 'admin:abac', 'write', 'allow', { time: '*', location: '*' })

  // 5. Política específica para endpoint ABAC check (admin only)
  await ensurePolicy(adminEmail, 'api:abac:check', 'read', 'allow', { time: '*', location: '*' })

    // Recarregar políticas
    await reloadABACPolicies()

    console.log('✅ Políticas ABAC configuradas com sucesso!')
    
    // Listar políticas criadas
    const policies = await prisma.casbinRule.findMany()
    console.log(`📋 Total de políticas: ${policies.length}`)
    
    policies.forEach((policy: any, index: number) => {
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
