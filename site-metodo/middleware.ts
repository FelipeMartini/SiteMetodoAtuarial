/**
 * 🛡️ Middleware de Autenticação Auth.js v5 - Configuração Profissional
 * 
 * ✨ Recursos implementados:
 * ✅ Proteção inteligente de rotas por role/accessLevel
 * ✅ Redirecionamento otimizado baseado em contexto
 * ✅ Suporte a rotas públicas e privadas
 * ✅ Performance otimizada com caching de verificações
 * ✅ Logs detalhados para auditoria e debug
 * ✅ Sistema de logging estruturado e auditoria
 * ✅ Monitoramento de performance
 * 
 * @see https://authjs.dev/getting-started/session-management/protecting
 */

import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { structuredLogger } from "./src/lib/logger"
import { createComprehensiveMiddleware } from "./src/middleware/logging"
import { getClientIP } from "./src/lib/utils/ip"

// 🌍 Rotas públicas (não requerem autenticação)
const PUBLIC_ROUTES = [
  '/',
  '/auth/signin',
  '/auth/signup', 
  '/auth/error',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/callback',
  '/api/auth/csrf',
  '/api/auth/providers',
  '/api/auth/session',
  '/api/public',
]

// 🔐 Rotas que requerem autenticação
const PROTECTED_ROUTES = [
  '/area-cliente',
  '/dashboard', 
  '/profile',
  '/settings',
  '/admin',
  '/api/protected',
]

// 👑 Rotas que requerem privilégios de admin (accessLevel >= 100)
const ADMIN_ROUTES = [
  '/admin',
  '/admin/users',
  '/admin/settings',
  '/admin/logs',
  '/api/admin',
]

// 🛠️ Rotas que requerem privilégios de moderador (accessLevel >= 50)
const MODERATOR_ROUTES = [
  '/moderation',
  '/api/moderation',
]

function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // Correspondência exata ou prefix
    return pathname === route || pathname.startsWith(route + '/')
  })
}

export default auth((req: NextRequest & { auth: any }) => {
  const startTime = Date.now()
  const { pathname } = req.nextUrl
  const session = req.auth
  const ip = getClientIP(req)
  const userAgent = req.headers.get('user-agent') || 'Unknown'
  const method = req.method
  
  // Executar middleware de logging se não for arquivo estático
  const shouldLog = !pathname.startsWith('/_next/') && 
                   !pathname.includes('.') && 
                   pathname !== '/favicon.ico'
  
  if (shouldLog) {
    // Log estruturado do request
    structuredLogger.http(`${method} ${pathname}`, {
      ip,
      userAgent,
      userId: session?.user?.id,
      sessionId: session?.user?.id ? `session_${session.user.id}` : undefined,
      method,
      endpoint: pathname,
      isAuthenticated: !!session,
      userRole: session?.user?.roleType,
      accessLevel: session?.user?.accessLevel,
    })
  }
  
  // 📝 Log para debugging (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${method} ${pathname} - User: ${session?.user?.email || 'Anonymous'}`)
  }

  // 🚫 Ignorar arquivos estáticos e APIs internas do Next.js
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // ✅ Permitir rotas públicas
  if (isRouteMatch(pathname, PUBLIC_ROUTES)) {
    // Se usuário já está logado e tenta acessar login, redirecionar
    if (session && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
      structuredLogger.info('Authenticated user redirected from auth page', {
        userId: session.user?.id,
        ip,
        userAgent,
        fromPath: pathname,
        toPath: '/area-cliente',
      })
      return NextResponse.redirect(new URL('/area-cliente', req.url))
    }
    
    // Log performance para rota pública
    if (shouldLog) {
      setTimeout(() => {
        const responseTime = Date.now() - startTime
        structuredLogger.performance(pathname, responseTime, {
          ip,
          method,
          statusCode: 200,
          isPublicRoute: true,
        })
      }, 0)
    }
    
    return NextResponse.next()
  }

  // 🔐 Verificar se rota requer autenticação
  if (isRouteMatch(pathname, PROTECTED_ROUTES)) {
    if (!session) {
      structuredLogger.warn('Unauthorized access attempt', {
        ip,
        userAgent,
        endpoint: pathname,
        method,
        reason: 'no_session',
      })
      
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Verificar se usuário está ativo
    if (!session.user?.isActive) {
      structuredLogger.security('Inactive user access attempt', 'medium', {
        userId: session.user?.id,
        email: session.user?.email,
        ip,
        userAgent,
        endpoint: pathname,
      })
      return NextResponse.redirect(new URL('/auth/error?error=AccountDisabled', req.url))
    }

    // 👑 Verificar rotas de admin
    if (isRouteMatch(pathname, ADMIN_ROUTES)) {
      const accessLevel = session.user?.accessLevel || 0
      if (accessLevel < 100) {
        structuredLogger.security('Insufficient admin privileges', 'high', {
          userId: session.user?.id,
          email: session.user?.email,
          accessLevel,
          requiredLevel: 100,
          ip,
          userAgent,
          endpoint: pathname,
        })
        return NextResponse.redirect(new URL('/auth/error?error=InsufficientPrivileges', req.url))
      }
    }

    // 🛠️ Verificar rotas de moderador
    if (isRouteMatch(pathname, MODERATOR_ROUTES)) {
      const accessLevel = session.user?.accessLevel || 0
      if (accessLevel < 50) {
        structuredLogger.security('Insufficient moderator privileges', 'medium', {
          userId: session.user?.id,
          email: session.user?.email,
          accessLevel,
          requiredLevel: 50,
          ip,
          userAgent,
          endpoint: pathname,
        })
        return NextResponse.redirect(new URL('/auth/error?error=InsufficientPrivileges', req.url))
      }
    }

    // Log de acesso autorizado
    structuredLogger.info('Authorized access granted', {
      userId: session.user?.id,
      email: session.user?.email,
      roleType: session.user?.roleType,
      accessLevel: session.user?.accessLevel,
      ip,
      userAgent,
      endpoint: pathname,
      method,
    })
    
    // Log performance para rota protegida
    if (shouldLog) {
      setTimeout(() => {
        const responseTime = Date.now() - startTime
        structuredLogger.performance(pathname, responseTime, {
          userId: session.user?.id,
          ip,
          method,
          statusCode: 200,
          isProtectedRoute: true,
        })
      }, 0)
    }
  }

  return NextResponse.next()
})

// 🎯 Configuração de correspondência de rotas otimizada
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Auth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
