// Simulação de rate limit (substitua por @upstash/ratelimit real depois)
import { NextRequest } from 'next/server'

const buckets: Record<string, { count: number; last: number }> = {}
const LIMIT = 10 // 10 req/min

export async function rateLimit(req: NextRequest, key: string) {
  const ip = req.headers.get('x-forwarded-for') || 'local'
  const bucketKey = `${key}:${ip}`
  const now = Date.now()
  if (!buckets[bucketKey] || now - buckets[bucketKey].last > 60_000) {
    buckets[bucketKey] = { count: 1, last: now }
  } else {
    buckets[bucketKey].count++
    if (buckets[bucketKey].count > LIMIT) {
      throw new Error('Rate limit exceeded')
    }
  }
}
