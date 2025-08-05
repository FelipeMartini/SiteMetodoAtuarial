/**
 * Página de Recuperação de Senha - Modernizada
 * Sistema completo de recuperação de senha com interface responsiva
 */
'use client';
import Link from 'next/link';

import React, { useState } from 'react';
import styled from 'styled-components';
// import { useTema } from '../contexts/ThemeContext'; // Removido para evitar warning
import { Botao } from '../design-system';

// Container principal da página
const PaginaContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
`;

// Card principal
const RecoveryCard = styled.div`
  width: 100%;
  max-width: 450px;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

// Título principal
const Titulo = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Ícone de email
const EmailIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${props => props.theme.colors.primary}20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg} auto;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${props => props.theme.colors.primary};
  }
`;

// Descrição
const Descricao = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

// Formulário
const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// Grupo de campo
const CampoGrupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  text-align: left;
`;

// Label do campo
const CampoLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
`;

// Input do campo
const CampoInput = styled.input`
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Mensagem de status
const Mensagem = styled.div<{ tipo: 'erro' | 'sucesso' | 'info' }>`
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  
  ${props => {
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
  }}
`;

// Container de ações
const AcoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

// Link de volta
const LinkVoltar = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-decoration: none;
  transition: color ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: underline;
  }
`;

// Container para estado de sucesso
const SucessoContainer = styled.div`
  text-align: center;
`;

const IconeSucesso = styled.div`
  width: 4rem;
  height: 4rem;
  background: #00aa0020;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg} auto;

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
      setMensagem({
        texto: 'Erro de conexão. Verifique sua internet e tente novamente.',
        tipo: 'erro'
      }); // erro capturado mas não utilizado
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
