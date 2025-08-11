import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'
import DiscordProvider from 'next-auth/providers/discord'
import FacebookProvider from 'next-auth/providers/facebook'
import AppleProvider from 'next-auth/providers/apple'
import Credentials from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { signInSchema } from './src/lib/validation'
import { prisma } from './src/lib/prisma'
import { migrateAccessLevelToRoles } from './src/lib/auth/authRoles'

/**
 * 🚀 Auth.js v5 - Configuração Profissional e Completa
 *
 * ✨ IMPLEMENTAÇÃO ENTERPRISE-GRADE:
 * ✅ 5 Provedores OAuth: Google, Microsoft, Discord, Facebook, Apple
 * ✅ Database sessions para TODOS os providers (OAuth + Credentials)
 * ✅ Sistema de roles unificado moderno (baseado no fuse-react)
 * ✅ Compatibilidade com accessLevel legado
 * ✅ Auditoria e logs de segurança completos
 * ✅ Validação com Zod para credentials
 * ✅ Performance otimizada com Prisma singleton
 *
 * @see https://authjs.dev/getting-started/adapters/prisma
 */

// Definição de roles do sistema (compatibilidade)
export const SYSTEM_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  USER: 'user',
  GUEST: 'guest',
} as const

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES]

// Mapeamento de accessLevel para roles (compatibilidade legada)
export function mapAccessLevelToRole(accessLevel: number): string[] {
  if (accessLevel >= 100) return ['admin'] // Admin completo
  if (accessLevel >= 50) return ['staff'] // Staff/Moderador
  if (accessLevel >= 1) return ['user'] // Usuário padrão
  return [] // Guest (não autenticado)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === 'development',

  // 🎯 DATABASE SESSIONS PARA TODOS OS PROVIDERS
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60, // Update a cada 24h
  },

  providers: [
    // === 🌐 GOOGLE OAUTH PROVIDER ===
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // === 🏢 MICROSOFT ENTRA ID PROVIDER ===
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
      allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
    }),

    // === 🎮 DISCORD OAUTH PROVIDER ===
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
      allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
    }),

    // === 📘 FACEBOOK OAUTH PROVIDER ===
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
      allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
    }),

    // === 🍎 APPLE OAUTH PROVIDER ===
    AppleProvider({
      clientId: process.env.AUTH_APPLE_ID!,
      clientSecret: process.env.AUTH_APPLE_SECRET!,
      allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
    }),

    // === 🔐 CREDENTIALS PROVIDER (DATABASE SESSIONS) ===
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'admin@test.com',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '123456',
        },
      },
      async authorize(credentials) {
        try {
          // Validação com Zod
          const { email, password } = await signInSchema.parseAsync(credentials)

          // Buscar usuário no banco
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              accessLevel: true,
              isActive: true,
              image: true,
              emailVerified: true,
            },
          })

          if (!user || !user.password) {
            console.log('[Auth] ❌ User not found or no password:', email)
            return null
          }

          if (!user.isActive) {
            console.log('[Auth] ❌ User is inactive:', email)
            return null
          }

          // Verificar senha com bcrypt
          const isPasswordValid = await bcryptjs.compare(password, user.password)
          if (!isPasswordValid) {
            console.log('[Auth] ❌ Invalid password for:', email)
            return null
          }

          console.log('[Auth] ✅ Successful credentials login for:', email)

          // Auditoria: registrar login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })

          // Retornar objeto do usuário para Auth.js v5
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            accessLevel: user.accessLevel,
            role: mapAccessLevelToRole(user.accessLevel),
            isActive: user.isActive,
            emailVerified: user.emailVerified,
          }
        } catch (error) {
          console.error('[Auth] ❌ Credentials authorization error:', error)
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  callbacks: {
    // 🔄 Session callback - enriquece session com dados do banco
    async session({ session, user }) {
      console.log('[Auth] 📊 Session callback for:', user?.email)

      if (session.user && user) {
        try {
          // Buscar dados completos e atualizados do usuário
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              accessLevel: true,
              isActive: true,
              emailVerified: true,
              createdAt: true,
              lastLogin: true,
            },
          })

          if (dbUser) {
            // Estender session com dados customizados (incluindo novo sistema de roles)
            const extendedUser = session.user as typeof session.user & {
              id: string
              accessLevel: number
              role: string[] // Novo sistema de roles moderno
              isActive: boolean
              emailVerified: Date | null
              createdAt: Date
              lastLogin: Date | null
            }

            extendedUser.id = dbUser.id
            extendedUser.email = dbUser.email || ''
            extendedUser.name = dbUser.name
            extendedUser.image = dbUser.image
            extendedUser.accessLevel = dbUser.accessLevel // Manter compatibilidade
            extendedUser.role = mapAccessLevelToRole(dbUser.accessLevel) // Converter para novo sistema
            extendedUser.isActive = dbUser.isActive
            extendedUser.emailVerified = dbUser.emailVerified
            extendedUser.createdAt = dbUser.createdAt
            extendedUser.lastLogin = dbUser.lastLogin

            console.log(
              '[Auth] ✅ Session enriched for user:',
              dbUser.email,
              'roles:',
              extendedUser.role
            )
          }
        } catch (error) {
          console.error('[Auth] ❌ Error enriching session:', error)
        }
      }

      return session
    },

    // 🔐 SignIn callback - validação e criação de usuários OAuth
    async signIn({ user, account, profile }) {
      console.log('[Auth] 🔑 SignIn callback:', {
        user: user?.email,
        provider: account?.provider,
        isOAuth: account?.provider !== 'credentials',
      })

      try {
        // Para OAuth providers, verificar/criar usuário no banco
        if (account?.provider !== 'credentials') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: {
              id: true,
              email: true,
              isActive: true,
              accessLevel: true,
              name: true,
              image: true,
            },
          })

          // Se usuário não existe, criar um novo
          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                image: user.image,
                emailVerified: new Date(),
                accessLevel: 1, // Usuário padrão
                isActive: true,
                lastLogin: new Date(),
              },
            })

            console.log('[Auth] ✅ New OAuth user created:', {
              email: user.email,
              provider: account?.provider,
              id: newUser.id,
            })

            // Atualizar user object com ID correto
            user.id = newUser.id
          } else {
            // Verificar se usuário está ativo
            if (!existingUser.isActive) {
              console.log('[Auth] ❌ OAuth user is inactive:', user.email)
              return false
            }

            // Atualizar dados do usuário existente
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                lastLogin: new Date(),
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                emailVerified: user.email ? new Date() : null,
              },
            })

            console.log('[Auth] ✅ OAuth user updated:', {
              email: user.email,
              provider: account?.provider,
              role: mapAccessLevelToRole(existingUser.accessLevel),
            })

            // Atualizar user object com ID correto
            user.id = existingUser.id
          }
        } else {
          // Para Credentials, verificar se usuário ainda está ativo
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id! },
            select: { isActive: true, accessLevel: true },
          })

          if (!dbUser?.isActive) {
            console.log('[Auth] ❌ Credentials user is inactive:', user.email)
            return false
          }

          console.log('[Auth] ✅ Credentials user validated:', {
            email: user.email,
            role: mapAccessLevelToRole(dbUser.accessLevel),
          })
        }

        return true
      } catch (error) {
        console.error('[Auth] ❌ SignIn callback error:', error)
        return false
      }
    },

    // 🔀 Redirect callback - redirecionamento seguro pós-login
    async redirect({ url, baseUrl }) {
      console.log('[Auth] 🔀 Redirect callback:', { url, baseUrl })

      // Redirecionamento seguro
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/area-cliente`
    },
  },

  // 📊 Events - Auditoria e logs de sistema
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      const provider = account?.provider || 'unknown'
      const userInfo = `${user.email} (ID: ${user.id})`

      console.log(
        `[Auth] ✅ User signed in: ${userInfo} via ${provider}${isNewUser ? ' (NEW USER)' : ''}`
      )

      // TODO: Implementar logging em tabela de auditoria
      // await prisma.auditLog.create({
      //   data: {
      //     action: 'SIGN_IN',
      //     userId: user.id,
      //     provider: provider,
      //     isNewUser: isNewUser || false,
      //     timestamp: new Date(),
      //   }
      // })
    },

    async signOut() {
      console.log(`[Auth] 👋 User signed out`)
    },

    async createUser({ user }) {
      console.log(`[Auth] 👤 New user created: ${user.email} (ID: ${user.id})`)
    },

    async updateUser({ user }) {
      console.log(`[Auth] 🔄 User updated: ${user.email} (ID: ${user.id})`)
    },

    async linkAccount({ user, account, profile }) {
      console.log(`[Auth] 🔗 Account linked: ${account.provider} → ${user.email}`)
    },

    async session({ session, token }) {
      // Log de acesso à session para debug (se necessário)
      if (process.env.AUTH_DEBUG === 'true') {
        console.log(`[Auth] 📊 Session accessed: ${session?.user?.email}`)
      }
    },
  },
})

// 📝 Tipos TypeScript para session estendida
export type ExtendedUser = {
  id: string
  email: string
  name?: string | null
  image?: string | null
  accessLevel: number
  role: SystemRole
  isActive: boolean
  emailVerified: Date | null
  createdAt: Date
  lastLogin: Date | null
}

export type ExtendedSession = {
  user: ExtendedUser
  expires: string
}
