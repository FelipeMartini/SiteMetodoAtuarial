// Formulário de login avançado com credenciais
// Baseado nos padrões do ArchitectUI React Theme

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Tipos para o formulário
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Styled Components baseados no ArchitectUI
const LoginFormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const FormCard = styled(motion.div)`
  background: ${props => props.theme.cores.fundoCard || 'white'};
  border: 1px solid ${props => props.theme.cores.borda || '#e5e7eb'};
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.cores.textoSecundario || '#1f2937'};
  text-align: center;
  margin-bottom: 8px;
`;

const FormSubtitle = styled.p`
  color: ${props => props.theme.cores.textoTerciario || '#6b7280'};
  text-align: center;
  margin-bottom: 32px;
  font-size: 14px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${props => props.theme.cores.textoSecundario || '#374151'};
  font-size: 14px;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props =>
    props.$hasError
      ? props.theme.cores.erro || '#ef4444'
      : props.theme.cores.borda || '#e5e7eb'
  };
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: ${props => props.theme.cores.fundoInput || 'white'};
  color: ${props => props.theme.cores.texto || '#000'};
  
  &:focus {
    outline: none;
    border-color: ${props =>
    props.$hasError
      ? props.theme.cores.erro || '#ef4444'
      : props.theme.cores.primaria || '#4f46e5'
  };
    box-shadow: 0 0 0 3px ${props =>
    props.$hasError
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(79, 70, 229, 0.1)'
  };
  }
  
  &::placeholder {
    color: ${props => props.theme.cores.textoTerciario || '#9ca3af'};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.cores.textoTerciario || '#6b7280'};
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: ${props => props.theme.cores.textoSecundario || '#374151'};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    
    input[type="checkbox"] {
      margin-right: 8px;
      width: 16px;
      height: 16px;
      accent-color: ${props => props.theme.cores.primaria || '#4f46e5'};
    }
    
    label {
      font-size: 14px;
      color: ${props => props.theme.cores.textoTerciario || '#6b7280'};
      margin: 0;
      cursor: pointer;
    }
  }
`;

const ForgotPasswordLink = styled.a`
  color: ${props => props.theme.cores.primaria || '#4f46e5'};
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(motion.button) <{ $loading?: boolean }>`
  width: 100%;
  padding: 14px;
  background: ${props => props.theme.cores.primaria || '#4f46e5'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$loading ? 0.7 : 1};
  transition: all 0.2s ease;
  margin-bottom: 24px;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.cores.primariaHover || '#4338ca'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled(motion.div)`
  background: ${props => props.theme.cores.fundoErro || '#fef2f2'};
  border: 1px solid ${props => props.theme.cores.bordaErro || '#fecaca'};
  color: ${props => props.theme.cores.textoErro || '#dc2626'};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '⚠️';
    margin-right: 8px;
  }
`;

const FieldError = styled.div`
  color: ${props => props.theme.cores.erro || '#ef4444'};
  font-size: 12px;
  margin-top: 4px;
`;

const Divider = styled.div`
  margin: 24px 0;
  position: relative;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.theme.cores.borda || '#e5e7eb'};
  }
  
  span {
    background: ${props => props.theme.cores.fundo || 'white'};
    padding: 0 16px;
    color: ${props => props.theme.cores.textoTerciario || '#6b7280'};
    font-size: 14px;
  }
`;

interface LoginFormAvancadoProps {
  onSocialLogin?: (provider: string) => void;
  showSocialButtons?: boolean;
}

export default function LoginFormAvancado({
  onSocialLogin,
  showSocialButtons = true
}: LoginFormAvancadoProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Diferentes tipos de erro baseados na resposta
        switch (result.error) {
          case 'CredentialsSignin':
            setError('Email ou senha incorretos. Verifique suas credenciais.');
            break;
          case 'EmailNotVerified':
            setError('Por favor, verifique seu email antes de fazer login.');
            break;
          case 'AccountDisabled':
            setError('Sua conta foi desabilitada. Entre em contato conosco.');
            break;
          default:
            setError('Erro ao fazer login. Tente novamente.');
        }
      } else if (result?.ok) {
        // Redirecionar para a URL de callback ou área do cliente
        const callbackUrl = searchParams.get('callbackUrl') || '/area-cliente';
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro inesperado. Tente novamente em alguns momentos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginFormContainer>
      <FormCard
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FormTitle>Entrar na conta</FormTitle>
        <FormSubtitle>Digite suas credenciais para acessar</FormSubtitle>

        {error && (
          <ErrorMessage
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              $hasError={!!errors.email}
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Formato de email inválido',
                },
              })}
            />
            {errors.email && (
              <FieldError>{errors.email.message}</FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <InputContainer>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                $hasError={!!errors.password}
                {...register('password', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'Senha deve ter pelo menos 6 caracteres',
                  },
                })}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <EyeSlashIcon width={20} height={20} />
                ) : (
                  <EyeIcon width={20} height={20} />
                )}
              </PasswordToggle>
            </InputContainer>
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </FormGroup>

          <CheckboxGroup>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="rememberMe"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe">Lembrar de mim</label>
            </div>
            <ForgotPasswordLink href="/recuperar-senha">
              Esqueceu a senha?
            </ForgotPasswordLink>
          </CheckboxGroup>

          <SubmitButton
            type="submit"
            $loading={loading}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </SubmitButton>
        </form>

        {showSocialButtons && onSocialLogin && (
          <>
            <Divider>
              <span>ou continue com</span>
            </Divider>
            {/* Botões sociais serão renderizados pelo componente pai */}
          </>
        )}
      </FormCard>
    </LoginFormContainer>
  );
}
