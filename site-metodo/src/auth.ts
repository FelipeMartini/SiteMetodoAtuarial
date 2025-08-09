// Configuração central do Auth.js (@auth/core) usando PrismaAdapter e sessões em banco
// Estratégia: 'database' para permitir invalidação server-side e auditoria
// Fornece helpers: authConfig, authHandler(), auth(), requireRole()

import { cookies } from 'next/headers'
import { Auth, type AuthConfig } from '@auth/core'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import Email from '@auth/core/providers/email'
import Credentials from '@auth/core/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Prisma singleton para evitar múltiplas conexões em dev
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

// Providers (Email incluso apenas se SMTP configurado)
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
      if (!user || !user.password) return null
      const ok = await bcrypt.compare(credentials.password as string, user.password)
      if (!ok) return null
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
  session: { strategy: 'database' },
  providers,
  callbacks: {
    async session({ session }) {
      if (!session.user?.email && !session.user?.id) return session
      const userRecord = await prisma.user.findFirst({
        where: {
          OR: [
            session.user.id ? { id: session.user.id } : undefined,
            session.user.email ? { email: session.user.email } : undefined,
          ].filter(Boolean) as [{ id: string }] | [{ email: string }],
        },
        select: { id: true, accessLevel: true, name: true, email: true },
      })
      if (userRecord) {
        (session.user as typeof session.user & { id?: string; role?: string; accessLevel?: number }).id = userRecord.id
        ;(session.user as typeof session.user & { id?: string; role?: string; accessLevel?: number }).accessLevel = userRecord.accessLevel
        ;(session.user as typeof session.user & { id?: string; role?: string; accessLevel?: number }).role = mapAccessLevelToRole(userRecord.accessLevel)
      }
      return session
    },
  },
  experimental: { enableWebAuthn: false },
}

export async function authHandler(request: Request) {
  return Auth(request, authConfig)
}

// Helper para recuperar sessão a partir do cookie de sessão (Session model)
export async function auth() {
  const store = await cookies()
  const candidates = ['__Secure-authjs.session-token', 'authjs.session-token', 'next-auth.session-token']
  let sessionToken: string | undefined
  for (const c of candidates) {
    const cookie = store.get(c)
    if (cookie?.value) { sessionToken = cookie.value; break }
  }
  if (!sessionToken) return null
  const sessionRecord = await prisma.session.findUnique({
    where: { sessionToken },
    select: { sessionToken: true, userId: true, expires: true, user: { select: { id: true, name: true, email: true, accessLevel: true } } },
  })
  if (!sessionRecord) return null
  if (sessionRecord.expires.getTime() < Date.now()) return null
  const accessLevel = sessionRecord.user.accessLevel
  return {
    user: {
      id: sessionRecord.user.id,
      name: sessionRecord.user.name ?? undefined,
      email: sessionRecord.user.email ?? undefined,
      accessLevel,
      role: mapAccessLevelToRole(accessLevel),
    },
    sessionToken,
    expires: sessionRecord.expires,
  }
}

export async function requireRole(minRole: string | string[]) {
  const session = await auth()
  if (!session) return null
  const role = session.user.role
  if (Array.isArray(minRole)) return minRole.includes(role) ? session : null
  return role === minRole ? session : null
}

