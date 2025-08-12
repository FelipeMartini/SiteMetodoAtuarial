'use client'

/**
 * 🛡️ SISTEMA ABAC/ASIC PURO - ENFORCER CASBIN
 * ==========================================
 * 
 * Sistema de autorização baseado em atributos usando Casbin
 * - Remove completamente sistema RBAC legado
 * - Implementa ABAC/ASIC com políticas flexíveis
 * - Suporte para contexto temporal, geográfico e organizacional
 */

import { Enforcer, newEnforcer } from 'casbin'
import { PrismaAdapter } from 'casbin-prisma-adapter'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger-simple'

// 🔧 Cache do enforcer para performance
let cachedEnforcer: Enforcer | null = null
let lastCacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

// 📋 Modelo ABAC/ASIC Casbin
const ABAC_MODEL = `
[request_definition]
r = sub, obj, act, ctx

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) || r.sub == p.sub || keyMatch2(r.sub, p.sub) || \
    (r.obj == p.obj || keyMatch2(r.obj, p.obj)) && \
    (r.act == p.act || keyMatch2(r.act, p.act)) && \
    eval(p.eft) && \
    contextMatch(r.ctx, p.ctx)
`

// 🏗️ Interface para contexto ABAC
interface ABACContext {
  time?: string           // "business_hours", "2024-01-15T10:00:00Z"
  location?: string       // "office", "remote", "brazil"
  department?: string     // "finance", "hr", "it"
  ip?: string            // IP do usuário
  userAgent?: string     // Browser/device
  sensitive?: boolean    // Dados sensíveis
  urgency?: 'low' | 'normal' | 'high' | 'critical'
  [key: string]: any     // Contexto adicional
}

// 🏗️ Interface para resultado de autorização
interface AuthResult {
  allowed: boolean
  reason: string
  appliedPolicies: string[]
  context: ABACContext
  timestamp: Date
  responseTime: number
}

/**
 * 🔧 Funções auxiliares para matching de contexto
 */
function addCustomFunctions(enforcer: Enforcer) {
  // Função para matching de contexto
  enforcer.addFunction('contextMatch', (requestCtx: string, policyCtx: string) => {
    try {
      if (!policyCtx || policyCtx === '*') return true
      
      const reqContext = JSON.parse(requestCtx || '{}')
      const polContext = JSON.parse(policyCtx || '{}')
      
      // Verificar cada condição da política
      for (const [key, value] of Object.entries(polContext)) {
        if (key === 'time') {
          if (!checkTimeCondition(reqContext.time, value as string)) return false
        } else if (key === 'location') {
          if (!checkLocationCondition(reqContext.location, value as string)) return false
        } else if (key === 'department') {
          if (reqContext.department !== value) return false
        } else if (key === 'ip') {
          if (!checkIPCondition(reqContext.ip, value as string)) return false
        } else {
          // Comparação direta para outros atributos
          if (reqContext[key] !== value) return false
        }
      }
      
      return true
    } catch (error) {
      structuredLogger.error('Context match error', 'high', { 
        error: error instanceof Error ? error.message : String(error), 
        requestCtx, 
        policyCtx 
      })
      return false
    }
  })

  // Função para matching de tempo
  function checkTimeCondition(requestTime: string, policyTime: string): boolean {
    if (policyTime === 'business_hours') {
      const now = new Date(requestTime || Date.now())
      const hour = now.getHours()
      const day = now.getDay()
      return day >= 1 && day <= 5 && hour >= 9 && hour <= 18
    }
    // Adicionar outras condições temporais conforme necessário
    return true
  }

  // Função para matching de localização
  function checkLocationCondition(requestLocation: string, policyLocation: string): boolean {
    if (!requestLocation) return false
    
    // Suporte para wildcards e hierarquia
    if (policyLocation.includes('*')) {
      return new RegExp(policyLocation.replace(/\*/g, '.*')).test(requestLocation)
    }
    
    return requestLocation === policyLocation
  }

  // Função para matching de IP
  function checkIPCondition(requestIP: string, policyIP: string): boolean {
    if (!requestIP) return false
    
    // Suporte para CIDR, ranges, etc.
    if (policyIP.includes('/')) {
      // Implementar verificação CIDR se necessário
      return true
    }
    
    return requestIP === policyIP
  }
}

/**
 * 🚀 Inicializar enforcer ABAC
 */
async function initializeEnforcer(): Promise<Enforcer> {
  try {
    const startTime = Date.now()
    
    // Configurar adapter com versão compatível
    const adapter = await PrismaAdapter.newAdapter({
      prisma,
      tableName: 'casbin_rule',
      modelName: 'CasbinRule'
    })

    // Criar enforcer com modelo ABAC
    const enforcer = await newEnforcer(ABAC_MODEL, adapter)
    
    // Adicionar funções customizadas
    addCustomFunctions(enforcer)
    
    // Carregar políticas do banco
    await enforcer.loadPolicy()
    
    const loadTime = Date.now() - startTime
    structuredLogger.info('ABAC enforcer initialized', {
      loadTime,
      policyCount: (await enforcer.getGroupingPolicy()).length + (await enforcer.getPolicy()).length
    })
    
    return enforcer
  } catch (error) {
    structuredLogger.error('Failed to initialize ABAC enforcer', 'critical', { 
      error: error instanceof Error ? error.message : String(error) 
    })
    throw error
  }
}

/**
 * 🔍 Obter enforcer (com cache)
 */
export async function getEnforcer(): Promise<Enforcer> {
  const now = Date.now()
  
  if (cachedEnforcer && (now - lastCacheTime) < CACHE_TTL) {
    return cachedEnforcer
  }
  
  cachedEnforcer = await initializeEnforcer()
  lastCacheTime = now
  
  return cachedEnforcer
}

/**
 * 🛡️ FUNÇÃO PRINCIPAL DE AUTORIZAÇÃO ABAC
 */
export async function checkABACPermission(
  subject: string,
  object: string,
  action: string,
  context: ABACContext = {}
): Promise<AuthResult> {
  const startTime = Date.now()
  
  try {
    const enforcer = await getEnforcer()
    
    // Converter contexto para string JSON
    const contextStr = JSON.stringify(context)
    
    // Verificar permissão
    const allowed = await enforcer.enforce(subject, object, action, contextStr)
    
    const responseTime = Date.now() - startTime
    
    // Log da decisão
    const result: AuthResult = {
      allowed,
      reason: allowed ? 'Access granted by ABAC policy' : 'Access denied by ABAC policy',
      appliedPolicies: await getAppliedPolicies(enforcer, subject, object, action),
      context,
      timestamp: new Date(),
      responseTime
    }
    
    // Log para auditoria
    structuredLogger.audit('ABAC_DECISION', {
      subject,
      object,
      action,
      context,
      allowed: result.allowed,
      responseTime: Date.now() - startTime,
      appliedPolicies: result.appliedPolicies,
      performedBy: subject
    })    // Salvar log de acesso no banco
    await saveAccessLog(subject, object, action, result)
    
    return result
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    structuredLogger.error('ABAC permission check failed', 'high', {
      error: error instanceof Error ? error.message : String(error),
      subject,
      object,
      action,
      context,
      responseTime
    })
    
    return {
      allowed: false,
      reason: `ABAC check failed: ${error}`,
      appliedPolicies: [],
      context,
      timestamp: new Date(),
      responseTime
    }
  }
}

/**
 * 📊 Obter políticas aplicadas na decisão
 */
async function getAppliedPolicies(
  enforcer: Enforcer,
  subject: string,
  object: string,
  action: string
): Promise<string[]> {
  try {
    const policies = await enforcer.getFilteredPolicy(0, subject)
    const objectPolicies = await enforcer.getFilteredPolicy(1, object)
    const actionPolicies = await enforcer.getFilteredPolicy(2, action)
    
    // Combinar e filtrar políticas relevantes
    const relevantPolicies = [
      ...policies.map(p => p.join(', ')),
      ...objectPolicies.map(p => p.join(', ')),
      ...actionPolicies.map(p => p.join(', '))
    ]
    
    return [...new Set(relevantPolicies)] // Remove duplicatas
  } catch (error) {
    structuredLogger.error('Failed to get applied policies', 'medium', { error: error instanceof Error ? error.message : String(error) })
    return []
  }
}

/**
 * 💾 Salvar log de acesso no banco
 */
async function saveAccessLog(
  subject: string,
  object: string,
  action: string,
  result: AuthResult
): Promise<void> {
  try {
    // Extrair userId do subject se possível
    const userId = subject.startsWith('user:') ? subject.replace('user:', '') : null
    
    await prisma.accessLog.create({
      data: {
        userId,
        subject,
        object,
        action,
        allowed: result.allowed,
        reason: result.reason,
        context: JSON.stringify(result.context),
        responseTime: result.responseTime,
        ipAddress: result.context.ip,
        userAgent: result.context.userAgent
      }
    })
  } catch (error) {
    structuredLogger.error('Failed to save access log', 'medium', { error: error instanceof Error ? error.message : String(error) })
  }
}

/**
 * 🔧 FUNÇÕES ADMINISTRATIVAS PARA POLÍTICAS
 */

// Adicionar política ABAC
export async function addABACPolicy(
  subject: string,
  object: string,
  action: string,
  effect: 'allow' | 'deny' = 'allow',
  context?: Record<string, any>
): Promise<boolean> {
  try {
    const enforcer = await getEnforcer()
    
    const policy = [subject, object, action, effect]
    if (context && Object.keys(context).length > 0) {
      policy.push(JSON.stringify(context))
    }
    
    const added = await enforcer.addPolicy(...policy)
    
    if (added) {
      await enforcer.savePolicy()
      structuredLogger.audit('ABAC_POLICY_ADDED', { 
        subject, 
        object, 
        action, 
        effect, 
        context,
        performedBy: subject
      })
    }
    
    return added
  } catch (error) {
    structuredLogger.error('Failed to add ABAC policy', 'high', { error: error instanceof Error ? error.message : String(error) })
    return false
  }
}

// Remover política ABAC
export async function removeABACPolicy(
  subject: string,
  object: string,
  action: string,
  effect: 'allow' | 'deny' = 'allow'
): Promise<boolean> {
  try {
    const enforcer = await getEnforcer()
    const removed = await enforcer.removePolicy(subject, object, action, effect)
    
    if (removed) {
      await enforcer.savePolicy()
      structuredLogger.audit('ABAC_POLICY_REMOVED', { 
        subject, 
        object, 
        action, 
        effect,
        performedBy: subject
      })
    }
    
    return removed
  } catch (error) {
    structuredLogger.error('Failed to remove ABAC policy', 'high', { error: error instanceof Error ? error.message : String(error) })
    return false
  }
}

// Listar todas as políticas
export async function getAllABACPolicies(): Promise<string[][]> {
  try {
    const enforcer = await getEnforcer()
    return await enforcer.getPolicy()
  } catch (error) {
    structuredLogger.error('Failed to get ABAC policies', 'medium', { error: error instanceof Error ? error.message : String(error) })
    return []
  }
}

// Recarregar políticas do banco
export async function reloadABACPolicies(): Promise<boolean> {
  try {
    const enforcer = await getEnforcer()
    await enforcer.loadPolicy()
    
    // Limpar cache para forçar nova inicialização
    cachedEnforcer = null
    lastCacheTime = 0
    
    structuredLogger.info('ABAC policies reloaded')
    return true
  } catch (error) {
    structuredLogger.error('Failed to reload ABAC policies', 'high', { error: error instanceof Error ? error.message : String(error) })
    return false
  }
}

/**
 * 🎯 FUNÇÕES UTILITÁRIAS PARA INTEGRAÇÃO
 */

// Verificar se usuário é admin (compatibilidade)
export async function isAdmin(userId: string, context: ABACContext = {}): Promise<boolean> {
  const result = await checkABACPermission(`user:${userId}`, 'system:admin', 'access', context)
  return result.allowed
}

// Verificar se usuário pode acessar recurso
export async function canAccess(
  userId: string,
  resource: string,
  action: string = 'read',
  context: ABACContext = {}
): Promise<boolean> {
  const result = await checkABACPermission(`user:${userId}`, resource, action, context)
  return result.allowed
}

// Verificar se usuário pode fazer ação em recurso específico
export async function hasPermission(
  userId: string,
  resource: string,
  action: string,
  context: ABACContext = {}
): Promise<AuthResult> {
  return await checkABACPermission(`user:${userId}`, resource, action, context)
}

export default {
  checkABACPermission,
  addABACPolicy,
  removeABACPolicy,
  getAllABACPolicies,
  reloadABACPolicies,
  isAdmin,
  canAccess,
  hasPermission
}
