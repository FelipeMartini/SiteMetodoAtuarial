/**
 * Página de Criação de Conta
 * Permite criar nova conta com email/senha ou usando provedores sociais
 */
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
// import { useTema } from '../contexts/ThemeContext'; // Removido para evitar warning
import SocialLoginBox from '../components/SocialLoginBox';
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

// Container do conteúdo
const ConteudoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  max-width: 1000px;
  width: 100%;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

// Seção do formulário
const FormularioSecao = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

// Título da página
const Titulo = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

// Subtítulo
const Subtitulo = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  line-height: 1.6;
`;

// Formulário
const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

// Grupo de campo
const CampoGrupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
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
`;

// Divisor
const Divisor = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.lg} 0;

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
    font-weight: ${props => props.theme.typography.fontWeight.medium};
  }
`;

// Link para login
const LinkLogin = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.lg};
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: ${props => props.theme.typography.fontWeight.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Mensagem de erro/sucesso
const Mensagem = styled.div<{ tipo: 'erro' | 'sucesso' }>`
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-align: center;
  background-color: ${props => props.tipo === 'erro' ? '#ff000020' : '#00ff0020'};
  color: ${props => props.tipo === 'erro' ? '#ff0000' : '#00aa00'};
  border: 1px solid ${props => props.tipo === 'erro' ? '#ff000040' : '#00aa0040'};
`;

export default function CriarContaPage() {
  // const { currentTheme } = useTema();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'erro' | 'sucesso' } | null>(null);

  // Atualiza dados do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submete o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem(null);

    try {
      // Validações básicas
      if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (formData.senha !== formData.confirmarSenha) {
        throw new Error('As senhas não coincidem');
      }

      if (formData.senha.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Enviar dados para API de registro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          password: formData.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }

      setMensagem({
        texto: 'Conta criada com sucesso! Você pode fazer login agora.',
        tipo: 'sucesso'
      });

      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
      });

    } catch (error) {
      setMensagem({
        texto: error instanceof Error ? error.message : 'Erro inesperado',
        tipo: 'erro'
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <PaginaContainer>
      <ConteudoContainer>
        {/* Seção do formulário */}
        <FormularioSecao>
          <Titulo>Criar Conta</Titulo>
          <Subtitulo>
            Preencha os dados abaixo para criar sua conta ou use uma das opções de login social
          </Subtitulo>

          {mensagem && (
            <Mensagem tipo={mensagem.tipo}>
              {mensagem.texto}
            </Mensagem>
          )}

          <Formulario onSubmit={handleSubmit}>
            <CampoGrupo>
              <CampoLabel htmlFor="nome">Nome completo</CampoLabel>
              <CampoInput
                id="nome"
                name="nome"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </CampoGrupo>

            <CampoGrupo>
              <CampoLabel htmlFor="email">Email</CampoLabel>
              <CampoInput
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </CampoGrupo>

            <CampoGrupo>
              <CampoLabel htmlFor="senha">Senha</CampoLabel>
              <CampoInput
                id="senha"
                name="senha"
                type="password"
                placeholder="Digite sua senha (mín. 6 caracteres)"
                value={formData.senha}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </CampoGrupo>

            <CampoGrupo>
              <CampoLabel htmlFor="confirmarSenha">Confirmar senha</CampoLabel>
              <CampoInput
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </CampoGrupo>

            <Botao
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Botao>
          </Formulario>

          <LinkLogin>
            Já tem uma conta? <Link href="/login">Faça login</Link>
          </LinkLogin>
        </FormularioSecao>

        {/* Seção do login social */}
        <div>
          <Divisor>
            <span>ou crie usando</span>
          </Divisor>
          <SocialLoginBox
            showTitle={false}
          />
        </div>
      </ConteudoContainer>
    </PaginaContainer>
  );
}
