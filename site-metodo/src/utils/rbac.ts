interface UsuarioRole { 
  role?: string 
  accessLevel?: number
}

export function checkRole(user: UsuarioRole | null | undefined, roles: string[] | string) {
  if (!user) return false
  
  // Se tem a propriedade role, use-a
  if (user.role) {
    if (Array.isArray(roles)) return roles.includes(user.role)
    return user.role === roles
  }
  
  // Caso contrário, derive o role do accessLevel
  const accessLevel = user.accessLevel ?? 0
  const derivedRole = accessLevel >= 100 ? "admin" : 
                     accessLevel >= 50 ? "moderador" : "usuario"
                     
  if (Array.isArray(roles)) return roles.includes(derivedRole)
  return derivedRole === roles
}
