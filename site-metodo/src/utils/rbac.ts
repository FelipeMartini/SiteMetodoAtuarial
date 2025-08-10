import { UserRole } from '@/lib/auth/authRoles';
import { hasPermission } from '@/lib/auth/permissions';

interface UsuarioRole { 
  role?: string | string[] | null;
  accessLevel?: number;
}

export function checkRole(user: UsuarioRole | null | undefined, roles: string[] | string) {
  if (!user) return false;
  
  // Usar o novo sistema de permissões moderno
  return hasPermission(Array.isArray(roles) ? roles : [roles], user.role as UserRole);
}

/**
 * Função legada - mantida para compatibilidade
 * @deprecated Use hasPermission em vez disso
 */
export function checkRoleLegacy(user: UsuarioRole | null | undefined, roles: string[] | string) {
  if (!user) return false;
  
  // Se tem a propriedade role, use-a
  if (user.role) {
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    return requiredRoles.some(requiredRole => userRoles.includes(requiredRole));
  }
  
  // Caso contrário, derive o role do accessLevel
  const accessLevel = user.accessLevel ?? 0;
  const derivedRole = accessLevel >= 100 ? "admin" : 
                     accessLevel >= 50 ? "moderador" : "usuario";
                     
  if (Array.isArray(roles)) return roles.includes(derivedRole);
  return derivedRole === roles;
}
