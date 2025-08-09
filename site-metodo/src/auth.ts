// Arquivo central de configuração do Auth.js v5 (NextAuth)
// Segue as melhores práticas para Next.js 15, React 19, RBAC, MFA, TOTP, WebAuthn, Upstash Rate Limit
// https://authjs.dev/getting-started/installation

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Email from "next-auth/providers/email"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import WebAuthn from "next-auth/providers/webauthn"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { auth, handlers, signIn, signOut } = NextAuth({
  // Providers configurados conforme .env
  providers: [
    Credentials({
      name: "Login",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Validar usuário no banco (Prisma)
        // Exemplo: const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        // if (!user || !validaSenha(credentials.password, user.passwordHash)) return null
        // return { id: user.id, name: user.name, email: user.email, role: user.role }
        return null // Implementação real obrigatória
      },
    }),
    Email({}),
    Google,
    GitHub,
    WebAuthn({}),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      // Adiciona role e id ao session.user
      if (token?.role) session.user.role = token.role
      if (token?.id) session.user.id = token.id
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async signIn({ user }) {
      // Exemplo: bloquear usuários inativos
      // if (!user.ativo) return false
      return true
    },
  },
  events: {
    async signIn({ user }) {
      // TODO: log de auditoria
    },
    async signOut({ session }) {
      // TODO: log de auditoria
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  // MFA/TOTP pode ser configurado via callbacks ou provider
  // MFA obrigatório pode ser implementado via lógica customizada
})
