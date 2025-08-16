'use client'

/**
 * Client-side ABAC utility functions
 * These make API calls instead of using server-side enforcer directly
 */

export async function checkClientPermission(
  userEmail: string,
  resource: string,
  action: string
): Promise<boolean> {
  // cache simples em memória para evitar chamadas repetidas que podem causar loops
  const key = `${userEmail}:${resource}:${action}`
  const now = Date.now()
  const CACHE_TTL = 30_000 // 30s
  if (typeof (checkClientPermission as any).cache === 'undefined') {
    ;(checkClientPermission as any).cache = new Map()
  }
  const cache = (checkClientPermission as any).cache as Map<string, { allowed: boolean; status: number; ts: number }>
  const cached = cache.get(key)
  if (cached && now - cached.ts < CACHE_TTL) {
    console.log('[checkClientPermission] cache hit', { key, cached })
    return cached.allowed
  }
  try {
    // Log para rastrear todas as chamadas
    console.log('[checkClientPermission] chamada', { userEmail, resource, action })
    const response = await fetch('/api/abac/check', {
      method: 'POST',
      credentials: 'include', // garantir envio de cookies/session
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: userEmail,
        object: resource,
        action,
      }),
    })

    if (!response.ok) {
      console.error('Permission check failed:', response.statusText, response.status)
      // cache negativo para evitar loop de requisições repetidas (ex: 401)
      cache.set(key, { allowed: false, status: response.status, ts: Date.now() })
      return false
    }

    const data = await response.json()
    const allowed = !!data.allowed
    cache.set(key, { allowed, status: response.status, ts: Date.now() })
    return allowed
  } catch (_error) {
    console.error('Permission check error:', String(_error))
    return false
  }
}

/**
 * Invalida cache de permissões no cliente.
 * Pode ser chamada após ações administrativas que alterem policies.
 * Se nenhum parâmetro for passado limpa todo cache; caso contrário remove chaves específicas.
 */
export function invalidateClientPermissionCache(options?: { userEmail?: string; resource?: string; action?: string }) {
  const anyFn = checkClientPermission as any
  if (typeof anyFn.cache === 'undefined') return
  const cache = anyFn.cache as Map<string, { allowed: boolean; status: number; ts: number }>
  if (!options || Object.keys(options).length === 0) {
    cache.clear()
    return
  }
  const { userEmail, resource, action } = options
  const keysToDelete: string[] = []
  for (const key of cache.keys()) {
    const [kEmail, kResource, kAction] = key.split(':')
    if ((userEmail && userEmail !== kEmail) || (resource && resource !== kResource) || (action && action !== kAction)) {
      continue
    }
    keysToDelete.push(key)
  }
  keysToDelete.forEach(k => cache.delete(k))
}
