import { newEnforcer, Enforcer as CasbinEnforcer } from 'casbin';
import { CustomPrismaAdapter } from './prisma-adapter';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs';
import {
  // Subject,
  // Resource,
  Context,
  AuthorizationRequest,
  AuthorizationResult,
  Enforcer,
  PolicyRule,
  AuthorizationError
} from './types';

/**
 * ABAC Enforcer for Site Método Atuarial
 * Implements Casbin with custom Prisma adapter
 */

export class ABACEnforcer implements Enforcer {
  private enforcer: CasbinEnforcer | null = null;
  private adapter: CustomPrismaAdapter;
  private modelPath: string;

  constructor() {
    this.adapter = new CustomPrismaAdapter(prisma);
    this.modelPath = path.join(process.cwd(), 'src/lib/abac/models/rbac_model.conf');
  }

  /**
   * Initialize the enforcer
   */
  async initialize(): Promise<void> {
    try {
      // Verificar se o arquivo de modelo existe
      if (!fs.existsSync(this.modelPath)) {
        throw new Error(`Model file not found: ${this.modelPath}`);
      }

      // Criar enforcer com adapter customizado
      this.enforcer = await newEnforcer(this.modelPath, this.adapter);
      
      // Carregar políticas do banco
      await this.enforcer.loadPolicy();
      
      console.log('ABAC Enforcer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ABAC Enforcer:', error);
      throw new AuthorizationError(
        'Failed to initialize authorization system',
        'ENFORCER_INIT_FAILED',
        error
      );
    }
  }

  /**
   * Ensure enforcer is initialized
   */
  private ensureInitialized(): void {
    if (!this.enforcer) {
      throw new AuthorizationError(
        'Enforcer not initialized',
        'ENFORCER_NOT_INITIALIZED'
      );
    }
  }

  /**
   * Main authorization method
   */
  async enforce(request: AuthorizationRequest): Promise<AuthorizationResult> {
    this.ensureInitialized();

    try {
      const subject = typeof request.subject === 'string' 
        ? request.subject 
        : request.subject.email;
      
      const object = typeof request.object === 'string'
        ? request.object
        : request.object.id;

      const startTime = Date.now();
      const allowed = await this.enforcer!.enforce(subject, object, request.action);
      const endTime = Date.now();

      const result: AuthorizationResult = {
        allowed,
        reason: allowed ? 'Access granted by policy' : 'No matching policy found',
        timestamp: new Date()
      };

      // Log da decisão de autorização
      await this.logAccess({
        userId: typeof request.subject === 'string' ? request.subject : request.subject.id,
        resource: object,
        action: request.action,
        result: allowed ? 'allow' : 'deny',
        reason: result.reason,
        context: request.context,
        responseTime: endTime - startTime
      });

      return result;
    } catch (error) {
      console.error('Authorization error:', error);
      throw new AuthorizationError(
        'Authorization check failed',
        'AUTHORIZATION_FAILED',
        error
      );
    }
  }

  /**
   * Add a policy
   */
  async addPolicy(policy: PolicyRule): Promise<boolean> {
    this.ensureInitialized();

    try {
      const added = await this.enforcer!.addPolicy(
        policy.subject,
        policy.object,
        policy.action,
        policy.effect
      );

      if (added) {
        await this.enforcer!.savePolicy();
      }

      return added;
    } catch (error) {
      console.error('Error adding policy:', error);
      return false;
    }
  }

  /**
   * Remove a policy
   */
  async removePolicy(policy: PolicyRule): Promise<boolean> {
    this.ensureInitialized();

    try {
      const removed = await this.enforcer!.removePolicy(
        policy.subject,
        policy.object,
        policy.action,
        policy.effect
      );

      if (removed) {
        await this.enforcer!.savePolicy();
      }

      return removed;
    } catch (error) {
      console.error('Error removing policy:', error);
      return false;
    }
  }

  /**
   * Get all policies
   */
  async getAllPolicies(): Promise<PolicyRule[]> {
    this.ensureInitialized();

    try {
      const policies = await this.enforcer!.getPolicy();
      
      return policies.map((policy, index) => ({
        id: `policy_${index}`,
        subject: policy[0],
        object: policy[1],
        action: policy[2],
        effect: (policy[3] || 'allow') as 'allow' | 'deny',
        description: `Policy for ${policy[0]} to ${policy[2]} ${policy[1]}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    } catch (error) {
      console.error('Error getting policies:', error);
      return [];
    }
  }

  /**
   * Add role for user
   */
  async addRoleForUser(user: string, role: string): Promise<boolean> {
    this.ensureInitialized();

    try {
      const added = await this.enforcer!.addRoleForUser(user, role);
      
      if (added) {
        await this.enforcer!.savePolicy();
      }

      return added;
    } catch (error) {
      console.error('Error adding role for user:', error);
      return false;
    }
  }

  /**
   * Delete role for user
   */
  async deleteRoleForUser(user: string, role: string): Promise<boolean> {
    this.ensureInitialized();

    try {
      const deleted = await this.enforcer!.deleteRoleForUser(user, role);
      
      if (deleted) {
        await this.enforcer!.savePolicy();
      }

      return deleted;
    } catch (error) {
      console.error('Error deleting role for user:', error);
      return false;
    }
  }

  /**
   * Get roles for user
   */
  async getRolesForUser(user: string): Promise<string[]> {
    this.ensureInitialized();

    try {
      return await this.enforcer!.getRolesForUser(user);
    } catch (error) {
      console.error('Error getting roles for user:', error);
      return [];
    }
  }

  /**
   * Get users for role
   */
  async getUsersForRole(role: string): Promise<string[]> {
    this.ensureInitialized();

    try {
      return await this.enforcer!.getUsersForRole(role);
    } catch (error) {
      console.error('Error getting users for role:', error);
      return [];
    }
  }

  /**
   * Check if user has role
   */
  async hasRoleForUser(user: string, role: string): Promise<boolean> {
    this.ensureInitialized();

    try {
      return await this.enforcer!.hasRoleForUser(user, role);
    } catch (error) {
      console.error('Error checking role for user:', error);
      return false;
    }
  }

  /**
   * Log access attempt
   */
  private async logAccess(logData: {
    userId: string;
    resource: string;
    action: string;
    result: 'allow' | 'deny';
    reason?: string;
    context?: Context;
    responseTime?: number;
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
          userAgent: logData.context?.userAgent
        }
      });
    } catch (error) {
      console.error('Error logging access:', error);
      // Não propagar erro de log para não afetar a autorização
    }
  }

  /**
   * Initialize default policies
   */
  async initializeDefaultPolicies(): Promise<void> {
    this.ensureInitialized();

    const defaultPolicies = [
      // Admin permissions
      ['admin', '/admin/*', 'read', 'allow'],
      ['admin', '/admin/*', 'write', 'allow'],
      ['admin', '/admin/*', 'delete', 'allow'],
      ['admin', '/area-cliente/*', 'read', 'allow'],
      ['admin', '/area-cliente/*', 'write', 'allow'],
      
      // User permissions
      ['user', '/area-cliente/perfil', 'read', 'allow'],
      ['user', '/area-cliente/perfil', 'write', 'allow'],
      ['user', '/area-cliente/dashboard-admin', 'read', 'allow'],
      
      // Actuarial permissions
      ['actuarial', '/area-cliente/calculos-atuariais', 'read', 'allow'],
      ['actuarial', '/area-cliente/calculos-atuariais', 'write', 'allow'],
      
      // Public permissions
      ['*', '/', 'read', 'allow'],
      ['*', '/login', 'read', 'allow'],
      ['*', '/criar-conta', 'read', 'allow'],
      ['*', '/sobre', 'read', 'allow']
    ];

    try {
      for (const policy of defaultPolicies) {
        await this.enforcer!.addPolicy(...policy);
      }
      
      await this.enforcer!.savePolicy();
      console.log('Default policies initialized');
    } catch (error) {
      console.error('Error initializing default policies:', error);
    }
  }

  /**
   * Reload policies from database
   */
  async reloadPolicies(): Promise<void> {
    this.ensureInitialized();
    
    try {
      await this.enforcer!.loadPolicy();
      console.log('Policies reloaded successfully');
    } catch (error) {
      console.error('Error reloading policies:', error);
      throw new AuthorizationError(
        'Failed to reload policies',
        'POLICY_RELOAD_FAILED',
        error
      );
    }
  }
}

// Singleton instance
let enforcerInstance: ABACEnforcer | null = null;

/**
 * Get the singleton enforcer instance
 */
export async function getEnforcer(): Promise<ABACEnforcer> {
  if (!enforcerInstance) {
    enforcerInstance = new ABACEnforcer();
    await enforcerInstance.initialize();
  }
  
  return enforcerInstance;
}
