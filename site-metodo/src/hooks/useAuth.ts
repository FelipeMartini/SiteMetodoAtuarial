
"use client";

import { useEffect, useState } from "react";



import type { Session } from "@/types/auth";

// ...

/**
 * Hook de autenticação seguro, moderno e tipado para Auth.js puro.
 * Busca a sessão do usuário via endpoint seguro e retorna status explícito.
 * Nunca expõe dados sensíveis ao client.
 */
export function useAuth() {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");
    fetch("/api/auth/session")
      .then(async (res) => {
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setData(data);
            setStatus("authenticated");
          } else {
            setData(null);
            setStatus("unauthenticated");
          }
        } else {
          setData(null);
          setStatus("unauthenticated");
        }
      })
      .catch(() => {
        if (isMounted) {
          setData(null);
          setStatus("unauthenticated");
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, status };
}


