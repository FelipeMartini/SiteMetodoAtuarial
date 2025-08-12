import { newEnforcer, Enforcer as CasbinEnforcer } from 'casbin'
import { CustomPrismaAdapter } from './prisma-adapter'
import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs'
import {
  // Subject,
  // Resource,
  Context,
  AuthorizationRequest,
  AuthorizationResult,
  Enforcer,
  PolicyRule,
  AuthorizationError,
} from './types'

/**
 * ABAC Enforcer for Site Método Atuarial
 * Implements Casbin with custom Prisma adapter
 */

export class ABACEnforcer implements Enforcer {
  private enforcer: CasbinEnforcer | null = null
  private adapter: CustomPrismaAdapter
  private modelPath: string

  constructor() {
    this.adapter = new CustomPrismaAdapter(prisma)
    this.modelPath = path.join(process.cwd(), 'src/lib/abac/models/pure_abac_model.conf')
  }

  /**
   * Initialize the enforcer
   */
  async initialize(): Promise<void> {
    try {
      // Verificar se o arquivo de modelo existe
      if (!fs.existsSync(this.modelPath)) {
        throw new Error(`Model file not found: ${this.modelPath}`)
      }

      // Criar enforcer com adapter customizado
      this.enforcer = await newEnforcer(this.modelPath, this.adapter)

      // Carregar políticas do banco
      await this.enforcer.loadPolicy()

      console.log('ABAC Enforcer initialized successfully')
    } catch (_error) {
      console.error('Failed to initialize ABAC Enforcer:', String(_error))
      throw new AuthorizationError(
        'Failed to initialize authorization system',
        'ENFORCER_INIT_FAILED',
        _error instanceof Error ? { message: _error.message, stack: _error.stack } : { message: String(_error) }
      )
    }
  }

  /**
   * Ensure enforcer is initialized
   */
  private ensureInitialized(): void {
    if (!this.enforcer) {
      throw new AuthorizationError('Enforcer not initialized', 'ENFORCER_NOT_INITIALIZED')
    }
  }

  /**
   * Main ABAC authorization method with attribute evaluation
   */
  async enforce(request: AuthorizationRequest): Promise<AuthorizationResult> {
    this.ensureInitialized()

    try {
      // Prepare subject attributes
      const subject =
        typeof request.subject === 'string'
          ? { email: request.subject, authenticated: true, attributes: {} }
          : request.subject

      // Prepare object attributes
      const object =
        typeof request.object === 'string'
          ? { id: request.object, type: 'resource', attributes: {} }
          : request.object

      // Prepare context with current time attributes
      const context = request.context || {}
      const now = new Date()
      const enrichedContext = {
        ...context,
        time: now,
        hour: now.getHours(),
        attributes: (context as { attributes?: Record<string, unknown> }).attributes || {},
      }

      const startTime = Date.now()

      // ABAC enforcement with all attributes
      const allowed = await this.enforcer!.enforce(subject, object, request.action, enrichedContext)

      const endTime = Date.now()

      const result: AuthorizationResult = {
        allowed,
        reason: allowed ? 'Access granted by ABAC policy' : 'No matching ABAC policy found',
        timestamp: new Date(),
      }

      // Log da decisão de autorização
      await this.logAccess({
        userId: (subject as { id?: string; email?: string }).id || subject.email,
        resource: object.id,
        action: request.action,
        result: allowed ? 'allow' : 'deny',
        reason: result.reason,
        context: enrichedContext,
        responseTime: endTime - startTime,
      })

      return result
    } catch (_error) {
      console.error('ABAC authorization error:')
      throw new AuthorizationError(
        'ABAC authorization check failed',
        'AUTHORIZATION_FAILED',
        _error instanceof Error ? { message: _error.message, stack: _error.stack } : { message: String(_error) }
      )
    }
  }

  /**
   * Add a policy
   */
  async addPolicy(policy: PolicyRule): Promise<boolean> {
    this.ensureInitialized()

    try {
      const added = await this.enforcer!.addPolicy(
        policy.subject,
        policy.object,
        policy.action,
        policy.effect
      )

      if (added) {
        await this.enforcer!.savePolicy()
      }

      return added
    } catch (_error) {
      console.error('Error adding policy:', String(_error))
      return false
    }
  }

  /**
   * Remove a policy
   */
  async removePolicy(policy: PolicyRule): Promise<boolean> {
    this.ensureInitialized()

    try {
      const removed = await this.enforcer!.removePolicy(
        policy.subject,
        policy.object,
        policy.action,
        policy.effect
      )

      if (removed) {
        await this.enforcer!.savePolicy()
      }

      return removed
    } catch (_error) {
      console.error('Error removing policy:', String(_error))
      return false
    }
  }

  /**
   * Get all policies
   */
  async getAllPolicies(): Promise<PolicyRule[]> {
    this.ensureInitialized()

    try {
      const policies = await this.enforcer!.getPolicy()

      return policies.map((policy, index) => ({
        id: `policy_${index}`,
        subject: policy[0],
        object: policy[1],
        action: policy[2],
        effect: (policy[3] || 'allow') as 'allow' | 'deny',
        description: `Policy for ${policy[0]} to ${policy[2]} ${policy[1]}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    } catch (_error) {
      console.error('Error getting policies:', String(_error))
      return []
    }
  }

  /**
   * Log access attempt for pure ABAC
   */
  private async logAccess(logData: {
    userId: string
    resource: string
    action: string
    result: 'allow' | 'deny'
    reason?: string
    context?: Context
    responseTime?: number
  }): Promise<void> {
    try {
      await prisma.accessLog.create({
        data: {
          userId: logData.userId,
          resource: logData.resource,
          action: logData.action,
          result: logData.result,
          reason: logData.reason,
          context: logData.context ? JSON.stringify(logData.context) : null,
          ipAddress: logData.context?.ip,
          userAgent: logData.context?.userAgent,
        },
      })
    } catch (_error) {
      console.error('Error logging access:')
      // Não propagar erro de log para não afetar a autorização
    }
  }

  /**
   * Initialize default ABAC policies
   */
  async initializeDefaultPolicies(): Promise<void> {
    this.ensureInitialized()

    const defaultPolicies = [
      // Admin email can access everything
      ['r.sub.email == "admin@metodoatuarial.com"', 'r.obj.match("/.*")', 'read', 'true', 'allow'],
      ['r.sub.email == "admin@metodoatuarial.com"', 'r.obj.match("/.*")', 'write', 'true', 'allow'],
      [
        'r.sub.email == "admin@metodoatuarial.com"',
        'r.obj.match("/.*")',
        'delete',
        'true',
        'allow',
      ],

      // Users can access their own data
      ['r.sub.id == r.obj.ownerId', 'r.obj.type == "user_data"', 'read', 'true', 'allow'],
      ['r.sub.id == r.obj.ownerId', 'r.obj.type == "user_data"', 'write', 'true', 'allow'],

      // Authenticated users can access public content
      ['r.sub.authenticated == true', 'r.obj.type == "public"', 'read', 'true', 'allow'],

      // Department-based access
      ['r.sub.department == "actuarial"', 'r.obj.type == "calculation"', 'read', 'true', 'allow'],
      [
        'r.sub.department == "actuarial" && r.sub.experience > 5',
        'r.obj.type == "calculation"',
        'write',
        'true',
        'allow',
      ],
    ]

    try {
      for (const policy of defaultPolicies) {
        await this.enforcer!.addPolicy(...policy)
      }

      await this.enforcer!.savePolicy()
      console.log('Default ABAC policies initialized')
    } catch (_error) {
      console.error('Error initializing default policies:')
    }
  }

  /**
   * Reload policies from database
   */
  async reloadPolicies(): Promise<void> {
    this.ensureInitialized()

    try {
      await this.enforcer!.loadPolicy()
      console.log('Policies reloaded successfully')
    } catch (_error) {
      console.error('Error reloading policies:')
      throw new AuthorizationError('Failed to reload policies', 'POLICY_RELOAD_FAILED', _error instanceof Error ? { message: _error.message, stack: _error.stack } : { message: String(_error) })
    }
  }
}

// Singleton instance
let enforcerInstance: ABACEnforcer | null = null

/**
 * Get the singleton enforcer instance
 */
export async function getEnforcer(): Promise<ABACEnforcer> {
  if (!enforcerInstance) {
    enforcerInstance = new ABACEnforcer()
    await enforcerInstance.initialize()
  }

  return enforcerInstance
}
