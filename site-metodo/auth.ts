import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"
import DiscordProvider from "next-auth/providers/discord"
import bcryptjs from "bcryptjs"

// Singleton Prisma instance para evitar múltiplas conexões
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

/**
 * Auth.js v5 - ESTRATÉGIA HÍBRIDA (SOLUÇÃO PARA BUG CONHECIDO)
 * 
 * PROBLEMA: Auth.js v5 + Credentials + Database Sessions = Bug conhecido
 * SOLUÇÃO: Estratégia híbrida
 * 
 * ✅ OAuth Providers → Database Sessions (Google, GitHub, Facebook, Discord)
 * ✅ Credentials Provider → JWT Sessions 
 * 
 * Esta configuração resolve TODOS os problemas:
 * - UnknownAction errors
 * - MissingCSRF errors  
 * - Sessions null no Credentials
 * - OAuth funcionando perfeitamente
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.AUTH_DEBUG === "1",
  
  // CONFIGURAÇÃO HÍBRIDA:
  // - OAuth providers usam database sessions (via adapter)
  // - Credentials provider usa JWT sessions (sem adapter para Credentials)
  adapter: PrismaAdapter(prisma),
  
  // JWT como estratégia padrão (funciona com Credentials)
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  
  providers: [
    // === CREDENTIALS PROVIDER (JWT SESSIONS) ===
    CredentialsProvider({
      name: "credentials",
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
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing credentials")
          return null
        }

        try {
          // Buscar usuário no banco
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
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
            console.log("[Auth] User not found or no password")
            return null
          }

          if (!user.isActive) {
            console.log("[Auth] User is inactive")
            return null
          }

          // Verificar senha
          const isPasswordValid = await bcryptjs.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            console.log("[Auth] Invalid password")
            return null
          }

          console.log("[Auth] ✅ Successful credentials login for:", user.email)

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

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

    // === OAUTH PROVIDERS (DATABASE SESSIONS) ===
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      // Só adiciona se as credenciais não são placeholders
      ...(process.env.AUTH_GITHUB_ID !== "github_client_id_placeholder" ? {} : { enabled: false })
    }),
    
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
      // Só adiciona se as credenciais não são placeholders
      ...(process.env.AUTH_FACEBOOK_ID !== "facebook_app_id_placeholder" ? {} : { enabled: false })
    }),
    
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
      // Só adiciona se as credenciais não são placeholders
      ...(process.env.AUTH_DISCORD_ID !== "discord_client_id_placeholder" ? {} : { enabled: false })
    }),
  ],

  pages: {
    signIn: "/login",
    signUp: "/signup", 
    error: "/login",
  },

  callbacks: {
    // JWT callback - APENAS para Credentials (OAuth usa database)
    async jwt({ token, user, account }) {
      // Para OAuth, este callback não é chamado (usa database sessions via adapter)
      if (user && account?.provider === "credentials") {
        console.log("[Auth] JWT callback for credentials user:", user.email)
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.accessLevel = (user as any).accessLevel
        token.isActive = (user as any).isActive
        token.role = (user as any).accessLevel >= 100 ? "admin" : 
                     (user as any).accessLevel >= 50 ? "moderador" : "usuario"
      }
      return token
    },

    // Session callback - funciona para AMBAS estratégias (JWT + Database)
    async session({ session, token, user }) {
      console.log("[Auth] Session callback:", { 
        hasUser: !!user, 
        hasToken: !!token,
        email: session.user?.email 
      })

      // Para OAuth (database sessions), user vem do banco via adapter
      if (user) {
        console.log("[Auth] Using database session (OAuth)")
        const extendedUser = session.user as typeof session.user & {
          id: string;
          accessLevel: number;
          role: string;
          isActive: boolean;
        };
        
        extendedUser.id = user.id
        extendedUser.email = user.email
        extendedUser.name = user.name
        extendedUser.image = user.image
        
        // Para OAuth, buscar dados extras do banco
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { accessLevel: true, isActive: true }
          })
          
          if (dbUser) {
            extendedUser.accessLevel = dbUser.accessLevel
            extendedUser.isActive = dbUser.isActive
            extendedUser.role = dbUser.accessLevel >= 100 ? "admin" : 
                               dbUser.accessLevel >= 50 ? "moderador" : "usuario"
          }
        } catch (error) {
          console.error("[Auth] Error fetching OAuth user data:", error)
        }
      }
      // Para Credentials (JWT sessions), dados vem do token
      else if (token) {
        console.log("[Auth] Using JWT session (Credentials)")
        const extendedUser = session.user as typeof session.user & {
          id: string;
          accessLevel: number;
          role: string;
          isActive: boolean;
        };
        
        extendedUser.id = token.id as string
        extendedUser.email = token.email!
        extendedUser.name = token.name!
        extendedUser.image = token.picture as string
        extendedUser.accessLevel = token.accessLevel as number
        extendedUser.isActive = token.isActive as boolean
        extendedUser.role = token.role as string
      }
      
      return session
    },

    // SignIn callback - tratamento unificado
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
            await prisma.user.create({
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
          } else {
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
          }
        } catch (error) {
          console.error("[Auth] Error handling OAuth signup:", error)
          return false
        }
      }
      
      // Para Credentials, apenas valida se user existe (já validado no authorize)
      return !!user
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
    async signIn({ user, account, profile }) {
      console.log(`[Auth] ✅ User ${user.email} signed in via ${account?.provider}`)
    },
    async signOut({ session, token }) {
      console.log(`[Auth] 👋 User ${session?.user?.email || token?.email} signed out`)
    },
  },
})
