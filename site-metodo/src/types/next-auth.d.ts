
import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

// Tipagem customizada para sessão do Auth.js v5
// Extende os tipos padrão para incluir campos customizados

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      accessLevel: number // @deprecated Use role em vez disso
      role: string[] | string | null // Novo sistema de roles moderno
      isActive: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    accessLevel: number // @deprecated Use role em vez disso
    role?: string[] | string | null // Novo sistema de roles moderno
    isActive: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessLevel: number // @deprecated Use role em vez disso
    role: string[] | string | null // Novo sistema de roles moderno
    isActive: boolean
  }
}
