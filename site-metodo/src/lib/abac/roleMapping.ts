import { UserRoleType } from '@prisma/client'

/**
 * Utilitários para mapeamento entre accessLevel legado e roleType moderno
 * Facilita a migração gradual do sistema ABAC
 */

// Enum de roles do sistema
export const SYSTEM_ROLES = {
  GUEST: 'GUEST',
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN',
} as const

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES]

/**
 * Converte accessLevel legado para roleType moderno
 * @param accessLevel - Nível de acesso legado (0-100+)
 * @returns UserRoleType correspondente
 */
export function mapAccessLevelToRoleType(accessLevel: number): UserRoleType {
  if (accessLevel >= 100) return UserRoleType.ADMIN // Admin completo
  if (accessLevel >= 50) return UserRoleType.MODERATOR // Moderador
  if (accessLevel >= 1) return UserRoleType.USER // Usuário padrão
  return UserRoleType.GUEST // Visitante
}

/**
 * Converte roleType para accessLevel legado (para compatibilidade)
 * @param roleType - Tipo de role moderno
 * @returns Nível de acesso equivalente
 */
export function mapRoleTypeToAccessLevel(roleType: UserRoleType): number {
  switch (roleType) {
    case UserRoleType.ADMIN:
      return 100
    case UserRoleType.MODERATOR:
      return 50
    case UserRoleType.USER:
      return 1
    case UserRoleType.GUEST:
    default:
      return 0
  }
}

/**
 * Obtém o rótulo de exibição para um roleType
 * @param roleType - Tipo de role
 * @returns String amigável para exibição
 */
export function getRoleTypeLabel(roleType: UserRoleType): string {
  switch (roleType) {
    case UserRoleType.ADMIN:
      return 'Administrador'
    case UserRoleType.MODERATOR:
      return 'Moderador'
    case UserRoleType.USER:
      return 'Usuário'
    case UserRoleType.GUEST:
      return 'Visitante'
    default:
      return 'Desconhecido'
  }
}

/**
 * Obtém o valor numérico para exibição (compatibilidade com UI existente)
 * @param roleType - Tipo de role
 * @returns Valor numérico equivalente para exibição
 */
export function getRoleTypeDisplayValue(roleType: UserRoleType): number {
  return mapRoleTypeToAccessLevel(roleType)
}

/**
 * Verifica se um roleType tem permissões de admin
 * @param roleType - Tipo de role a verificar
 * @returns true se tem permissões de admin
 */
export function hasAdminPermissions(roleType: UserRoleType): boolean {
  return roleType === UserRoleType.ADMIN
}

/**
 * Verifica se um roleType tem permissões de moderador ou superior
 * @param roleType - Tipo de role a verificar
 * @returns true se tem permissões de moderador ou superior
 */
export function hasModeratorPermissions(roleType: UserRoleType): boolean {
  return roleType === UserRoleType.ADMIN || roleType === UserRoleType.MODERATOR
}

/**
 * Verifica se um roleType é de usuário autenticado ou superior
 * @param roleType - Tipo de role a verificar
 * @returns true se é usuário autenticado ou superior
 */
export function hasUserPermissions(roleType: UserRoleType): boolean {
  return roleType !== UserRoleType.GUEST
}

/**
 * Compara dois roleTypes para verificar hierarquia
 * @param userRole - Role do usuário
 * @param requiredRole - Role mínimo necessário
 * @returns true se o usuário tem o role necessário ou superior
 */
export function hasRequiredRole(userRole: UserRoleType, requiredRole: UserRoleType): boolean {
  const roleHierarchy = {
    [UserRoleType.GUEST]: 0,
    [UserRoleType.USER]: 1,
    [UserRoleType.MODERATOR]: 2,
    [UserRoleType.ADMIN]: 3,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
