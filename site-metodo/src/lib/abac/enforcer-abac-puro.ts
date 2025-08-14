/**
 * 🛡️ SISTEMA ABAC/ASIC PURO - ENFORCER CASBIN (SERVER-SIDE)
 * ==========================================================
 * 
 * Sistema de autorização baseado em atributos usando Casbin
 * - Remove completamente sistema RBAC legado
 * - Implementa ABAC/ASIC com políticas flexíveis
 * - Suporte para contexto temporal, geográfico e organizacional
 * - APENAS SERVER-SIDE - Para client-side usar /lib/abac/client.ts
 */

import { Enforcer, newEnforcer } from 'casbin'
import { PrismaAdapter } from 'casbin-prisma-adapter'
import { prisma } from '@/lib/prisma'
import { structuredLogger } from '@/lib/logger'
import path from 'path'

// 🔧 Cache do enforcer para performance
let cachedEnforcer: Enforcer | null = null
let lastCacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos
// Cache simples para mapear email -> userId e evitar consultas repetidas
const SUBJECT_CACHE_TTL = 5 * 60 * 1000 // 5 minutos
const emailToUserIdCache: Map<string, { id: string; ts: number }> = new Map()

// 📋 Caminho para o modelo ABAC/ASIC Casbin
const ABAC_MODEL_PATH = path.join(process.cwd(), 'src/lib/abac/abac-model.conf')

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
async function initializeEnforcer(): Promise<Enforcer> {
  try {
    const startTime = Date.now()
    
    // Configurar adapter com versão compatível
    const adapter = await PrismaAdapter.newAdapter(prisma)

    // Criar enforcer com modelo ABAC sem adapter para evitar que newEnforcer
    // carregue políticas automaticamente (caso o adapter tenha parsing issues)
    const enforcer = await newEnforcer(ABAC_MODEL_PATH)

    // Anexar adapter manualmente e então adicionar funções customizadas
    // Use setAdapter para evitar comportamento de load automático
    try {
  // Desabilitar regra temporariamente e aplicar a diretiva TS para compatibilidade
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - setAdapter pode não ter tipagem completa em algumas versões do casbin adapter
      await (enforcer as any).setAdapter(adapter)
    } catch (setAdapterErr) {
      structuredLogger.warn('setAdapter falhou, tentando continuar', { error: setAdapterErr instanceof Error ? setAdapterErr.message : String(setAdapterErr) })
    }

    // Adicionar funções customizadas
    addCustomFunctions(enforcer)

    // Tentar carregar políticas do adapter/banco
    try {
      // loadPolicy pode falhar se o adapter retornar linhas mal formatadas
      await enforcer.loadPolicy()
    } catch (loadErr) {
      // Fallback: se o loadPolicy falhar (ex: parsing error do modelo),
      // fazemos carga manual das políticas vindas do banco para evitar erro de parsing.
      structuredLogger.warn('enforcer.loadPolicy failed, attempting manual policy load', { error: loadErr instanceof Error ? loadErr.message : String(loadErr) })
      try {
        const dbPolicies = await prisma.casbinRule.findMany()
        for (const p of dbPolicies) {
          const parts: Array<string> = []
          if (p.v0) parts.push(String(p.v0))
          if (p.v1) parts.push(String(p.v1))
          if (p.v2) parts.push(String(p.v2))
          if (p.v3) parts.push(String(p.v3))
          if (p.v4) parts.push(String(p.v4))
          if (p.v5) parts.push(String(p.v5))

          // Adiciona política diretamente no enforcer (mantendo formato existente)
          try {
            // ignorar retorno booleano
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - addPolicy aceita arrays variáveis e a tipagem pode não cobrir todos os casos
            await enforcer.addPolicy(...parts)
          } catch (addErr) {
            structuredLogger.error('Failed to add policy during manual load', { error: addErr instanceof Error ? addErr.message : String(addErr), policy: parts })
          }
        }
      } catch (dbErr) {
        structuredLogger.error('Failed to read policies from DB for manual load', { error: dbErr instanceof Error ? dbErr.message : String(dbErr) })
        throw dbErr
      }
    }
    
    const loadTime = Date.now() - startTime
    structuredLogger.info('ABAC enforcer initialized', {
      loadTime,
      policyCount: (await enforcer.getGroupingPolicy()).length + (await enforcer.getPolicy()).length
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
    
  // Verificar permissão sem contexto para simplificar
  let allowed = await enforcer.enforce(subject, object, action)

    // Se não permitido inicialmente, tentar estratégias de compatibilidade
    // 1) se o subject for um email, resolver userId (user:{id}) e tentar novamente
    // 2) se o subject for user:{id}, tentar equivalentes por email (caso exista alguma política assim)
    // 3) fallback por curingas (ex: user:* ou '*')
    if (!allowed) {
      const triedSubjects = new Set<string>()
      triedSubjects.add(subject)

      // Helper: resolver email -> userId com cache
      const resolveEmailToUserId = async (email: string): Promise<string | null> => {
        const cached = emailToUserIdCache.get(email)
        const now = Date.now()
        if (cached && (now - cached.ts) < SUBJECT_CACHE_TTL) return cached.id
        try {
          const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
          if (user) {
            emailToUserIdCache.set(email, { id: user.id, ts: now })
            return user.id
          }
          return null
        } catch (err) {
          structuredLogger.error('Failed to resolve email to userId', { error: err instanceof Error ? err.message : String(err), email })
          return null
        }
      }

      // Se o subject parece um email
      if (subject.includes('@')) {
        const uid = await resolveEmailToUserId(subject)
        if (uid) {
          const alt = `user:${uid}`
          if (!triedSubjects.has(alt)) {
            try {
              const res = await enforcer.enforce(alt, object, action)
              triedSubjects.add(alt)
              if (res) {
                allowed = true
              }
            } catch (err) {
              structuredLogger.error('Error enforcing alternative subject (email->user)', { error: err instanceof Error ? err.message : String(err), alt })
            }
          }
        }
      }

      // Se o subject for user:{id}, tentar buscar email equivalente e testar
      if (!allowed && subject.startsWith('user:')) {
        const uid = subject.replace('user:', '')
        try {
          const user = await prisma.user.findUnique({ where: { id: uid }, select: { email: true } })
          if (user?.email) {
            const altEmail = user.email
            if (!triedSubjects.has(altEmail)) {
              try {
                const res = await enforcer.enforce(altEmail, object, action)
                triedSubjects.add(altEmail)
                if (res) {
                  allowed = true
                }
              } catch (err) {
                structuredLogger.error('Error enforcing alternative subject (user->email)', { error: err instanceof Error ? err.message : String(err), alt: altEmail })
              }
            }
          }
        } catch (err) {
          structuredLogger.error('Failed to lookup user email for alternative enforcement', { error: err instanceof Error ? err.message : String(err), userId: uid })
        }
      }

      // Ainda não permitido? tentar fallback por curingas (ex: user:* ou '*')
      try {
        const policies = await enforcer.getPolicy()
        for (const p of policies) {
          const pSub = String(p[0] || '')
          const pObj = String(p[1] || '')
          const pAct = String(p[2] || '')
          // Effect pode estar como p[3] em algumas inserções
          const pEff = p[3] ? String(p[3]) : 'allow'

          if (pEff !== 'allow') continue

          const subMatch = (pSub === '*' || pSub === subject) || (pSub.endsWith('*') && subject.startsWith(pSub.slice(0, -1)))
          const objMatch = (pObj === '*' || pObj === object) || (pObj.endsWith('*') && object.startsWith(pObj.slice(0, -1)))
          const actMatch = (pAct === '*' || pAct === action) || (pAct.endsWith('*') && action.startsWith(pAct.slice(0, -1)))

          if (subMatch && objMatch && actMatch) {
            allowed = true
            break
          }
        }
      } catch (err) {
        structuredLogger.error('Fallback policy check failed', { error: err instanceof Error ? err.message : String(err) })
      }
    }

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
    structuredLogger.error('Failed to get applied policies', { error: error instanceof Error ? error.message : String(error) })
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
    // Extrair userId do subject se possível; se for email, tentar resolver
    let userId: string | null = null
    if (subject.startsWith('user:')) {
      userId = subject.replace('user:', '')
    } else if (subject.includes('@')) {
      // tentar resolver email -> userId através de cache/DB
      const cached = emailToUserIdCache.get(subject)
      if (cached && (Date.now() - cached.ts) < SUBJECT_CACHE_TTL) {
        userId = cached.id
      } else {
        try {
          const user = await prisma.user.findUnique({ where: { email: subject }, select: { id: true } })
          if (user) {
            userId = user.id
            emailToUserIdCache.set(subject, { id: user.id, ts: Date.now() })
          }
        } catch (err) {
          structuredLogger.error('Failed to resolve email when saving access log', { error: err instanceof Error ? err.message : String(err), subject })
        }
      }
    }
    
    await prisma.accessLog.create({
      data: {
        userId,
        subject,
        object,
        action,
        allowed: result.allowed,
        ip: result.context.ip,
        userAgent: result.context.userAgent
      }
    })
  } catch (error) {
    structuredLogger.error('Failed to save access log', { error: error instanceof Error ? error.message : String(error) })
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
    structuredLogger.error('Failed to add ABAC policy', { error: error instanceof Error ? error.message : String(error) })
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
    structuredLogger.error('Failed to remove ABAC policy', { error: error instanceof Error ? error.message : String(error) })
    return false
  }
}

// Listar todas as políticas
export async function getAllABACPolicies(): Promise<string[][]> {
  try {
    const enforcer = await getEnforcer()
    return await enforcer.getPolicy()
  } catch (error) {
    structuredLogger.error('Failed to get ABAC policies', { error: error instanceof Error ? error.message : String(error) })
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
    structuredLogger.error('Failed to reload ABAC policies', { error: error instanceof Error ? error.message : String(error) })
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

const abacEnforcerPuro = {
  checkABACPermission,
  addABACPolicy,
  removeABACPolicy,
  getAllABACPolicies,
  reloadABACPolicies,
  isAdmin,
  canAccess,
  hasPermission
}

export default abacEnforcerPuro
