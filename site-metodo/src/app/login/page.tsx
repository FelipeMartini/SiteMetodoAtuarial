"use client";

import React, { useState, useEffect } from "react";
import TotpPrompt from "./TotpPrompt";
import { isMfaObrigatorio } from "@/configs/mfaConfig";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
// import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail, Lock } from 'lucide-react';
import SocialLoginBox from '@/components/SocialLoginBox';
import Link from 'next/link';

/**
 * Página de Login com design moderno usando shadcn/ui customizado
 * Sistema de temas integrado e componentes profissionais
 */
const LoginPage: React.FC = () => {
  // Estados para campos e feedback
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);

  // Hook de autenticação unificado (Auth.js puro)
  const { status } = useAuth();

  // Hook de navegação do Next.js
  const router = useRouter();

  // Efeito para redirecionar após autenticação
  useEffect(() => {
    // Se o usuário estiver autenticado, redireciona para área do cliente
    if (status === 'authenticated') {
      router.push('/area-cliente');
    }
  }, [status, router]);

  // Handler do submit do formulário tradicional usando Auth.js v5
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    
    try {
      // Usar signIn action do Auth.js v5
      const result = await fetch('/api/auth/signin/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          password: senha,
          redirect: 'false',
        }),
      });

      if (result.ok) {
        // Verificar se precisa de MFA
        if (isMfaObrigatorio('login')) {
          const mfaRes = await fetch('/api/auth/totp-status');
          const mfaData = await mfaRes.json();
          if (mfaData.enabled) {
            setMfaRequired(true);
            setMfaStep(true);
            setLoading(false);
            return;
          }
        }
        
        // Login bem-sucedido - redirecionar
        router.push('/area-cliente');
      } else {
        setErro('Credenciais inválidas. Verifique email e senha.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Erro ao tentar autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (mfaStep && mfaRequired) {
    return <TotpPrompt onVerify={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Card principal */}
  <Card className="backdrop-blur-md bg-card/95">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar a área do cliente
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {erro && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {erro}
                  {erro.includes('definir uma senha') && (
                    <Link
                      href="/definir-senha"
                      className="font-medium underline ml-2 hover:no-underline"
                    >
                      Definir senha
                    </Link>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Formulário de login */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                    required
                    className="pl-10"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="default"
                size="lg"
                className="w-full"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Links de ajuda */}
            <div className="flex justify-between text-sm">
              <Link
                href="/recuperar-senha"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Esqueceu a senha?
              </Link>
              <Link
                href="/criar-conta"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Criar conta
              </Link>
            </div>

            {/* Divisor */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground font-medium">
                  Ou continue com
                </span>
              </div>
            </div>

            {/* Login social */}
            <SocialLoginBox />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
