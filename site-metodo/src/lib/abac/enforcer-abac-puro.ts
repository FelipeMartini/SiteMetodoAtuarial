/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import fs from 'fs'
import { newEnforcer } from 'casbin'
import { PrismaAdapter } from 'casbin-prisma-adapter'
import { prisma } from '@/lib/prisma'
import { structuredLogger } from '@/lib/logger'
import DatabaseLogger from '@/lib/logging/database-logger'

const _logger = structuredLogger

const ABAC_MODEL_PATH = path.join(process.cwd(), 'src/lib/abac/abac-model.conf')

export type ABACContext = Record<string, unknown>

export interface AuthResult {
  allowed: boolean
  reason: string
  appliedPolicies: string[]
  context: ABACContext
  timestamp: Date
  responseTime: number
}

let cachedEnforcer: unknown | null = null
let lastCacheTime = 0
const CACHE_TTL = 5 * 60 * 1000

const SUBJECT_CACHE_TTL = 5 * 60 * 1000
const emailToUserIdCache: Map<string, { id: string; ts: number }> = new Map()

function addCustomFunctions(enforcer: any) {
  try {
    enforcer.addFunction('contextMatch', (requestCtx: string, policyCtx: string) => {
      try {
        if (!policyCtx || policyCtx === '*') return true
        const reqContext = JSON.parse(requestCtx || '{}')
        const polContext = JSON.parse(policyCtx || '{}')
        for (const [key, value] of Object.entries(polContext)) {
          if ((reqContext as any)[key] !== value) return false
        }
        return true
      } catch (_err) {
        structuredLogger.error('Context match error', { error: _err instanceof Error ? _err.message : String(_err), requestCtx, policyCtx })
        return false
      }
    })
    // Função para comparar objetos com suporte a wildcard '*' (converte para regex)
    enforcer.addFunction('objMatch', (requestObj: string, policyObj: string) => {
      try {
        if (!policyObj || policyObj === '*') return true
        // escape regex special chars except '*'
        const escaped = String(policyObj).replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&')
        const regexStr = '^' + escaped.replace(/\\\*/g, '.*') + '$'
        const re = new RegExp(regexStr)
        return re.test(String(requestObj))
      } catch (err) {
        structuredLogger.error('objMatch error', { error: err instanceof Error ? err.message : String(err), requestObj, policyObj })
        return false
      }
    })
  } catch (err) {
    structuredLogger.warn('Failed to add custom functions to enforcer', { error: err instanceof Error ? err.message : String(err) })
  }
}

async function initializeEnforcer(): Promise<any> {
  const start = Date.now()
  const adapter = await PrismaAdapter.newAdapter(prisma)
  const enforcer = await newEnforcer(ABAC_MODEL_PATH)

  try {
    const setter = (enforcer as any).setAdapter
    if (typeof setter === 'function') {
      await setter.call(enforcer, adapter)
    }
  } catch (_err) {
    structuredLogger.warn('setAdapter failed', { error: _err instanceof Error ? _err.message : String(_err) })
  }

  addCustomFunctions(enforcer)

  try {
    await enforcer.loadPolicy()
  } catch (_err) {
    structuredLogger.warn('loadPolicy failed, attempting manual load', { error: _err instanceof Error ? _err.message : String(_err) })
    // Tentativa automática de correção: sanitizar registros no DB e tentar recarregar
    try {
      // import dinâmico para evitar que bundlers interpretem require/exports e causem erro
      const { spawnSync } = await import('child_process')
      const script = path.resolve(process.cwd(), 'scripts', 'sanitize-casbin-rules.cjs.js')
      structuredLogger.info('Running sanitize-casbin-rules script as auto-repair', { script })
      const res = spawnSync('node', [script], { stdio: 'inherit' })
      if (res && (res as any).error) structuredLogger.error('sanitize script failed to execute', { error: (res as any).error.message })
      else structuredLogger.info('sanitize script executed, retrying enforcer.loadPolicy()')
      await enforcer.loadPolicy()
    } catch (_repairErr) {
      structuredLogger.error('Automatic policy sanitization failed', { error: _repairErr instanceof Error ? _repairErr.message : String(_repairErr) })
      // segue para manual load
    try {
      const dbPolicies = await prisma.casbinRule.findMany()
      for (const p of dbPolicies) {
        const parts: string[] = []
        if (p.v0) parts.push(String(p.v0))
        if (p.v1) parts.push(String(p.v1))
        if (p.v2) parts.push(String(p.v2))
        if (p.v3) parts.push(String(p.v3))
        if (p.v4) parts.push(String(p.v4))
        if (p.v5) parts.push(String(p.v5))
        try {
          if (parts.length > 0) await enforcer.addPolicy(...parts)
        } catch (_addErr) {
          structuredLogger.error('Failed to add policy during manual load', { error: _addErr instanceof Error ? _addErr.message : String(_addErr), policy: parts })
        }
      }
    } catch (_dbErr) {
      structuredLogger.error('Failed to read policies from DB for manual load', { error: _dbErr instanceof Error ? _dbErr.message : String(_dbErr) })
      throw _dbErr
    }
  }
  }

  structuredLogger.info('ABAC enforcer initialized', { loadTime: Date.now() - start })
  return enforcer
}

export async function getEnforcer(): Promise<any> {
  const now = Date.now()
  if (cachedEnforcer && (now - lastCacheTime) < CACHE_TTL) return cachedEnforcer
  cachedEnforcer = await initializeEnforcer()
  lastCacheTime = now
  return cachedEnforcer
}

export async function checkABACPermission(subject: string, object: string, action: string, context: ABACContext = {}): Promise<AuthResult> {
  const start = Date.now()
  try {
  // Enforce strict email-only policy: attempt to normalize user:{id} -> email,
    // but always use email as the enforcement subject. Do not accept plain
    // user:{id} subjects for policy evaluation to avoid RBAC-style checks.
    const originalSubject = subject
    try {
      if (subject.startsWith('user:')) {
        const uid = subject.replace('user:', '')
        const u = await prisma.user.findUnique({ where: { id: uid }, select: { email: true } })
        if (u?.email) subject = u.email
        else {
          // If we cannot resolve to an email, set subject to an empty string so
          // that enforcer checks will fail (no RBAC fallback to user:id).
          subject = ''
        }
      }
    } catch (err) {
      structuredLogger.warn('Failed to normalize subject to email', { error: err instanceof Error ? err.message : String(err), subject: originalSubject })
      subject = ''
    }

    // Runtime enforcement: if subject is missing or not an email, in production
    // return denied immediately to avoid accidental RBAC access. In dev, warn
    // and continue (optionally allowing dev fallback elsewhere).
    if (!subject || !subject.includes('@')) {
      const msg = `ABAC subject not email-like after normalization: "${originalSubject}" -> "${subject}"`
      if (process.env.NODE_ENV === 'production') {
        structuredLogger.error(msg)
        return { allowed: false, reason: 'Invalid subject for ABAC (email required)', appliedPolicies: [], context, timestamp: new Date(), responseTime: Date.now() - start }
      } else {
        structuredLogger.warn(msg)
      }
    }
    const enforcer = await getEnforcer()
    let allowed = false

    try {
      // Passar contexto como quarto argumento para casar com request_definition r = sub,obj,act,ctx
      const ctxArg = JSON.stringify(context || {})
      allowed = !!(await enforcer.enforce(subject, object, action, ctxArg))
    } catch (_err) {
      structuredLogger.warn('Primary enforce failed, will try fallbacks', { error: _err instanceof Error ? _err.message : String(_err), subject, object, action })
    }

  if (!allowed) {
      // Strict policy evaluation: do not attempt RBAC-like fallbacks. Only
      // evaluate using the normalized email subject. However, keep a very small
      // fallback: if the subject is an empty string (couldn't normalize), we
      // skip additional checks and return denied.
      if (!subject) {
        // nothing more to do; denied
      } else {
        // fallback by scanning policies limited to email subjects (preserve
        // wildcard support but do not try user:id matches)
        try {
          const policies = await enforcer.getPolicy()
          for (const p of policies) {
            const pSub = String(p[0] || '')
            const pObj = String(p[1] || '')
            const pAct = String(p[2] || '')
            const pEff = p[3] ? String(p[3]) : 'allow'
            if (pEff !== 'allow') continue
            const subMatch = (pSub === '*' || pSub === subject) || (pSub.endsWith('*') && subject.startsWith(pSub.slice(0, -1)))
            const objMatch = (pObj === '*' || pObj === object) || (pObj.endsWith('*') && object.startsWith(pObj.slice(0, -1)))
            const actMatch = (pAct === '*' || pAct === action) || (pAct.endsWith('*') && action.startsWith(pAct.slice(0, -1)))
            if (subMatch && objMatch && actMatch) { allowed = true; break }
          }
  } catch (_err) { structuredLogger.error('Fallback policy check failed', { error: _err instanceof Error ? _err.message : String(_err) }) }
      }
    }

  const responseTime = Date.now() - start
  const result: AuthResult = { allowed, reason: allowed ? 'Access granted by ABAC policy' : 'Access denied by ABAC policy', appliedPolicies: await getAppliedPolicies(enforcer, subject, object, action), context, timestamp: new Date(), responseTime }

  // Log the decision using the normalized subject (email when available)
  structuredLogger.audit('ABAC_DECISION', { subject, object, action, context, allowed: result.allowed, responseTime: result.responseTime, appliedPolicies: result.appliedPolicies, performedBy: subject })
  
  // Registra no sistema de logging com banco de dados
  try {
    await DatabaseLogger.logAudit({
      action: 'ACCESS',
      resource: object,
      resourceId: `${object}:${action}`,
      success: result.allowed,
      context: {
        userId: subject,
        correlationId: DatabaseLogger.generateCorrelationId(),
        metadata: {
          subject,
          action,
          context,
          appliedPolicies: result.appliedPolicies,
          responseTime: result.responseTime,
          originalSubject,
        },
      },
    });

    // Se for negado, registra também no log de sistema
    if (!result.allowed) {
      await DatabaseLogger.logSystem({
        level: 'WARN',
        message: `Acesso negado: ${subject} tentou ${action} em ${object}`,
        module: 'abac',
        operation: 'permission_check',
        context: {
          userId: subject,
          metadata: {
            object,
            action,
            context,
            appliedPolicies: result.appliedPolicies,
            originalSubject,
          },
        },
      });
    }
  } catch (dbError) {
    structuredLogger.error('Failed to log ABAC decision to database', { error: dbError instanceof Error ? dbError.message : String(dbError) });
  }

  // Persist a lightweight log line for quick debugging in XLOGS
  try {
    const logsDir = path.resolve(process.cwd(), 'XLOGS')
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true })
    const logPath = path.join(logsDir, 'abac-enforcer.log')
    const entry = {
      ts: new Date().toISOString(),
      subject,
      object,
      action,
      allowed: result.allowed,
      reason: result.reason,
      responseTime: result.responseTime,
      appliedPoliciesCount: Array.isArray(result.appliedPolicies) ? result.appliedPolicies.length : 0,
      contextPreview: Object.keys(result.context || {}).length > 0 ? Object.fromEntries(Object.entries(result.context as any).slice(0, 5)) : {}
    }
    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n')
  } catch (e) {
    structuredLogger.error('Failed to write ABAC enforcer XLOGS line', { error: e instanceof Error ? e.message : String(e) })
  }

  await saveAccessLog(subject, object, action, result)
    return result
  } catch (error) {
    structuredLogger.error('ABAC permission check failed', { error: error instanceof Error ? error.message : String(error), subject, object, action, context })
    return { allowed: false, reason: `ABAC check failed: ${String(error)}`, appliedPolicies: [], context, timestamp: new Date(), responseTime: Date.now() - start }
  }
}

async function getAppliedPolicies(enforcer: any, subject: string, object: string, action: string): Promise<string[]> {
  try {
    const policies = await enforcer.getFilteredPolicy(0, subject)
    const objectPolicies = await enforcer.getFilteredPolicy(1, object)
    const actionPolicies = await enforcer.getFilteredPolicy(2, action)
    const relevantPolicies = [
      ...policies.map((p: string[]) => p.join(', ')),
      ...objectPolicies.map((p: string[]) => p.join(', ')),
      ...actionPolicies.map((p: string[]) => p.join(', '))
    ]
    return [...new Set(relevantPolicies)]
  } catch (error) {
    structuredLogger.error('Failed to get applied policies', { error: error instanceof Error ? error.message : String(error) })
    return []
  }
}

async function saveAccessLog(subject: string, object: string, action: string, result: AuthResult): Promise<void> {
  try {
    let userId: string | null = null
    if (subject.startsWith('user:')) userId = subject.replace('user:', '')
    else if (subject.includes('@')) {
      const cached = emailToUserIdCache.get(subject)
      if (cached && (Date.now() - cached.ts) < SUBJECT_CACHE_TTL) userId = cached.id
      else {
        try {
          const u = await prisma.user.findUnique({ where: { email: subject }, select: { id: true } })
          if (u) { userId = u.id; emailToUserIdCache.set(subject, { id: u.id, ts: Date.now() }) }
        } catch (err) {
          structuredLogger.error('Failed to resolve email when saving access log', { error: err instanceof Error ? err.message : String(err), subject })
        }
      }
    }

    await prisma.accessLog.create({ data: { userId, subject, object, action, allowed: result.allowed, ip: (result.context as any).ip, userAgent: (result.context as any).userAgent } })
  } catch (error) {
    structuredLogger.error('Failed to save access log', { error: error instanceof Error ? error.message : String(error) })
  }
}

export async function addABACPolicy(subject: string, object: string, action: string, effect: 'allow' | 'deny' = 'allow', context?: Record<string, unknown>): Promise<boolean> {
  try {
    const enforcer = await getEnforcer()
    const policy: any[] = [subject, object, action, effect]
    if (context && Object.keys(context).length > 0) policy.push(JSON.stringify(context))
    const added = await enforcer.addPolicy(...policy)
    if (added) { await enforcer.savePolicy(); structuredLogger.audit('ABAC_POLICY_ADDED', { subject, object, action, effect, context, performedBy: subject }) }
    return added
  } catch (error) {
    structuredLogger.error('Failed to add ABAC policy', { error: error instanceof Error ? error.message : String(error) })
    return false
  }
}

export async function removeABACPolicy(subject: string, object: string, action: string, effect: 'allow' | 'deny' = 'allow'): Promise<boolean> {
  try {
    const enforcer = await getEnforcer()
    const removed = await enforcer.removePolicy(subject, object, action, effect)
    if (removed) { await enforcer.savePolicy(); structuredLogger.audit('ABAC_POLICY_REMOVED', { subject, object, action, effect, performedBy: subject }) }
    return removed
  } catch (error) {
    structuredLogger.error('Failed to remove ABAC policy', { error: error instanceof Error ? error.message : String(error) })
    return false
  }
}

export async function getAllABACPolicies(): Promise<string[][]> {
  try { const enforcer = await getEnforcer(); return await enforcer.getPolicy() } catch (error) { structuredLogger.error('Failed to get ABAC policies', { error: error instanceof Error ? error.message : String(error) }); return [] }
}

export async function reloadABACPolicies(): Promise<boolean> {
  try { const enforcer = await getEnforcer(); await enforcer.loadPolicy(); cachedEnforcer = null; lastCacheTime = 0; structuredLogger.info('ABAC policies reloaded'); return true } catch (error) { structuredLogger.error('Failed to reload ABAC policies', { error: error instanceof Error ? error.message : String(error) }); return false }
}

// Essas funções aceitam um email (preferido) ou um userId. Se receber um email, usará ele como subject; caso contrário, prefixa com 'user:'.
/**
 * Nova API unificada: retorna o AuthResult completo (allowed + metadata).
 * Esta função é a fachada unificada para chamadas server-side que desejam
 * o resultado detalhado da checagem ABAC.
 */
export async function checkPermissionDetailed(subject: string, object: string, action: string, context: ABACContext = {}): Promise<AuthResult> {
  return await checkABACPermission(subject, object, action, context)
}


const abacEnforcerPuro = { checkABACPermission, checkPermissionDetailed, addABACPolicy, removeABACPolicy, getAllABACPolicies, reloadABACPolicies }

export default abacEnforcerPuro
