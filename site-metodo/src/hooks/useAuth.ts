
"use client";

import { useEffect, useState } from "react";

// Tipagem local baseada no Auth.js v5+ (https://authjs.dev/reference/core/types#session)
export type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type Session = {
  user?: SessionUser;
  expires: string;
};

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface UseAuthResult {
  data: Session | null;
  status: AuthStatus;
}

/**
 * Hook de autenticação seguro, moderno e tipado para Auth.js puro.
 * Busca a sessão do usuário via endpoint seguro e retorna status explícito.
 * Nunca expõe dados sensíveis ao client.
 */
export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");
    fetch("/api/auth/session")
      .then(async (res) => {
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setSession(data as Session);
            setStatus("authenticated");
          } else {
            setSession(null);
            setStatus("unauthenticated");
          }
        } else {
          setSession(null);
          setStatus("unauthenticated");
        }
      })
      .catch(() => {
        if (isMounted) {
          setSession(null);
          setStatus("unauthenticated");
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { data: session, status };
}


