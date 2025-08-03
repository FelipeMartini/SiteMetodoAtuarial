// Tipagem customizada para sessão do Auth.js (NextAuth)
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    id?: string;
    picture?: string;
    email?: string;
    // Adicione outros campos personalizados conforme necessário
  }
}

// Comentário: Este arquivo estende a tipagem da sessão do Auth.js para permitir campos extras como id, picture e email.
// Isso resolve o erro de tipagem ao atribuir session.id, session.picture, etc. no callback de sessão.
