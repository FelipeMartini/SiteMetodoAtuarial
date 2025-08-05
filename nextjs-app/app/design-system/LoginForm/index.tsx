'use client';

import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  LoginContainer,
  LoginCard,
  LoginTitle,
  LoginForm as StyledLoginForm,
  FormSection,
  SocialSection,
  Divider,
  DividerText,
  ForgotPasswordLink,
  SignUpPrompt,
  SignUpLink,
  ErrorAlert,
  SuccessAlert,
  ThemeToggleWrapper,
} from './LoginForm.styled';
import { InputField } from '../InputField';
import { Button } from '../Button';
import { SocialLoginButton } from '../SocialLoginButton';
import ThemeToggle from '../../components/ThemeToggle';

interface LoginFormData {
  email: string;
  password: string;
  name?: string; // Para o modo de registro
}

interface LoginFormProps {
  mode?: 'login' | 'register';
  onModeChange?: (mode: 'login' | 'register') => void;
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  mode = 'login',
  onModeChange,
  redirectTo = '/area-cliente',
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LoginFormData>();

  const password = watch('password');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Email ou senha inválidos. Tente novamente.');
        } else if (result?.ok) {
          setSuccess('Login realizado com sucesso! Redirecionando...');
          // Atualiza a sessão e redireciona
          await getSession();
          setTimeout(() => {
            router.push(redirectTo);
          }, 1000);
        }
      } else {
        // Modo de registro
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        });

        if (response.ok) {
          setSuccess('Conta criada com sucesso! Agora você pode fazer login.');
          reset();
          setTimeout(() => {
            onModeChange?.('login');
          }, 2000);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Ocorreu um erro durante o cadastro.');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      console.error('Erro de autenticação:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setError(null);
    try {
      await signIn(provider, { callbackUrl: redirectTo });
    } catch (err) {
      setError(`Falha ao entrar com ${provider}. Tente novamente.`);
      console.error('Erro de login social:', err);
    }
  };

  return (
    <LoginContainer>
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>

      <LoginCard>
        <LoginTitle>
          {mode === 'login' ? 'Entrar' : 'Criar Conta'}
        </LoginTitle>

        {error && <ErrorAlert>{error}</ErrorAlert>}
        {success && <SuccessAlert>{success}</SuccessAlert>}

        <StyledLoginForm onSubmit={handleSubmit(onSubmit)}>
          <FormSection>
            {mode === 'register' && (
              <InputField
                id="name"
                type="text"
                placeholder="Nome completo"
                label="Nome completo"
                required
                error={errors.name?.message}
                {...register('name', {
                  required: mode === 'register' ? 'Nome é obrigatório' : false,
                  minLength: {
                    value: 2,
                    message: 'Nome deve ter pelo menos 2 caracteres',
                  },
                })}
              />
            )}

            <InputField
              id="email"
              type="email"
              placeholder="Email"
              label="Email"
              required
              error={errors.email?.message}
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Digite um email válido',
                },
              })}
            />

            <InputField
              id="password"
              type="password"
              placeholder="Senha"
              label="Senha"
              required
              error={errors.password?.message}
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres',
                },
              })}
            />

            {mode === 'login' && (
              <ForgotPasswordLink href="/auth/esqueci-senha">
                Esqueceu sua senha?
              </ForgotPasswordLink>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            >
              {mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </Button>
          </FormSection>

          <Divider>
            <DividerText>ou</DividerText>
          </Divider>

          <SocialSection>
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              Continuar com Google
            </SocialLoginButton>

            <SocialLoginButton
              provider="apple"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              Continuar com Apple
            </SocialLoginButton>
          </SocialSection>
        </StyledLoginForm>

        <SignUpPrompt>
          {mode === 'login' ? "Não tem uma conta? " : "Já tem uma conta? "}
          <SignUpLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange?.(mode === 'login' ? 'register' : 'login');
            }}
          >
            {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
          </SignUpLink>
        </SignUpPrompt>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginForm;
