// Auth.js (@auth/core) configuração unificada sem dependência de next-auth v4
// Documentação: https://authjs.dev/reference/core
// Este arquivo expõe:
// - authConfig: configuração para roteador dinâmico
// - auth(): util para obter sessão server-side via cookie JWT
// - authHandler(): handler para rota /api/auth/[...auth]
// - requireRole(): helper simples de RBAC baseado em accessLevel -> role derivada

import { cookies } from 'next/headers'
import { Auth, type AuthConfig } from '@auth/core'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import Email from '@auth/core/providers/email'
import Credentials from '@auth/core/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { decode, encode } from '@auth/core/jwt'

// Singleton Prisma (evita múltiplas instâncias em dev)
// Singleton tipado do Prisma
const globalForPrisma = global as unknown as { prisma?: PrismaClient }
export const prisma: PrismaClient = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

function mapAccessLevelToRole(accessLevel?: number): string {
  if (accessLevel == null) return 'usuario'
  if (accessLevel >= 100) return 'admin'
  if (accessLevel >= 50) return 'moderador'
  return 'usuario'
}

const AUTH_SECRET = process.env.AUTH_SECRET || 'DEV_PLACEHOLDER_SECRET_CHANGE_ME'

// Monta providers dinamicamente (Email só se SMTP configurado para evitar erro de build)
const providers: AuthConfig['providers'] = [
  Credentials({
    name: 'Login',
    credentials: {
      email: { label: 'E-mail', type: 'email' },
      password: { label: 'Senha', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null
      const user = await prisma.user.findUnique({ where: { email: credentials.email as string } })
      if (!user) return null
      // TODO: validar hash da senha (bcrypt). Placeholder aceita sempre usuário existente.
      return { id: user.id, name: user.name, email: user.email, accessLevel: user.accessLevel }
    },
  }),
  Google,
  GitHub,
]

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.EMAIL_FROM) {
  providers.splice(1, 0, Email({
    server: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    },
    from: process.env.EMAIL_FROM,
  }))
} else if (process.env.NODE_ENV !== 'production') {
  console.warn('[auth] Provider Email não configurado (variáveis SMTP ausentes) – ignorando.')
}

export const authConfig: AuthConfig = {
  basePath: '/api/auth',
  trustHost: true,
  secret: AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      // Extendendo token quando usuário faz sign-in
      if (user) {
        const accessLevel: number = (user as { accessLevel?: number; id?: string }).accessLevel ?? 1
        return {
          ...token,
          id: (user as { id?: string }).id,
          accessLevel,
          role: mapAccessLevelToRole(accessLevel),
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        const t = token as Partial<{ id: string; role: string; accessLevel: number }>
        // Estende dinamicamente user; criação de tipo local evita uso de any
        (session.user as typeof session.user & { id?: string; role?: string; accessLevel?: number }).id = t.id
        ;(session.user as typeof session.user & { id?: string; role?: string; accessLevel?: number }).role = t.role
        ;(session.user as typeof session.user & { id?: string; role?: string; accessLevel?: number }).accessLevel = t.accessLevel
      }
      return session
    },
  },
  jwt: {
    async encode(params) { return encode({ ...params, secret: AUTH_SECRET, salt: 'authjs' }) },
    async decode(params) { return decode({ ...params, secret: AUTH_SECRET, salt: 'authjs' }) },
  },
  experimental: { enableWebAuthn: false },
}

export async function authHandler(request: Request) {
  return Auth(request, authConfig)
}

export async function auth() {
  const store = cookies()
  const candidates = ['__Secure-authjs.session-token', 'authjs.session-token', 'next-auth.session-token']
  let raw: string | undefined
  for (const c of candidates) {
    const cookie = store.get(c)
    if (cookie?.value) { raw = cookie.value; break }
  }
  if (!raw) return null
  const payload = await decode({ token: raw, secret: AUTH_SECRET, salt: 'authjs' }) as (Record<string, unknown> | null)
  if (!payload) return null
  const userId = payload.id as string | undefined
  let user = null
  if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, accessLevel: true } })
  }
  const accessLevel = user?.accessLevel ?? (payload.accessLevel as number | undefined) ?? 1
  return {
    user: {
      id: user?.id || userId,
      name: user?.name || (payload.name as string | undefined),
      email: user?.email || (payload.email as string | undefined),
      accessLevel,
      role: mapAccessLevelToRole(accessLevel),
    },
    token: payload,
  }
}

export async function requireRole(minRole: string | string[]) {
  const session = await auth()
  if (!session) return null
  const role = session.user.role
  if (Array.isArray(minRole)) return minRole.includes(role) ? session : null
  return role === minRole ? session : null
}
