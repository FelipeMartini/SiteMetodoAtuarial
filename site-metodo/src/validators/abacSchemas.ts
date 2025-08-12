/**
 * 🔐 VALIDADORES ABAC PUROS - ZOD SCHEMAS
 * =======================================
 * 
 * Substitui validadores baseados em roleType/accessLevel
 * Implementa validação para sistema ABAC/ASIC puro
 */

import { z } from 'zod'

// 🏷️ SCHEMAS BÁSICOS PARA ATRIBUTOS ABAC
// ======================================

export const departmentSchema = z.enum([
  'finance',
  'hr', 
  'it',
  'sales',
  'marketing',
  'operations',
  'legal',
  'admin'
]).optional()

export const locationSchema = z.enum([
  'office',
  'remote',
  'hybrid',
  'field'
]).optional()

export const jobTitleSchema = z.string()
  .min(2, 'Cargo deve ter pelo menos 2 caracteres')
  .max(100, 'Cargo deve ter no máximo 100 caracteres')
  .optional()

// 🧑‍💼 SCHEMA DE USUÁRIO PARA ABAC
// ===============================

export const usuarioABACSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres'),
  
  // Atributos ABAC
  department: departmentSchema,
  location: locationSchema,
  jobTitle: jobTitleSchema,
  
  // Contexto temporal
  validFrom: z.string()
    .datetime('Data de início inválida')
    .optional(),
  
  validUntil: z.string()
    .datetime('Data de fim inválida')
    .optional(),
  
  // Estado
  isActive: z.boolean().default(true)
})

export const usuarioUpdateABACSchema = z.object({
  id: z.string().uuid('ID inválido'),
  
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional(),
  
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .optional(),
  
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres')
    .optional(),
  
  // Atributos ABAC
  department: departmentSchema,
  location: locationSchema,
  jobTitle: jobTitleSchema,
  
  // Contexto temporal
  validFrom: z.string()
    .datetime('Data de início inválida')
    .optional(),
  
  validUntil: z.string()
    .datetime('Data de fim inválida')
    .optional(),
  
  // Estado
  isActive: z.boolean().optional()
}).refine(data => {
  // Validar que validUntil é posterior a validFrom se ambos estão presentes
  if (data.validFrom && data.validUntil) {
    return new Date(data.validUntil) > new Date(data.validFrom)
  }
  return true
}, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['validUntil']
})

// 🛡️ SCHEMAS PARA POLÍTICAS ABAC
// ==============================

export const abacSubjectSchema = z.string()
  .min(1, 'Subject obrigatório')
  .regex(/^(user:|role:|dept:|location:|\*)/, 'Subject deve começar com user:, role:, dept:, location: ou *')

export const abacObjectSchema = z.string()
  .min(1, 'Object obrigatório')
  .regex(/^(resource:|api:|file:|system:|\*)/, 'Object deve começar com resource:, api:, file:, system: ou *')

export const abacActionSchema = z.enum([
  'read',
  'write', 
  'delete',
  'admin',
  'create',
  'update',
  'list',
  'export',
  'import',
  'execute',
  'access',
  '*'
])

export const policyEffectSchema = z.enum(['allow', 'deny'])

export const abacConditionsSchema = z.record(z.string(), z.any()).optional()

export const abacPolicySchema = z.object({
  name: z.string()
    .min(3, 'Nome da política deve ter pelo menos 3 caracteres')
    .max(100, 'Nome da política deve ter no máximo 100 caracteres'),
  
  subject: abacSubjectSchema,
  object: abacObjectSchema, 
  action: abacActionSchema,
  effect: policyEffectSchema.default('allow'),
  
  conditions: abacConditionsSchema,
  
  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  
  category: z.string()
    .max(50, 'Categoria deve ter no máximo 50 caracteres')
    .optional(),
  
  priority: z.number()
    .int('Prioridade deve ser um número inteiro')
    .min(1, 'Prioridade mínima é 1')
    .max(1000, 'Prioridade máxima é 1000')
    .default(100),
  
  isActive: z.boolean().default(true)
})

export const abacPolicyUpdateSchema = abacPolicySchema.partial().extend({
  id: z.string().uuid('ID da política inválido')
})

// 🔍 SCHEMAS PARA CONTEXTO ABAC
// =============================

export const abacContextSchema = z.object({
  // Contexto temporal
  time: z.union([
    z.string().datetime(),
    z.string().regex(/^(business_hours|after_hours|weekend)$/),
    z.date()
  ]).optional(),
  
  timeZone: z.string().optional(),
  
  // Contexto geográfico
  location: z.string().optional(),
  country: z.string().length(2, 'Código do país deve ter 2 caracteres').optional(),
  region: z.string().optional(),
  
  // Contexto organizacional
  department: departmentSchema,
  team: z.string().optional(),
  project: z.string().optional(),
  
  // Contexto técnico
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  device: z.enum(['desktop', 'mobile', 'tablet', 'unknown']).optional(),
  
  // Contexto de segurança
  mfaVerified: z.boolean().optional(),
  sessionAge: z.number().int().min(0).optional(),
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  
  // Contexto de dados
  dataClassification: z.enum(['public', 'internal', 'confidential', 'restricted']).optional(),
  sensitive: z.boolean().optional(),
  
  // Contexto de urgência
  urgency: z.enum(['low', 'normal', 'high', 'critical']).optional()
}).strict()

// 📊 SCHEMAS PARA REQUISIÇÕES ABAC
// ===============================

export const abacRequestSchema = z.object({
  subject: abacSubjectSchema,
  object: abacObjectSchema,
  action: abacActionSchema,
  context: abacContextSchema.default({})
})

export const abacBulkRequestSchema = z.object({
  requests: z.array(abacRequestSchema)
    .min(1, 'Pelo menos uma requisição é obrigatória')
    .max(100, 'Máximo de 100 requisições por vez')
})

// 🔐 SCHEMAS PARA AUTENTICAÇÃO ABAC
// ================================

export const loginABACSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  
  // Contexto adicional para ABAC
  context: z.object({
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    location: z.string().optional(),
    device: z.string().optional()
  }).optional()
})

export const registerABACSchema = usuarioABACSchema.extend({
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword']
})

// 📈 SCHEMAS PARA LOGS E AUDITORIA
// ===============================

export const accessLogQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  subject: z.string().optional(),
  object: z.string().optional(),
  action: z.string().optional(),
  result: z.enum(['allow', 'deny', 'indeterminate']).optional(),
  
  // Filtros de data
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  
  // Paginação
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

export const auditLogQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  success: z.boolean().optional(),
  
  // Filtros de data
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  
  // Paginação
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

// 🔧 SCHEMAS PARA ADMINISTRAÇÃO
// ============================

export const adminActionSchema = z.object({
  action: z.enum([
    'reload_policies',
    'clear_cache',
    'export_policies',
    'import_policies',
    'backup_data',
    'restore_data'
  ]),
  target: z.string().optional(),
  params: z.record(z.string(), z.any()).optional()
})

export const migrationStepSchema = z.object({
  phase: z.enum(['analysis', 'preparation', 'migration', 'validation', 'cleanup', 'complete']),
  step: z.string(),
  description: z.string(),
  autoExecute: z.boolean().default(false)
})

// 📤 EXPORTS PRINCIPAIS
// ====================

const abacSchemas = {
  // Usuários
  usuarioABACSchema,
  usuarioUpdateABACSchema,
  
  // Políticas
  abacPolicySchema,
  abacPolicyUpdateSchema,
  
  // Contexto e requisições
  abacContextSchema,
  abacRequestSchema,
  abacBulkRequestSchema,
  
  // Autenticação
  loginABACSchema,
  registerABACSchema,
  
  // Logs e consultas
  accessLogQuerySchema,
  auditLogQuerySchema,
  
  // Administração
  adminActionSchema,
  migrationStepSchema,
  
  // Schemas de componentes
  departmentSchema,
  locationSchema,
  jobTitleSchema,
  abacSubjectSchema,
  abacObjectSchema,
  abacActionSchema,
  policyEffectSchema,
  abacConditionsSchema
}

export default abacSchemas

// 🏷️ TIPOS INFERIDOS DOS SCHEMAS
// =============================

export type UsuarioABAC = z.infer<typeof usuarioABACSchema>
export type UsuarioUpdateABAC = z.infer<typeof usuarioUpdateABACSchema>
export type ABACPolicy = z.infer<typeof abacPolicySchema>
export type ABACPolicyUpdate = z.infer<typeof abacPolicyUpdateSchema>
export type ABACContext = z.infer<typeof abacContextSchema>
export type ABACRequest = z.infer<typeof abacRequestSchema>
export type LoginABAC = z.infer<typeof loginABACSchema>
export type RegisterABAC = z.infer<typeof registerABACSchema>
export type AccessLogQuery = z.infer<typeof accessLogQuerySchema>
export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>
export type AdminAction = z.infer<typeof adminActionSchema>
export type MigrationStep = z.infer<typeof migrationStepSchema>
