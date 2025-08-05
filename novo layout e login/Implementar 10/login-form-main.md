# Main Login Form Component

## components/design-system/LoginForm/LoginForm.styled.ts

```typescript
import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.xxl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 4px 6px -1px ${({ theme }) => theme.colors.shadow},
              0 2px 4px -1px ${({ theme }) => theme.colors.shadow};
  transition: box-shadow ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: 0 10px 15px -3px ${({ theme }) => theme.colors.shadowHover},
                0 4px 6px -2px ${({ theme }) => theme.colors.shadowHover};
  }

  @media (max-width: 480px) {
    margin: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  }
`;

export const LoginTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SocialSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

export const DividerText = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const ForgotPasswordLink = styled.a`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};
  align-self: flex-end;
  margin-top: -${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.outline};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

export const SignUpPrompt = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const SignUpLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.outline};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

export const ErrorAlert = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SuccessAlert = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.success}10;
  border: 1px solid ${({ theme }) => theme.colors.success}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.success};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
```

## components/design-system/LoginForm/index.tsx

```typescript
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
} from './LoginForm.styled';
import { InputField } from '../InputField';
import { Button } from '../Button';
import { SocialLoginButton } from '../SocialLoginButton';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  mode?: 'login' | 'register';
  onModeChange?: (mode: 'login' | 'register') => void;
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  mode = 'login',
  onModeChange,
  redirectTo = '/dashboard',
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
  } = useForm<LoginFormData>();

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
          setError('Invalid email or password. Please try again.');
        } else if (result?.ok) {
          setSuccess('Login successful! Redirecting...');
          // Refresh session and redirect
          await getSession();
          setTimeout(() => {
            router.push(redirectTo);
          }, 1000);
        }
      } else {
        // Register mode
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setSuccess('Account created successfully! You can now log in.');
          reset();
          setTimeout(() => {
            onModeChange?.('login');
          }, 2000);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'An error occurred during registration.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setError(null);
    try {
      await signIn(provider, { callbackUrl: redirectTo });
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`);
      console.error('Social login error:', err);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>
          {mode === 'login' ? 'Login' : 'Create Account'}
        </LoginTitle>

        {error && <ErrorAlert>{error}</ErrorAlert>}
        {success && <SuccessAlert>{success}</SuccessAlert>}

        <StyledLoginForm onSubmit={handleSubmit(onSubmit)}>
          <FormSection>
            <InputField
              id="email"
              type="email"
              placeholder="Email address"
              label="Email address"
              required
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email address',
                },
              })}
            />

            <InputField
              id="password"
              type="password"
              placeholder="Password"
              label="Password"
              required
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            {mode === 'login' && (
              <ForgotPasswordLink href="/auth/forgot-password">
                Forgot your password?
              </ForgotPasswordLink>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            >
              {mode === 'login' ? 'Log in' : 'Create Account'}
            </Button>
          </FormSection>

          <Divider>
            <DividerText>or</DividerText>
          </Divider>

          <SocialSection>
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              Continue with Google
            </SocialLoginButton>

            <SocialLoginButton
              provider="apple"
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              Continue with Apple
            </SocialLoginButton>
          </SocialSection>
        </StyledLoginForm>

        <SignUpPrompt>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <SignUpLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange?.(mode === 'login' ? 'register' : 'login');
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </SignUpLink>
        </SignUpPrompt>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginForm;
```

## app/login/page.tsx

```typescript
'use client';

import React, { useState } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '../../components/design-system/LoginForm';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <LoginForm
      mode={mode}
      onModeChange={setMode}
      redirectTo="/dashboard"
    />
  );
}
```

## hooks/useAuth.ts

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = (redirectTo?: string) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session && redirectTo) {
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
  };
};

export const useRequireAuth = (redirectTo: string = '/login') => {
  return useAuth(redirectTo);
};
```

## Form Validation Utilities (utils/validation.ts)

```typescript
export const emailValidation = {
  required: 'Email is required',
  pattern: {
    value: /^\S+@\S+$/i,
    message: 'Please enter a valid email address',
  },
};

export const passwordValidation = {
  required: 'Password is required',
  minLength: {
    value: 6,
    message: 'Password must be at least 6 characters',
  },
};

export const confirmPasswordValidation = (password: string) => ({
  required: 'Please confirm your password',
  validate: (value: string) =>
    value === password || 'Passwords do not match',
});

export const nameValidation = {
  required: 'Name is required',
  minLength: {
    value: 2,
    message: 'Name must be at least 2 characters',
  },
};
```