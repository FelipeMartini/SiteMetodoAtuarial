// Configuração central do Auth.js (@auth/core) usando PrismaAdapter e sessões em banco
// Estratégia: 'database' para permitir invalidação server-side e auditoria
// Fornece helpers: authConfig, authHandler(), auth(), requireRole()

import { cookies } from 'next/headers'
import { Auth, type AuthConfig } from '@auth/core'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import Email from '@auth/core/providers/email'
import Credentials from '@auth/core/providers/credentials'
// Providers adicionais opcionais (inclusão condicional por variáveis de ambiente)
import Apple from '@auth/core/providers/apple'
import Twitter from '@auth/core/providers/twitter'
import MicrosoftEntraID from '@auth/core/providers/microsoft-entra-id'
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

/**
 * Montagem dinâmica da lista de providers do Auth.js.
 * Regras:
 * - Sempre inclui Credentials (login tradicional) para permitir auto-login pós registro.
 * - Inclui Email magic-link se variáveis SMTP presentes (mantendo posição logo após Credentials).
 * - Inclui Google / GitHub sempre que as respectivas variáveis estiverem presentes (Auth.js já usa env padrões AUTH_<PROV>_ID/SECRET).
 * - Inclui Apple somente se TODOS os requisitos estiverem definidos: AUTH_APPLE_ID, AUTH_APPLE_TEAM_ID, AUTH_APPLE_PRIVATE_KEY, AUTH_APPLE_KEY_ID.
 *   A chave privada frequentemente vem com quebras de linha escapadas, convertemos '\n' em '\n'.
 * - Inclui Twitter se AUTH_TWITTER_ID e AUTH_TWITTER_SECRET.
 * - Inclui Microsoft Entra ID se AUTH_MICROSOFT_ENTRA_ID_ID e AUTH_MICROSOFT_ENTRA_ID_SECRET (issuer opcional restringe tenant).
 * - Ordem pensada para UX: Credentials (interno) + Email (se existir) depois principais sociais (Google, GitHub, Apple, Twitter, Microsoft).
 * - O componente SocialLoginBox consome /api/auth/providers para descobrir quais estão realmente ativos.
 */
export const providers: AuthConfig['providers'] = [
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
    // Corrigir tipagem de emailVerified no fluxo de criação de usuário social
    // O Auth.js v5 espera Date/null, mas Google retorna boolean. Corrigimos no callback.
  }),
]

// Email magic link (inserido logo após Credentials)
if (process.env.NODE_ENV !== 'test' && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.EMAIL_FROM) {
  providers.push(Email({
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

// Google
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google)
}
// GitHub
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(GitHub)
}
// Apple (todos requisitos)
if (process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_TEAM_ID && process.env.AUTH_APPLE_PRIVATE_KEY && process.env.AUTH_APPLE_KEY_ID) {
  // Tipagem de Apple em @auth/core pode não expor todas propriedades; usamos cast para permitir configuração avançada.
  type AppleConfig = { clientId: string; teamId: string; keyId: string; privateKey: string }
  providers.push(Apple({
    clientId: process.env.AUTH_APPLE_ID,
    teamId: process.env.AUTH_APPLE_TEAM_ID,
    keyId: process.env.AUTH_APPLE_KEY_ID,
    privateKey: process.env.AUTH_APPLE_PRIVATE_KEY.split('\\n').join('\n'),
  } as unknown as AppleConfig))
} else if (process.env.AUTH_APPLE_ID && process.env.NODE_ENV !== 'production') {
  console.warn('[auth] Apple incompleto – defina AUTH_APPLE_TEAM_ID, AUTH_APPLE_PRIVATE_KEY, AUTH_APPLE_KEY_ID para habilitar.')
}
// Twitter
if (process.env.AUTH_TWITTER_ID && process.env.AUTH_TWITTER_SECRET) {
  providers.push(Twitter({ clientId: process.env.AUTH_TWITTER_ID, clientSecret: process.env.AUTH_TWITTER_SECRET }))
}
// Microsoft Entra ID (OIDC)
if (process.env.AUTH_MICROSOFT_ENTRA_ID_ID && process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET) {
  providers.push(MicrosoftEntraID({
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
    issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER, // opcional (restringe tenant)
  }))
}

export const authConfig: AuthConfig = {
  basePath: '/api/auth',
  trustHost: true,
  secret: AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  // Em testes usamos 'jwt' porque Credentials provider no Auth.js v5 exige JWT strategy; em produção mantemos 'database' para invalidação server-side
  session: process.env.NODE_ENV === 'test' ? { strategy: 'jwt' } : { strategy: 'database' },
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
    async signIn({ user, profile }) {
      // Corrigir emailVerified: se vier boolean, converte para Date/null
      if (profile && typeof profile.email_verified === 'boolean' && user.email) {
        const emailVerified = profile.email_verified ? new Date() : null
        await prisma.user.update({ where: { email: user.email as string }, data: { emailVerified } }).catch(() => {})
      }
      return true
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

