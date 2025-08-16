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
import { validatePolicy } from '../src/lib/abac/validatePolicy'

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
    // validate and sanitize before inserting
    const val = validatePolicy([subject, object, action, effect, context ? JSON.stringify(context) : '', ''])
    if (!val.ok) {
      console.error('Policy validation failed, skipping insert', { subject, object, action, effect, error: val.error })
      return
    }
    const [s,o,a,e,v4,v5] = val.sanitized
    // if context was provided it will be v4 sanitized
    await addABACPolicy(s, o, a, e as 'allow'|'deny', v4 ? JSON.parse(v4 as string) : undefined)
  }

  // Função para garantir binding de usuário -> role (ptype = 'g')
  async function ensureGroup(user: string, role: string) {
    const exists = await prisma.casbinRule.findFirst({ where: { ptype: 'g', v0: user, v1: role } })
    if (exists) { console.log('group exists, skipping', { user, role }); return }
    // inserir diretamente na tabela via prisma para garantir ptype correto
    await prisma.casbinRule.create({ data: { ptype: 'g', v0: user, v1: role } })
    console.log('group created', { user, role })
  }

  // Função para garantir policy para um role (ptype = 'p')
  async function ensureRolePolicy(role: string, object: string, action: string, effect: 'allow' | 'deny' = 'allow', context?: Record<string, unknown>) {
    const exists = await prisma.casbinRule.findFirst({ where: { ptype: 'p', v0: role, v1: object, v2: action, v3: effect } })
    if (exists) { console.log('role policy exists, skipping', { role, object, action, effect }); return }
    // inserir via addABACPolicy para manter enforcer sync
    await addABACPolicy(role, object, action, effect, context)
    console.log('role policy added', { role, object, action, effect })
  }

  // Criar role:admin e vincular o usuário
  await ensureGroup(adminEmail, 'role:admin')

  // Permitir admin:* para role:admin (p. ex. admin:dashboard, admin:abac, etc.)
  await ensureRolePolicy('role:admin', 'admin:*', '*', 'allow', { department: 'admin' })

  // Manter compatibilidade: garantimos também políticas específicas para sessão e usuario area cliente
  await ensurePolicy(adminEmail, 'session:read', 'read', 'allow', { time: '*', location: '*' })
  await ensurePolicy(adminEmail, 'session:write', 'write', 'allow', { time: '*', location: '*' })
  await ensurePolicy(adminEmail, 'usuario:areacliente', 'read', 'allow', { time: '*', location: '*' })
  await ensurePolicy(adminEmail, 'usuario:areacliente', 'write', 'allow', { time: '*', location: '*' })
  // Políticas específicas para admin dashboard e abac
  await ensurePolicy(adminEmail, 'admin:dashboard', 'read', 'allow', { time: '*', location: '*' })
  await ensurePolicy(adminEmail, 'admin:dashboard', 'write', 'allow', { time: '*', location: '*' })
  await ensurePolicy(adminEmail, 'admin:abac', 'read', 'allow', { time: '*', location: '*' })
  await ensurePolicy(adminEmail, 'admin:abac', 'write', 'allow', { time: '*', location: '*' })

 
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
