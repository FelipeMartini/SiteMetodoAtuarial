/**
 * 🏗️ PRISMA ADAPTER PARA CASBIN ABAC
 * Adaptação limpa para sistema ABAC puro
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// usar tipos locais para compatibilidade com diferentes versões das libs
import { prisma } from '@/lib/prisma'
import { structuredLogger } from '@/lib/logger'
import { sanitizePolicyArray } from './utils'

type AnyModel = any

export class PrismaAdapter /* implements Adapter */ {
  private prisma: any

  // Aceita uma instância de prisma ou usa o singleton do projeto como fallback
  constructor(prismaClient?: any) {
    this.prisma = prismaClient || prisma
  }

  /**
   * 📚 Carregar políticas do banco
   */
  async loadPolicy(model: AnyModel): Promise<void> {
    try {
      // Carregar regras do banco
      const rules = await this.prisma.casbinRule.findMany()
      
        for (const rule of rules) {
          const parts = [rule.v0, rule.v1, rule.v2, rule.v3, rule.v4, rule.v5]
          const filtered = sanitizePolicyArray(parts)
          if (filtered.length === 0) continue
          model.addPolicy('p', 'p', filtered)
        }
    } catch (error) {
      structuredLogger.error('Erro ao carregar políticas', { error: String(error) })
      throw error
    }
  }

  /**
   * 💾 Salvar política no banco
   */
  async savePolicy(model: AnyModel): Promise<boolean> {
    try {
      // Limpar regras existentes
      await this.prisma.casbinRule.deleteMany({})

      // Salvar novas políticas
      const policies = model.getPolicy('p', 'p')
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
      structuredLogger.error('Erro ao salvar políticas', { error: String(error) })
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
      structuredLogger.error('Erro ao adicionar política', { error: String(error) })
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
      structuredLogger.error('Erro ao remover política', { error: String(error) })
      throw error
    }
  }

  /**
   * 🧹 Remover políticas filtradas
   */
  async removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void> {
    try {
      const where: Record<string, unknown> = { ptype }
      
      fieldValues.forEach((value, index) => {
        if (value) {
          const field = `v${fieldIndex + index}`
          where[field] = value
        }
      })

      await this.prisma.casbinRule.deleteMany({ where })
    } catch (error) {
      structuredLogger.error('Erro ao remover políticas filtradas', { error: String(error) })
      throw error
    }
  }
}
