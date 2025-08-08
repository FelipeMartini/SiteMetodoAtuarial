// use cliente
// Hook universal para autenticação e sessão usando apenas Auth.js puro (fetch nas rotas API)
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { SessaoAuth } from '@/types/next-auth';

async function fetchSessaoApi(): Promise<SessaoAuth | null> {
  const res = await fetch('/api/auth/session');
  if (!res.ok) return null;
  const data = await res.json();
  return data?.user || null;
}

export function useSessaoAuth() {
  const queryClient = useQueryClient();
  const {
    data: usuario,
    status: queryStatus,
    isFetching,
    refetch: refetchSessao,
  } = useQuery<SessaoAuth | null>({
    queryKey: ['sessao-auth'],
    queryFn: fetchSessaoApi,
    staleTime: 60 * 1000, // 1 min
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Login social ou tradicional
  const login = useCallback(async (provider: string, credenciais?: Record<string, unknown> & { redirect?: boolean }) => {
    if (provider !== 'credentials') {
      window.location.href = `/api/auth/signin/${provider}`;
      return new Promise(() => { });
    }
    const body = credenciais ? { ...credenciais, redirect: credenciais.redirect ?? false } : { redirect: false };
    const url = '/api/auth/signin/credentials';
    const options: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
    const res = await fetch(url, options);
    if (!res.ok) {
      let msg = 'Erro ao logar';
      try {
        const data = await res.json();
        if (data?.error) msg = data.error;
      } catch { }
      throw new Error(msg);
    }
    await queryClient.invalidateQueries({ queryKey: ['sessao-auth'] });
    return res;
  }, [queryClient]);

  // Logout
  const logout = useCallback(async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    await queryClient.invalidateQueries({ queryKey: ['sessao-auth'] });
  }, [queryClient]);

  // Status compatível com o hook antigo
  const status: 'loading' | 'authenticated' | 'unauthenticated' =
    queryStatus === 'pending' || isFetching
      ? 'loading'
      : usuario
      ? 'authenticated'
      : 'unauthenticated';

  return { usuario, status, login, logout, fetchSessao: refetchSessao };
}

// Comentário: Este hook substitui useSession, signIn, signOut do next-auth/react, usando apenas Auth.js puro via REST.
