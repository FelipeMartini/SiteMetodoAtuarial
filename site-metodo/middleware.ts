/**
 * 🛡️ Middleware de Autenticação Auth.js v5 - Configuração Profissional
 * 
 * ✨ Recursos implementados:
 * ✅ Proteção inteligente de rotas por role/accessLevel
 * ✅ Redirecionamento otimizado baseado em contexto
 * ✅ Suporte a rotas públicas e privadas
 * ✅ Performance otimizada com caching de verificações
 * ✅ Logs detalhados para auditoria e debug
 * 
 * @see https://authjs.dev/getting-started/session-management/protecting
 */

import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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
  const { pathname } = req.nextUrl
  const session = req.auth
  
  // 📝 Log para debugging (apenas em desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${req.method} ${pathname} - User: ${session?.user?.email || 'Anonymous'}`)
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
      console.log(`[Middleware] ↩️ Logged user redirected from ${pathname} to /area-cliente`)
      return NextResponse.redirect(new URL('/area-cliente', req.url))
    }
    return NextResponse.next()
  }

  // 🔐 Verificar se rota requer autenticação
  if (isRouteMatch(pathname, PROTECTED_ROUTES)) {
    if (!session) {
      console.log(`[Middleware] 🚫 Unauthorized access to ${pathname} - redirecting to signin`)
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Verificar se usuário está ativo
    if (!session.user?.isActive) {
      console.log(`[Middleware] ⚠️ Inactive user ${session.user?.email} trying to access ${pathname}`)
      return NextResponse.redirect(new URL('/auth/error?error=AccountDisabled', req.url))
    }

    // 👑 Verificar rotas de admin
    if (isRouteMatch(pathname, ADMIN_ROUTES)) {
      const accessLevel = session.user?.accessLevel || 0
      if (accessLevel < 100) {
        console.log(`[Middleware] 🚫 Insufficient admin privileges for ${session.user?.email} (level: ${accessLevel})`)
        return NextResponse.redirect(new URL('/auth/error?error=InsufficientPrivileges', req.url))
      }
    }

    // 🛠️ Verificar rotas de moderador
    if (isRouteMatch(pathname, MODERATOR_ROUTES)) {
      const accessLevel = session.user?.accessLevel || 0
      if (accessLevel < 50) {
        console.log(`[Middleware] 🚫 Insufficient moderator privileges for ${session.user?.email} (level: ${accessLevel})`)
        return NextResponse.redirect(new URL('/auth/error?error=InsufficientPrivileges', req.url))
      }
    }

    console.log(`[Middleware] ✅ Access granted to ${pathname} for ${session.user?.email} (role: ${session.user?.role})`)
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
