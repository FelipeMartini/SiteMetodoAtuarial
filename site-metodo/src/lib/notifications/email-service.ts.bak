import nodemailer from 'nodemailer'
import { EmailData, EmailTemplate, NotificationPriority, EmailAttachment } from '@/types/notifications'
import { simpleLogger } from '@/lib/simple-logger'
import { PrismaClient } from '@prisma/client'

/**
 * Serviço de email com templates responsivos
 * Suporte para SMTP, SendGrid, Mailgun, AWS SES
 */
export class EmailService {
  private transporter!: nodemailer.Transporter
  private prisma: PrismaClient
  private config: EmailConfig

  constructor(config: EmailConfig, prisma: PrismaClient) {
    this.config = config
    this.prisma = prisma
    this.initializeTransporter()
  }

  /**
   * Envia email usando template
   */
  async sendWithTemplate(
    templateId: string,
    to: string | string[],
    variables: Record<string, unknown>,
    options?: Partial<EmailData>
  ): Promise<boolean> {
    try {
      const template = await this.getTemplate(templateId)
      if (!template) {
        throw new Error(`Template ${templateId} não encontrado`)
      }

      const html = this.processTemplate(template.html, variables)
      const text = template.text ? this.processTemplate(template.text, variables) : undefined
      const subject = this.processTemplate(template.subject, variables)

      const emailData: EmailData = {
        to,
        subject,
        html,
        text,
        ...options,
      }

      return await this.send(emailData)
    } catch (_error) {
      simpleLogger.error('Erro ao enviar email com template', {
        _error,
        templateId,
        to: Array.isArray(to) ? to.length : 1,
      })
      return false
    }
  }

  /**
   * Envia email direto
   */
  async send(emailData: EmailData): Promise<boolean> {
    try {
      const recipients = Array.isArray(emailData.to) ? emailData.to : [emailData.to]

      for (const recipient of recipients) {
        const mailOptions = {
          from: process.env.SMTP_FROM || 'felipe@metodoatuarial.com.br',
          to: recipient,
          cc: emailData.cc,
          bcc: emailData.bcc,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
          attachments: emailData.attachments?.map((att: EmailAttachment) => ({
            filename: att.filename,
            content: att.content,
            contentType: att.contentType,
            encoding: att.encoding as string,
            cid: att.cid,
          })),
          priority: (emailData.priority as 'low' | 'normal' | 'high') || 'normal',
        }

        await this.transporter.sendMail(mailOptions)

        simpleLogger.info('Email enviado com sucesso', {
          to: recipient,
          subject: emailData.subject,
        })
      }

      return true
    } catch (_error) {
      simpleLogger.error('Erro ao enviar email', {
        _error,
        to: emailData.to,
        subject: emailData.subject,
      })
      return false
    }
  }

  /**
   * Envia email em lote
   */
  async sendBulk(emails: EmailData[]): Promise<{ sent: number; failed: number }> {
    const results = { sent: 0, failed: 0 }

    // Processa em batches para evitar rate limiting
    const batchSize = 10

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)

      const promises = batch.map(async email => {
        try {
          const success = await this.send(email)
          return success ? 'sent' : 'failed'
        } catch {
          return 'failed'
        }
      })

      const batchResults = await Promise.allSettled(promises)

      batchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value === 'sent') {
          results.sent++
        } else {
          results.failed++
        }
      })

      // Pausa entre batches para respeitar rate limits
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    simpleLogger.info('Email em lote processado', results)
    return results
  }

  /**
   * Cria ou atualiza template de email
   */
  async createTemplate(
    template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const created = await this.prisma.emailTemplate.create({
        data: {
          name: template.name,
          subject: template.subject,
          html: template.html,
          text: template.text,
          variables: JSON.stringify(template.variables),
          category: template.category,
          isActive: template.isActive,
        },
      })

      simpleLogger.info('Template de email criado', {
        templateId: created.id,
        name: template.name,
      })

      return created.id
    } catch (_error) {
      simpleLogger.error('Erro ao criar template', { error: String(_error), template: template.name })
      throw _error
    }
  }

  /**
   * Busca template por ID
   */
  async getTemplate(templateId: string): Promise<EmailTemplate | null> {
    try {
      const template = await this.prisma.emailTemplate.findUnique({
        where: { id: templateId, isActive: true },
      })

      if (!template) return null

      return {
        id: template.id,
        name: template.name,
        subject: template.subject,
        html: template.html,
        text: template.text || undefined,
        variables: JSON.parse(template.variables),
        category: template.category || undefined,
        isActive: template.isActive,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      }
    } catch (_error) {
      simpleLogger.error('Erro ao buscar template', { error: String(_error), templateId })
      return null
    }
  }

  /**
   * Lista todos os templates
   */
  async listTemplates(category?: string): Promise<EmailTemplate[]> {
    try {
      const where: Record<string, unknown> = { isActive: true }
      if (category) where.category = category

      const templates = await this.prisma.emailTemplate.findMany({
        where,
        orderBy: { name: 'asc' },
      })

      return templates.map(template => ({
        id: template.id,
        name: template.name,
        subject: template.subject,
        html: template.html,
        text: template.text || undefined,
        variables: JSON.parse(template.variables),
        category: template.category || undefined,
        isActive: template.isActive,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      }))
    } catch (_error) {
      simpleLogger.error('Erro ao listar templates', { error: String(_error), category })
      return []
    }
  }

  /**
   * Valida template (verifica sintaxe e variáveis)
   */
  async validateTemplate(
    html: string,
    variables: string[]
  ): Promise<{
    valid: boolean
    errors: string[]
    usedVariables: string[]
  }> {
    const errors: string[] = []
    const usedVariables: string[] = []

    try {
      // Extrai variáveis do template
      const variableRegex = /\{\{([^}]+)\}\}/g
      let match

      while ((match = variableRegex.exec(html)) !== null) {
        const variable = match[1].trim()
        usedVariables.push(variable)

        if (!variables.includes(variable)) {
          errors.push(`Variável ${variable} não está declarada`)
        }
      }

      // Verifica se HTML é válido (básico)
      if (!html.includes('<html') && !html.includes('<body')) {
        errors.push('Template deve conter estrutura HTML básica')
      }

      return {
        valid: errors.length === 0,
        errors,
        usedVariables: [...new Set(usedVariables)], // Remove duplicatas
      }
    } catch {
      return {
        valid: false,
        errors: ['Erro ao validar template'],
        usedVariables: [],
      }
    }
  }

  /**
   * Testa envio de email
   */
  async testEmail(to: string, subject: string = 'Teste de Email'): Promise<boolean> {
    try {
      const testHtml = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Teste de Email</h2>
            <p>Este é um email de teste enviado em <strong>${new Date().toLocaleString()}</strong></p>
            <p>Se você recebeu este email, o sistema de notificações está funcionando corretamente.</p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              Sistema de Notificações - Método Atuarial
            </p>
          </body>
        </html>
      `

      return await this.send({
        to,
        subject,
        html: testHtml,
        text: `Teste de Email - ${new Date().toLocaleString()}`,
      })
    } catch (_error) {
      simpleLogger.error('Erro no teste de email', { error: String(_error), to })
      return false
    }
  }

  /**
   * Inicializa o transporter baseado na configuração
   */
  private initializeTransporter(): void {
    try {
      switch (this.config.provider) {
        case 'smtp':
          this.transporter = nodemailer.createTransport({
            host: this.config.smtp?.host,
            port: this.config.smtp?.port || 587,
            secure: this.config.smtp?.secure || false,
            auth: {
              user: this.config.smtp?.user,
              pass: this.config.smtp?.pass,
            },
          })
          break

        case 'sendgrid':
          this.transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: 'apikey',
              pass: this.config.apiKey,
            },
          })
          break

        case 'mailgun':
          // Implementar configuração Mailgun
          throw new Error('Mailgun ainda não implementado')

        case 'aws-ses':
          // Implementar configuração AWS SES
          throw new Error('AWS SES ainda não implementado')

        default:
          throw new Error(`Provedor ${this.config.provider} não suportado`)
      }

      simpleLogger.info('Email transporter inicializado', {
        provider: this.config.provider,
      })
    } catch (_error) {
      simpleLogger.error('Erro ao inicializar email transporter', { _error })
      throw _error
    }
  }

  /**
   * Processa template substituindo variáveis
   */
  private processTemplate(template: string, variables: Record<string, unknown>): string {
    let processed = template

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
      processed = processed.replace(regex, String(value))
    }

    return processed
  }

  /**
   * Mapeia prioridade para formato do Nodemailer
   */
  private mapPriorityToNodemailer(priority?: NotificationPriority): 'low' | 'normal' | 'high' {
    switch (priority) {
      case NotificationPriority.URGENT:
        return 'high'
      case NotificationPriority.HIGH:
        return 'normal'
      case NotificationPriority.LOW:
        return 'low'
      default:
        return 'normal'
    }
  }
}

// Interfaces para configuração
export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'aws-ses'
  from: string
  replyTo?: string
  apiKey?: string
  smtp?: {
    host: string
    port: number
    secure: boolean
    user: string
    pass: string
  }
}

// Factory function
export function createEmailService(config: EmailConfig): EmailService {
  const prisma = new PrismaClient()
  return new EmailService(config, prisma)
}

// Templates padrão
export const defaultEmailTemplates = {
  welcome: {
    name: 'welcome',
    subject: 'Bem-vindo ao {{siteName}}!',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333;">Bem-vindo ao {{siteName}}!</h1>
          </div>
          
          <p>Olá {{userName}},</p>
          
          <p>É um prazer tê-lo conosco! Sua conta foi criada com sucesso.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Suas informações:</h3>
            <p><strong>Email:</strong> {{userEmail}}</p>
            <p><strong>Data de cadastro:</strong> {{signupDate}}</p>
          </div>
          
          <p>Para começar, acesse sua conta:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{loginUrl}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Acessar Minha Conta
            </a>
          </div>
          
          <p>Se você tiver alguma dúvida, não hesite em nos contatar.</p>
          
          <p>Atenciosamente,<br>Equipe {{siteName}}</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            {{siteName}} - {{siteUrl}}
          </p>
        </body>
      </html>
    `,
    variables: ['siteName', 'userName', 'userEmail', 'signupDate', 'loginUrl', 'siteUrl'],
    category: 'auth',
  },

  passwordReset: {
    name: 'password-reset',
    subject: 'Redefinição de senha - {{siteName}}',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333;">Redefinição de Senha</h1>
          </div>
          
          <p>Olá {{userName}},</p>
          
          <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚠️ Importante:</strong> Se você não solicitou esta redefinição, ignore este email.</p>
          </div>
          
          <p>Para redefinir sua senha, clique no botão abaixo:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetUrl}}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Redefinir Senha
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            Este link expira em {{expirationTime}}. Se o botão não funcionar, copie e cole este link no seu navegador:<br>
            <a href="{{resetUrl}}">{{resetUrl}}</a>
          </p>
          
          <p>Atenciosamente,<br>Equipe {{siteName}}</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            {{siteName}} - {{siteUrl}}
          </p>
        </body>
      </html>
    `,
    variables: ['siteName', 'userName', 'resetUrl', 'expirationTime', 'siteUrl'],
    category: 'auth',
  },

  notification: {
    name: 'notification',
    subject: '{{notificationTitle}} - {{siteName}}',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333;">{{notificationTitle}}</h1>
          </div>
          
          <p>Olá {{userName}},</p>
          
          <div style="background: #f8f9fa; border-left: 4px solid {{notificationColor}}; padding: 20px; margin: 20px 0;">
            {{notificationMessage}}
          </div>
          
          {{#if actionUrl}}
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{actionUrl}}" style="background: {{notificationColor}}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              {{actionText}}
            </a>
          </div>
          {{/if}}
          
          <p style="font-size: 14px; color: #666;">
            Data: {{notificationDate}}
          </p>
          
          <p>Atenciosamente,<br>Equipe {{siteName}}</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            {{siteName}} - {{siteUrl}}
          </p>
        </body>
      </html>
    `,
    variables: [
      'siteName',
      'userName',
      'notificationTitle',
      'notificationMessage',
      'notificationColor',
      'notificationDate',
      'actionUrl',
      'actionText',
      'siteUrl',
    ],
    category: 'notification',
  },
}
