


// Tipagem customizada para sessão do Auth.js puro
export interface SessaoAuth {
  id?: string;
  picture?: string;
  email?: string;
  accessLevel?: number;
  isActive?: boolean;
  name?: string | null;
  image?: string | null;
}

// Comentário: Este arquivo estende a tipagem da sessão do Auth.js para permitir campos extras como id, picture e email.
// Isso resolve o erro de tipagem ao atribuir session.id, session.picture, etc. no callback de sessão.
