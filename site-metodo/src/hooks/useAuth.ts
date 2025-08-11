
"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/types/auth";

/**
 * Hook de autenticação moderno para Auth.js v5
 * Busca a sessão via endpoint oficial e gerencia estado de loading
 */
export function useAuth() {
  const [data, setData] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    let isMounted = true;
    
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        
        if (!isMounted) return;
        
        if (response.ok) {
          const sessionData = await response.json();
          
          if (sessionData && sessionData.user) {
            setData(sessionData);
            setStatus("authenticated");
          } else {
            setData(null);
            setStatus("unauthenticated");
          }
        } else {
          setData(null);
          setStatus("unauthenticated");
        }
      } catch (_error) {
        console.error("[useAuth] Error fetching session:", error);
        if (isMounted) {
          setData(null);
          setStatus("unauthenticated");
        }
      }
    };

    fetchSession();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, status };
}


