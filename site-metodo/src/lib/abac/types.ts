'use client';

/**
 * ABAC System Types and Interfaces
 * Site Método Atuarial - Authorization System
 */

// Basic authorization interfaces
export interface Subject {
  id: string;
  email: string;
  role: string;
  department?: string;
  accessLevel?: number;
  attributes?: Record<string, any>;
}

export interface Resource {
  id: string;
  type: string;
  owner_id?: string;
  department?: string;
  attributes?: Record<string, any>;
}

export interface Context {
  time?: Date;
  location?: string;
  device?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: Record<string, unknown>;
}

export interface PolicyRule {
  id: string;
  subject: string;
  object: string;
  action: string;
  effect: 'allow' | 'deny';
  conditions?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  inherits?: string[];
  attributes?: Record<string, any>;
}

// Casbin enforcer interface
export interface AuthorizationRequest {
  subject: Subject | string;
  object: Resource | string;
  action: string;
  context?: Context;
}

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
  appliedPolicies?: string[];
  timestamp: Date;
}

// Policy management interfaces
export interface PolicyManager {
  addPolicy(policy: PolicyRule): Promise<boolean>;
  removePolicy(policy: PolicyRule): Promise<boolean>;
  getAllPolicies(): Promise<PolicyRule[]>;
  getPoliciesForSubject(subject: string): Promise<PolicyRule[]>;
  getPoliciesForObject(object: string): Promise<PolicyRule[]>;
}

export interface RoleManager {
  addRole(role: RoleDefinition): Promise<boolean>;
  removeRole(roleId: string): Promise<boolean>;
  getRoles(): Promise<RoleDefinition[]>;
  assignRoleToUser(userId: string, roleId: string): Promise<boolean>;
  removeRoleFromUser(userId: string, roleId: string): Promise<boolean>;
  getUserRoles(userId: string): Promise<string[]>;
}

// Enforcement interfaces
export interface Enforcer {
  enforce(request: AuthorizationRequest): Promise<AuthorizationResult>;
  addPolicy(policy: PolicyRule): Promise<boolean>;
  removePolicy(policy: PolicyRule): Promise<boolean>;
  getAllPolicies(): Promise<PolicyRule[]>;
  addRoleForUser(user: string, role: string): Promise<boolean>;
  deleteRoleForUser(user: string, role: string): Promise<boolean>;
  getRolesForUser(user: string): Promise<string[]>;
  getUsersForRole(role: string): Promise<string[]>;
  hasRoleForUser(user: string, role: string): Promise<boolean>;
}

// Next.js middleware types
export interface AuthorizedRoute {
  path: string;
  requiredPermissions: {
    action: string;
    resource?: string;
    conditions?: string;
  }[];
  roles?: string[];
}

export interface AuthorizationMiddlewareConfig {
  enforcer: Enforcer;
  getUserFromRequest: (request: Record<string, unknown>) => Promise<Subject | null>;
  onUnauthorized?: (request: Record<string, unknown>, response: Record<string, unknown>) => void;
  routes: AuthorizedRoute[];
}

// Attribute evaluation functions
export type AttributeEvaluator = (
  subject: Subject,
  resource: Resource,
  context: Context
) => boolean;

export interface AttributeRule {
  name: string;
  description: string;
  evaluator: AttributeEvaluator;
}

// Audit and logging
export interface AccessLog {
  id: string;
  userId: string;
  resource: string;
  action: string;
  result: 'allow' | 'deny';
  reason?: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  context?: Context;
}

export interface AuditLogger {
  logAccess(log: AccessLog): Promise<void>;
  getAccessLogs(filters?: {
    userId?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AccessLog[]>;
}

// Error types
export class AuthorizationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class PolicyNotFoundError extends AuthorizationError {
  constructor(policyId: string) {
    super(`Policy not found: ${policyId}`, 'POLICY_NOT_FOUND', { policyId });
  }
}

export class InsufficientPermissionsError extends AuthorizationError {
  constructor(required: string, actual: string[]) {
    super(
      `Insufficient permissions. Required: ${required}, Actual: ${actual.join(', ')}`,
      'INSUFFICIENT_PERMISSIONS',
      { required, actual }
    );
  }
}

// Utility types
export type Permission = {
  resource: string;
  action: string;
  conditions?: string;
};

export type UserPermissions = {
  userId: string;
  permissions: Permission[];
  roles: string[];
  attributes: Record<string, any>;
};
