"use client"

import { simpleLogger } from '@/lib/simple-logger';
import { prisma } from '@/lib/prisma';

interface EmailLogWhereClause {
  status?: string;
  priority?: string;
  templateType?: string;
  to?: { contains: string };
  subject?: { contains: string };
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface EmailLogEntry {
  id?: string;
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  templateType?: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened' | 'clicked';
  messageId?: string;
  error?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    userId?: string;
    retryCount?: number;
    provider?: string;
    templateEngine?: string;  // Adicionando campo templateEngine
    deliveryTime?: number;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    bounceReason?: string;
  };
  sentAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface EmailMetrics {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  bounced: number;
  delivered: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  deliveryRate: number;
}

export interface EmailStats {
  last24Hours: EmailMetrics;
  last7Days: EmailMetrics;
  last30Days: EmailMetrics;
  allTime: EmailMetrics;
  byProvider: Record<string, EmailMetrics>;
  byTemplate: Record<string, EmailMetrics>;
  byPriority: Record<string, EmailMetrics>;
}

class EmailLogger {
  /**
   * Registra tentativa de envio de email
   */
  async logEmailAttempt(entry: Omit<EmailLogEntry, 'id' | 'createdAt'>): Promise<string> {
    try {
      const logEntry = await prisma.emailLog.create({
        data: {
          to: Array.isArray(entry.to) ? entry.to.join(',') : entry.to,
          cc: entry.cc?.join(','),
          bcc: entry.bcc?.join(','),
          subject: entry.subject,
          templateType: entry.templateType,
          status: entry.status,
          messageId: entry.messageId,
          error: entry.error,
          priority: entry.priority,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
          sentAt: entry.sentAt,
          createdAt: new Date(),
        },
      });

      simpleLogger.info('Email attempt logged', {
        logId: logEntry.id,
        to: entry.to,
        subject: entry.subject,
        status: entry.status,
      });

      return logEntry.id;
    } catch (error) {
      simpleLogger.error('Failed to log email attempt', {
        error: error instanceof Error ? error.message : String(error),
        entry: entry,
      });
      throw error;
    }
  }

  /**
   * Atualiza status do email
   */
  async updateEmailStatus(
    messageId: string, 
    status: EmailLogEntry['status'], 
    metadata?: Partial<EmailLogEntry['metadata']>
  ): Promise<void> {
    try {
      await prisma.emailLog.updateMany({
        where: { messageId },
        data: {
          status,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
          updatedAt: new Date(),
        },
      });

      simpleLogger.info('Email status updated', {
        messageId,
        status,
        metadata,
      });
    } catch (error) {
      simpleLogger.error('Failed to update email status', {
        messageId,
        status,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Busca logs de email com filtros
   */
  async getEmailLogs(filters: {
    status?: EmailLogEntry['status'];
    priority?: EmailLogEntry['priority'];
    templateType?: string;
    to?: string;
    subject?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  } = {}): Promise<EmailLogEntry[]> {
    try {
      const where: EmailLogWhereClause = {};

      if (filters.status) where.status = filters.status;
      if (filters.priority) where.priority = filters.priority;
      if (filters.templateType) where.templateType = filters.templateType;
      if (filters.to) where.to = { contains: filters.to };
      if (filters.subject) where.subject = { contains: filters.subject };
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
        if (filters.dateTo) where.createdAt.lte = filters.dateTo;
      }

      const logs = await prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      });

      return logs.map(log => ({
        id: log.id,
        to: log.to.split(','),
        cc: log.cc?.split(','),
        bcc: log.bcc?.split(','),
        subject: log.subject,
        templateType: log.templateType || undefined,
        status: log.status as EmailLogEntry['status'],
        messageId: log.messageId || undefined,
        error: log.error || undefined,
        priority: log.priority as EmailLogEntry['priority'],
        metadata: log.metadata ? JSON.parse(String(log.metadata)) : undefined,
        sentAt: log.sentAt || undefined,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt || undefined,
      }));
    } catch (error) {
      simpleLogger.error('Failed to get email logs', {
        filters,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Gera métricas detalhadas de email
   */
  async getEmailMetrics(period: '24h' | '7d' | '30d' | 'all' = '7d'): Promise<EmailMetrics> {
    try {
      const now = new Date();
      let dateFrom: Date | undefined;

      switch (period) {
        case '24h':
          dateFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFrom = undefined;
      }

      const where = dateFrom ? { createdAt: { gte: dateFrom } } : {};

      const [
        total,
        sent,
        failed,
        pending,
        bounced,
        delivered,
        opened,
        clicked
      ] = await Promise.all([
        prisma.emailLog.count({ where }),
        prisma.emailLog.count({ where: { ...where, status: 'sent' } }),
        prisma.emailLog.count({ where: { ...where, status: 'failed' } }),
        prisma.emailLog.count({ where: { ...where, status: 'pending' } }),
        prisma.emailLog.count({ where: { ...where, status: 'bounced' } }),
        prisma.emailLog.count({ where: { ...where, status: 'delivered' } }),
        prisma.emailLog.count({ where: { ...where, status: 'opened' } }),
        prisma.emailLog.count({ where: { ...where, status: 'clicked' } }),
      ]);

      const openRate = delivered > 0 ? (opened / delivered) * 100 : 0;
      const clickRate = opened > 0 ? (clicked / opened) * 100 : 0;
      const bounceRate = total > 0 ? (bounced / total) * 100 : 0;
      const deliveryRate = total > 0 ? (delivered / total) * 100 : 0;

      return {
        total,
        sent,
        failed,
        pending,
        bounced,
        delivered,
        opened,
        clicked,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
      };
    } catch (error) {
      simpleLogger.error('Failed to get email metrics', {
        period,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Gera estatísticas completas de email
   */
  async getEmailStats(): Promise<EmailStats> {
    try {
      const [last24Hours, last7Days, last30Days, allTime] = await Promise.all([
        this.getEmailMetrics('24h'),
        this.getEmailMetrics('7d'),
        this.getEmailMetrics('30d'),
        this.getEmailMetrics('all'),
      ]);

      // Métricas por provider
      const providers = await prisma.emailLog.groupBy({
        by: ['metadata'],
        _count: true,
        where: {
          metadata: {
            not: undefined,
          },
        },
      });

      const byProvider: Record<string, EmailMetrics> = {};
      for (const provider of providers) {
        try {
          const metadata = JSON.parse(String(provider.metadata) || '{}');
          if (metadata.provider) {
            // Implementar métricas por provider
            byProvider[metadata.provider] = await this.getEmailMetricsForProvider(metadata.provider);
          }
        } catch (e) {
          // Ignorar erros de parse JSON
        }
      }

      // Métricas por template
      const templates = await prisma.emailLog.groupBy({
        by: ['templateType'],
        _count: true,
        where: {
          templateType: {
            not: null,
          },
        },
      });

      const byTemplate: Record<string, EmailMetrics> = {};
      for (const template of templates) {
        if (template.templateType) {
          byTemplate[template.templateType] = await this.getEmailMetricsForTemplate(template.templateType);
        }
      }

      // Métricas por prioridade
      const priorities = await prisma.emailLog.groupBy({
        by: ['priority'],
        _count: true,
      });

      const byPriority: Record<string, EmailMetrics> = {};
      for (const priority of priorities) {
        byPriority[priority.priority] = await this.getEmailMetricsForPriority(priority.priority);
      }

      return {
        last24Hours,
        last7Days,
        last30Days,
        allTime,
        byProvider,
        byTemplate,
        byPriority,
      };
    } catch (error) {
      simpleLogger.error('Failed to get email stats', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Métricas por provider
   */
  private async getEmailMetricsForProvider(provider: string): Promise<EmailMetrics> {
    // Implementação simplificada - pode ser expandida
    return this.getEmailMetrics('all');
  }

  /**
   * Métricas por template
   */
  private async getEmailMetricsForTemplate(templateType: string): Promise<EmailMetrics> {
    // Implementação simplificada - pode ser expandida
    return this.getEmailMetrics('all');
  }

  /**
   * Métricas por prioridade
   */
  private async getEmailMetricsForPriority(priority: string): Promise<EmailMetrics> {
    // Implementação simplificada - pode ser expandida
    return this.getEmailMetrics('all');
  }

  /**
   * Limpa logs antigos
   */
  async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
      
      const result = await prisma.emailLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      simpleLogger.info('Old email logs cleaned up', {
        deletedCount: result.count,
        cutoffDate,
        daysToKeep,
      });

      return result.count;
    } catch (error) {
      simpleLogger.error('Failed to cleanup old email logs', {
        daysToKeep,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

// Instância singleton
export const emailLogger = new EmailLogger();

// Funções auxiliares para integração
export async function logEmailSent(entry: Omit<EmailLogEntry, 'id' | 'createdAt' | 'status'> & { messageId: string }) {
  return emailLogger.logEmailAttempt({
    ...entry,
    status: 'sent',
    sentAt: new Date(),
  });
}

export async function logEmailFailed(entry: Omit<EmailLogEntry, 'id' | 'createdAt' | 'status'> & { error: string }) {
  return emailLogger.logEmailAttempt({
    ...entry,
    status: 'failed',
  });
}

export async function logEmailPending(entry: Omit<EmailLogEntry, 'id' | 'createdAt' | 'status'>) {
  return emailLogger.logEmailAttempt({
    ...entry,
    status: 'pending',
  });
}
