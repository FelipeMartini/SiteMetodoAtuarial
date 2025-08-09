import { NextRequest } from 'next/server'
// Exemplo: rate limit simples (substitua por @upstash/ratelimit em prod)
const requests = new Map<string, number>()

export async function rateLimit(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'local'
  const now = Date.now()
  const window = 60 * 1000 // 1 min
  const last = requests.get(ip) || 0
  if (now - last < window) {
    throw new Error('Rate limit exceeded')
  }
  requests.set(ip, now)
}
