"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSessaoAuth } from '@/hooks/useSessaoAuth';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Container, Flex, Texto } from '../../styles/ComponentesBase';
import InputTexto from '../design-system/InputTexto';

const SocialLoginBox = React.lazy(() => import("../components/SocialLoginBox"));


// Tela de login com formulário tradicional e login social
const LoginPage: React.FC = () => {
  // Estados para campos e feedback
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Hook de autenticação unificado (Auth.js puro)
  const { status, login } = useSessaoAuth();
  // Hook de navegação do Next.js
  const router = useRouter();

  // Efeito para redirecionar após autenticação
  useEffect(() => {
    // Se o usuário estiver autenticado, redireciona para área do cliente
    if (status === 'authenticated') {
      router.push('/area-cliente');
    }
  }, [status, router]);
  // Comentário: Este efeito garante que, após autenticação, o usuário seja redirecionado automaticamente para a área do cliente. Isso cobre o fluxo esperado pelo teste automatizado e pelo usuário.

  // Handler do submit do formulário tradicional usando Auth.js puro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await login('credentials', { email, password: senha });
    } catch (err: any) {
      setErro(err?.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Container>
        <Flex
          $direction="column"
          $align="center"
          $justify="center"
          style={{ minHeight: '100vh', padding: '32px 0' }}
        >
          <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
            <Texto
              $variante="h3"
              $peso="negrito"
              $align="centro"
              style={{ marginBottom: 32, color: '#4F46E5' }}
            >
              Login
            </Texto>

            {/* Formulário tradicional de login */}
            <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <InputTexto
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                obrigatorio
                autoComplete="username"
                disabled={loading}
              />
              <InputTexto
                label="Senha"
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                obrigatorio
                autoComplete="current-password"
                disabled={loading}
              />
              {erro && (
                <div style={{ color: '#ef4444', fontSize: 14, marginBottom: 8 }}>
                  {erro}
                  {erro.includes('definir uma senha') && (
                    <a href="/definir-senha" style={{ color: '#4F46E5', textDecoration: 'underline', marginLeft: 8 }}>Definir senha</a>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontWeight: 600, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Login social permanece */}
            <Suspense fallback={<div>Carregando login social...</div>}>
              <SocialLoginBox />
            </Suspense>
          </div>
        </Flex>
      </Container>
    </ErrorBoundary>
  );
};

export default LoginPage;
