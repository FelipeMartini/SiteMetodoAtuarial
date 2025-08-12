import { auth } from '../../../auth'
import { getRoleTypeLabel, hasRequiredRole } from '@/lib/abac/roleMapping'
import { UserRoleType } from '@prisma/client'

export interface AuthorizedUser {
  id: string
  email: string | null
  name: string | null
  roleType: UserRoleType
  role: string[]
  isActive: boolean
}

/**
 * Verifica autorização em APIs usando sistema ABAC
 * @param requiredRole - Role mínimo necessário
 * @returns Usuário autorizado ou null
 */
export async function checkApiAuthorization(
  requiredRole: UserRoleType = UserRoleType.USER
): Promise<AuthorizedUser | null> {
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
        roleType: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return null
    }

    // Verificar se usuário tem o role necessário ou superior
    if (!hasRequiredRole(user.roleType, requiredRole)) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roleType: user.roleType,
      role: [getRoleTypeLabel(user.roleType)],
      isActive: user.isActive,
    }
  } catch (_error) {
    console.error('Erro na verificação de autorização da API:', String(_error))
    return null
  }
}
