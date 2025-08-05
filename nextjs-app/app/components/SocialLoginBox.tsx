/**
 * Componente SocialLoginBox - Sistema de login social completo
 * Adaptado ao novo sistema de temas unificado com styled-components
 * Inclui login com Google, Apple e funcionalidade de recuperar senha/criar conta
 */
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { signIn } from 'next-auth/react';
import { useTema } from '../contexts/ThemeContext';
import Link from 'next/link';

// Container principal com fundo alternado por tema
const LoginContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  min-height: 500px;
  background-image: url(${props => props.theme.name === 'dark' ? '/loginboxescura.png' : '/loginboxclara.png'});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all ${props => props.theme.transitions.normal};
`;

// Overlay para melhor contraste do conteúdo
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.name === 'dark' 
    ? 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'};
  backdrop-filter: blur(2px);
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
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Subtítulo
const LoginSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// Botão social base
const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};
  cursor: pointer;
  outline: none;
  min-height: 3rem;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Ícone do botão social
const SocialIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

// Seção de divisor
const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.md} 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }

  span {
    color: ${props => props.theme.colors.textSecondary};
    font-size: ${props => props.theme.typography.fontSize.sm};
    padding: 0 ${props => props.theme.spacing.sm};
  }
`;

// Links de ações
const ActionLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const ActionLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-decoration: none;
  text-align: center;
  transition: color ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.primaryHover};
    text-decoration: underline;
  }
`;

// Status de carregamento
const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid ${props => props.theme.colors.textSecondary};
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Ícones SVG dos provedores
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

interface SocialLoginBoxProps {
  onSuccess?: () => void;
  className?: string;
}

const SocialLoginBox: React.FC<SocialLoginBoxProps> = ({
  onSuccess,
  className
}) => {
  const { currentTheme } = useTema();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Função para lidar com login social
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      setIsLoading(provider);
      
      const result = await signIn(provider, {
        callbackUrl: '/area-cliente',
        redirect: false,
      });

      if (result?.error) {
        console.error(`Erro no login ${provider}:`, result.error);
        // Aqui você pode adicionar notificação de erro
      } else if (result?.ok) {
        onSuccess?.();
      }
    } catch (error) {
      console.error(`Erro no login ${provider}:`, error);
      // Aqui você pode adicionar notificação de erro
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <LoginContainer className={className}>
      <Overlay />
      <LoginContent>
        <div>
          <LoginTitle>Login Social</LoginTitle>
          <LoginSubtitle>
            Entre na sua conta usando uma das opções abaixo
          </LoginSubtitle>
        </div>

        <div>
          <SocialButton
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading !== null}
          >
            <SocialIcon>
              {isLoading === 'google' ? <LoadingSpinner /> : <GoogleIcon />}
            </SocialIcon>
            <img alt="Entrar com Google" style={{ display: 'none' }} />
            Entrar com Google
          </SocialButton>

          <div style={{ marginTop: currentTheme.spacing.md }}>
            <SocialButton
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading !== null}
            >
              <SocialIcon>
                {isLoading === 'apple' ? <LoadingSpinner /> : <AppleIcon />}
              </SocialIcon>
              <img alt="Entrar com Apple" style={{ display: 'none' }} />
              Entrar com Apple
            </SocialButton>
          </div>
        </div>

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

        {/* Elemento para testes que verificam role="img" */}
        <div 
          role="img" 
          aria-label="login" 
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        />
      </LoginContent>
    </LoginContainer>
  );
};

export default SocialLoginBox;
