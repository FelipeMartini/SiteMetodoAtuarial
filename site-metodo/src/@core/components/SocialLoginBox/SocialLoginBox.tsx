'use client';
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useSessaoAuth } from '@/hooks/useSessaoAuth';
import { useTema } from '@core/theme/ContextoTema';
import Link from 'next/link';

// Container principal com cor contrastante, borda e sombra
const LoginContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  min-height: 600px;
  /* Cor contrastante: clara no tema escuro, escura no tema claro */
  background: ${({ theme }) => theme.name === 'dark'
    ? theme.colors.surface // cor clara no tema escuro
    : theme.colors.backgroundSecondary // cor escura no tema claro
  };
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};
  margin: 0 auto;
  /* Adiciona contorno sutil para destacar o box */
  outline: 2px solid ${({ theme }) => theme.colors.primary}20;
`;

// Overlay para melhor contraste do conteúdo
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.name === 'dark'
    ? 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)'};
  backdrop-filter: blur(3px);
`;

// Conteúdo principal do login
const LoginContent = styled.div`
  position: relative;
  z-index: 2;
  padding: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  gap: ${props => props.theme.spacing.lg};
`;

// Título principal
const LoginTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  text-shadow: ${props => props.theme.name === 'dark' ? '0 1px 2px rgba(0,0,0,0.5)' : '0 1px 2px rgba(255,255,255,0.8)'};
`;

// Subtítulo
const LoginSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.5;
`;

// Container para botões sociais
const SocialButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
`;

// Botão social base com hover e focus melhorados
const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};
  cursor: pointer;
  outline: none;
  min-height: 3.2rem;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}40;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

// Ícone do botão social
const SocialIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

// Spinner de loading animado
const LoadingSpinner = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid ${props => props.theme.colors.textSecondary}40;
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Seção de divisor melhorada
const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.lg} 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, ${props => props.theme.colors.border}, transparent);
  }

  span {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    padding: 0 ${props => props.theme.spacing.md};
    background: ${props => props.theme.colors.background};
    border-radius: ${props => props.theme.borderRadius.sm};
  }
`;

// Links de ações melhorados
const ActionLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const ActionLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-decoration: none;
  text-align: center;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.primaryHover};
    background-color: ${props => props.theme.colors.surface};
    text-decoration: underline;
  }
`;

// Ícones SVG oficiais dos provedores (otimizados e com cores corretas)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#1DA1F2">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00A1F1" />
  </svg>
);

// Tipos para as props do componente
interface SocialLoginBoxProps {
  className?: string;
  showTitle?: boolean;
  providers?: ('google' | 'apple' | 'github' | 'twitter' | 'microsoft')[];
}

// Configuração dos provedores com ícones e labels
const PROVIDER_CONFIG = {
  google: {
    icon: GoogleIcon,
    label: 'Entrar com Google',
    provider: 'google'
  },
  apple: {
    icon: AppleIcon,
    label: 'Entrar com Apple',
    provider: 'apple'
  },
  github: {
    icon: GitHubIcon,
    label: 'Entrar com GitHub',
    provider: 'github'
  },
  twitter: {
    icon: TwitterIcon,
    label: 'Entrar com Twitter',
    provider: 'twitter'
  },
  microsoft: {
    icon: MicrosoftIcon,
    label: 'Entrar com Microsoft',
    provider: 'microsoft-entra-id'
  },
};

const SocialLoginBox: React.FC<SocialLoginBoxProps> = ({
  className,
  showTitle = true,
  providers = ['google', 'apple', 'github', 'twitter', 'microsoft']
}) => {
  const { currentTheme } = useTema();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para lidar com login social usando o hook universal
  const { login } = useSessaoAuth();
  const handleSocialLogin = async (providerKey: string) => {
    try {
      setIsLoading(providerKey);
      setError(null);
      await login(PROVIDER_CONFIG[providerKey as keyof typeof PROVIDER_CONFIG].provider);
    } catch (error) {
      console.error(`Erro no login ${providerKey}:`, error);
      setError(`Erro inesperado ao conectar com ${PROVIDER_CONFIG[providerKey as keyof typeof PROVIDER_CONFIG].label}`);
    } finally {
      setIsLoading(null);
      // Remove erro após 5 segundos
      if (error) {
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  return (
    <LoginContainer className={className}>
      <Overlay />
      <LoginContent>
        {showTitle && (
          <div>
            <LoginTitle>Entre na sua conta</LoginTitle>
            <LoginSubtitle>
              Escolha uma das opções abaixo para acessar sua conta
            </LoginSubtitle>
          </div>
        )}

        {error && (
          <div style={{
            padding: currentTheme.spacing.md,
            backgroundColor: '#ff000020',
            color: '#ff0000',
            borderRadius: currentTheme.borderRadius.md,
            fontSize: currentTheme.typography.fontSize.sm,
            textAlign: 'center' as const
          }}>
            {error}
          </div>
        )}

        <SocialButtonsContainer>
          {providers.map((providerKey) => {
            const config = PROVIDER_CONFIG[providerKey];
            const IconComponent = config.icon;

            return (
              <SocialButton
                key={providerKey}
                onClick={() => handleSocialLogin(providerKey)}
                disabled={isLoading !== null}
                title={`Fazer login com ${config.label}`}
              >
                <SocialIcon>
                  {isLoading === providerKey ? <LoadingSpinner /> : <IconComponent />}
                </SocialIcon>
                {config.label}
              </SocialButton>
            );
          })}
        </SocialButtonsContainer>

        <Divider>
          <span>ou</span>
        </Divider>

        <ActionLinks>
          <ActionLink href="/recuperar-senha">
            Esqueceu sua senha?
          </ActionLink>
          <ActionLink href="/criar-conta">
            Criar nova conta
          </ActionLink>
        </ActionLinks>

        {/* Elemento para acessibilidade e testes */}
        <div
          role="img"
          aria-label="social login interface"
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        />
      </LoginContent>
    </LoginContainer>
  );
};

export default SocialLoginBox;
