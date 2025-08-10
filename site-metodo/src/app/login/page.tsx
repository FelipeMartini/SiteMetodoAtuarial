"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import TotpPrompt from "./TotpPrompt";
import { isMfaObrigatorio } from "@/configs/mfaConfig";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { signInCredentials, signInOAuth, type SignInCredentialsResult } from '@/actions/signin';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

/**
 * Página de Login com design moderno usando shadcn/ui customizado
 * Sistema de temas integrado e componentes profissionais
 * Atualizada para usar server actions do Auth.js v5
 */
const LoginPage: React.FC = () => {
  // Estados para feedback
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Hook de autenticação unificado (Auth.js puro)
  const { status } = useAuth();

  // Hook de navegação do Next.js
  const router = useRouter();

  // useFormState para credentials
  const [credentialsState, credentialsAction] = useFormState<SignInCredentialsResult, FormData>(
    signInCredentials,
    undefined
  );

  // Efeito para redirecionar após autenticação
  useEffect(() => {
    // Se o usuário estiver autenticado, redireciona para área do cliente
    if (status === 'authenticated') {
      router.push('/area-cliente');
    }
  }, [status, router]);

  // Handler para OAuth social login
  const handleOAuthLogin = (providerId: string) => {
    startTransition(async () => {
      try {
        const result = await signInOAuth({ providerId });
        if (result && result.status === "error") {
          console.error("Erro OAuth:", result.errorMessage);
        }
      } catch (error) {
        console.error("Erro OAuth:", error);
      }
    });
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
            {credentialsState?.status === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {credentialsState.errorMessage}
                  {credentialsState.errorMessage.includes('definir uma senha') && (
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

            {/* Formulário de login com server action */}
            <form action={credentialsAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    className="pl-10"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
              >
                Entrar
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

            {/* Login social com server actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthLogin('google')}
                disabled={isPending}
                className="w-full"
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOAuthLogin('github')}
                disabled={isPending}
                className="w-full"
              >
                GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
