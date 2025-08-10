/**
 * Sistema de Verificação de Permissões - Baseado no Fuse-React
 * 
 * Implementa lógica sofisticada de verificação de permissões
 * compatível com diferentes tipos de roles e configurações.
 */

import { UserRole } from './authRoles';

/**
 * Verifica se um usuário tem permissão para acessar um recurso
 * 
 * @param requiredRoles - Roles necessários para acesso (string[], string, null ou undefined)
 * @param userRole - Role atual do usuário (string[], string ou null)
 * @returns boolean - true se tem permissão, false caso contrário
 * 
 * Lógica de permissão:
 * 1. Se requiredRoles é null/undefined = acesso público (sempre permite)
 * 2. Se requiredRoles é array vazio = apenas guests (usuários não autenticados)
 * 3. Se userRole é array e requiredRoles é array = verifica intersecção
 * 4. Se userRole é string e requiredRoles é array = verifica se inclui
 * 5. Qualquer outro caso = negado
 */
export function hasPermission(
  requiredRoles: string[] | string | null | undefined,
  userRole: UserRole
): boolean {
  /**
   * Caso 1: Sem restrições de role (acesso público)
   * Se requiredRoles é null ou undefined, qualquer um pode acessar
   */
  if (requiredRoles === null || requiredRoles === undefined) {
    return true;
  }

  /**
   * Caso 2: Acesso apenas para guests (usuários não autenticados)
   * Se requiredRoles é array vazio, apenas usuários não logados podem acessar
   */
  if (Array.isArray(requiredRoles) && requiredRoles.length === 0) {
    // Permite acesso apenas se userRole é null, undefined ou array vazio
    return !userRole || (Array.isArray(userRole) && userRole.length === 0);
  }

  /**
   * Caso 3: Usuário não autenticado tentando acessar recurso protegido
   * Se chegou até aqui e userRole é null/undefined/vazio = sem permissão
   */
  if (!userRole || (Array.isArray(userRole) && userRole.length === 0)) {
    return false;
  }

  /**
   * Caso 4: Verificação de intersecção (ambos são arrays)
   * Se userRole e requiredRoles são arrays, verifica se há roles em comum
   */
  if (Array.isArray(userRole) && Array.isArray(requiredRoles)) {
    return requiredRoles.some((requiredRole: string) => 
      userRole.indexOf(requiredRole) >= 0
    );
  }

  /**
   * Caso 5: userRole é string e requiredRoles é array
   * Verifica se o role do usuário está na lista de roles necessários
   */
  if (typeof userRole === 'string' && Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }

  /**
   * Caso 6: requiredRoles é string
   * Verifica compatibilidade entre string e userRole
   */
  if (typeof requiredRoles === 'string') {
    if (Array.isArray(userRole)) {
      return userRole.includes(requiredRoles);
    }
    if (typeof userRole === 'string') {
      return userRole === requiredRoles;
    }
  }

  /**
   * Caso padrão: sem permissão
   * Se nenhuma das condições acima foi atendida, nega acesso
   */
  return false;
}

/**
 * Verifica se um usuário é guest (não autenticado)
 * 
 * @param userRole - Role atual do usuário
 * @returns boolean - true se é guest, false caso contrário
 */
export function isUserGuest(userRole: UserRole): boolean {
  return !userRole || (Array.isArray(userRole) && userRole.length === 0);
}

/**
 * Verifica se um usuário tem pelo menos uma das roles especificadas
 * Útil para verificações de role múltiplas
 * 
 * @param userRole - Role atual do usuário
 * @param requiredRoles - Array de roles válidos
 * @returns boolean - true se tem pelo menos uma das roles
 */
export function hasAnyRole(userRole: UserRole, requiredRoles: string[]): boolean {
  if (!userRole || requiredRoles.length === 0) {
    return false;
  }

  if (Array.isArray(userRole)) {
    return requiredRoles.some(role => userRole.includes(role));
  }

  if (typeof userRole === 'string') {
    return requiredRoles.includes(userRole);
  }

  return false;
}

/**
 * Verifica se um usuário tem todas as roles especificadas
 * Útil para verificações rigorosas de múltiplas permissões
 * 
 * @param userRole - Role atual do usuário
 * @param requiredRoles - Array de roles necessários
 * @returns boolean - true se tem todas as roles
 */
export function hasAllRoles(userRole: UserRole, requiredRoles: string[]): boolean {
  if (!userRole || requiredRoles.length === 0) {
    return false;
  }

  if (Array.isArray(userRole)) {
    return requiredRoles.every(role => userRole.includes(role));
  }

  if (typeof userRole === 'string') {
    return requiredRoles.length === 1 && requiredRoles.includes(userRole);
  }

  return false;
}

/**
 * Obtém o nível de acesso mais alto do usuário
 * Útil para determinar a role principal quando o usuário tem múltiplas roles
 * 
 * @param userRole - Role atual do usuário
 * @returns string - Role de maior prioridade ou 'guest' se não autenticado
 */
export function getHighestRole(userRole: UserRole): string {
  if (isUserGuest(userRole)) {
    return 'guest';
  }

  if (typeof userRole === 'string') {
    return userRole;
  }

  if (Array.isArray(userRole)) {
    // Ordem de prioridade: admin > staff > user
    const rolePriority = ['admin', 'staff', 'user'];
    
    for (const role of rolePriority) {
      if (userRole.includes(role)) {
        return role;
      }
    }
    
    // Se não encontrou nenhuma role conhecida, retorna a primeira
    return userRole[0] || 'guest';
  }

  return 'guest';
}

/**
 * Hook de compatibilidade com sistema legado
 * Converte accessLevel string para verificação de permissão moderna
 * 
 * @param accessLevel - Nível de acesso legado
 * @param requiredLevel - Nível necessário para acesso
 * @returns boolean - true se tem permissão
 * 
 * @deprecated Use hasPermission com roles array em vez disso
 */
export function checkAccessLevel(accessLevel: string | null, requiredLevel: string): boolean {
  if (!accessLevel || !requiredLevel) {
    return false;
  }

  const levels = ['guest', 'user', 'staff', 'admin'];
  const userLevelIndex = levels.indexOf(accessLevel.toLowerCase());
  const requiredLevelIndex = levels.indexOf(requiredLevel.toLowerCase());

  if (userLevelIndex === -1 || requiredLevelIndex === -1) {
    return false;
  }

  return userLevelIndex >= requiredLevelIndex;
}

export default hasPermission;
