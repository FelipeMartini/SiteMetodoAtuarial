// Utilidades compartilhadas para endpoint de observabilidade (fase 1 avançada)
import { z } from 'zod'

export const observabilityQuerySchema = z.object({
  type: z.string().default('sistema'),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(200).default(25),
  sort: z.string().optional(),
  order: z.enum(['asc','desc']).default('desc'),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  level: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  operation: z.string().optional(),
  status: z.string().optional(),
  export: z.enum(['csv','json']).optional(),
  summary: z.string().transform(v => v === 'true').optional(),
})

export interface BuildPaginationParams { page: number; pageSize: number }
export function buildPagination({ page, pageSize }: BuildPaginationParams) {
  return { skip: (page - 1) * pageSize, take: pageSize }
}

export function toDateRange(from?: string, to?: string) {
  const range: any = {}
  if (from) range.gte = new Date(from)
  if (to) range.lte = new Date(to)
  return Object.keys(range).length ? range : undefined
}

export function buildCSV(rows: any[], columns?: string[]): string {
  if (!rows.length) return ''
  const cols = columns || Array.from(new Set(rows.flatMap(r => Object.keys(r))))
  const header = cols.join(',')
  const lines = rows.map(r => cols.map(c => escapeCsv(r[c])).join(','))
  return [header, ...lines].join('\n')
}

function escapeCsv(v: any): string {
  if (v === null || v === undefined) return ''
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g,'""') + '"'
  return s
}

export interface SummaryMetrics {
  count24h: number
  errors24h?: number
  p95DurationMs?: number
}
