import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import bcrypt from "bcryptjs"

// Singleton Prisma instance para evitar múltiplas conexões
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

/**
 * Configuração Auth.js v5 moderna com Next.js 15
 * - Database sessions (não JWT) para invalidação server-side
 * - Suporte completo a OAuth (Google, GitHub) e Credentials
 * - Integração com Prisma para persistência
 * - Logs detalhados para debugging
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  
  // Usar database sessions (mais seguro que JWT)
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  
  // Configuração de providers
  providers: [
    // Credentials provider para login tradicional
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing credentials")
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              accessLevel: true,
              isActive: true
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

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValidPassword) {
            console.log("[Auth] Invalid password")
            return null
          }

          console.log("[Auth] Successful login for:", user.email)

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            accessLevel: user.accessLevel
          }
        } catch (error) {
          console.error("[Auth] Authorization error:", error)
          return null
        }
      }
    }),

    // Google OAuth provider
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        })]
      : []
    ),

    // GitHub OAuth provider  
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [GitHub({
          clientId: process.env.AUTH_GITHUB_ID,
          clientSecret: process.env.AUTH_GITHUB_SECRET,
        })]
      : []
    ),
  ],

  // Páginas customizadas
  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },

  // Callbacks para customização
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("[Auth] SignIn callback:", { 
        user: user?.email, 
        provider: account?.provider 
      })
      
      // Para OAuth providers, verificar se é primeiro login
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
                emailVerified: new Date(),
                accessLevel: 1,
                isActive: true
              }
            })
            console.log("[Auth] New OAuth user created:", user.email)
          }
        } catch (error) {
          console.error("[Auth] Error handling OAuth signup:", error)
          return false
        }
      }

      return true
    },

    async session({ session, user }) {
      if (!session?.user?.email) return session

      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            accessLevel: true,
            isActive: true,
            name: true,
            email: true
          }
        })

        if (dbUser) {
          // Extender o tipo da session.user para incluir campos customizados
          const extendedUser = session.user as typeof session.user & {
            id: string;
            accessLevel: number;
            role: string;
            isActive: boolean;
          };
          
          extendedUser.id = dbUser.id;
          extendedUser.accessLevel = dbUser.accessLevel;
          extendedUser.role = dbUser.accessLevel >= 100 ? "admin" : 
                             dbUser.accessLevel >= 50 ? "moderador" : "usuario";
          extendedUser.isActive = dbUser.isActive;
        }

        console.log("[Auth] Session callback for:", session.user.email)
        return session
      } catch (error) {
        console.error("[Auth] Session callback error:", error)
        return session
      }
    },

    async redirect({ url, baseUrl }) {
      // Garante redirecionamento seguro após login
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/area-cliente`
    }
  },

  // Configurações de debug e segurança
  debug: process.env.NODE_ENV === "development",
  
  events: {
    async signIn({ user, account }) {
      console.log(`[Auth] User ${user.email} signed in via ${account?.provider}`)
    },
    async signOut({ session }) {
      console.log(`[Auth] User signed out`)
    }
  }
})
