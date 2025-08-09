export function checkRole(user: any, roles: string[] | string) {
  if (!user || !user.role) return false
  if (Array.isArray(roles)) return roles.includes(user.role)
  return user.role === roles
}
