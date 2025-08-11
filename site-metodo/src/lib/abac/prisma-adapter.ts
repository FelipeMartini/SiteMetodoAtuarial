import { PrismaClient } from '@prisma/client'

/**
 * Custom Prisma Adapter for Casbin
 * Integrates with existing User schema and creates authorization tables
 */

export class CustomPrismaAdapter {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * Load all policies from database
   */
  async loadPolicy(): Promise<string[][]> {
    try {
      // Buscar políticas da tabela de políticas
      const policies = await this.prisma.authorizationPolicy.findMany({
        where: { isActive: true },
        orderBy: { id: 'asc' },
      })

      // Buscar roles
      const roles = await this.prisma.userRole.findMany({
        where: { isActive: true },
        include: {
          user: true,
          role: true,
        },
      })

      const policyLines: string[][] = []

      // Converter políticas para formato Casbin
      policies.forEach((policy: Record<string, unknown>) => {
        const line = ['p', policy.subject, policy.object, policy.action, policy.effect]
        if (policy.conditions) {
          line.push(policy.conditions)
        }
        policyLines.push(line)
      })

      // Converter roles para formato Casbin
      roles.forEach((userRole: Record<string, unknown>) => {
        policyLines.push(['g', userRole.user.email, userRole.role.name])
      })

      return policyLines
    } catch (_error) {
      console.error('Error loading policies:', String(error))
      return []
    }
  }

  /**
   * Save a policy to database
   */
  async savePolicy(policyLines: string[][]): Promise<void> {
    try {
      // Limpar políticas existentes
      await this.prisma.authorizationPolicy.deleteMany({})
      await this.prisma.userRole.deleteMany({})

      for (const line of policyLines) {
        if (line[0] === 'p') {
          // Política de permissão
          await this.prisma.authorizationPolicy.create({
            data: {
              subject: line[1],
              object: line[2],
              action: line[3],
              effect: line[4] as 'allow' | 'deny',
              conditions: line[5] || null,
            },
          })
        } else if (line[0] === 'g') {
          // Atribuição de role
          const userEmail = line[1]
          const roleName = line[2]

          // Buscar usuário
          const user = await this.prisma.user.findUnique({
            where: { email: userEmail },
          })

          // Buscar ou criar role
          let role = await this.prisma.role.findUnique({
            where: { name: roleName },
          })

          if (!role) {
            role = await this.prisma.role.create({
              data: {
                name: roleName,
                description: `Auto-created role: ${roleName}`,
              },
            })
          }

          if (user) {
            // Criar atribuição de role se não existir
            const existingUserRole = await this.prisma.userRole.findUnique({
              where: {
                userId_roleId: {
                  userId: user.id,
                  roleId: role.id,
                },
              },
            })

            if (!existingUserRole) {
              await this.prisma.userRole.create({
                data: {
                  userId: user.id,
                  roleId: role.id,
                },
              })
            }
          }
        }
      }
    } catch (_error) {
      console.error('Error saving policies:', String(error))
      throw error
    }
  }

  /**
   * Add a policy
   */
  async addPolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    if (ptype === 'p') {
      await this.prisma.authorizationPolicy.create({
        data: {
          subject: rule[0],
          object: rule[1],
          action: rule[2],
          effect: (rule[3] || 'allow') as 'allow' | 'deny',
          conditions: rule[4] || null,
        },
      })
    } else if (ptype === 'g') {
      const userEmail = rule[0]
      const roleName = rule[1]

      const user = await this.prisma.user.findUnique({
        where: { email: userEmail },
      })

      let role = await this.prisma.role.findUnique({
        where: { name: roleName },
      })

      if (!role) {
        role = await this.prisma.role.create({
          data: {
            name: roleName,
            description: `Auto-created role: ${roleName}`,
          },
        })
      }

      if (user) {
        await this.prisma.userRole.upsert({
          where: {
            userId_roleId: {
              userId: user.id,
              roleId: role.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            roleId: role.id,
          },
        })
      }
    }
  }

  /**
   * Remove a policy
   */
  async removePolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    if (ptype === 'p') {
      await this.prisma.authorizationPolicy.deleteMany({
        where: {
          subject: rule[0],
          object: rule[1],
          action: rule[2],
          effect: (rule[3] || 'allow') as 'allow' | 'deny',
        },
      })
    } else if (ptype === 'g') {
      const userEmail = rule[0]
      const roleName = rule[1]

      const user = await this.prisma.user.findUnique({
        where: { email: userEmail },
      })

      const role = await this.prisma.role.findUnique({
        where: { name: roleName },
      })

      if (user && role) {
        await this.prisma.userRole.deleteMany({
          where: {
            userId: user.id,
            roleId: role.id,
          },
        })
      }
    }
  }

  /**
   * Remove filtered policies
   */
  async removeFilteredPolicy(
    sec: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    if (ptype === 'p') {
      const whereClause: Record<string, unknown> = {}

      fieldValues.forEach((value, index) => {
        const actualIndex = fieldIndex + index
        switch (actualIndex) {
          case 0:
            whereClause.subject = value
            break
          case 1:
            whereClause.object = value
            break
          case 2:
            whereClause.action = value
            break
          case 3:
            whereClause.effect = value
            break
        }
      })

      await this.prisma.authorizationPolicy.deleteMany({
        where: whereClause,
      })
    }
  }
}
