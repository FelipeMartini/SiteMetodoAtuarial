/**
 * 🏗️ PRISMA ADAPTER PARA CASBIN ABAC
 * Adaptação limpa para sistema ABAC puro
 */

import { Adapter } from 'casbin'
import { PrismaClient } from '@prisma/client'

export class PrismaAdapter implements Adapter {
  private prisma: PrismaClient

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient
  }

  /**
   * 📚 Carregar políticas do banco
   */
  async loadPolicy(model: any): Promise<void> {
    try {
      // Carregar regras do banco
      const rules = await this.prisma.casbinRule.findMany()
      
      for (const rule of rules) {
        const line = [rule.v0, rule.v1, rule.v2, rule.v3, rule.v4, rule.v5]
          .filter((v): v is string => v !== null)
          .join(', ')
        
        model.addPolicy('p', 'p', line.split(', '))
      }
    } catch (error) {
      console.error('Erro ao carregar políticas:', error)
      throw error
    }
  }

  /**
   * 💾 Salvar política no banco
   */
  async savePolicy(model: any): Promise<boolean> {
    try {
      // Limpar regras existentes
      await this.prisma.casbinRule.deleteMany({})

      // Salvar novas políticas
      const policies = model.getPolicy()
      for (const [ptype, ...rule] of policies) {
        await this.prisma.casbinRule.create({
          data: {
            ptype,
            v0: rule[0] || null,
            v1: rule[1] || null,
            v2: rule[2] || null,
            v3: rule[3] || null,
            v4: rule[4] || null,
            v5: rule[5] || null
          }
        })
      }

      return true
    } catch (error) {
      console.error('Erro ao salvar políticas:', error)
      return false
    }
  }

  /**
   * ➕ Adicionar política
   */
  async addPolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    try {
      await this.prisma.casbinRule.create({
        data: {
          ptype,
          v0: rule[0] || null,
          v1: rule[1] || null,
          v2: rule[2] || null,
          v3: rule[3] || null,
          v4: rule[4] || null,
          v5: rule[5] || null
        }
      })
    } catch (error) {
      console.error('Erro ao adicionar política:', error)
      throw error
    }
  }

  /**
   * ➖ Remover política
   */
  async removePolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    try {
      await this.prisma.casbinRule.deleteMany({
        where: {
          ptype,
          v0: rule[0] || null,
          v1: rule[1] || null,
          v2: rule[2] || null,
          v3: rule[3] || null,
          v4: rule[4] || null,
          v5: rule[5] || null
        }
      })
    } catch (error) {
      console.error('Erro ao remover política:', error)
      throw error
    }
  }

  /**
   * 🧹 Remover políticas filtradas
   */
  async removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void> {
    try {
      const where: any = { ptype }
      
      fieldValues.forEach((value, index) => {
        if (value) {
          const field = `v${fieldIndex + index}`
          where[field] = value
        }
      })

      await this.prisma.casbinRule.deleteMany({ where })
    } catch (error) {
      console.error('Erro ao remover políticas filtradas:', error)
      throw error
    }
  }
}
