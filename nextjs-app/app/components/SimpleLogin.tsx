// Componente de login temporário simples
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { signIn } from 'next-auth/react';

const LoginCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #4338ca;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SocialButton = styled(Button)`
  background: #dc2626;
  margin-top: 1rem;
  
  &:hover {
    background: #b91c1c;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
`;

interface SimpleLoginProps {
  onSocialLogin?: (provider: string) => void;
  showSocialButtons?: boolean;
}

const SimpleLogin: React.FC<SimpleLoginProps> = ({
  onSocialLogin,
  showSocialButtons = true
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Email ou senha incorretos');
      } else {
        window.location.href = '/area-cliente';
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/area-cliente' });
    } catch (err) {
      setError('Erro no login com Google');
      setLoading(false);
    }
  };

  return (
    <LoginCard>
      <Title>Entrar no Sistema</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <Input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <Button type="submit" disabled={loading || !email || !password}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Form>

      {showSocialButtons && (
        <SocialButton
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          🚀 Entrar com Google
        </SocialButton>
      )}
    </LoginCard>
  );
};

export default SimpleLogin;
