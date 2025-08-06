"use client";
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { InputField, Button } from '../design-system';
import styled from 'styled-components';

const ContatoContainer = styled.main`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Titulo = styled.h1`
  text-align: center;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Descricao = styled.p`
  text-align: center;
  max-width: 500px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FormContainer = styled.form`
  width: 100%;
  max-width: 420px;
  margin: 32px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  min-height: 80px;
  font-family: inherit;
  font-size: 16px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export default function ContatoOrcamento() {
  return (
    <ErrorBoundary>
      <ContatoContainer>
        <Titulo>Contato / Orçamento</Titulo>
        <Descricao>Entre em contato conosco ou solicite seu orçamento personalizado!</Descricao>
        <FormContainer>
          <InputField label="Nome" id="contato-nome" required />
          <InputField label="Email" id="contato-email" type="email" required />
          <InputField label="Mensagem" id="contato-mensagem" required />
          <InputField label="Serviço desejado" id="orcamento-servico" required />
          <Label htmlFor="orcamento-detalhes">Detalhes do orçamento</Label>
          <TextArea id="orcamento-detalhes" required />
          <Button variant="primary" type="submit">Enviar</Button>
        </FormContainer>
      </ContatoContainer>
    </ErrorBoundary>
  );
}
