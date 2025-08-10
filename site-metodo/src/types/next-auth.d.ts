
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

// Tipagem customizada para sessão do Auth.js v5
// Extende os tipos padrão para incluir campos customizados

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      accessLevel: number
      role: string
      isActive: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    accessLevel: number
    isActive: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessLevel: number
    role: string
    isActive: boolean
  }
}
