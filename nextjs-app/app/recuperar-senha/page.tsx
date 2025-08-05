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
text - align: center;
`;

// Título principal
const Titulo = styled.h1`
font - size: ${ props => props.theme.typography.fontSize.xxl };
font - weight: ${ props => props.theme.typography.fontWeight.bold };
color: ${ props => props.theme.colors.text };
margin - bottom: ${ props => props.theme.spacing.md };
`;

// Ícone de email
const EmailIcon = styled.div`
width: 4rem;
height: 4rem;
background: ${ props => props.theme.colors.primary } 20;
border - radius: 50 %;
display: flex;
align - items: center;
justify - content: center;
margin: 0 auto ${ props => props.theme.spacing.lg } auto;

  svg {
  width: 2rem;
  height: 2rem;
  color: ${ props => props.theme.colors.primary };
}
`;

// Descrição
const Descricao = styled.p`
font - size: ${ props => props.theme.typography.fontSize.base };
color: ${ props => props.theme.colors.textSecondary };
line - height: 1.6;
margin - bottom: ${ props => props.theme.spacing.xl };
`;

// Formulário
const Formulario = styled.form`
display: flex;
flex - direction: column;
gap: ${ props => props.theme.spacing.lg };
margin - bottom: ${ props => props.theme.spacing.lg };
`;

// Grupo de campo
const CampoGrupo = styled.div`
display: flex;
flex - direction: column;
gap: ${ props => props.theme.spacing.sm };
text - align: left;
`;

// Label do campo
const CampoLabel = styled.label`
font - size: ${ props => props.theme.typography.fontSize.sm };
font - weight: ${ props => props.theme.typography.fontWeight.medium };
color: ${ props => props.theme.colors.text };
`;

// Input do campo
const CampoInput = styled.input`
padding: ${ props => props.theme.spacing.md };
font - size: ${ props => props.theme.typography.fontSize.base };
border: 2px solid ${ props => props.theme.colors.border };
border - radius: ${ props => props.theme.borderRadius.md };
background: ${ props => props.theme.colors.background };
color: ${ props => props.theme.colors.text };
transition: all ${ props => props.theme.transitions.fast };

  &:focus {
  outline: none;
  border - color: ${ props => props.theme.colors.primary };
  box - shadow: 0 0 0 3px ${ props => props.theme.colors.primary } 20;
}

  &::placeholder {
  color: ${ props => props.theme.colors.textSecondary };
}

  &:disabled {
  opacity: 0.6;
  cursor: not - allowed;
}
`;

// Mensagem de status
const Mensagem = styled.div<{ tipo: 'erro' | 'sucesso' | 'info' }>`
padding: ${ props => props.theme.spacing.md };
border - radius: ${ props => props.theme.borderRadius.md };
font - size: ${ props => props.theme.typography.fontSize.sm };
margin - bottom: ${ props => props.theme.spacing.md };
  
  ${
  props => {
    switch (props.tipo) {
      case 'erro':
        return `
          background-color: #ff000015;
          color: #cc0000;
          border: 1px solid #ff000030;
        `;
      case 'sucesso':
        return `
          background-color: #00aa0015;
          color: #008800;
          border: 1px solid #00aa0030;
        `;
      case 'info':
        return `
          background-color: ${props.theme.colors.primary}15;
          color: ${props.theme.colors.primary};
          border: 1px solid ${props.theme.colors.primary}30;
        `;
    }
  }
}
`;

// Container de ações
const AcoesContainer = styled.div`
display: flex;
flex - direction: column;
gap: ${ props => props.theme.spacing.md };
margin - top: ${ props => props.theme.spacing.lg };
`;

// Link de volta
const LinkVoltar = styled(Link)`
color: ${ props => props.theme.colors.textSecondary };
font - size: ${ props => props.theme.typography.fontSize.sm };
text - decoration: none;
transition: color ${ props => props.theme.transitions.fast };

  &:hover {
  color: ${ props => props.theme.colors.primary };
  text - decoration: underline;
}
`;

// Container para estado de sucesso
const SucessoContainer = styled.div`
text - align: center;
`;

const IconeSucesso = styled.div`
width: 4rem;
height: 4rem;
background: #00aa0020;
border - radius: 50 %;
display: flex;
align - items: center;
justify - content: center;
margin: 0 auto ${ props => props.theme.spacing.lg } auto;

  svg {
  width: 2rem;
  height: 2rem;
  color: #00aa00;
}
`;

// Ícone de email SVG
const EmailIconSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

// Ícone de sucesso SVG
const SucessoIconSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

export default function RecuperarSenhaPage() {
  // const router = useRouter(); // Removido para evitar warning
  // const { currentTheme } = useTema(); // Removido para evitar warning
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'erro' | 'sucesso' | 'info' } | null>(null);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMensagem({
        texto: 'Por favor, digite seu email',
        tipo: 'erro'
      });
      return;
    }

    setIsLoading(true);
    setMensagem(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailEnviado(true);
        setMensagem({
          texto: 'Instruções de recuperação enviadas! Verifique sua caixa de email e spam.',
          tipo: 'sucesso'
        });
      } else {
        setMensagem({
          texto: data.message || 'Erro ao enviar email de recuperação. Tente novamente.',
          tipo: 'erro'
        });
      }
    } catch (error) {
      // Exibe mensagem genérica ao usuário
      setMensagem({
        texto: 'Erro de conexão. Verifique sua internet e tente novamente.',
        tipo: 'erro'
      });
      // Log detalhado para desenvolvedores
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao enviar email de recuperação:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTentarNovamente = () => {
    setEmailEnviado(false);
    setEmail('');
    setMensagem(null);
  };

  return (
    <PaginaContainer>
      <RecoveryCard>
        {!emailEnviado ? (
          <>
            {/* Estado inicial - formulário */}
            <EmailIcon>
              <EmailIconSVG />
            </EmailIcon>

            <Titulo>Recuperar Senha</Titulo>

            <Descricao>
              Digite seu endereço de email e enviaremos instruções para redefinir sua senha.
            </Descricao>

            {mensagem && (
              <Mensagem tipo={mensagem.tipo}>
                {mensagem.texto}
              </Mensagem>
            )}

            <Formulario onSubmit={handleSubmit}>
              <CampoGrupo>
                <CampoLabel htmlFor="email">Endereço de email</CampoLabel>
                <CampoInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Digite seu email cadastrado"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </CampoGrupo>

              <Botao
                type="submit"
                variant="primary"
                loading={isLoading}
                disabled={isLoading || !email}
              >
                {isLoading ? 'Enviando...' : 'Enviar Instruções'}
              </Botao>
            </Formulario>
          </>
        ) : (
          <>
            {/* Estado de sucesso */}
            <SucessoContainer>
              <IconeSucesso>
                <SucessoIconSVG />
              </IconeSucesso>

              <Titulo>Email Enviado!</Titulo>

              <Descricao>
                Enviamos instruções de recuperação para <strong>{email}</strong>.
                <br />
                Verifique sua caixa de entrada e a pasta de spam.
              </Descricao>

              {mensagem && mensagem.tipo === 'sucesso' && (
                <Mensagem tipo="info">
                  O link de recuperação expira em 1 hora por segurança.
                </Mensagem>
              )}

              <AcoesContainer>
                <Botao
                  type="button"
                  variant="primary"
                  onClick={handleTentarNovamente}
                >
                  Enviar para outro email
                </Botao>
              </AcoesContainer>
            </SucessoContainer>
          </>
        )}

        {/* Links de navegação */}
        <AcoesContainer>
          <LinkVoltar href="/login">
            ← Voltar para o login
          </LinkVoltar>

          <LinkVoltar href="/criar-conta">
            Não tem uma conta? Criar conta
          </LinkVoltar>
        </AcoesContainer>
      </RecoveryCard>
    </PaginaContainer>
  );
}
