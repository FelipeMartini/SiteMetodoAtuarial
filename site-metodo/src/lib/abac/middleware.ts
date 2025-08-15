import { NextRequest, NextResponse } from 'next/server'
import { getEnforcer } from './enforcer-abac-puro'
// import { AuthorizationError } from './types';

/**
 * ABAC Middleware for Next.js
 * Integrates with existing middleware system
 */

export interface ABACMiddlewareConfig {
  publicPaths: string[]
  adminPaths: string[]
  protectedPaths: string[]
  enableLogging: boolean
  onUnauthorized?: (request: NextRequest) => NextResponse
}

const defaultConfig: ABACMiddlewareConfig = {
  publicPaths: [
    '/',
    '/login',
    '/criar-conta',
    '/sobre',
    '/contato',
    '/servicos',
    '/recuperar-senha',
    '/api/auth/*',
  ],
  adminPaths: ['/admin/*', '/api/admin/*'],
  protectedPaths: ['/area-cliente/*', '/api/usuarios/*', '/api/usuario/*'],
  enableLogging: true,
}

/**
 * Check if path matches pattern (supports wildcards)
 */
function matchesPath(path: string, pattern: string): boolean {
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1)
    return path.startsWith(prefix)
  }
  return path === pattern
}

/**
 * Check if path is in patterns array
 */
function isPathInPatterns(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => matchesPath(path, pattern))
}

/**
 * Get user from request (integrates with Auth.js)
 */
async function getUserFromRequest(request: NextRequest): Promise<{
  email: string
  role: string
  id: string
} | null> {
  try {
    // Try to get session token from cookies
    const sessionToken =
      request.cookies.get('authjs.session-token')?.value ||
      request.cookies.get('__Secure-authjs.session-token')?.value

    if (!sessionToken) {
      return null
    }

    // In a real implementation, you would validate the session token
    // For now, we'll use a simplified approach
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      // Extract user info from token or session
      // This is a simplified implementation
      return {
        email: 'user@example.com',
        role: 'user',
        id: 'user-id',
      }
    }

    return null
  } catch (_error) {
    console.error('Error getting user from request:', String(_error))
    return null
  }
}

/**
 * Main ABAC middleware function
 */
export async function abacMiddleware(
  request: NextRequest,
  config: Partial<ABACMiddlewareConfig> = {}
): Promise<NextResponse> {
  const mergedConfig = { ...defaultConfig, ...config }
  const { pathname } = request.nextUrl

  try {
    // Skip authorization for public paths
    if (isPathInPatterns(pathname, mergedConfig.publicPaths)) {
      return NextResponse.next()
    }

    // Get user from request
    const user = await getUserFromRequest(request)

    // Redirect to login if user not authenticated and path is protected
    if (
      !user &&
      (isPathInPatterns(pathname, mergedConfig.protectedPaths) ||
        isPathInPatterns(pathname, mergedConfig.adminPaths))
    ) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // If user is authenticated, check permissions
    if (user) {
      const enforcer = await getEnforcer()

      // Determine action based on HTTP method
      const action = getActionFromMethod(request.method)

      // Check authorization
      const isAllowed = await enforcer.enforce(
        user.email,
        pathname,
        action,
        JSON.stringify({
          ip: getClientIP(request),
          userAgent: request.headers.get('user-agent') || undefined,
          time: new Date(),
          attributes: {},
        })
      )

      if (!isAllowed) {
        // Log unauthorized access attempt
        if (mergedConfig.enableLogging) {
          console.warn(`Unauthorized access attempt: ${user.email} -> ${pathname} (${action})`)
        }

        // Custom unauthorized handler or default
        if (mergedConfig.onUnauthorized) {
          return mergedConfig.onUnauthorized(request)
        }

        // Default unauthorized response
        if (isPathInPatterns(pathname, mergedConfig.adminPaths)) {
          // Admin paths -> 403 Forbidden
          return new NextResponse('Forbidden: Insufficient permissions', { status: 403 })
        } else {
          // Other protected paths -> redirect to unauthorized page
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }

      // Log successful access
      if (mergedConfig.enableLogging) {
        console.log(`Access granted: ${user.email} -> ${pathname} (${action})`)
      }
    }

    return NextResponse.next()
  } catch (_error) {
    console.error('ABAC Middleware error:', String(_error))

    // In case of error, allow access but log the error
    // In production, you might want to deny access instead
    return NextResponse.next()
  }
}

/**
 * Get action from HTTP method
 */
function getActionFromMethod(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET':
    case 'HEAD':
      return 'read'
    case 'POST':
    case 'PUT':
    case 'PATCH':
      return 'write'
    case 'DELETE':
      return 'delete'
    default:
      return 'read'
  }
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for')
  const xRealIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  if (cfConnectingIP) {
    return cfConnectingIP
  }

  if (xRealIP) {
    return xRealIP
  }

  return 'unknown'
}

/**
 * Create a middleware function with custom config
 */
export function createABACMiddleware(config: Partial<ABACMiddlewareConfig> = {}) {
  return (request: NextRequest) => abacMiddleware(request, config)
}

/**
 * HOC for protecting API routes
 */
export function withABACAuthorization(
  handler: (req: NextRequest) => Promise<NextResponse>,
  requiredAction: string = 'read'
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const user = await getUserFromRequest(request)

      if (!user) {
        return new NextResponse('Unauthorized', { status: 401 })
      }

      const enforcer = await getEnforcer()
      const { pathname } = request.nextUrl

      const isAllowed = await enforcer.enforce(
        user.email,
        pathname,
        requiredAction,
        JSON.stringify({
          ip: getClientIP(request),
          userAgent: request.headers.get('user-agent') || undefined,
          time: new Date(),
          attributes: {},
        })
      )

      if (!isAllowed) {
        return new NextResponse('Forbidden', { status: 403 })
      }

      return handler(request)
    } catch (_error) {
      console.error('Authorization error:', String(_error))
      return new NextResponse('Internal Server Error', { status: 500 })
    }
  }
}

/**
 * Utility function to check permissions in React components
 */
export async function checkPermission(
  userEmail: string,
  resource: string,
  action: string = 'read'
): Promise<boolean> {
  try {
    const enforcer = await getEnforcer()

    const isAllowed = await enforcer.enforce(
      userEmail,
      resource,
      action
    )

    return isAllowed
  } catch (_error) {
    console.error('Permission check error:', String(_error))
    return false
  }
}
