// Tipagem oficial e extensão segura do Auth.js para campo customizado accessLevel
import type { Session as AuthSession } from "@auth/core/types";

declare module "@auth/core/types" {
  interface Session {
    user?: User;
  }
  interface User {
    accessLevel?: number;
  }
}

// Exporta o tipo Session já estendido para uso global
export type Session = AuthSession;
