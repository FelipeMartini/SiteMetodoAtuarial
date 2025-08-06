// use cliente
// Hook universal para autenticação e sessão usando apenas Auth.js puro (fetch nas rotas API)
import { useState, useEffect, useCallback } from 'react';
import type { SessaoAuth } from '../types/next-auth';

export function useSessaoAuth() {
  const [usuario, setUsuario] = useState<SessaoAuth | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  // Busca sessão atual via API Auth.js
  const fetchSessao = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) throw new Error('Falha ao buscar sessão');
      const data = await res.json();
      if (data?.user) {
        setUsuario(data.user);
        setStatus('authenticated');
      } else {
        setUsuario(null);
        setStatus('unauthenticated');
      }
    } catch (e) {
      setUsuario(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    fetchSessao();
  }, [fetchSessao]);

  // Login social ou tradicional
  const login = useCallback(async (provider: string, credenciais?: any) => {
    if (provider !== 'credentials') {
      // Para login social, redireciona para o fluxo OAuth2
      window.location.href = `/api/auth/signin/${provider}`;
      // Retorna uma Promise pendente para evitar erro se alguém usar await login('google')
      return new Promise(() => { });
    }
    let url = '/api/auth/signin/credentials';
    let options: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
    if (credenciais) options.body = JSON.stringify(credenciais);
    const res = await fetch(url, options);
    if (!res.ok) {
      let msg = 'Erro ao logar';
      try {
        const data = await res.json();
        if (data?.error) msg = data.error;
      } catch { }
      throw new Error(msg);
    }
    await fetchSessao();
    return res;
  }, [fetchSessao]);

  // Logout
  const logout = useCallback(async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    setUsuario(null);
    setStatus('unauthenticated');
  }, []);

  return { usuario, status, login, logout, fetchSessao };
}

// Comentário: Este hook substitui useSession, signIn, signOut do next-auth/react, usando apenas Auth.js puro via REST.
