'use client';



import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';



export const useAuth = (redirectTo?: string) => {
  // Ajuste: SessaoAuth removido, usar SessaoUsuario
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/sessao');
        if (res.ok) {
          const data = await res.json();
          setSession(data?.user || null);
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
      setIsLoading(false);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (!isLoading && !session && redirectTo) {
      router.push(redirectTo);
    }
  }, [session, isLoading, router, redirectTo]);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
  };
};

export const useRequireAuth = (redirectTo: string = '/login') => {
  return useAuth(redirectTo);
};
