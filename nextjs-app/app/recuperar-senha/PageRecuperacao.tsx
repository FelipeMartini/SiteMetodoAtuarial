/**
 * Página de Recuperação de Senha - Sistema Avançado
 * Interface moderna com validação e feedback completo
 */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Tipos para o formulário
interface RecoveryFormData {
  email: string;
}

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const RecoveryCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  position: relative;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  margin-bottom: 24px;
  font-size: 14px;
  
  &:hover {
    color: #4f46e5;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 32px;
  font-size: 14px;
  line-height: 1.5;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: white;
  color: #000;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#4f46e5'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 70, 229, 0.1)'};
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SubmitButton = styled(motion.button) <{ $loading?: boolean }>`
  width: 100%;
  padding: 14px;
  background: #4f46e5;
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
    background: #4338ca;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled(motion.div)`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
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
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

const LoginLink = styled.a`
  display: block;
  text-align: center;
  color: #4f46e5;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessContainer = styled.div`
  text-align: center;
  
  .icon {
    font-size: 48px;
    margin-bottom: 24px;
  }
`;

export default function RecuperarSenhaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryFormData>();

  const onSubmit = async (data: RecoveryFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Erro ao enviar email de recuperação');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.push('/login');
  };

  if (success) {
    return (
      <ErrorBoundary>
        <PageContainer>
          <RecoveryCard
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SuccessContainer>
              <div className="icon">📧</div>
              <Title>Email enviado!</Title>
              <Subtitle>
                Enviamos instruções para recuperação de senha para seu email.
                Verifique sua caixa de entrada e siga as instruções.
              </Subtitle>
              <LoginLink href="/login">
                Voltar para o login
              </LoginLink>
            </SuccessContainer>
          </RecoveryCard>
        </PageContainer>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <PageContainer>
        <RecoveryCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BackButton onClick={goBack}>
            <ArrowLeftIcon width={16} height={16} />
            Voltar para login
          </BackButton>

          <Title>Recuperar senha</Title>
          <Subtitle>
            Digite seu email e enviaremos instruções para criar uma nova senha.
          </Subtitle>

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

            <SubmitButton
              type="submit"
              $loading={loading}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Enviando...' : 'Enviar instruções'}
            </SubmitButton>
          </form>

          <LoginLink href="/login">
            Lembrou da senha? Faça login
          </LoginLink>
        </RecoveryCard>
      </PageContainer>
    </ErrorBoundary>
  );
}
