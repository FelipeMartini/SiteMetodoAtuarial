/**
 * 🏗️ TIPOS TYPESCRIPT PARA SISTEMA ABAC PURO
 * ==========================================
 * 
 * Define tipos para sistema de autorização baseado em atributos
 * Remove completamente referências ao sistema RBAC legado
 */

import { DefaultSession, DefaultUser } from 'next-auth'


// 🔐 EXTENSÕES AUTH.JS V5 PARA ABAC
// ================================

declare module 'next-auth' {
  /**
   * Sessão do usuário estendida para ABAC
   */
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      
      // Atributos ABAC
      isActive: boolean
      department?: string | null
      location?: string | null
      jobTitle?: string | null
      
      // Contexto temporal
      validFrom?: Date | null
      validUntil?: Date | null
      
      // MFA
      mfaEnabled: boolean
      
      // Metadados de sessão
      lastLogin?: Date | null
      loginCount: number
    } & DefaultSession['user']
  }

  /**
   * Usuário estendido para ABAC
   */
  interface User extends DefaultUser {
    id: string
    email: string
    name?: string | null
    image?: string | null
    
    // Atributos ABAC
    isActive: boolean
    department?: string | null
    location?: string | null
    jobTitle?: string | null
    
    // Contexto temporal
    validFrom?: Date | null
    validUntil?: Date | null
    
    // MFA
    mfaEnabled: boolean
    
    // Metadados
    lastLogin?: Date | null
    loginCount: number
    failedLogins: number
    createdAt: Date
    updatedAt: Date
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWT estendido para ABAC
   */
  interface JWT {
    id: string
    email: string
    name?: string | null
    
    // Atributos ABAC
    isActive: boolean
    department?: string | null
    location?: string | null
    jobTitle?: string | null
    
    // Contexto temporal
    validFrom?: Date | null
    validUntil?: Date | null
    
    // MFA
    mfaEnabled: boolean
    
    // Cache de sessão
    lastLogin?: Date | null
    loginCount: number
  }
}

// 🛡️ TIPOS CORE PARA ABAC
// =======================

/**
 * Contexto para decisões ABAC
 */
export interface ABACContext {
  // Contexto temporal
  time?: string | Date
  timeZone?: string
  
  // Contexto geográfico
  location?: string
  country?: string
  region?: string
  
  // Contexto organizacional
  department?: string
  team?: string
  project?: string
  
  // Contexto técnico
  ip?: string
  userAgent?: string
  device?: string
  
  // Contexto de segurança
  mfaVerified?: boolean
  sessionAge?: number
  riskLevel?: 'low' | 'medium' | 'high'
  
  // Contexto de dados
  dataClassification?: 'public' | 'internal' | 'confidential' | 'restricted'
  sensitive?: boolean
  
  // Contexto de urgência/prioridade
  urgency?: 'low' | 'normal' | 'high' | 'critical'
  
  // Contexto adicional (extensível)
  [key: string]: unknown
}

/**
 * Resultado de autorização ABAC
 */
export interface ABACResult {
  allowed: boolean
  reason: string
  appliedPolicies: string[]
  context: ABACContext
  timestamp: Date
  responseTime: number
  decision: 'allow' | 'deny' | 'indeterminate'
}

/**
 * Requisição ABAC
 */
export interface ABACRequest {
  subject: string      // user:123, role:admin, dept:finance
  object: string       // resource:users, api:/users/*, file:/docs/sensitive.pdf
  action: string       // read, write, delete, admin, export
  context: ABACContext
}

/**
 * Política ABAC
 */
export interface ABACPolicy {
  id: string
  name: string
  subject: string
  object: string
  action: string
  effect: 'allow' | 'deny'
  conditions?: Record<string, unknown>
  description?: string
  category?: string
  priority: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy?: string
}

// 📊 TIPOS PARA AUDITORIA E LOGS
// =============================

/**
 * Log de acesso ABAC
 */
export interface ABACAccessLog {
  id: string
  userId?: string | null
  subject: string
  object: string
  action: string
  result: 'allow' | 'deny' | 'indeterminate'
  reason?: string
  context: ABACContext
  responseTime?: number
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

/**
 * Evento de auditoria ABAC
 */
export interface ABACauditEvent {
  id: string
  userId?: string | null
  action: string
  target?: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  success: boolean
  timestamp: Date
}

// 🔧 TIPOS UTILITÁRIOS
// ===================

/**
 * Configuração do enforcer ABAC
 */
export interface ABACConfig {
  cacheTimeout: number
  enableAuditLog: boolean
  enableAccessLog: boolean
  defaultDeny: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

/**
 * Estatísticas ABAC
 */
export interface ABACStats {
  totalRequests: number
  allowedRequests: number
  deniedRequests: number
  averageResponseTime: number
  policiesCount: number
  usersCount: number
  lastUpdate: Date
}

/**
 * Métricas de performance ABAC
 */
export interface ABACMetrics {
  requestsPerSecond: number
  averageLatency: number
  p95Latency: number
  p99Latency: number
  errorRate: number
  cacheHitRate: number
}

// 🎯 TIPOS PARA INTEGRAÇÃO COM APIS
// ================================

/**
 * Middleware ABAC para rotas
 */
export interface ABACMiddlewareOptions {
  resource: string
  action: string
  context?: Partial<ABACContext>
  onDenied?: (result: ABACResult) => Response
  onError?: (error: Error) => Response
}

/**
 * Decorador para proteção de rotas
 */
export interface RouteProtection {
  requireAuth: boolean
  resource: string
  action: string
  contextBuilder?: (req: Request) => ABACContext
}

/**
 * Resultado de verificação de permissão para UI
 */
export interface PermissionCheck {
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  canAdmin: boolean
  reasons: Record<string, string>
  context: ABACContext
}

// 🔄 TIPOS PARA MIGRAÇÃO E COMPATIBILIDADE
// ========================================

/**
 * Estado da migração RBAC -> ABAC
 */
export interface MigrationStatus {
  phase: 'analysis' | 'preparation' | 'migration' | 'validation' | 'cleanup' | 'complete'
  rbacElementsRemaining: number
  abacPoliciesCreated: number
  usersUpdated: number
  errors: string[]
  warnings: string[]
  startTime: Date
  endTime?: Date
}

/**
 * Relatório de migração
 */
export interface MigrationReport {
  status: MigrationStatus
  removedElements: {
    tables: string[]
    fields: string[]
    enums: string[]
    functions: string[]
    files: string[]
  }
  createdElements: {
    policies: number
    attributes: number
    contexts: number
  }
  validationResults: {
    functionalTests: boolean
    performanceTests: boolean
    securityTests: boolean
  }
}

// 🏷️ RE-EXPORTS DE TIPOS PRISMA RELEVANTES
// ========================================

export type {
  User,
  AuthorizationPolicy,
  AccessLog,
  AuditLog,
  CasbinRule
} from '@prisma/client'

// 🎯 TIPOS GLOBAIS PARA APLICAÇÃO
// ==============================

export interface AppUser extends User {
  permissions?: PermissionCheck
  abacContext?: ABACContext
}

export interface AppSession {
  user: AppUser
  permissions: PermissionCheck
  context: ABACContext
  expiresAt: Date
}

const NextAuthTypes = {
  ABACContext,
  ABACResult,
  ABACRequest,
  ABACPolicy,
  ABACAccessLog,
  ABACauditEvent,
  ABACConfig,
  ABACStats,
  ABACMetrics,
  PermissionCheck,
  MigrationStatus,
  MigrationReport,
  AppUser,
  AppSession
}

export default NextAuthTypes
