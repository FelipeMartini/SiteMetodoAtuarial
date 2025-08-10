import { auth } from '../../../auth'
import { mapAccessLevelToRole } from '../../../auth'

export interface AuthorizedUser {
  id: string
  email: string | null
  name: string | null
  accessLevel: number
  role: string[]
  isActive: boolean
}

/**
 * Verifica autorização em APIs
 * @param requiredRoles - Roles necessários (admin, staff, user)
 * @returns Usuário autorizado ou null
 */
export async function checkApiAuthorization(requiredRoles: string[] = ['user']): Promise<AuthorizedUser | null> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return null
    }

    // Buscar dados completos do usuário
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        accessLevel: true,
        isActive: true,
      }
    })

    if (!user || !user.isActive) {
      return null
    }

    const userRoles = mapAccessLevelToRole(user.accessLevel)
    
    // Verificar se usuário tem pelo menos uma das roles necessárias
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role))
    
    if (!hasRequiredRole) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      accessLevel: user.accessLevel,
      role: userRoles,
      isActive: user.isActive,
    }
  } catch (error) {
    console.error('Erro na verificação de autorização da API:', error)
    return null
  }
}
