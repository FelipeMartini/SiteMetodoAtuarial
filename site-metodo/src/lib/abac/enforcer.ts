/* eslint-disable @typescript-eslint/no-explicit-any */
// Arquivo server-side: enforcer ABAC

/**
 * 🛡️ SISTEMA ABAC/ASIC PURO - ENFORCER CASBIN
 * ==========================================
 * 
 * Sistema de autorização baseado em atributos usando Casbin
 * - Remove completamente sistema RBAC legado
 * - Implementa ABAC/ASIC com políticas flexíveis
 * - Suporte para contexto temporal, geográfico e organizacional
 */

import { newEnforcer } from 'casbin'
type AnyEnforcer = any
import { PrismaAdapter } from 'casbin-prisma-adapter'
import { prisma } from '@/lib/prisma'
import { structuredLogger } from '@/lib/logger'

// 🔧 Cache do enforcer para performance
let cachedEnforcer: AnyEnforcer | null = null
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
  [key: string]: unknown // Contexto adicional
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
function addCustomFunctions(enforcer: AnyEnforcer) {
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
      structuredLogger.error('Context match error', { 
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
async function initializeEnforcer(): Promise<AnyEnforcer> {
  try {
    const startTime = Date.now()
    
      // Criar adapter Prisma para tabela CasbinRule
      const adapter = await PrismaAdapter.newAdapter(prisma)

      // Criar enforcer com modelo ABAC
      const enforcer = await newEnforcer(ABAC_MODEL)
      // setAdapter pode não existir em todas as versões, usar com cautela
      const setter = (enforcer as any).setAdapter
      if (typeof setter === 'function') {
        await setter.call(enforcer, adapter)
      }
    
    // Adicionar funções customizadas
    addCustomFunctions(enforcer)
    
    // Carregar políticas do banco
    try {
      await enforcer.loadPolicy()
    } catch (err) {
      // Diagnóstico: tentar identificar a regra que quebra o parser
      structuredLogger.error('loadPolicy failed, running per-row diagnostic', { error: err instanceof Error ? err.message : String(err) })
      try {
        const rows = await prisma.casbinRule.findMany({ select: { id: true, ptype: true, v0: true, v1: true, v2: true, v3: true, v4: true, v5: true } })
        for (const r of rows) {
          if (r.ptype !== 'p') continue
          const policyParts: string[] = []
          if (r.v0) policyParts.push(r.v0)
          if (r.v1) policyParts.push(r.v1)
          if (r.v2) policyParts.push(r.v2)
          if (r.v3) policyParts.push(r.v3)
          if (r.v4) policyParts.push(r.v4)
          if (r.v5) policyParts.push(r.v5)
          try {
            // tentar adicionar a política individualmente para detectar parse error
            // sem salvar no adapter (apenas em memória)
            await enforcer.addPolicy(...policyParts)
            await enforcer.clearPolicy()
          } catch (innerErr) {
            structuredLogger.error('Policy parse failed for casbin_rule', { id: r.id, row: r, error: innerErr instanceof Error ? innerErr.message : String(innerErr) })
          }
        }
      } catch (diagErr) {
        structuredLogger.error('Per-row diagnostic failed', { error: diagErr instanceof Error ? diagErr.message : String(diagErr) })
      }
      // rethrow original to preserve behavior
      throw err
    }
    
    const loadTime = Date.now() - startTime
    structuredLogger.info('ABAC enforcer initialized', {
      loadTime,
      // policyCount: await enforcer.getPolicyCount() // Método pode não existir
    })
    
    return enforcer
  } catch (error) {
    structuredLogger.error('Failed to initialize ABAC enforcer', { 
      error: error instanceof Error ? error.message : String(error) 
    })
    throw error
  }
}

/**
 * 🔍 Obter enforcer (com cache)
 */
async function getEnforcer(): Promise<AnyEnforcer> {
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
    
    // Log para auditoria - adicionar performedBy obrigatório
    const userId = subject.startsWith('user:') ? subject.replace('user:', '') : 'system'
    
    structuredLogger.audit('ABAC_DECISION', {
      performedBy: userId,
      subject,
      object,
      action,
      context,
      allowed,
      responseTime,
      appliedPolicies: result.appliedPolicies
    })
    
    // Salvar log de acesso no banco
    await saveAccessLog(subject, object, action, result)
    
    return result
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    structuredLogger.error('ABAC permission check failed', {
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
  enforcer: AnyEnforcer,
  subject: string,
  object: string,
  action: string
): Promise<string[]> {
  try {
    const policies: string[][] = await enforcer.getFilteredPolicy(0, subject)
    const objectPolicies: string[][] = await enforcer.getFilteredPolicy(1, object)
    const actionPolicies: string[][] = await enforcer.getFilteredPolicy(2, action)

    // Combinar e filtrar políticas relevantes
    const relevantPolicies = [
      ...policies.map((p: string[]) => p.join(', ')),
      ...objectPolicies.map((p: string[]) => p.join(', ')),
      ...actionPolicies.map((p: string[]) => p.join(', '))
    ]
    
    return [...new Set(relevantPolicies)] // Remove duplicatas
  } catch (error) {
    structuredLogger.error('Failed to get applied policies', { 
      error: error instanceof Error ? error.message : String(error) 
    })
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
        ip: result.context.ip as string,
        userAgent: result.context.userAgent as string
      }
    })
  } catch (error) {
    structuredLogger.error('Failed to save access log', { 
      error: error instanceof Error ? error.message : String(error) 
    })
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
  context?: Record<string, unknown>
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
        performedBy: 'system', // TODO: passar userId real
        subject, 
        object, 
        action, 
        effect, 
        context 
      })
    }
    
    return added
  } catch (error) {
    structuredLogger.error('Failed to add ABAC policy', { 
      error: error instanceof Error ? error.message : String(error) 
    })
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
        performedBy: 'system', // TODO: passar userId real
        subject, 
        object, 
        action, 
        effect 
      })
    }
    
    return removed
  } catch (error) {
    structuredLogger.error('Failed to remove ABAC policy', { 
      error: error instanceof Error ? error.message : String(error) 
    })
    return false
  }
}

// Listar todas as políticas
export async function getAllABACPolicies(): Promise<string[][]> {
  try {
    const enforcer = await getEnforcer()
    return await enforcer.getPolicy()
  } catch (error) {
    structuredLogger.error('Failed to get ABAC policies', { 
      error: error instanceof Error ? error.message : String(error) 
    })
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
    structuredLogger.error('Failed to reload ABAC policies', { 
      error: error instanceof Error ? error.message : String(error) 
    })
    return false
  }
}

/**
 * 🎯 FUNÇÕES UTILITÁRIAS PARA INTEGRAÇÃO
 */

// Verificar se usuário é admin (compatibilidade)
// Essas funções aceitam tanto userId quanto email; preferem email quando informado
export async function isAdmin(userIdOrEmail: string, context: ABACContext = {}): Promise<boolean> {
  const subject = userIdOrEmail.includes('@') ? userIdOrEmail : `user:${userIdOrEmail}`
  const result = await checkABACPermission(subject, 'system:admin', 'access', context)
  return result.allowed
}

// Verificar se usuário pode acessar recurso
export async function canAccess(
  userIdOrEmail: string,
  resource: string,
  action: string = 'read',
  context: ABACContext = {}
): Promise<boolean> {
  const subject = userIdOrEmail.includes('@') ? userIdOrEmail : `user:${userIdOrEmail}`
  const result = await checkABACPermission(subject, resource, action, context)
  return result.allowed
}

// Verificar se usuário pode fazer ação em recurso específico
export async function hasPermission(
  userIdOrEmail: string,
  resource: string,
  action: string,
  context: ABACContext = {}
): Promise<AuthResult> {
  const subject = userIdOrEmail.includes('@') ? userIdOrEmail : `user:${userIdOrEmail}`
  return await checkABACPermission(subject, resource, action, context)
}

const abacEnforcer = {
  checkABACPermission,
  addABACPolicy,
  removeABACPolicy,
  getAllABACPolicies,
  reloadABACPolicies,
  isAdmin,
  canAccess,
  hasPermission
}

export default abacEnforcer
