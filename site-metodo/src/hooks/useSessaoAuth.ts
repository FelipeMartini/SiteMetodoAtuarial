// use cliente
// Hook universal para autenticação e sessão usando apenas Auth.js puro (fetch nas rotas API)
import { useCallback, useEffect, useState } from 'react';
import type { SessaoAuth } from '@/types/next-auth';

async function fetchSessaoApi(): Promise<SessaoAuth | null> {
  const res = await fetch('/api/auth/session');
  if (!res.ok) return null;
  const data = await res.json();
  return data?.user || null;
}

export function useSessaoAuth() {
  const [usuario, setUsuario] = useState<SessaoAuth | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isFetching, setIsFetching] = useState(false);

  const fetchSessao = useCallback(async () => {
    setIsFetching(true);
    setStatus('loading');
    try {
      const user = await fetchSessaoApi();
      setUsuario(user);
      setStatus('success');
    } catch {
      setUsuario(null);
      setStatus('error');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchSessao();
  }, [fetchSessao]);

  // Função para refetch manual
  const refetchSessao = fetchSessao;

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
    return res;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
  setUsuario(null);
  setStatus('idle');
  }, []);

  // Status compatível com o hook antigo
  const statusCompat: 'loading' | 'authenticated' | 'unauthenticated' =
    status === 'loading' || isFetching
      ? 'loading'
      : usuario
        ? 'authenticated'
        : 'unauthenticated';

  return { usuario, status: statusCompat, login, logout, fetchSessao: refetchSessao };
}