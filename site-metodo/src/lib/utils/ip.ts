import { NextRequest } from 'next/server'

/**
 * Extrai o endereço IP real do usuário considerando proxies e CDNs
 */
export function getClientIP(request: NextRequest): string {
  // Cloudflare
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) return cfConnectingIP.trim()

  // Proxy reverso padrão
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    const firstIP = xForwardedFor.split(',')[0]
    if (firstIP) return firstIP.trim()
  }

  // Nginx
  const xRealIP = request.headers.get('x-real-ip')
  if (xRealIP) return xRealIP.trim()

  // Heroku
  const herokuForwardedFor = request.headers.get('x-forwarded-for')
  if (herokuForwardedFor) return herokuForwardedFor.split(',')[0].trim()

  // Vercel
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for')
  if (vercelForwardedFor) return vercelForwardedFor.trim()

  // Fallback
  return '127.0.0.1'
}
