interface UsuarioRole { role?: string }
export function checkRole(user: UsuarioRole | null | undefined, roles: string[] | string) {
  if (!user || !user.role) return false
  if (Array.isArray(roles)) return roles.includes(user.role)
  return user.role === roles
}
