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
  try {
    // Log para rastrear todas as chamadas
    console.log('[checkClientPermission] chamada', { userEmail, resource, action })
    const response = await fetch('/api/abac/check', {
      method: 'POST',
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
      console.error('Permission check failed:', response.statusText)
      return false
    }

    const data = await response.json()
    return data.allowed || false
  } catch (_error) {
    console.error('Permission check error:', String(_error))
    return false
  }
}
