/**
 * Página de Recuperação de Senha
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Container, Flex, Texto } from '../../styles/ComponentesBase';

const CardBase = styled(Card)`
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InputBase = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const BotaoBase = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Heading = styled(Texto).attrs({ $variante: 'h3' })``;
const Text = styled(Texto)``;
const FlexContainer = styled(Flex)``;
import ThemeToggle from '../components/ThemeToggle';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const RecoveryCard = styled(CardBase)`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-decoration: underline;
  margin-top: ${({ theme }) => theme.spacing.md};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const RecuperarSenha: React.FC = () => {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage('Por favor, digite seu email');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSent(true);
        setMessage('Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.');
      } else {
        const error = await response.json();
        setMessage(error.message || 'Erro ao enviar email de recuperação');
      }
    } catch (error) {
      setMessage('Erro ao processar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <RecoveryCard $padding="lg" $shadow>
        <FlexContainer justify="flex-end" direction="row">
          <ThemeToggle />
        </FlexContainer>

        <Heading level={2} color="primary">
          Recuperar Senha
        </Heading>

        {!sent ? (
          <>
            <Text color="textSecondary" style={{ marginTop: currentTheme.spacing.md }}>
              Digite seu email para receber instruções de recuperação de senha
            </Text>

            <Form onSubmit={handleSubmit}>
              <InputBase
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />

              <BotaoBase
                type="submit"
                $variant="primary"
                $size="lg"
                $fullWidth
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Instruções'}
              </BotaoBase>
            </Form>
          </>
        ) : (
          <>
            <Text color="success" style={{ marginTop: currentTheme.spacing.md }}>
              ✓ Instruções enviadas com sucesso!
            </Text>
            <Text color="textSecondary" size="sm" style={{ marginTop: currentTheme.spacing.sm }}>
              Verifique sua caixa de email e spam
            </Text>
          </>
        )}

        {message && (
          <Text
            color={message.includes('sucesso') || message.includes('receberá') ? 'success' : 'error'}
            $size="sm"
            style={{ marginTop: currentTheme.spacing.sm }}
          >
            {message}
          </Text>
        )}

        <BackLink onClick={() => router.push('/login')}>
          ← Voltar para o login
        </BackLink>
      </RecoveryCard>
    </PageContainer>
  );
};

export default RecuperarSenha;
