/**
 * SocialLoginBox - Versão migrada para Tailwind CSS + shadcn/ui
 * Sistema de login social completo com design moderno e responsivo
 * Versão moderna do SocialLoginBox
 */
'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

// Função helper para redirecionar via Auth.js handler
function loginSocial(provider: string) {
  window.location.href = `/api/auth/signin?provider=${provider}`;
}

interface ProviderInfo {
  id: string;
  name?: string;
  type?: string;
}

// Tipagem das props do componente
interface SocialLoginBoxProps {
  className?: string;
  /** Exibe ou oculta o título principal */
  showTitle?: boolean;
}

// Componente principal migrado para Tailwind + shadcn/ui
const SocialLoginBox: React.FC<SocialLoginBoxProps> = ({ className, showTitle = true }) => {


  const [providers, setProviders] = useState<ProviderInfo[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch('/api/auth/providers')
      .then(r => r.json() as Promise<Record<string, ProviderInfo>>)
      .then((data) => {
        if (!active) return;
        // data é um objeto chave->definição; transformamos em array
        const arr: ProviderInfo[] = Object.keys(data || {}).map(k => {
          const prov = (data?.[k] || {}) as ProviderInfo;
          const clone: ProviderInfo = { ...prov, id: k };
          return clone;
        });
        setProviders(arr);
      })
      .catch(() => { if (active) setProviders([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const isAvailable = (id: string) => providers?.some(p => p.id === id);

  return (
    <div className={cn(
      "flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-4 p-6",
      "bg-card text-card-foreground rounded-lg border border-border shadow-sm",
      className
    )}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-foreground text-center mb-2">
          Entrar com suas redes sociais
        </h3>
      )}

      {/* Container dos botões de login social */}
      <div className="flex flex-col w-full space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Carregando provedores...</p>}

        {/* Botão Google */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground"
          onClick={() => loginSocial('google')}
          aria-label="Entrar com Google"
          disabled={!isAvailable('google')}
          title={!isAvailable('google') ? 'Google não configurado' : undefined}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </Button>

        {/* Botão Apple */}
        {/* Apple (somente se provider adicionado no futuro) */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground"
          onClick={() => loginSocial('apple')}
          aria-label="Entrar com Apple"
          disabled={!isAvailable('apple')}
          title={!isAvailable('apple') ? 'Apple não configurado' : undefined}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Apple
        </Button>

        {/* Botão GitHub */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground"
          onClick={() => loginSocial('github')}
          aria-label="Entrar com GitHub"
          disabled={!isAvailable('github')}
          title={!isAvailable('github') ? 'GitHub não configurado' : undefined}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </Button>

        {/* Botão Twitter */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground"
          onClick={() => loginSocial('twitter')}
          aria-label="Entrar com Twitter"
          disabled={!isAvailable('twitter')}
          title={!isAvailable('twitter') ? 'Twitter não configurado' : undefined}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
          Twitter
        </Button>

        {/* Botão Microsoft */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-start space-x-3 hover:bg-accent hover:text-accent-foreground"
          onClick={() => loginSocial('microsoft-entra-id')}
          aria-label="Entrar com Microsoft"
          disabled={!isAvailable('microsoft-entra-id')}
          title={!isAvailable('microsoft-entra-id') ? 'Microsoft não configurado' : undefined}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
          </svg>
          Microsoft
        </Button>
      </div>

      {/* Texto informativo */}
      <p className="text-sm text-muted-foreground text-center mt-4">
        Escolha uma das opções acima para fazer login
      </p>
    </div>
  );
};

export default SocialLoginBox;
