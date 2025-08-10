import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"
import DiscordProvider from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"
import { signInSchema } from "@/src/lib/validation"

// Singleton Prisma instance para evitar múltiplas conexões
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

/**
 * Auth.js v5 - CONFIGURAÇÃO PURA DATABASE SESSIONS
 * 
 * ✨ NOVA IMPLEMENTAÇÃO: Database sessions para TODOS os providers
 * ✅ OAuth Providers → Database Sessions (Google, GitHub, Facebook, Discord)
 * ✅ Credentials Provider → Database Sessions (AGORA FUNCIONA!)
 * 
 * Esta configuração resolve todos os problemas do sistema híbrido:
 * - Sessões consistentes em database para todos os providers
 * - Controle total sobre revogação de sessões
 * - Simplicidade de código e configuração
 * - Alinhado com Auth.js v5 oficial
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.AUTH_DEBUG === "1",
  
  // 🎯 DATABASE SESSIONS PARA TODOS (OAuth + Credentials)
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60,   // Update a cada 24h
  },
  
  providers: [
    // === OAUTH PROVIDERS (DATABASE SESSIONS) ===
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
    
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    }),

    // === CREDENTIALS PROVIDER (DATABASE SESSIONS) ===
    Credentials({
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "admin@test.com" 
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "123456" 
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
            }
          })

          if (!user || !user.password) {
            console.log("[Auth] User not found or no password:", email)
            throw new Error("Invalid credentials")
          }

          if (!user.isActive) {
            console.log("[Auth] User is inactive:", email)
            throw new Error("Account disabled")
          }

          // Verificar senha
          const isPasswordValid = await bcryptjs.compare(password, user.password)
          if (!isPasswordValid) {
            console.log("[Auth] Invalid password for:", email)
            throw new Error("Invalid credentials")
          }

          console.log("[Auth] ✅ Successful credentials login for:", email)

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

          // Retornar user object - Auth.js v5 criará automaticamente a session no database
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            accessLevel: user.accessLevel,
            isActive: user.isActive,
          }
        } catch (error) {
          console.error("[Auth] Credentials authorization error:", error)
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    signUp: "/signup", 
    error: "/login",
  },

  callbacks: {
    // Session callback - agora funciona APENAS com database sessions
    async session({ session, user }) {
      console.log("[Auth] Session callback - database user:", user?.email)

      if (session.user && user) {
        // Buscar dados completos do usuário no banco
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            accessLevel: true,
            isActive: true,
          }
        })

        if (dbUser) {
          // Estender session com dados customizados
          const extendedUser = session.user as typeof session.user & {
            id: string;
            accessLevel: number;
            role: string;
            isActive: boolean;
          };

          extendedUser.id = dbUser.id
          extendedUser.email = dbUser.email
          extendedUser.name = dbUser.name
          extendedUser.image = dbUser.image
          extendedUser.accessLevel = dbUser.accessLevel
          extendedUser.isActive = dbUser.isActive
          extendedUser.role = dbUser.accessLevel >= 100 ? "admin" : 
                             dbUser.accessLevel >= 50 ? "moderador" : "usuario"
        }
      }
      
      return session
    },

    // SignIn callback - tratamento unificado para todos os providers
    async signIn({ user, account, profile }) {
      console.log("[Auth] SignIn callback:", { 
        user: user?.email, 
        provider: account?.provider 
      })
      
      // Para OAuth providers, verificar/criar usuário no banco
      if (account?.provider !== "credentials") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          // Se usuário não existe, criar um novo
          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "",
                image: user.image,
                emailVerified: new Date(),
                accessLevel: 1, // Usuário padrão
                isActive: true
              }
            })
            console.log("[Auth] ✅ New OAuth user created:", user.email)
            
            // Atualizar o user object com o ID correto
            user.id = newUser.id
          } else {
            // Verificar se usuário está ativo
            if (!existingUser.isActive) {
              console.log("[Auth] ❌ OAuth user is inactive:", user.email)
              return false
            }
            
            // Atualizar dados do usuário existente
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                lastLogin: new Date(),
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
              }
            })
            console.log("[Auth] ✅ OAuth user updated:", user.email)
            
            // Atualizar o user object com o ID correto
            user.id = existingUser.id
          }
        } catch (error) {
          console.error("[Auth] Error handling OAuth signup:", error)
          return false
        }
      } else {
        // Para Credentials, verificar se usuário está ativo
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id! },
            select: { isActive: true }
          })
          
          if (!dbUser?.isActive) {
            console.log("[Auth] ❌ Credentials user is inactive:", user.email)
            return false
          }
        } catch (error) {
          console.error("[Auth] Error checking credentials user:", error)
          return false
        }
      }
      
      return true
    },

    // Redirect callback - redirecionamento seguro
    async redirect({ url, baseUrl }) {
      console.log("[Auth] Redirect callback:", { url, baseUrl })
      
      // Garante redirecionamento seguro após login
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/area-cliente`
    }
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`[Auth] ✅ User ${user.email} signed in via ${account?.provider}${isNewUser ? ' (new user)' : ''}`)
    },
    async signOut({ session, token }) {
      console.log(`[Auth] 👋 User ${session?.user?.email} signed out`)
    },
    async createUser({ user }) {
      console.log(`[Auth] 👤 New user created: ${user.email}`)
    },
    async updateUser({ user }) {
      console.log(`[Auth] 🔄 User updated: ${user.email}`)
    },
    async linkAccount({ user, account, profile }) {
      console.log(`[Auth] 🔗 Account ${account.provider} linked to user ${user.email}`)
    },
    async session({ session, token }) {
      // Log session access (pode ser útil para auditoria)
      if (process.env.AUTH_DEBUG === "1") {
        console.log(`[Auth] 📊 Session accessed for user: ${session?.user?.email}`)
      }
    }
  },
})

// Export types for TypeScript
export type CustomUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  accessLevel: number;
  role: string;
  isActive: boolean;
}
